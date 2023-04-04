import { getNumbers, postNumbers, replaceNumber, deleteNumber } from './services'
import { useEffect, useState } from 'react'
import './App.css'

const DeleteButton = ({person, persons, setPersons, setErrorMessage}) => {
  const handleClick = () => {
    const confirmationString = `Delete ${person.name}?`
    if (window.confirm(confirmationString)) {
      deleteNumber(person).catch(error => {
        setErrorMessage(`Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      setPersons(persons.filter(element => element.id !== person.id))
    }
  }

  return(
    <>
      <button onClick={handleClick}>delete</button>
    </>
  )
}

const Persons = ({persons, filter, setPersons, setErrorMessage}) =>
  <>
    {
      persons.filter(
        person => person.name.toLowerCase().includes(filter.toLowerCase())
      ).map(
        person => 
          <p key={person.name}>{person.name} {person.number}
            <DeleteButton person={person} persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage}/>
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

const PersonForm = ({persons, setPersons, setMessage, setErrorMessage}) => {
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
      postNumbers(newPerson)
        .then(response => {
          setPersons([...persons].concat(response))
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } else {
      const confirmationString = `${newName} is already added to the phonebook, replace the old number with the new one?`
      if (window.confirm(confirmationString)) {
        const newPerson = { name: newName, number: number, id: foundPerson.id}
        replaceNumber(newPerson)
        setPersons(persons.map(person => person.id === foundPerson.id ? newPerson : person))
      }
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

const Notification = ({message}) => {
  if (message == null) {
    return null
  }

  return (
    <div className='person-added-notification'>
      {message}
    </div>
  )
}

const ErrorNotification = ({message}) => {
  if (message == null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    getNumbers()
    .then(result => setPersons(result))
  },[])

  return (
    <div>
      <h2>Phonebook</h2>
        <ErrorNotification message={errorMessage}/>
        <Notification message={message}/>
        <Filter setFilter={setFilter} />
      <h3>Add a new</h3>
        <PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage} setErrorMessage={setErrorMessage}/>
      <h3>Numbers</h3>
        <Persons persons={persons} filter={filter} setPersons={setPersons} setErrorMessage={setErrorMessage}/>
    </div>
  )
}

export default App
