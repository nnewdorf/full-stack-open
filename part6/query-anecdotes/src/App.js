import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, voteFor } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const voteForMutation = useMutation(voteFor, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      const updatedAnecdotes = anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
      queryClient.setQueryData('anecdotes', updatedAnecdotes)
    }
  })

  const handleVote = (anecdote) => {
    voteForMutation.mutate(anecdote)
    const message = `you voted for ${anecdote.content}`
    notificationDispatch({type: 'SET', payload: message})
    setTimeout(() => notificationDispatch({type: 'REMOVE'}), 5000)
  }

  const result = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service is not available due to problems with the server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
