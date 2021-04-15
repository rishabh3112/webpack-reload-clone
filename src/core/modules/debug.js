import { HAS_DEBUG_FLAG, IS_BROWSER } from 'libs/utils'
import { DEBUG_DISABLED, DEBUG_ENABLED } from '../actiontypes'
import { createBundle } from '../bundler'

const colorBlue = 'color: #1676D2;'
const colorGreen = 'color: #4CAF50;'
const colorOrange = 'color: #F57C00;'
const colorRed = 'color: #F22222;'

/* eslint-disable no-console */

const log = (toLog, { method = 'log', label, color }) =>
  console[method](...(IS_BROWSER ? [`%c${label}`, color, toLog] : [label, toLog]))

const config = {
  logSelectors: true,
  logState: true,
  enabled: HAS_DEBUG_FLAG,
  actionFilter: null,
}
export default createBundle({
  name: 'debug',
  reducer: (state = config.enabled, { type }) => {
    if (type === DEBUG_ENABLED) {
      return true
    }
    if (type === DEBUG_DISABLED) {
      return false
    }
    return state
  },
  selectors: {
    selectIsDebug: state => state.debug,
  },
  actions: {
    enableDebug: () => dispatch => {
      if (IS_BROWSER) {
        try {
          localStorage.debug = true
        } catch (e) {
          log('attempted to access local storage.', {
            label: 'Error:',
            color: colorRed,
          })
        }
      }
      dispatch({ type: DEBUG_ENABLED })
    },
    disableDebug: () => dispatch => {
      if (IS_BROWSER) {
        try {
          delete localStorage.debug
        } catch (e) {
          log('attempted to access local storage.', {
            label: 'Error:',
            color: colorRed,
          })
        }
      }
      dispatch({ type: DEBUG_DISABLED })
    },
    logBundles: () => (dispatch, { store }) => {
      log(
        store.meta.chunks.reduce((result, chunk) => {
          result.push(...chunk.bundleNames)
          return result
        }, []),
        { label: 'installed bundles:', color: colorBlue }
      )
    },
    logSelectors: () => (dispatch, { store }) => {
      log(
        Object.keys(store.meta.resolvedSelectors)
          .sort()
          .reduce((res, name) => {
            if (name.match(/^(select).+/)) res[name] = store[name]()
            return res
          }, {}),
        {
          label: 'selectors:',
          color: colorGreen,
        }
      )
    },
    logActions: () => (dispatch, { store }) => {
      log(Object.keys(store.meta.unboundActions).sort(), {
        label: 'actions:',
        color: colorOrange,
      })
    },
    logReactors: () => (dispatch, { store }) => {
      log(store.meta.reactorNames, { label: 'reactors:', color: colorOrange })
    },
    logNextReaction: () => (dispatch, { store }) => {
      const { nextReaction, activeReactor } = store
      if (nextReaction) {
        log(nextReaction, {
          color: colorOrange,
          label: `next reaction ${activeReactor}:`,
        })
      }
    },
    logDebugSummary: () => (dispatch, { store }) => {
      store.logBundles()
      store.logSelectors()
      store.logActions()
      store.logReactors()
      store.logNextReaction()
    },
  },
  priority: Infinity,
  init: store => {
    if (store.selectIsDebug()) {
      if (IS_BROWSER) {
        // eslint-disable-next-line
        self.store = store
        console.groupCollapsed(`%cBrainalyzed Core v${VERSION}`, colorBlue)
        store.logDebugSummary()
        console.groupEnd()
      }
    }
  },
  args: null,
  middleware: composedBundle => store => next => action => {
    const isDebug =
      (store.selectIsDebug && store.selectIsDebug()) || store.getState().debug

    if (!isDebug || (config.actionFilter && !config.actionFilter(action))) {
      return next(action)
    }

    console.group(action.type)
    console.info('report:', action)
    const result = next(action)
    config.logState && console.debug('state:', store.getState())
    config.logSelectors && store.logSelectors()
    store.logNextReaction && store.logNextReaction()
    console.groupEnd(action.type)

    return result
  },
})
