import g from '../globals'
import { getItem } from '../methods/get'
import { putItem } from '../methods/put'
import removeItem from '../methods/remove'
import replaceItem from '../methods/replace'
import { normalizeId } from '../utils'

// orm.oneOf

let nextOrmKeys = ['id']
let num = 0
export const ormFactory = desc => {
  const orm = {
    put: (id, diff, userOptions) => {
      const options = { idKey: 'id' , ...userOptions }
      const normId = normalizeId(orm, options.idKey, id)
      return putItem(orm, normId, diff)
    },
    get: (id, userOptions) => {
      const options = { idKey: 'id', ...userOptions }
      const normId = normalizeId(orm, options.idKey, id)
      return getItem(normId)
    },
    replace: (id, newValue, userOptions) => {
      const options = { idKey: 'id', ...userOptions }
      const normId = normalizeId(orm, options.idKey, id)
      return replaceItem(normId, newValue)
    },
    remove: (id, userOptions) => {
      const options = { idKey: 'id', ...userOptions }
      const normId = normalizeId(orm, options.idKey, id)
      return removeItem(normId)
    },
    num: num++
  }

  g.descriptions.set(orm, desc)
  g.ormKeys.set(orm, nextOrmKeys)
  nextOrmKeys = ['id']

  return orm
}

ormFactory.byKeys = (...args) => {
  nextOrmKeys = args
  return ormFactory
}
