import { getNumbers, postNumbers, replaceNumber, deleteNumber } from './services'
import { useEffect, useState } from 'react'

const DeleteButton = ({person, persons, setPersons}) => {
  const handleClick = () => {
    deleteNumber(person)
    setPersons(persons.filter(element => element.id !== person.id))
  }

  return(
    <>
      <button onClick={handleClick}>delete</button>
    </>
  )
}

const Persons = ({persons, filter, setPersons}) =>
  <>
    {
      persons.filter(
        person => person.name.toLowerCase().includes(filter.toLowerCase())
      ).map(
        person => 
          <p key={person.name}>{person.name} {person.number}
            <DeleteButton person={person} persons={persons} setPersons={setPersons} />
          </p>
      )
    }
  </>

const Filter = ({setFilter}) => {
  const handleChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <>
      <div>
        filter shown with: <input onChange={handleChange}></input>
      </div>
    </>
  )
}

const PersonForm = ({persons, setPersons}) => {
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')

  const handleNewNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNumber(event.target.value)
  const handleSubmitClick = (event) => {
    event.preventDefault()

    const foundPerson = persons.find(person => newName === person.name)
    
    if (foundPerson === undefined) {
      const id = persons.length+1
      const newPerson = { name: newName, number: number, id: id}
      postNumbers(newPerson).then(response => setPersons([...persons].concat(response)))
    } else {
      const newPerson = { name: newName, number: number, id: foundPerson.id}
      replaceNumber(newPerson)
      setPersons(persons.map(person => person.id === foundPerson.id ? newPerson : person))
    }
  }

  return (
    <>
      <form>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmitClick}>add</button>
        </div>    
      </form>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getNumbers()
    .then(result =>setPersons(result))
  },[])

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter setFilter={setFilter} />
      <h3>Add a new</h3>
        <PersonForm persons={persons} setPersons={setPersons}/>
      <h3>Numbers</h3>
        <Persons persons={persons} filter={filter} setPersons={setPersons}/>
    </div>
  )
}

export default App