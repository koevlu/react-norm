import { AUTHORS, BOOKS, FAVORITE_BOOKS } from './data'

const api = {
  author: {
    get: authorId => delay(() =>
      ({ ...AUTHORS[authorId] })
    )
  },
  authors: {
    get: () => delay(() =>
      Object.values(AUTHORS)
    )
  },
  book: {
    get: bookId => delay(() =>
      ({ ...BOOKS[bookId] })
    ),
    put: (bookId, diff) => delay(() =>
      putBook(bookId, diff)
    )
  },
  favoriteBooks: {
    get: () => delay(() =>
      [...FAVORITE_BOOKS]
    ),
  }
}
// 
// for (let inst of api)
//   for (let key of api[inst]) {
//     const method = api[inst][key]
//     api[inst][key] = (...args) => {
//       console.log(`${inst}.${key}`)
//       method(...args)
//     }
//   }


export default api

const delay = (func, ms = 999) =>
  new Promise(resolve =>
    setTimeout(
      () => resolve(func()), 
      ms
    )
  )

const putBook = (bookId, diff) => {
  const book = { ...BOOKS[bookId] }
  BOOKS[bookId] = book
  putAuthorPreviewBook(bookId, book)
  if (diff.hasOwnProperty('favorite')) {
    if (book.favorite !== diff.favorite)
      toggleFavoriteBook(bookId, book)
  }
  if (book.favorite) {
    const index = FAVORITE_BOOKS
      .findIndex(fb => fb.id === bookId)
    if (index !== -1) FAVORITE_BOOKS[index] = book
  }
  for (let key in diff) {
    book[key] = diff[key]
  }
  return book
}

const toggleFavoriteBook = (bookId, book) => {
  const index = FAVORITE_BOOKS
    .findIndex(fb => fb.id === bookId)
  if (index === -1) FAVORITE_BOOKS.unshift(book)
  else FAVORITE_BOOKS.splice(index, 1)
  return [...FAVORITE_BOOKS]
}

const putAuthorPreviewBook = (bookId, book) => {
  const authorId = book.author.id
  AUTHORS[authorId] = {
    ...AUTHORS[authorId],
    booksPreview: AUTHORS[authorId].booksPreview
      .map(b => b.id === bookId ? book : b)
  }
}
