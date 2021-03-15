import g from '../globals'
import { putItem } from '../methods/put'
import { getItem } from '../methods/get'
import { replaceItem } from '../methods/replace'
import { removeItem } from '../methods/remove'
import {
  normalizeId,
  isPromise,
  MONTH
} from '../utils'
import { executeSubscription } from '../subscriptions'
import { actualizeLoading } from '../loading'

const DEFAULT_STORE_OPTIONS = {
  lifetimeMs: MONTH,
  suspense: true
}

let i = 0
export const ormStoreFactory = (orm, userOptions) => {
  const storeOptions = { ...DEFAULT_STORE_OPTIONS, ...userOptions }
  const storeId = `ormStore ${i++}`

  const ormStore = {
    id: storeId,
    put: (...args) => {
      const { normId, diff, options } = parsePutArgs(ormStore, storeOptions, args)
      return isPromise(diff)
        ? putOrmStorePromise(ormStore, normId, diff, options)
        : putOrmStoreItem(ormStore, normId, diff)
    },
    get: id => {
      const normId = normalizeId(orm, id)
      const item = getItem(normId)
      return g.suspensePromises.get(normId) || item
    },
    replace: (id, nextValue) => {
      const normId = normalizeId(orm, id)
      return replaceItem(normId, nextValue)
    },
    remove: id => {
      const normId = normalizeId(orm, id)
      return removeItem(normId)
    },
    isLoading: id => {
      const normId = normalizeId(orm, id)
      return g.suspensePromises.has(normId) || g.refetchingPromises.has(normId)
    },
    wasLoaded: id => {
      const normId = normalizeId(orm, id)
      return g.fetchedAt.has(normId)
    }
  }

  g.ormsById.set(storeId, orm)

  return ormStore
}

const putOrmStorePromise = (ormStore, normId, promise, options) => {
  const gPromises =
    options.suspense && !(g.fetchedAt.has(normId) || g.suspensePromises.has(normId)) && !g.preloading
      ? g.suspensePromises
      : g.refetchingPromises

  const result = promise.then(
    item => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      g.fetchedAt.set(normId, Date.now())
      actualizeLoading()
      return putOrmStoreItem(ormStore, normId, item)
    },
    error => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      actualizeLoading()
      throw error
    }
  )
  gPromises.set(normId, result)
  executeSubscription(normId)
  actualizeLoading()
  return result
}

const putOrmStoreItem = (ormStore, normId, diff) => {
  const orm = g.ormsById.get(ormStore.id)
  const nextStoreItem = putItem(orm, normId, diff)

  return nextStoreItem
}

const parsePutArgs = (ormStore, storeOptions, args) => {
  const [id, diff, userOptions] = args
  const options = { ...storeOptions, ...userOptions }
  const storeOrm = g.ormsById.get(ormStore.id)
  const normId = normalizeId(storeOrm, id)

  return { options, diff, normId }
}
