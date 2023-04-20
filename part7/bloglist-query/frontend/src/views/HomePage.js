import { useState } from 'react'
import { useQuery } from 'react-query'
import blogService from '../services/blogs'
import Blog from '../components/Blog'
import NewBlogForm from '../components/NewBlogForm'
import {
  Button,
  List
} from '@mui/material'


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
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

const HomePage = () => {
  const blogsResult = useQuery('blogs', blogService.getAll, { refetchOnWindowFocus: false })

  if (blogsResult.isLoading) {
    return (<div>Loading...</div>)
  } else if (blogsResult.isError) {
    return <div>{blogsResult.error}</div>
  }

  const blogs = blogsResult.data
  const defaultPage = <>
    <h2>Blogs</h2>
    <Togglable buttonLabel='create new blog'>
      <NewBlogForm />
    </Togglable>
    <List>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
        />
      )}
    </List>
  </>

  return (
    defaultPage
  )
}

export default HomePage