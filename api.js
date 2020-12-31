/* eslint-disable */
const plainStore = store(description, initState, () => Promise, { ...options })
plainStore.put({ value: true })
useStore(plainStore, { ...options })

const ormItemStore = store(orm, initState, {
  refetchTimeoutMs: 0, // в первый раз за сессию всегда саспенс (онлайн)
  // (изменения из разных браузеров требуют)
  // дальше через refetchTimeoutMs throw Promise
  // если саспенс не нужен, то func.then(store.put)
  lifetimeMs: 2 * MONTH_MS, // через сколько удалять кэш конкретных id (оффлайн)

  refetching: Boolean, // возвращается из useStore во время refetchTimeoutMs
})
ormItemStore.put(id, { val: true })
ormItemStore.put(id, Promise)
ormItemStore.put(id, () => Promise, {
  idKey: 'id'
})
ormItemStore.get(id)
ormItemStore.get(id, { idKey: 'id' }) // -> Promise || value, { lastValue: true }
useStore(ormItemStore, id, { idKey: 'id' })

const arrayStore = store(parentOrm.path('bla.bla'), initState)
arrayStore.put(parentId, 
  () => Promise.resolve(list), 
  {
    idKey: 'id',
    // есть только у сторов
    pagination: {
      toId: 'id',
      fromId: 'id',

      per: 10,
      page: 1,
    },
    unpredictable: false,
    // sort: [],
    // filter: {}
  }
)
useStore(parentId, arrayStore, { idKey: 'id' })

const orm = orm()
orm.get(id, { idKey: 'id' })
orm.remove(id, { idKey: 'id' })
