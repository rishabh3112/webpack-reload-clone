import { createSelector } from 'create-selector'
import { createBundle } from '../bundler'

export default createBundle({
  name: 'appTime',
  reducer: (state, action) => {
    if (action.type === 'RESET_TIME') return null
    return Date.now()
  },
  selectors: {
    selectAppTime: state => state.appTime,
    reactAppTime: createSelector('selectAppTime', appTime => {
      if (appTime) {
        return (
          null && {
            type: 'RESET_TIMEA',
            payload: {
              token: '1',
            },
          }
        )
      }
      return null
    }),
  },
  actions: {
    resetAppTime: () => ({ type: 'RESET_TIME' }),
  },
  priority: Infinity,
  init: null,
  args: null,
})
