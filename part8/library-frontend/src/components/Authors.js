import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import { EDIT_AUTHOR } from '../mutations'
import { useState } from 'react'
import Select from 'react-select'

const SetBirthYear = ({authors}) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })
  
  const options = authors.map(a => {return {value: a.name, label: a.name}})

  const submit = (event) => {
    event.preventDefault()
    const setBornTo = Number(year)
    editAuthor({variables: {name, setBornTo}})
    setName('')
    setYear('')
  }

  const onNameChange = ({value, label}) => {
    setName(value)
  }

  return (
    <>
    <h3>set birth year</h3>
    <form onSubmit={submit}>
      <div>
        <Select
          defaultValue={options[0]}
          onChange={onNameChange}
          options={options}
        />
      </div>
      <div>
        year
        <input
          value={year}
          onChange={({ target }) => setYear(target.value)}
        />
      </div>
      <button type='submit'>update author</button>
    </form>
    </>
  )
}


const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  
  if (!props.show) {
    return null
  }
  
  if (result.loading) {
    return <div>Loading...</div>
  } else if (result.error) {
    console.log(result.error)
  }

  const authors = result.data.allAuthors || []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors}/>
    </div>
  )
}

export default Authors
