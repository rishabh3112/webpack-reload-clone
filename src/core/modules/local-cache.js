import { IS_BROWSER, IS_PROD } from 'libs/utils'
import { ric } from 'libs/utils/helpers'
import { createBundle } from '../bundler'
import cache from '../cache'

/* eslint no-param-reassign: 0 */
/* eslint no-console: 0 */

export default createBundle({
  name: 'localCache',
  priority: Infinity,
  init: store => {
    store.buildPersistenceMap = () => {
      store.meta.persistenceMap = store.meta.chunks.reduce(
        (persistenceMap, chunk) => {
          chunk.processed.forEach(bundle => {
            if (bundle.persist) {
              bundle.persist.forEach(trigger => {
                persistenceMap[trigger] = persistenceMap[trigger] || []
                persistenceMap[trigger].push(bundle.name)
              })
            }
          })
          return persistenceMap
        },
        {}
      )
    }
    store.buildPersistenceMap()
  },
  middleware: composedBundle => {
    return store => next => action => {
      const { getState, meta } = store
      const { persistenceMap } = meta
      const reducersToPersist = persistenceMap[action.type]
      const res = next(action)
      const state = getState()
      if (IS_BROWSER && reducersToPersist) {
        ric(
          () => {
            Promise.all(
              reducersToPersist.map(name => cache.set(name, state[name]))
            ).then(() => {
              !IS_PROD &&
                console.log(
                  `cached ${reducersToPersist.join(', ')} due to ${action.type}`
                )
            })
          },
          { timeout: 500 }
        )
      }
      return res
    }
  },
})
