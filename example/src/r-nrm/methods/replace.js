import g from '../globals'
import { executeSubscriptions } from '../subscriptions'
import { deferRefreshes } from '../utils'

const replaceItem = (normId, item) => {
  g.items.set(normId, item)
  g.currentUpdatedAt = Date.now()
  g.updatedAt.set(normId, g.currentUpdatedAt)

  const updatedIds = new Map().set(normId, true)
  deferRefreshes(updatedIds)
  executeSubscriptions(updatedIds)
  return item
}

export default replaceItem
