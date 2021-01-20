import { orm } from 'react-norm'

// pass function for await const authorOrm execution
export const bookOrm = orm(() => ({
  author: authorOrm
}))

export const authorOrm = orm({
  booksPreview: [bookOrm]
})
