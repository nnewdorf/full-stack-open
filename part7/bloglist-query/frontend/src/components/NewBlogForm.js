import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import {
  Button,
  TextField
} from '@mui/material'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { useUserValue } from '../contexts/UserContext'


const NewBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const user = useUserValue()

  const notificationDispatch = useNotificationDispatch()

  const queryClient = useQueryClient()
  const createBlog = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      newBlog.user = {
        id: newBlog.user,
        username: user.username,
        name: user.name
      }
      const currentBlogs = queryClient.getQueryData('blogs')
      const updatedBlogs = currentBlogs.concat(newBlog)
      queryClient.setQueryData('blogs', updatedBlogs)
    }
  })

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title, author, url
      }
      createBlog.mutate(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      notificationDispatch({
        type: 'SET',
        payload: {
          message: `a new blog ${title} by ${author} added`,
          class: 'success'
        }
      })
    } catch (exception) {
      notificationDispatch({
        type: 'SET',
        payload: {
          message: exception.message,
          class: 'error'
        }
      })
    }
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleCreate}>
        <div>
          <TextField
            type='text'
            value={title}
            name='Title'
            label='Title'
            margin='dense'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            type='text'
            value={author}
            name='Author'
            label='Author'
            margin='dense'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            type='text'
            value={url}
            name='URL'
            label='Url'
            margin='dense'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type='submit'>create</Button>
      </form>
    </div>
  )
}

export default NewBlogForm