import { useState, useEffect } from 'react'
import g from './globals'
import { subscribe } from './subscriptions'
import { getItem } from './methods/get'
import { normalizeId, isPromise } from './utils'
import { LOADING_NORM_ID } from './loading'

export const useStore = (store, options) => {
  const [state, setState] = useState(getState(store.id))

  useSubscription(store.id, setState)
  if (isPromise(state)) throw state
  return state.value
}

export const useOrmStore = (ormStore, id, userOptions) => {
  const options = {
    idKey: 'id',
    ...userOptions
  }
  const orm = g.ormsById.get(ormStore.id)
  const normId = normalizeId(orm, options.idKey, id)
  const [state, setState] = useState(getState(normId))

  useSubscription(normId, setState)
  if (isPromise(state)) throw state
  return state
}

export const useLoading = () => {
  const [loading, setLoading] = useState(false)
  useSubscription(
    LOADING_NORM_ID,
    nextLoading => nextLoading !== loading && setLoading(nextLoading)
  )
  return loading
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
