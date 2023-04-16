import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => 
  axios.get(baseUrl).then(res => res.data)

export const addAnecdote = anecdote => 
  axios.post(baseUrl, anecdote).then(res => res.data)

export const voteFor = (anecdote) =>{
  const updatedAnecdote = {...anecdote, votes: anecdote.votes+1}
  return axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)
}
