/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */
import { bindActionCreators, combineReducers, compose, createStore } from 'redux'
import { resolveSelectors } from 'create-selector'
import { HAS_WINDOW, HAS_DEBUG_FLAG, IS_PROD } from 'libs/utils'

const devTools = () =>
  HAS_WINDOW && window.__REDUX_DEVTOOLS_EXTENSION__ && (HAS_DEBUG_FLAG || !IS_PROD)
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : a => a

// Modified to expose all of `store` to middleware instead of just `getState` and `dispatch`
const applyMiddleware = (...middleware) => (/* createStore */) => (
  reducer,
  preloadedState,
  enhancer
) => {
  const store = createStore(reducer, preloadedState, enhancer)
  const chain = middleware.map(mw => mw(store))
  store.dispatch = compose(...chain)(store.dispatch)
  return store
}

// Modified to provide only dispatch and an object of args
const argsThunkMiddleware = args => store => {
  const extraArgs = args.reduce((result, fn) => Object.assign(result, fn(store)), {})
  return next => action => {
    if (typeof action === 'function') {
      const { dispatch } = store
      return action(dispatch, { ...extraArgs, store })
    }
    return next(action)
  }
}

const enableBatchDispatch = reducer => (state, action) => {
  if (action.type === 'BATCH_ACTIONS') {
    return action.actions.reduce(reducer, state)
  }
  return reducer(state, action)
}

const enableReplaceState = reducer => (state, action) => {
  if (action.type === 'REPLACE_STATE') {
    return reducer(action.payload, action)
  }
  return reducer(state, action)
}

const enhanceReducer = compose(enableBatchDispatch, enableReplaceState)

//  selectUserData >>> userData
const mapSelectorToValue = name => {
  if (!name.match(/select[A-Z].+/))
    throw Error(`${name} does not match selector naming pattern.`)
  // const start = name[0] === 's' ? 6 : 5
  return name[6].toLowerCase() + name.slice(7)
}

const parseSelector = selector => {
  // converts a potentially keyed-selector "name[param1, param2]"
  // into a name and an array of string parameters
  const name = selector.split(/(?=\[.*])/)[0]
  const params = ((selector.split(/(?=\[.*])/)[1] || '').match(/([^\[\]])+/g) || [
    '',
  ])[0]
    .split(',')
    .map(e => e.trim())
    .filter(e => e.length)
  return [name, params]
}

const addSubscriptionMethods = store => {
  // get values from an array of selector names
  store.select = selectorNames =>
    selectorNames.reduce((acc, selector) => {
      const [name, params] = parseSelector(selector)
      if (!store[name]) throw new Error(`Selector not found: ${name}`)
      acc[mapSelectorToValue(selector)] = store[name](...params)
      return acc
    }, {})

  // get all values from all available selectors (even if added later)
  store.selectAll = () => store.select(Object.keys(store.meta.resolvedSelectors))

  store.subscriptions = {
    watchedValues: {},
    watchedSelectors: {},
  }
  store.subscriptions.set = new Set()
  const subscriptions = store.subscriptions.set
  const { watchedSelectors } = store.subscriptions

  const watch = selectorName => {
    watchedSelectors[selectorName] = (watchedSelectors[selectorName] || 0) + 1
  }
  const unwatch = selectorName => {
    const count = watchedSelectors[selectorName] - 1
    if (count === 0) {
      delete watchedSelectors[selectorName]
    } else {
      watchedSelectors[selectorName] = count
    }
  }

  store.subscribe(() => {
    const newValues = watchedSelectors.all
      ? store.selectAll()
      : store.select(Object.keys(watchedSelectors))
    const { watchedValues } = store.subscriptions

    // the only diffing in the app happens here
    const changed = {}
    Object.keys(newValues).forEach(key => {
      const val = newValues[key]
      if (val !== watchedValues[key]) {
        changed[key] = val
      }
    })

    // look through subscriptions to trigger
    store.subscriptions.watchedValues = newValues

    subscriptions.forEach(subscription => {
      const relevantChanges = {}
      let hasChanged = false
      if (subscription.names === 'all') {
        Object.assign(relevantChanges, changed)
        hasChanged = !!Object.keys(relevantChanges).length
      } else {
        subscription.names.forEach(name => {
          if (Object.prototype.hasOwnProperty.call(changed, name)) {
            relevantChanges[name] = changed[name]
            hasChanged = true
          }
        })
      }

      //  Normalize the changes before updating, removing the parameters from keys
      const normalizedChanges = Object.assign(
        {},
        Object.entries(relevantChanges).reduce((acc, cur) => {
          const [key, value] = cur
          acc[parseSelector(key)[0]] = value
          return acc
        }, {})
      )

      if (hasChanged) {
        subscription.fn(normalizedChanges)
      }
    })
  })

  // this exists separately in order to support
  // subscribing to all changes even after lazy-loading
  // additional bundles
  store.subscribeToAllChanges = callback =>
    store.subscribeToSelectors('all', callback)

  // given an array of selector names, it will call the
  // callback any time those have changed with an object
  // containing only changed values
  store.subscribeToSelectors = (keys, callback) => {
    const isAll = keys === 'all'

    // cancel if no keys are being watched
    if (keys.length === 0) {
      return () => {}
    }
    // re-use loop for double duty
    // extract names, but also ensure
    // selector actually exists on store
    const subscription = {
      fn: callback,
      names: isAll ? 'all' : keys.map(mapSelectorToValue),
    }
    subscriptions.add(subscription)
    if (isAll) watch('all')
    else keys.forEach(watch)

    // make sure starting values are in watched so we can
    // track changes
    Object.assign(
      store.subscriptions.watchedValues,
      isAll ? store.selectAll() : store.select(keys)
    )

    // return function that can be used to unsubscribe
    return () => {
      subscriptions.delete(subscription)
      if (isAll) unwatch('all')
      else keys.forEach(unwatch)
    }
  }
}

