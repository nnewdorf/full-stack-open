import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = (props) => {
  const { data: userData } = useQuery(ME)
  const userGenre = userData?.me?.favoriteGenre
  const result = useQuery(ALL_BOOKS, {
      skip: !userGenre,
      variables: { genre: userGenre }
    }
  )

  if (!props.show) {
    return null
  }

  if(result.loading) {
    return <div>loading...</div>
  }

  const books = userGenre ? result.data.allBooks : []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{userGenre}</b></p>
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
    </div>
  )
}

export default Recommended