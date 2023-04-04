import axios from 'axios'
const BASE_URL = '/api/persons'

const getNumbers = () => {
    const request = axios.get(BASE_URL)
    return request.then(response => response.data)
}

const postNumbers = (newPerson) => {
    const request = axios.post(BASE_URL, newPerson)
    return request.then(response => response.data)
}

const replaceNumber = (person) => {
    const request = axios.put(`${BASE_URL}/${person.id}`, person)
    return request.then(response => response.data)
}

const deleteNumber = (person) => {
    const request = axios.delete(`${BASE_URL}/${person.id}`)
    return request.then(response => response.data)
}

export {
    getNumbers,
    postNumbers,
    replaceNumber,
    deleteNumber
}
