export { ormFactory as orm } from './factories/orm'
export { storeFactory as store } from './factories/store'
// ? export { ormStoreFactory as ormStore } from './factories/ormStore'
export { useStore, useLoading } from './hooks'

// trouble: import('...') is promise 
// and store.put calls after first component render
// export { preloadStore } from './preloadStore'
