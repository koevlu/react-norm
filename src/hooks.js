import { useState, useEffect } from 'react'
import g from './globals'
import { subscribe } from './subscriptions'
import { getItem } from './methods/get'
import { normalizeId, isPromise } from './utils'
import { LOADER_NORM_ID } from './factories/store'

export const useLoading = () => {
  const [loading, setLoading] = useState(false)
  useSubscription(LOADER_NORM_ID, l => l !== loading && setLoading(l))
  return loading
}

export const useStore = (...args) => {
  const { store, normId } = parseStoreArgs(...args)
  const [state, setState] = useState(getState(normId))

  useSubscription(normId, setState)
  if (isPromise(state)) throw state
  return store.isOrmStore ? state : state.value
}

const useSubscription = (normId, setState) => {
  const initState = getState(normId)
  useEffect(
    () => {
      const sub = () => setState(getState(normId))
      if (initState !== getState(normId)) sub()
      return subscribe(normId, sub)
    },
    [normId, initState, setState]
  )
}

const getState = normId => g.suspensePromises.get(normId) || getItem(normId)

const parseStoreArgs = (store, idOrOptions, ormStoreOptions) => {
  const options = {
    idKey: 'id',
    ...(store.isOrmStore ? ormStoreOptions : idOrOptions)
  }
  const storeOrm = g.ormsById.get(store.id)
  return {
    store,
    normId:
      store.isOrmStore
        ? normalizeId(storeOrm, options.idKey, idOrOptions)
        : store.id
  }
}
