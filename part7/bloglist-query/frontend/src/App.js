import { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import LogInForm from './components/LogInForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import UserContext from './contexts/UserContext'
import UsersPage from './views/UsersPage'
import { Routes, Route } from 'react-router-dom'

const LoggedInMessage = () => {
  const [user, userDispatch] = useContext(UserContext)

  const handleClick = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    userDispatch({ type: 'RESET' })
  }

  return (
    <div>
      {user.name} logged in
      <button onClick={handleClick}>
        logout
      </button>
    </div>
  )
}

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const queryClient = useQueryClient()
  const blogsResult = useQuery('blogs', blogService.getAll, { refetchOnWindowFocus: false })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const likeBlogMutation = useMutation(blogService.update, {
    onSuccess: (responseBlog) => {
      const currentBlogs = queryClient.getQueryData('blogs')
      const blogToIncrement = currentBlogs.find(b => b.id === responseBlog.id)
      blogToIncrement.likes++
      const updatedBlogs = currentBlogs.map(b => b.id === blogToIncrement.id ? blogToIncrement : b)
      queryClient.setQueryData('blogs', updatedBlogs)
    }
  })

  const likeBlog = async (blog) => {
    const replacementBlog = {
      user: blog.user.id,
      likes: (blog.likes + 1),
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    likeBlogMutation.mutate({ replacementBlog, idToReplace: blog.id })
  }

  const isUserOwner = username => user.username === username

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (idToRemove) => {
      const currentBlogs = queryClient.getQueryData('blogs')
      const updatedBlogs = currentBlogs.filter(b => b.id !== idToRemove)
      queryClient.setQueryData('blogs', updatedBlogs)
    }
  })

  const removeBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const idToRemove = blog.id
      removeBlogMutation.mutate(idToRemove)
    }
  }

  if(user === null) {
    return (
      <LogInForm />
    )
  }

  if (blogsResult.isLoading) {
    return (<div>Loading...</div>)
  } else if (blogsResult.isError) {
    return <div>{blogsResult.error}</div>
  }

  const blogs = blogsResult.data
  const defaultPage = <>
    <Togglable buttonLabel='create new blog'>
      <NewBlogForm />
    </Togglable>
    {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        isUserOwner={isUserOwner}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
      />
    )}
  </>

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Notification/>
        <LoggedInMessage />
      </div>
      <Routes>
        <Route path='/' element={defaultPage} />
        <Route path='/users' element={<UsersPage/>} />
      </Routes>
    </div>
  )
}

export default App