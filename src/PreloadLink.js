import { useEffect } from 'react'
import { Link, matchPath } from 'react-router-dom'
import g from './globals'

export const PreloadLink = ({ ...props }) => {
  useEffect(() => {
    preloadPathname(props.to)
  }, [props.to])

  return <Link {...props} />
}

// hack hard...
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
