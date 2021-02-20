import g from './globals'
import { pathSet, pathDelete } from './path'

const subs = new Map

export const subscribe = (normId, sub) => {
  pathSet(subs, normId, sub)(true)
  const unsubscribe = () => pathDelete(subs, normId, sub)
  return unsubscribe
}

export const executeSubscription = normId => {
  const itemSubs = subs.get(normId)
  if (!itemSubs) return
  for (let sub of itemSubs.keys()) sub()
}

export const executeSubscriptions = normIds => {
  for (let normId of subs.keys()) {
    if (!normIds.has(normId) && !g.refreshes.has(normId)) continue
    executeSubscription(normId)
  }
}