const addBundleMethods = (store, processed) => {
  if (!store.meta) {
    store.meta = {
      chunks: [],
      unboundActions: {},
      resolvedSelectors: {},
      reactorNames: [],
      destroyMethods: [],
    }
  }
  const { meta } = store

  meta.chunks.push(processed)
  //  Binds only newly processed actions to the store - keep unbound in meta
  meta.unboundActions = Object.assign(meta.unboundActions, processed.actions)
  Object.assign(store, bindActionCreators(processed.actions, store.dispatch))

  //  Binds selectors to the store - keep unbound in meta
  meta.resolvedSelectors = resolveSelectors({
    ...meta.resolvedSelectors,
    ...processed.selectors,
  })
  Object.keys(meta.resolvedSelectors).forEach(key => {
    const selector = meta.resolvedSelectors[key]
    if (!store[key]) {
      store[key] = (...args) => selector(store.getState(), ...args)
    }
  })

  //  Reactors are not bound to the store so we just keep them in meta
  meta.resolvedReactors = resolveSelectors({
    ...meta.resolvedSelectors,
    ...processed.reactors,
  })
  Object.keys(meta.resolvedReactors).forEach(key => {
    const reactor = meta.resolvedReactors[key]
    if (!store.reactors) store.reactors = {}
    if (!store.reactors[key]) {
      store.reactors[key] = () => reactor(store.getState())
    }
  })
  meta.reactorNames = meta.reactorNames.concat(
    processed.reactors ? Object.keys(processed.reactors) : []
  )
  meta.destroyMethods = meta.destroyMethods.concat(processed.destroyMethods)

  processed.initMethods.forEach(init => {
    const destroy = init(store)
    if (typeof destroy === 'function') {
      meta.destroyMethods = meta.destroyMethods.concat(destroy)
    }
  })
}

export const createBundle = bundle => {
  const {
    name,
    reducer,
    selectors,
    actions,
    priority = 0,
    init,
    args,
    middleware,
    persist,
  } = bundle
  const selectorTest = /^(select).+/
  const reactorTest = /^(react).+/

  return {
    name,
    init,
    args,
    reducer,
    actions,
    middleware,
    priority,
    selectors: selectors
      ? Object.keys(selectors)
          .filter(key => selectorTest.test(key))
          .reduce((acc, key) => {
            acc[key] = selectors[key]
            return acc
          }, {})
      : null,
    reactors: selectors
      ? Object.keys(selectors)
          .filter(key => reactorTest.test(key))
          .reduce((acc, key) => {
            acc[key] = selectors[key]
            return acc
          }, {})
      : null,
    persist,
  }
}

export const createChunk = bundles => {
  const composed = {
    bundleNames: [],
    reducers: {},
    selectors: {},
    reactors: {},
    actions: {},
    processed: [],
    initMethods: [],
    middleware: [],
    args: [],
    // destroyMethods: [],
    // reactors: []
  }
  bundles
    .slice()
    .sort((a, b) => b.priority - a.priority)
    .forEach(bundle => {
      composed.bundleNames.push(bundle.name)
      Object.assign(composed.selectors, bundle.selectors)
      Object.assign(composed.reactors, bundle.reactors)
      Object.assign(composed.actions, bundle.actions)
      if (bundle.reducer) {
        Object.assign(composed.reducers, { [bundle.name]: bundle.reducer })
      }
      if (bundle.init) composed.initMethods.push(bundle.init)
      if (bundle.args) composed.args.push(bundle.args)
      if (bundle.middleware) composed.middleware.push(bundle.middleware)
      composed.processed.push(bundle)
    })
  return composed
}

export const composeBundles = (...bundles) => {
  const composed = createChunk(bundles)

  return initialData => {
    const store = createStore(
      enhanceReducer(combineReducers(composed.reducers)),
      initialData,
      compose(
        applyMiddleware(
          ...[
            argsThunkMiddleware(composed.args),
            ...composed.middleware.map(fn => fn(composed)),
          ]
        ),
        devTools()
      )
    )
    // add support for dispatching an action by name
    store.action = (name, args = []) => {
      if (store[name] && typeof store[name] === 'function') store[name](...args)
      else throw new Error(`Action ${name} not found on the store.`)
    }

    addSubscriptionMethods(store)
    addBundleMethods(store, composed)

    store.destroy = () =>
      store.meta.destroyMethods.forEach(destroy => destroy(store))

    // defines method for integrating other bundles later
    store.integrateBundles = (...bundlesToIntegrate) => {
      addBundleMethods(store, createChunk(bundlesToIntegrate))
      const allReducers = store.meta.chunks.reduce(
        (accum, chunk) => Object.assign(accum, chunk.reducers),
        {}
      )
      store.replaceReducer(enhanceReducer(combineReducers(allReducers)))
      store.buildPersistenceMap && store.buildPersistenceMap()
    }
    return store
  }
}
