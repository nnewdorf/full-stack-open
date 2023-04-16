import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addAnecdote = async (content) => {
  const anecdote = {content, votes: 0}
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const vote = async (anecdote) => {
  const updatedAnecdote = {...anecdote, votes: anecdote.votes+1}
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updatedAnecdote)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, addAnecdote, vote }