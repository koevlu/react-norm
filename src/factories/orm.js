import g from '../globals'

// orm.oneOf

let nextOrmKeys = ['id']
let num = 0
export const ormFactory = desc => {
  const orm = {
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
