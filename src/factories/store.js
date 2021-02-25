import g from '../globals'
import { putItem } from '../methods/put'
import { getItem } from '../methods/get'
import {
  normalizeId,
  isOrm,
  isPromise,
  MONTH
} from '../utils'
import { ormFactory } from './orm'
import { executeSubscription } from '../subscriptions'

export const LOADER_NORM_ID = Symbol('loader')

const DEFAULT_STORE_OPTIONS = {
  idKey: 'id',
  lifetimeMs: MONTH,
  suspense: true
}

let i = 0
export const storeFactory = (desc, initState, userOptions) => {
  const storeOptions = { ...DEFAULT_STORE_OPTIONS, ...userOptions }
  const isOrmStore = isOrm(desc)
  const storeId = Symbol.for(`store ${i++}`)
  const store = {
    id: storeId,
    isOrmStore,
    put: (...args) => {
      const { normId, diff, options } = parsePutArgs(store, storeOptions, args)
      return isPromise(diff)
        ? putStorePromise(store, normId, diff, options)
        : putStoreItem(store, normId, diff)
    },
    get: (...args) => {
      const { normId } = parseGetArgs(store, storeOptions, args)
      const item = getItem(normId)
      return g.suspensePromises.get(normId) || (isOrmStore ? item : item.value)
    },
    isLoading: (...args) => {
      const { normId } = parseGetArgs(store, storeOptions, args)
      return g.suspensePromises.has(normId) || g.refetchingPromises.has(normId)
    },
    wasLoaded: (...args) => {
      const { normId } = parseGetArgs(store, storeOptions, args)
      return g.fetchedAt.has(normId)
    }
  }
  g.ormsById.set(
    storeId, 
    isOrmStore ? desc : ormFactory({ value: desc })
  )
  if (!isOrmStore) store.put(initState)
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

const actualizeLoading = () => {
  const loader = g.suspensePromises.size !== 0 || g.refetchingPromises.size !== 0
  putItem(null, LOADER_NORM_ID, loader)
}

const putStoreItem = (store, normId, diff) => {
  const orm = g.ormsById.get(store.id)
  const nextStoreItem = putItem(
    orm,
    normId,
    store.isOrmStore
      ? diff
      : { id: normId, value: diff }
  )
  return store.isOrmStore
    ? nextStoreItem
    : nextStoreItem.value
}

const parsePutArgs = (store, storeOptions, args) => {
  const id = store.isOrmStore ? args[0] : store.id
  const userOptions = store.isOrmStore ? args[2] : args[1]
  const storeOrm = g.ormsById.get(store.id)

  const diff = store.isOrmStore ? args[1] : args[0]
  const options = { ...storeOptions, ...userOptions }
  const normId = store.isOrmStore
    ? normalizeId(storeOrm, options.idKey, id)
    : store.id

  return {
    normId,
    options,
    diff
  }
}

const parseGetArgs = (store, storeOptions, args) => {
  const id = store.isOrmStore ? args[0] : store.id
  const userOptions = store.isOrmStore ? args[2] : args[1]
  const storeOrm = g.ormsById.get(store.id)
  const options = { ...storeOptions, ...userOptions }

  return {
    normId: store.isOrmStore
      ? normalizeId(storeOrm, options.idKey, id)
      : store.id
  }
}
