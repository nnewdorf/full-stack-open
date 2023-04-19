import { useQuery } from 'react-query'
import userService from '../services/users'

const UsersPage = () => {
  const usersResult = useQuery('users', userService.getAll, { refetchOnWindowFocus: false })

  if (usersResult.isLoading) {
    return <div>Loading...</div>
  } else if (usersResult.isError) {
    return <div>{usersResult.error}</div>
  }

  const users = usersResult.data

  const usersTable =
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user =>
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.blogs.length}</td>
          </tr>
        )}
      </tbody>
    </table>

  return (
    <div>
      <h2>Users</h2>
      {usersTable}
    </div>
  )
}

export default UsersPage