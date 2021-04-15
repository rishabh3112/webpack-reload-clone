import React, { useMemo, useReducer, useEffect, useContext, forwardRef } from 'react'
import PropTypes from 'prop-types'
import invariant from 'tiny-invariant'
import { isValidElementType } from 'react-is'
import { createLocation, createPath } from 'history'
import {
  generatePath,
  matchPath,
  stripLeadingSlash,
  stripTrailingSlash,
  resolveToLocation,
  normalizeToLocation,
  isModifiedEvent,
  computeRootMatch,
} from './helpers'

/* eslint react/destructuring-assignment: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/jsx-props-no-spreading: 0 */

// =================================
//        STORE CONNECTORS
// =================================
const StoreContext = React.createContext(null)

export const useStore = (...storeKeys) => {
  const store = useContext(StoreContext)
  invariant(store, 'You cannot use the "useStore" hook without a <Core> provider')

  //  using string for caching as array is recreated
  const keystring = storeKeys.join(' ')
  const [keysToWatch, actions] = useMemo(() => {
    const selectorKeys = []
    const actionsKeys = []
    keystring.split(' ').forEach(str => {
      if (str.slice(0, 6) === 'select') {
        selectorKeys.push(str)
      } else {
        actionsKeys.push(str)
      }
    })

    const boundActions = actionsKeys.reduce((acc, key) => {
      acc[key] = (...args) => {
        if (store.action) {
          return store.action(key, args)
        }
        return store[key](...args)
      }
      return acc
    }, {})
    return [selectorKeys, boundActions]
  }, [store, keystring])

  const [state, setState] = useReducer(
    (s, action) => {
      return typeof action === 'function' ? action(s) : { ...s, ...action }
    },
    {
      ...Object.entries(store.select(keysToWatch)).reduce((acc, cur) => {
        const [key, value] = cur
        acc[key.split(/(?=\[.*])/)[0]] = value
        return acc
      }, {}),
      ...actions,
    }
  )

  useEffect(() => {
    // setState({ ...store.select(keysToWatch), ...actions })
    const unsubscribe = store.subscribeToSelectors(keysToWatch, setState)
    return () => {
      unsubscribe()
    }
  }, [store, actions, keysToWatch])

  if (store === null) {
    throw new Error('Could not find a store provider, make sure to wrap the App.')
  }
  return state
}
export const Provider = ({ store, children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

Provider.propTypes = {
  store: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
}

// =================================
//        ROUTER CONNECTORS
// =================================

const RouteContext = React.createContext(null)

export const useLocation = () => {
  const context = useContext(RouteContext)
  invariant(context, 'You cannot use the "useLocation" hook outside of <Core>')
  return context.location
}

export const useHistory = () => {
  const context = useContext(RouteContext)
  invariant(context, 'You cannot use the "useHistory" hook outside of <Core>')
  return context.history
}

export const useRouteMatch = (
  path,
  exact = false,
  strict = false,
  sensitive = false
) => {
  const context = useContext(RouteContext)
  invariant(context, 'You should not use the "useRouteMatch" hook outside of <Core>')
  const { match } = context

  return path ? matchPath(path, exact, strict, sensitive, context) : match
}

export const Route = props => {
  const context = useContext(RouteContext)
  invariant(context, 'You should not use <Route> outside of <Core>')

  const { location } = context
  const {
    path,
    exact = false,
    strict = false,
    sensitive = false,
    computedMatch,
  } = props
  const match = computedMatch || matchPath(path, exact, strict, sensitive, context)

  if (!match) return null

  const routeProps = { ...context, location, match }
  const { component, render } = props

  if (component) {
    return (
      <RouteContext.Provider value={routeProps}>
        {React.createElement(component, routeProps)}
      </RouteContext.Provider>
    )
  }

  if (render) {
    return (
      <RouteContext.Provider value={routeProps}>
        {render(routeProps)}
      </RouteContext.Provider>
    )
  }
  return null
}
Route.displayName = 'Route'

export const Redirect = props => {
  const context = useContext(RouteContext)
  invariant(context, 'You should not use <Redirect> outside of <Core>')

  const { location } = context
  const { historyRedirect, historyPush } = useStore('historyRedirect', 'historyPush')
  const {
    path,
    exact = false,
    strict = false,
    sensitive = false,
    computedMatch,
    to,
    push,
  } = props

  const method = push ? historyPush : historyRedirect
  const match = computedMatch || matchPath(path, exact, strict, sensitive, context)

  const routeTo = typeof to === 'function' ? to({ location, match }) : to
  const compiledPath =
    typeof routeTo === 'string'
      ? generatePath(routeTo, match.params)
      : {
          ...routeTo,
          pathname: generatePath(routeTo.pathname, match.params),
        }

  const redirectLocation = createLocation(match ? compiledPath : routeTo)

  useEffect(() => {
    method(redirectLocation)
  }, [redirectLocation, method])

  return (
    <pre>{`  Redirection Page\n\n  You should never see this page, redirection from "${location.pathname}" failed.`}</pre>
  )
}
Redirect.displayName = 'Redirect'

export const Switch = props => {
  const context = useContext(RouteContext)
  invariant(context, 'You should not use <Switch> outside a <Core>')
  const { children } = props

  let element = null
  let match = null

  React.Children.forEach(children, child => {
    if (match === null && React.isValidElement(child)) {
      element = child

      const defaultExact = child.type.displayName === 'Redirect'
      const {
        path,
        exact = defaultExact,
        strict = false,
        sensitive = false,
      } = child.props

      match = path
        ? matchPath(path, exact, strict, sensitive, context)
        : context.match
    }
  })
  return match ? React.cloneElement(element, { computedMatch: match }) : null
}

const LinkAnchor = forwardRef((props, ref) => {
  const { navigate, onClick, target, indexable, ...rest } = props

  const navProps = {
    ...rest,
    target,
    onClick: e => {
      try {
        if (onClick) onClick(e)
      } catch (err) {
        e.preventDefault()
        throw err
      }

      if (
        !e.defaultPrevented && // onClick prevented default
        e.button === 0 && // ignore everything but left clicks
        (!target || target === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(e) // ignore clicks with modifier keys
      ) {
        e.preventDefault()
        navigate()
      }
    },
  }

  /* eslint-disable-next-line jsx-a11y/anchor-has-content */
  return <a tabIndex={indexable ? 0 : -1} {...navProps} />
})

export const Link = forwardRef((props, ref) => {
  const context = useContext(RouteContext)
  invariant(context, 'You should not use <Link> outside a <Core>')
  const {
    history,
    location,
    match: { url },
  } = context
  const {
    to,
    absolute = false,
    replace,
    exact,
    strict,
    sensitive,
    isActive: isActiveProp,
    activeClassName = '',
    activeStyle,
    className: classNameProp,
    style: styleProp,
    indexable,
    ...rest
  } = props

  const fullPath = absolute
    ? to
    : `${stripTrailingSlash(url)}/${stripLeadingSlash(to)}`
  const toLocation = normalizeToLocation(
    resolveToLocation(fullPath, location, absolute),
    location
  )
  const { pathname: path } = toLocation
  const navigate = () => {
    if (replace) history.replace(toLocation)
    else history.push(toLocation)
  }
  const href = toLocation ? createPath(toLocation) : ''

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')

  const match = escapedPath
    ? matchPath(escapedPath, exact, strict, sensitive, context)
    : null
  const isActive = !!(isActiveProp ? isActiveProp(match, location) : match)
  const className = isActive
    ? [classNameProp, activeClassName].filter(e => e).join(' ')
    : classNameProp
  const style = isActive ? { ...styleProp, ...activeStyle } : styleProp

  const navProps = {
    ...rest,
    className,
    style,
    'data-active': isActive,
    href,
    navigate,
    indexable,
  }

  return React.createElement(LinkAnchor, navProps)
})

export const Router = props => {
  const { children } = props
  const {
    location,
    historyPush,
    historyReplace,
    historyGo,
    historyForward,
    historyBack,
  } = useStore(
    'selectLocation',
    'historyPush',
    'historyReplace',
    'historyGo',
    'historyBack',
    'historyForward'
  )

  return (
    <RouteContext.Provider
      value={{
        location,
        history: {
          push: historyPush,
          replace: historyReplace,
          go: historyGo,
          back: historyBack,
          forward: historyForward,
        },
        match: computeRootMatch(location.pathname),
      }}
    >
      {children || null}
    </RouteContext.Provider>
  )
}

Route.propTypes = {
  component: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(
        'Invalid prop "component" supplied to "Route": the prop is not a valid React component'
      )
    }
    return null
  },
  render: PropTypes.func,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  computedMatch: PropTypes.object,
  // location: PropTypes.object,
}
Redirect.propTypes = {
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  computedMatch: PropTypes.object,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  push: PropTypes.bool,
}
LinkAnchor.propTypes = {
  navigate: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  target: PropTypes.string,
  indexable: PropTypes.bool,
}
Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func])
    .isRequired,
  replace: PropTypes.bool,
  absolute: PropTypes.bool,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  isActive: PropTypes.func,
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  indexable: PropTypes.bool,
}
Router.propTypes = {
  children: PropTypes.node.isRequired,
}
