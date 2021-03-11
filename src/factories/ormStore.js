import g from '../globals'
import { putItem } from '../methods/put'
import { getItem } from '../methods/get'
import {
  normalizeId,
  isPromise,
  MONTH
} from '../utils'
import { ormFactory } from './orm'
import { executeSubscription } from '../subscriptions'
import { actualizeLoading } from '../loading'

const DEFAULT_STORE_OPTIONS = {
  idKey: 'id',
  lifetimeMs: MONTH,
  suspense: true
}

let i = 0
export const ormStoreFactory = (orm, userOptions) => {
  const storeOptions = { ...DEFAULT_STORE_OPTIONS, ...userOptions }
  const storeId = Symbol.for(`ormStore ${i++}`)

  const store = {
    id: storeId,
    put: (...args) => {
      const { normId, diff, options } = parsePutArgs(store, storeOptions, args)
      return isPromise(diff)
          ? putStorePromise(store, normId, diff, options)
          : putStoreItem(store, normId, diff)
    },
    get: (...args) => {
      const normId = parseGetArgs(store, storeOptions, args)
      const item = getItem(normId)
      return g.suspensePromises.get(normId) || item
    },
    isLoading: (...args) => {
      const normId = parseGetArgs(store, storeOptions, args)
      return g.suspensePromises.has(normId) || g.refetchingPromises.has(normId)
    },
    wasLoaded: (...args) => {
      const normId = parseGetArgs(store, storeOptions, args)
      return g.fetchedAt.has(normId)
    }
  }

  g.ormsById.set(storeId, orm)

  return store
}

const putStorePromise = (store, normId, promise, options) => {
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
      return putStoreItem(store, normId, item)
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

const putStoreItem = (store, normId, diff) => {
  const orm = g.ormsById.get(store.id)
  const nextStoreItem = putItem(orm, normId, diff)
  return nextStoreItem
}

const parsePutArgs = (store, storeOptions, args) => {
  const [id, diff, userOptions] = args
  const options = { ...storeOptions, ...userOptions }
  const storeOrm = g.ormsById.get(store.id)
  const normId = normalizeId(storeOrm, options.idKey, id)

  return { options, diff, normId }
}

const parseGetArgs = (store, storeOptions, args) => {
  const [id, userOptions] = args
  const storeOrm = g.ormsById.get(store.id)
  const options = { ...storeOptions, ...userOptions }

  return normalizeId(storeOrm, options.idKey, id)
}
