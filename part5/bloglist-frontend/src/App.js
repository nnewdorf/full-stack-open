import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const LogInForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='text'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

const LoggedInMessage = ({ user, setUser }) => {
  const handleClick = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
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

const NewBlogForm = ({ addBlog, setMessage, setMessageClass }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title, author, url
      }
      addBlog(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`a new blog ${title} by ${author} added`)
      setMessageClass('blog-added-notification')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage(exception.message)
      setMessageClass('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

const Message = ({ message, messageClass }) => {
  if(message) {
    return (
      <div className={messageClass}>
        {message}
      </div>
    )
  } else {
    return null
  }
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
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageClass, setMessageClass] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      let responseBlogs = await blogService.getAll()
      responseBlogs = responseBlogs.sort((a,b) => a.likes > b.likes)
      setBlogs( responseBlogs )
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (newBlog) => {
    const returnedBlog = await blogService.create(newBlog)
    returnedBlog.user = {
      id: returnedBlog.user,
      username: user.username,
      name: user.name
    }
    console.log(returnedBlog)
    setBlogs(blogs.concat(returnedBlog))
  }

  const likeBlog = async (blog) => {
    const replacementBlog = {
      user: blog.user.id,
      likes: (blog.likes + 1),
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    await blogService.update(replacementBlog, blog.id)
    let updatedBlogs = [...blogs]
    const updatedBlog = updatedBlogs.find(b => b.id === blog.id)
    updatedBlog.likes++
    updatedBlogs = updatedBlogs.sort((a,b) => a.likes > b.likes)
    setBlogs(updatedBlogs)
  }

  const isUserOwner = username => user.username === username

  const removeBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const idToRemove = blog.id
      await blogService.remove(idToRemove)
      const newBlogs = blogs.filter(b => b.id !== idToRemove)
      setBlogs(newBlogs)
    }
  }

  if(user === null) {
    return (
      <LogInForm setUser={setUser}/>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Message message={message} messageClass={messageClass} />
        <LoggedInMessage user={user} setUser={setUser} />
        <Togglable buttonLabel='create new blog'>
          <NewBlogForm
            addBlog={addBlog}
            setMessage={setMessage}
            setMessageClass={setMessageClass}
          />
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            isUserOwner={isUserOwner}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        )}
      </div>
    )
  }
}

export default App