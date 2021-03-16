import g from '*/global'
import put from '*/api/put'
import putAsync from '*/api/putAsync'
import get from '*/api/get'
import replace from '*/api/replace'
import remove from '*/api/remove'
import { normalizeId, isPromise } from '*/utils'

const storeFactory = orm => {
  const normId = normalizeId(orm, void 0)

  const store = {
    put: (id, diff) => {
      const normId = normalizeId(orm, id)
      return isPromise(diff)
        ? putAsync(orm, normId, diff)
        : put(orm, normId, diff)
    },
    get: id => {
      const normId = normalizeId(orm, id)
      return g.suspensePromises.get(normId) || get(normId)
    },
    replace: (id, nextValue) => {
      const normId = normalizeId(orm, id)
      return replace(normId, nextValue)
    },
    remove: id => {
      const normId = normalizeId(orm, id)
      return remove(normId)
    },
    normId
  }

  g.ormsById.set(normId, orm)

  return store
}

export default storeFactory
