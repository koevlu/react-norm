import { store, useStore } from 'react-norm'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default () => loadAuthors()

const authorsStore = store(
  [authorOrm],
  []
)

export const useAuthors = () => ({
  authors: useStore(authorsStore)
})

const loadAuthors = () =>
  !authorsStore.isLoading() &&
    authorsStore.put(
      api.authors.get()
    )
