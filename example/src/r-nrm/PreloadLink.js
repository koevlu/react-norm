import { useEffect } from 'react'
import { Link, matchPath } from 'react-router-dom'
import g from './globals'

export const PreloadLink = ({ ...props }) => {
  useEffect(() => {
    preloadUrl(props.to)
  }, [props.to])

  return <Link {...props} />
}

// hack hard...
let routes = []
export const preload = userRoutes => (
  routes = userRoutes
)

const preloadUrl = path => {
  const route = findRoute(path, routes)

  if (route && route.preload) {
    const { params } = matchPath(route.path, path)
    g.preloading = true
    route.preload(params)
    g.preloading = false
  }
}

const findRoute = (path, routes) => 
  routes.find(route =>
    matchPath(route.path, path) ||
    (route.children && findRoute(path, route.children))
  )
