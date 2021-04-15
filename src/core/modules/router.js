import createBrowserHistory from 'history/createBrowserHistory'
import { createSelector } from 'create-selector'
import { ric, locationMatch } from 'libs/utils/helpers'
import { createBundle } from '../bundler'
import { ROUTER_URL_UPDATED, ROUTER_URL_REDIRECTED } from '../actiontypes'

const historyInstance = createBrowserHistory({})

const initialState = {
  location:
    typeof historyInstance.location !== 'undefined' ? historyInstance.location : '/',
  redirect: false,
}

export default createBundle({
  name: 'router',
  reducer: (state = initialState, { type: action, payload }) => {
    if (action === ROUTER_URL_UPDATED) {
      return {
        ...state,
        location: { ...payload },
        redirect: false,
      }
    }
    if (action === ROUTER_URL_REDIRECTED) {
      return {
        ...state,
        location: payload,
        redirect: true,
      }
    }
    return state
  },
  selectors: {
    selectLocation: state => state.router.location,
    selectRedirect: state => state.router.redirect,
    reactTrailingSlashes: createSelector('selectLocation', location => {
      const { pathname } = location
      if (
        pathname &&
        pathname !== '/' &&
        pathname.substring(pathname.length - 1) === '/'
      )
        return {
          type: ROUTER_URL_REDIRECTED,
          payload: location.pathname.substring(0, pathname.length - 1),
        }
      return null
    }),
  },
  actions: {
    historyPush: payload => (dispatch, { history }) => {
      history.push(payload)
    },
    historyReplace: payload => (dispatch, { history }) => {
      history.replace(payload)
    },
    historyGo: payload => (dispatch, { history }) => {
      history.go(payload)
    },
    historyBack: () => (dispatch, { history }) => {
      history.goBack()
    },
    historyForward: () => (dispatch, { history }) => {
      history.goForward()
    },
    historyRedirect: payload => dispatch => {
      dispatch({ type: 'ROUTER_URL_REDIRECTED', payload })
    },
  },
  priority: Infinity,
  init: store => {
    const unlisten = historyInstance.listen((location, action) => {
      const routerLocation = store.selectLocation()
      const wasChanged = Object.keys(location).some(key => {
        return location[key] !== routerLocation[key]
      })
      if (wasChanged) {
        store.dispatch({
          type: ROUTER_URL_UPDATED,
          payload: location,
        })
      }
    })

    const unsubscribe = store.subscribeToSelectors(
      ['selectLocation', 'selectRedirect'],
      data => {
        const { location, redirect } = data
        if (location) {
          const wasChanged =
            typeof location === 'string' ||
            Object.keys(location).some(
              key => location[key] !== historyInstance.location[key]
            )
          if (wasChanged) {
            ric(
              () => {
                if (redirect) historyInstance.replace(location)
                else historyInstance.push(location)
              },
              { timeout: 500 }
            )
          }
        }
      }
    )

    return () => {
      unsubscribe()
      unlisten()
    }
  },
  args: () => ({
    history: historyInstance,
    matchPath: (...args) => locationMatch(historyInstance.location, ...args),
  }),
  middleware: null,
})

export { historyInstance as history }
