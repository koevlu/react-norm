import { store, useStore } from 'r-nrm'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default params => loadAuthor(params.authorId)

const authorStore = store(
  authorOrm
)

export const useAuthor = authorId => {
  authorId = Number(authorId)
  if (!authorStore.wasLoaded(authorId)) loadAuthor(authorId)
  return {
    author: useStore(authorStore, authorId)
  }
}

const loadAuthor = authorId => {
  authorId = Number(authorId)
  if (!authorStore.isLoading(authorId))
    authorStore.put(
      authorId,
      api.author.get(authorId)
    )
}
