import g from '../globals'

let num = 0
export const ormFactory = desc => {
  const orm = { num: num++ }

  g.descriptions.set(orm, desc)

  return orm
}
