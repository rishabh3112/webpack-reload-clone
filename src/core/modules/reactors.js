import { debounce, ric, raf } from 'libs/utils/helpers'
import { createBundle } from '../bundler'
/* eslint no-param-reassign: 0 */

const reactorPermissionCheck = (() => {
  let reactorsMap = {}
  setInterval(() => {
    reactorsMap = {}
  }, 1000)
  return (name, result) => {
    reactorsMap[`${name}-${result}`] = (reactorsMap[`${name}-${result}`] || 0) + 1
    if (reactorsMap[`${name}-${result}`] > 10)
      throw new Error(
        `Infinite loop detected for reactor: ${name}. Reactors must return an action that changes the state that caused the reactor to be triggered.`
      )
    // console.log(reactorsMap[`${name}-${result}`])
    return true
  }
})()

const dispatchIdle = debounce(dispatch => {
  //  raf to only fire if tab is active
  raf(() => ric(() => dispatch({ type: 'APP_IDLE' }), { timeout: 500 }))
}, 30000)

export default createBundle({
  name: 'reactors',
  reducer: null,
  selectors: null,
  actions: {
    idleAction: payload => dispatchIdle,
  },
  priority: Infinity,
  init: store => {
    if (process.env.NODE_ENV !== 'production') {
      store.meta.reactorNames.forEach(name => {
        if (!store.reactors[name]) {
          throw Error(`Reactor '${name}' not found on the store.`)
        }
      })
    }

    const dispatchNext = () => {
      // one at a time
      if (store.nextReaction) {
        return
      }
      // Set next reactor if one is available
      store.meta.reactorNames.some(name => {
        const result = store.reactors[name]()
        if (result && reactorPermissionCheck(name, result)) {
          store.activeReactor = name
          store.nextReaction = result
          return true
        }
        return false
      })
      if (store.nextReaction) {
        ric(
          () => {
            const { nextReaction } = store
            store.activeReactor = null
            store.nextReaction = null
            store.dispatch(nextReaction)
          },
          { timeout: 500 }
        )
      }
    }

    const callback = () => {
      dispatchNext()
      store.idleAction()
    }

    const unsubscribe = store.subscribe(callback)
    //  initial call to start reactions in case of starting state / lazy loading
    callback()

    return () => {
      store.idleAction.cancel()
      unsubscribe()
    }
  },
  args: null,
})
