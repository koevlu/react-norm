import g from '../globals'
import { putItem } from '../methods/put'
import { getItem } from '../methods/get'
import {
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
export const storeFactory = (desc, initState, userOptions) => {
  const storeOptions = { ...DEFAULT_STORE_OPTIONS, ...userOptions }
  const storeId = Symbol.for(`store ${i++}`)
  const store = {
    id: storeId,
    put: (...args) => {
      const { normId, diff, options } = parsePutArgs(store, storeOptions, args)
      return isPromise(diff)
        ? putStorePromise(store, normId, diff, options)
        : putStoreItem(store, normId, diff)
    },
    get: () => {
      return g.suspensePromises.get(storeId) || getItem(storeId).value
    },
    isLoading: () => {
      return g.suspensePromises.has(storeId) || g.refetchingPromises.has(storeId)
    },
    wasLoaded: () => {
      return g.fetchedAt.has(storeId)
    }
  }
  g.ormsById.set(storeId, ormFactory({ value: desc }))
  store.put(initState)

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
  const nextStoreItem = putItem(
    orm,
    normId,
    { id: normId, value: diff }
  )
  return nextStoreItem
}

const parsePutArgs = (store, storeOptions, args) => {
  const [diff, userOptions] = args
  const options = { ...storeOptions, ...userOptions }
  const normId = store.id

  return {
    normId,
    options,
    diff
  }
}
