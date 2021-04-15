import { pathToRegexp, compile as pathToRegexpCompile } from 'path-to-regexp'
import { createLocation } from 'history'
import invariant from 'tiny-invariant'

const cacheLimit = 10000
const cache = {}
let cacheCount = 0
const reverseCache = {}
let reverseCacheCount = 0

export const compilePath = (path, options) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  if (pathCache[path]) return pathCache[path]

  const keys = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { regexp, keys }

  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount += 1
  }

  return result
}

export const compilePathReverse = path => {
  if (reverseCache[path]) return reverseCache[path]

  const generator = pathToRegexpCompile(path)

  if (reverseCacheCount < cacheLimit) {
    reverseCache[path] = generator
    reverseCacheCount++
  }

  return generator
}

export const generatePath = (rawPath = '/', params = {}) => {
  return rawPath === '/'
    ? rawPath
    : compilePathReverse(rawPath)(params, { pretty: true })
}

export const computeRootMatch = pathname => {
  return { path: '/', url: '/', params: {}, isExact: pathname === '/' }
}

export const matchPath = (path, exact, strict, sensitive, context) => {
  const { location, match, computedMatch } = context

  if (computedMatch) return computedMatch

  const paths = [].concat(path)
  const routeMatch = paths.reduce((matched, current) => {
    if (!current && current !== '') return null
    if (matched) return matched

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    })

    const isMatch = regexp.exec(location.pathname)
    if (!isMatch) return null

    const [url, ...values] = isMatch
    const isExact = location.pathname === url
    if (exact && !isExact) return null

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((acc, key, index) => {
        acc[key.name] = values[index]
        return acc
      }, {}),
    }
  }, null)
  if (routeMatch) return routeMatch
  if (!path) {
    return match
  }
  return null
}

export const locationMatch = (
  location,
  path,
  exact = false,
  strict = false,
  sensitive = false
) => {
  invariant(
    location && location.pathname,
    'locationMatch function requires a location as a first parameter'
  )
  const context = {
    location,
    // history: history reference from store missing,
    match: computeRootMatch(location.pathname),
  }

  const match = matchPath(path, exact, strict, sensitive, context)
  if (!match) return null
  return match
}

export const stripLeadingSlash = path => {
  return path.charAt(0) === '/' ? path.substring(1) : path
}

export const stripTrailingSlash = path => {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}

export const resolveToLocation = (to, currentLocation, absolute) => {
  return typeof to === 'function' ? to(currentLocation) : to
}

export const normalizeToLocation = (to, currentLocation) => {
  return typeof to === 'string'
    ? createLocation(to, null, null, currentLocation)
    : to
}

export const isModifiedEvent = event => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}
