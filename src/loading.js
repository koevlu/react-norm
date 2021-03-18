import { useEffect } from 'react'
import { Link, matchPath } from 'react-router-dom'
import g from '*/global'
import putItem from '*/api/putItem'

export const LOADING_NORM_ID = 'Ἀ'

export const actualizeLoading = () => {
  const loader = g.suspensePromises.size !== 0 || g.refetchingPromises.size !== 0
  queueMicrotask(() => putItem(null, LOADING_NORM_ID, loader))
}

export const PreloadLink = ({ ...props }) => {
  useEffect(() => {
    preloadPathname(props.to)
  }, [props.to])

  return <Link {...props} />
}

// hack hard
let routes = []
export const preload = userRoutes => (
  routes = userRoutes
)

const preloadPathname = pathname => {
  const route = findRoute(pathname, routes)

  if (route && route.preload) {
    const { params } = matchPath(route.path, pathname)
    g.preloading = true
    route.preload(params)
    g.preloading = false
  }
}

const findRoute = (pathname, routes) => 
  routes.find(({ path, children }) =>
    matchPath(path, pathname) ||
    (children && findRoute(pathname, children))
  )
