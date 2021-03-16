import { orm } from '*'

// pass func for await const authorOrm execution
export const bookOrm = orm(() => ({
  author: authorOrm
}))

export const authorOrm = orm({
  booksPreview: [bookOrm]
})
