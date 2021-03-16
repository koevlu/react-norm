import ormFactory from '*/factories/orm'
import g from '*/global'
import put from '*/api/put'
import putAsync from '*/api/putAsync'
import get from '*/api/get'
import { normalizeId, isPromise } from '*/utils'

const stoneFactory = (desc, initState) => {
  const orm = ormFactory(desc)
  const normId = normalizeId(orm, void 0)

  const stone = {
    put: diff => {
      const normId = normalizeId(orm, void 0)
      return isPromise(diff)
        ? putAsync(orm, normId, diff)
        : put(orm, normId, diff)
    },
    get: () => {
      return g.suspensePromises.get(normId) || get(normId)
    },
    normId
  }

  g.ormsById.set(normId, orm)
  stone.put(initState)

  return stone
}

export default stoneFactory
