import { useEffect, useContext } from 'react'
import LogInForm from './components/LogInForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import UserContext from './contexts/UserContext'
import UsersPage from './views/UsersPage'
import UserPage from './views/UserPage'
import { Routes, Route } from 'react-router-dom'
import HomePage from './views/HomePage'
import BlogPage from './views/BlogPage'
import Menu from './components/Menu'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  if(user === null) {
    return (
      <LogInForm />
    )
  }

  return (
    <div>
      <Menu />
      <div>
        <Notification/>
      </div>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/users' element={<UsersPage/>} />
        <Route path='/users/:id' element={<UserPage/>} />
        <Route path='/blogs/:id' element={<BlogPage/>} />
      </Routes>
    </div>
  )
}

export default App