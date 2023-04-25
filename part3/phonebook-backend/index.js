const express = require('express')
const fs = require('fs')
const persons = require('./persons.json')

const app = express()

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id == id)
  const newPersons = persons.filter(p => p.id !== id)
  const data = JSON.stringify(newPersons)
  
  if(person) {
    fs.writeFile('persons.json', data, (err) => {
      if (err) {
        throw err
      }
      console.log(`${person.name} deleted`)
    })
  }

  response.status(204).end()
})

app.get('/api/info', (request, response) => {
  const numberOfPeople = persons.length
  const timeRecieved = Date()
  const returnString = `Phonebook has info for ${numberOfPeople} people ${timeRecieved}`
  
  response.json(returnString)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})