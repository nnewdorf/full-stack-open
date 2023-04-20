import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'

const CommentForm = ({ blogId }) => {
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const commentMutation = useMutation(blogService.comment, {
    onSuccess: (responseBlog) => {
      const currentBlogs = queryClient.getQueryData('blogs')
      const blogToCommentOn = currentBlogs.find(b => b.id === responseBlog.id)
      blogToCommentOn.comments = responseBlog.comments
      const updatedBlogs = currentBlogs.map(b => b.id === blogToCommentOn.id ? blogToCommentOn : b)
      queryClient.setQueryData('blogs', updatedBlogs)
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(comment)
    commentMutation.mutate({ comment: { comment }, id: blogId })
  }

  return(
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        id='comment'
        value={comment}
        name='Comment'
        onChange={({ target }) => setComment(target.value)}
      />
      <button type='submit'>add comment</button>
    </form>
  )
}

export default CommentForm