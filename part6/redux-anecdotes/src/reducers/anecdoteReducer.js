import { createSlice } from "@reduxjs/toolkit"
import anecdotesService from "../services/anecdotes"

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const toUpdate = state.find(a => a.id === id)
      toUpdate.votes++
      return state
    },
    appendAnecdote(state, action) {
      return state.concat(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { vote, appendAnecdote, setAnecdotes } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.addAnecdote(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteFor = (anecdote) => {
  return async dispatch => {
    await anecdotesService.vote(anecdote)
    dispatch(vote(anecdote.id))
  }
}

export default anecdotesSlice.reducer