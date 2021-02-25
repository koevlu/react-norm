import { orm } from 'r-nrm'

// pass func for await const authorOrm execution
export const bookOrm = orm(() => ({
  author: authorOrm
}))

export const authorOrm = orm({
  booksPreview: [bookOrm]
})
