
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const UserPage = () => {
  const usersResult = useQuery('users', userService.getAll, { refetchOnWindowFocus: false })
  const id = useParams().id

  if (usersResult.isLoading) {
    return <div>loading...</div>
  }

  const user = usersResult.data.find(u => u.id === id)

  const addedBlogsList =
  <ul>
    {user.blogs.map(b =>
      <li key={b.id}>
        {b.title}
      </li>
    )}
  </ul>

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>added blogs</h3>
      {addedBlogsList}
    </div>
  )
}

export default UserPage