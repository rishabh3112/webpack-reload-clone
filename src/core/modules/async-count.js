import { createBundle } from '../bundler'

const changes = {
  STARTED: 1,
  SUCCEEDED: -1,
  FAILED: -1,
}

const re = /_(STARTED|SUCCEEDED|FAILED)$/

export default createBundle({
  name: 'asyncCount',
  reducer: (state = 0, { type }) => {
    const result = re.exec(type)
    if (!result) return state
    return state + changes[result[1]]
  },
  selectors: {
    selectAsyncActive: state => state.asyncCount > 0,
  },
  actions: null,
  priority: Infinity,
  init: null,
  args: null,
})
