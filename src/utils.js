import g from './globals'
import { pathGet, pathSet, pathIncrement, pathDecrement } from './path'

export const MINUTE = 60 * 1000 / 12

export const MONTH = MINUTE * 60 * 24 * 30;

let normIdCount = 0
export const normalizeId = (orm, idKey, id) => {
  const normId = pathGet(g.ids, orm, idKey, id) || String(normIdCount++)
  pathSet(g.ids, orm, idKey, id)(normId)

  const item = g.items.get(normId)
  if (!isPlainObject(item)) return normId

  for (let key of g.ormKeys.get(orm))
    if (item.hasOwnProperty(key))
      pathSet(g.ids, orm, key, item[key])(normId)
  return normId
}

export const getIdKeyAndId = (orm, ...items) => {
  for (let idKey of g.ormKeys.get(orm)) {
    const itemWithId = items.find(obj =>
      isPlainObject(obj) &&
      obj.hasOwnProperty(idKey)
    )
    if (itemWithId) return {
      idKey,
      id: itemWithId[idKey]
    }
  }
}

export const relationsIncrement = (childId, parentId) => {
  if (!parentId) return
  const shouldRefresh = g.updatedAt.get(childId) < g.currentUpdatedAt
  if (shouldRefresh) {
    pathSet(g.childs, parentId, childId)(1)
    pathSet(g.parents, childId, parentId)(1)
  } else {
    pathIncrement(g.childs, parentId, childId)
    pathIncrement(g.parents, childId, parentId)
  }
}

export const relationsDecrement = (childId, parentId) => {
  if (!parentId) return
  pathDecrement(g.parents, childId, parentId)
  pathDecrement(g.childs, parentId, childId)
}

export const deferRefreshes = updatedIds => {
  const currentRefreshes = new Map
  for (let id of updatedIds.keys())
    deferItemRefreshes(id, currentRefreshes)
}

export const deferItemRefreshes = (normId, currentRefreshes) => {
  if (currentRefreshes.has(normId)) return
  g.refreshes.set(normId, true)
  currentRefreshes.set(normId, true)

  const itemParents = g.parents.get(normId)
  if (!itemParents) return
  for (let parentNormId of itemParents.keys())
    deferItemRefreshes(parentNormId, currentRefreshes)
}

export const applyLoops = (updatedIds, loops) => {
  for (let id of loops.keys()) {
    const itemLoops = loops.get(id)
    for (let loop of itemLoops) {
      const itemIndex = loop.findIndex(key => key === id)
      let currentLevel = g.items.get(id)
      let i = itemIndex + 1

      while (i < loop.length) {
        const key = loop[i++]
        const nextKey = loop[i]
        if (updatedIds.has(nextKey)) {
          const childItem = g.items.get(nextKey)
          currentLevel[key] = childItem
          currentLevel = childItem
          ++i
        } 
        else currentLevel = currentLevel[key]
      }
    }
  }
}

export const isOrm = inst => g.descriptions.has(inst)

export const isPlainObject = inst =>
  inst && Object.getPrototypeOf(inst) === Object.getPrototypeOf({})

export const resolveDiff = (diff, level) =>
  typeof diff === 'function' ? diff(level) : diff

export const isPromise = inst => inst && typeof inst.then === 'function'

export const isFunction = inst => typeof inst === 'function'

// dev utils
export const cloneMap = map => {
  if (!map) return null
  const r = {}
  let i = 0
  for (let [key, val] of map.entries()) {
    if (isPlainObject(key) || Array.isArray(key)) key = `obj ${i++}`
    r[key] = val
  }
  return r
}

export const cloneMapIds = map => {
  if (!map) return null
  const r = []
  for (let id of map.keys())
    r.push(g.items.get(id))
  return r
}
