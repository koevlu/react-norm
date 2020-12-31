export const preloadStore =
  (importStore, exportName = 'default') => (...args) =>
    importStore()
      .then(module => module[exportName] && module[exportName](...args))
