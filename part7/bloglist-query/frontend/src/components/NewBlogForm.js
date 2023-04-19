import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
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
          class: 'blog-added-notification'
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

export default NewBlogForm