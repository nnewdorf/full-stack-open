import { useNotificationDispatch } from "../NotificationContext"
import { useMutation, useQueryClient} from "react-query"
import { addAnecdote } from "../requests"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const addAnecdoteMutation = useMutation(addAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      notificationDispatch({type: 'SET', payload: 'Too short, anecdote must be at least 5 characters'})
      setTimeout(() => notificationDispatch({type: 'REMOVE'}), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    addAnecdoteMutation.mutate({content, votes: 0})
    event.target.anecdote.value = ''
    const message = `added anecdote: ${content}`
    notificationDispatch({type: 'SET', payload: message})
    setTimeout(() => notificationDispatch({type: 'REMOVE'}), 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
