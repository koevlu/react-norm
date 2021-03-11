import g from './globals'
import { putItem } from './methods/put'

export const LOADING_NORM_ID = 'LOADING_NORM_ID'

export const actualizeLoading = () => {
  const loader = g.suspensePromises.size !== 0 || g.refetchingPromises.size !== 0
  queueMicrotask(() => putItem(null, LOADING_NORM_ID, loader))
}
