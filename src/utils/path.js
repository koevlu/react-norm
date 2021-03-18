const path = (current, ...keys) => {
  for (const key of keys) {
    current.set(key, current.has(key) ? current.get(key) : new Map)
    current = current.get(key)
  }
  return current
}

export const pathGet = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  return parent.get(key)
}

export const pathSet = (map, ...keys) => val => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  parent.set(key, val)
  return val
}

export const pathDelete = (map, ...keys) => {
  const key = keys.pop()
  const parent = pathGet(map, ...keys)
  const item = parent.get(key)
  parent.delete(key)
  return item
}

export const pathIncrement = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  const val = parent.get(key) ? parent.get(key) : 1
  parent.set(key, val)
}

export const pathDecrement = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  const val = map.get(key) - 1
  if (!val) parent.delete(key)
  else parent.set(key, val)
}
