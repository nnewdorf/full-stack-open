import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  const [allGenres, setAllGenres] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if(result.data && genre === 'all genres'){
      const books = result.data.allBooks
      const reducedBooks = books.reduce((accumulator, current) => {
        current.genres.forEach(g => {
          if (accumulator.indexOf(g) === -1) {
            accumulator.push(g)
          }
        })
        return accumulator
      }, [])
      reducedBooks.push('all genres')
      setAllGenres(reducedBooks)
    }
  }, [result])

  useEffect(() => {
    if (genre === 'all genres') {
      result.refetch({genre: undefined})
    } else {
      result.refetch({genre})
    }
  }, [genre])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  } else if (result.error) {
    console.log(result.error)
  }

  const genreButtons = allGenres.map(g => <button key={g} onClick={() => setGenre(g)}>{g}</button>)
  const books = result.data.allBooks || []

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{genre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genreButtons}
    </div>
  )
}

export default Books
