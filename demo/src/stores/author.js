import { ormStore, useOrmStore } from 'r-nrm'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default params => loadAuthor(params.authorId)

const authorOrmStore = ormStore(
  authorOrm
)

export const useAuthor = authorId => {
  authorId = Number(authorId)
  if (!authorOrmStore.wasLoaded(authorId)) loadAuthor(authorId)
  return {
    author: useOrmStore(authorOrmStore, authorId)
  }
}

const loadAuthor = authorId => {
  authorId = Number(authorId)
  if (!authorOrmStore.isLoading(authorId))
    authorOrmStore.put(
      authorId,
      api.author.get(authorId)
    )
}
