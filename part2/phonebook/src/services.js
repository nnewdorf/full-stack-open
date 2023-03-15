import axios from 'axios'
const BASE_URL = 'http://localhost:3001/persons'

const getNumbers = () => {
    const request = axios.get(BASE_URL)
    return request.then(response => response.data)
}

const postNumbers = (newPerson) => {
    const request = axios.post(BASE_URL, newPerson)
    return request.then(response => response.data)
}

const replaceNumber = (person) => {
    const confirmationString = `${person.name} is already added to the phonebook, replace the old number with the new one?`
    if (window.confirm(confirmationString)) {
        axios.put(`${BASE_URL}/${person.id}`, person)
    }
}

const deleteNumber = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
        const request = axios.delete(`${BASE_URL}/${person.id}`)
        return request.then(response => response.data)
    }
}

export {
    getNumbers,
    postNumbers,
    replaceNumber,
    deleteNumber
}