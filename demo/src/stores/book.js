import { ormStore, useOrmStore } from 'r-nrm'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { toggleFavoriteBook } from '../stores/favoriteBooks'

export default params => loadBook(params.bookId)

export const bookOrmStore = ormStore(
  bookOrm
)

export const useBook = bookId => {
  bookId = Number(bookId)
  if (!bookOrmStore.wasLoaded(bookId)) loadBook(bookId)
  return {
    book: useOrmStore(bookOrmStore, bookId),

    changeBook: diff =>
      changeBook(bookId, diff)
        .catch(console.error),

    toggleFavorite: () =>
      toggleFavoriteBook(bookId)
        .catch(console.error)
  }
}

const loadBook = bookId => {
  bookId = Number(bookId)
  if (!bookOrmStore.isLoading(bookId))
    bookOrmStore.put(
      bookId,
      api.book.get(bookId)
    )
}

const changeBook = (bookId, diff) => {
  bookId = Number(bookId)
  bookOrmStore.put(bookId, diff)

  const book = bookOrmStore.get(bookId)
  return api.book.put(bookId, diff)
    .catch(e => {
      bookOrmStore.put(bookId, book)
      throw e
    })
}
