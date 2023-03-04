import { useState } from 'react'

const getRandomNumber = () => Math.floor(Math.random() * 8)
const getMostVotesIndex = (votes) => votes.reduce(
  (currentMaxIndex, voteCount, index, votes) => voteCount > votes[currentMaxIndex] ? index : currentMaxIndex,
  0
)

const Button = ({text, handelClick}) => {
  return (
    <>
      <button onClick={handelClick}>{text}</button>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(8).fill(0))

  const handleVoteClick = () => {
    const copyOfVotes = [...votes]
    copyOfVotes[selected] += 1
    setVotes(copyOfVotes)
  }

  const handleAnecdoteClick = () => setSelected(getRandomNumber())

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text="vote" handelClick={handleVoteClick} />
      <Button text="next anecdote" handelClick={handleAnecdoteClick} />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[getMostVotesIndex(votes)]}</p>
    </div>
  )
}

export default App