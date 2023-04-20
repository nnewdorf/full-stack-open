import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import userService from '../services/users'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'


const UsersPage = () => {
  const usersResult = useQuery('users', userService.getAll, { refetchOnWindowFocus: false })

  if (usersResult.isLoading) {
    return <div>Loading...</div>
  } else if (usersResult.isError) {
    return <div>{usersResult.error}</div>
  }

  const users = usersResult.data

  const usersTable =
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Blogs Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user =>
          <TableRow key={user.id}>
            <TableCell>
              <Link to={`/users/${user.id}`}>
                {user.username}
              </Link>
            </TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

  return (
    <div>
      <h2>Users</h2>
      {usersTable}
    </div>
  )
}

export default UsersPage