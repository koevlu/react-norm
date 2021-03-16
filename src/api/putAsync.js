import g from '*/global'
import { notifyOne } from '*/utils'
import { actualizeLoading } from '*/loading'
import put from '*/api/put'

const putAsync = (orm, normId, promise) => {
  const gPromises =
    !(g.fetchedAt.has(normId) || g.suspensePromises.has(normId)) && !g.preloading
      ? g.suspensePromises
      : g.refetchingPromises

  const result = promise.then(
    item => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      g.fetchedAt.set(normId, Date.now())
      actualizeLoading()
      return put(orm, normId, item)
    },
    error => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      actualizeLoading()
      throw error
    }
  )
  gPromises.set(normId, result)
  notifyOne(normId)
  actualizeLoading()
  return result
}

export default putAsync
