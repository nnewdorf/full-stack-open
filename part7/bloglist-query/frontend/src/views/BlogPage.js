import { useUserValue } from '../contexts/UserContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import CommentForm from '../components/CommentForm'
import {
  Button
} from '@mui/material'


const BlogPage = () => {
  const user = useUserValue()
  const id = useParams().id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const blogsResult = useQuery('blogs', blogService.getAll)

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
      url: blog.url,
      comments: blog.comments
    }
    likeBlogMutation.mutate({ replacementBlog, idToReplace: blog.id })
  }

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (idToRemove) => {
      navigate('/')
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

  if(blogsResult.isLoading) {
    return <div>loading...</div>
  }

  const blog = blogsResult.data.find(b => b.id === id)

  return (
    <div>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>{blog.likes} likes <Button onClick={ () => likeBlog(blog)}>like</Button></div>
      {user.username === blog.user.username
        ? <div>
          <Button onClick={() => removeBlog(blog)}>remove</Button>
        </div>
        : null
      }
      <div>
        <h3>comments</h3>
        <CommentForm blogId={blog.id}/>
        <ul>
          {blog.comments.map((c, index) =>
            <li key={index}>{c}</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogPage