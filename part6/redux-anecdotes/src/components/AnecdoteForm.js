import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    const response = await dispatch(addAnecdote(anecdote))
    dispatch(setNotification(`created ${response}`, 5000))
  }

  return (
  <>
    <h2>create new</h2>
    <form onSubmit={newAnecdote}>
      <input name='anecdote'/>
      <button type='submit'>create</button>
    </form>
  </>
  )
}

export default AnecdoteForm