import { useState } from 'react'
import {
  Box,
  Button,
  TextField
} from '@mui/material'
import { useUserDispatch } from '../contexts/UserContext'
import blogsService from '../services/blogs'
import loginService from '../services/login'

const LogInForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogsService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <div>
        <h2>Log In To Application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              type='text'
              id='username'
              value={username}
              name='Username'
              label='Username'
              margin='dense'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              type='password'
              id='password'
              value={password}
              name='Password'
              label='Password'
              margin='dense'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type='submit' id='login-button'>login</Button>
        </form>
      </div>
    </Box>
  )
}

export default LogInForm