import { store, useStore } from 'r-nrm'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { toggleFavoriteBook } from '../stores/favoriteBooks'

export default params => loadBook(params.bookId)

const bookStore = store(
  bookOrm
)

export const useBook = bookId => {
  bookId = Number(bookId)
  if (!bookStore.wasLoaded(bookId)) loadBook(bookId)
  return {
    book: useStore(bookStore, bookId),

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
  if (!bookStore.isLoading(bookId))
    bookStore.put(
      bookId,
      api.book.get(bookId)
    )
}

const changeBook = (bookId, diff) => {
  bookId = Number(bookId)
  bookStore.put(bookId, diff)

  const book = bookStore.get(bookId)
  return api.book.put(bookId, diff)
    .catch(e => {
      bookStore.put(bookId, book)
      throw e
    })
}
