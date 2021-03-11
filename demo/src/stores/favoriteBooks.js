import { store, useStore } from 'r-nrm'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { bookOrmStore } from '../stores/book'

export default () => loadFavoriteBooks()

const favoriteBooksStore = store(
  [bookOrm],
  []
)

export const useFavoriteBooks = () => ({
  favoriteBooks: useStore(favoriteBooksStore)
})

const loadFavoriteBooks = () =>
  !favoriteBooksStore.isLoading() &&
    favoriteBooksStore.put(
      api.favoriteBooks.get()
    )

export const toggleFavoriteBook = bookId => {
  const nextBook = bookOrmStore.put(
    bookId,
    book => ({ favorite: !book.favorite })
  )
  if (nextBook.favorite) addToFavorite(nextBook)
  else removeFromFavorite(nextBook)

  return api.book.put(bookId, nextBook)
    .catch(e => {
      if (nextBook.favorite) removeFromFavorite(nextBook)
      else addToFavorite(nextBook)
      throw e
    })
}

const addToFavorite = book =>
  favoriteBooksStore.put(favoriteBooks =>
    [book, ...favoriteBooks]
  )

const removeFromFavorite = book =>
  favoriteBooksStore.put(favoriteBooks =>
    favoriteBooks.filter(fb =>
      book.id !== fb.id
    )
  )
