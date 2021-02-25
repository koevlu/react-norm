const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous')

const aliasMap = {
  'r-nrm': '../src'
}

module.exports = aliasDangerous(aliasMap)
