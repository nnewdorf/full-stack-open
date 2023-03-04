import { useState } from 'react'

const Button = ({text, value, setter}) => {
  const handleClick = () => {
    setter(value+1);
  }
  
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const StatisticLine = ({text, value}) =>
  <>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </>

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = ((good-bad) / all).toFixed(1)
  const positive = ((good / all) * 100).toFixed(1)+'%';

  if (all > 0) {
    return (
      <>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
          </tbody>
        </table>
     </>
    )
  } else {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} value={good} setter={setGood} />
      <Button text={'neutral'} value={neutral} setter={setNeutral} />
      <Button text={'bad'} value={bad} setter={setBad} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App