import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const alist = state.anecdotes
    const filter = state.filter

    if(filter === '') {
      return alist
    } else {
      const lowercaseFilter = filter.toLowerCase()
      return alist.filter(a => a.content.toLowerCase().includes(lowercaseFilter))
    }
  })
  const dispatch = useDispatch()

  const handleVote = (anecdote) => {
    dispatch(voteFor(anecdote))
    dispatch(setNotification(`voted for ${anecdote.content}`, 5000))
  }

  return (
  <>
    { 
    anecdotes.slice().sort((a, b) => b.votes - a.votes).map(anecdote =>
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
  </>
  )
}

export default AnecdoteList