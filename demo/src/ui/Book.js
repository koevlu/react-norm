import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PreloadLink } from 'r-nrm'
import { useBook } from '../stores/book'
import { randomColor } from '../utils'

const Book = () => {
  const { bookId } = useParams()
  const { book, changeBook, toggleFavorite } = useBook(Number(bookId))

  const [description, setDescription] = useState(book.description)
  const [color, setColor] = useState(randomColor())
  const rColor = () => setColor(randomColor())

  return (
    <>
      <h1>
        {book.name}
      </h1>
      <PreloadLink
        to={`/author/${book.author.id}`}
        style={{
          display: 'block',
          width: 'fit-content',
          textDecoration: 'none',
          color: color,
        }}
        onMouseOver={rColor}
        onMouseOut={rColor}
      >
        <h2>{book.author.name}</h2>
      </PreloadLink>
      <img
        src={book.img}
        style={{
          width: 333
        }}
        alt="img"
      />
      <br/>
      <br/>
      description:&nbsp;
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        onBlur={() => changeBook({ ...book, description })}
        onKeyDown={e => {
          if (e.keyCode !== 13) return
          changeBook({ ...book, description })
          e.target.blur()
        }}
      />
      <br/>
      <br/>
      <label
        style={{
          color: book.favorite ? 'green' : 'red'
        }}
      >
        <input
          type="checkbox"
          checked={book.favorite}
          onChange={() => toggleFavorite()}
        />
        favorite: {String(book.favorite)}
      </label>
    </>
  )
}

export default Book
