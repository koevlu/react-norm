# react-norm (beta)

normalized state in hooks

## usage

- describe data relations with `orm`
- create stores of related data with `store`
- use it state in hooks with `useStore`

```JS
// example
import { orm, store, useStore } from 'react-norm'

const defaultAuthorId = 0

const bookOrm = orm(() => ({
  // by key "author" of any book is some author 
  author: authorOrm
}))

const authorOrm = orm({
  // by key "booksPreview" is array of books
  booksPreview: [bookOrm]
})

const authorBooksOrm = orm(
  [bookOrm]
)

// store for profile
// it fetched once per app when store file is resolved
// and we can pass promise as initial state
// and app will suspended by throw in useStore(profileStore)
const profileStore = store(
  { favoriteAuthors: [authorOrm] },

  api.fetchProfile()
    .catch(e => console.error(e))
)

export const useProfile = () => useStore(profileStore)

const allBooksStore = store(
  [bookOrm],

  api.fetchAllBooks()
)

const authorStore = store(
  authorOrm // orm as 1 arg for orm item usage
  // we can't fetch author at initialization
  // case we need some authorId for it
  // so stores for orms have not initial state
)

const authorBooksStore = store(
  authorBooks
  // it's store of orm authorBooks all items too
)

const useAuthor = authorId => useStore(authorStore, authorId)

const useAuthorBooks = authorId => useStore(authorBooksStore, authorId)

// profile is one for app and we dont need id for access it
// that's why description of profileStore
// ...is just an object but not orm
const useProfile = () => useStore(profileStore)

// books is same story
// it's only one array of books for app
const useBooks = () => useStore(booksStore)

let optimisticAddBookId = 0
const addBook = book => {
  book.id = `optimistic add book id ${optimisticAddBookId++}`
  authorOrm.put(book.author.id, {
    // actualize 3 first books in preview
    booksPreview: current => [book, ...current.slice(2)]
  })
  authorBooksOrm.put(
    book.author.id,
    authorBooks => [book, ...(authorBooks || [])]
  )
  api.addBook(book)
    .then(res =>
      // replace frontend created book to real book from response 
      bookOrm.replace(book.id, res.json)
    )
    .catch(e => {
      bookOrm.remove(book.id)
      console.error('add book error')
    })
}

const removeBook = book => {
  bookOrm.remove(book.id)
  api.removeBook(book.id)
    .catch(() => {
      allBooksStore.put(allBooks => [book, ...(allBooks || [])])
      authorBooksOrm.put(book.author.id, authorBooks => [book, (...authorBooks || [])])
      console.error('remove book error')
    })
}
```
