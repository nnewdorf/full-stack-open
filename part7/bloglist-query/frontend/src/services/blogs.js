import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async ({ replacementBlog, idToReplace }) => {
  const response = await axios.put(`${baseUrl}/${idToReplace}`, replacementBlog)
  return response.data
}

const remove = async idToRemove => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${idToRemove}`, config)
  return idToRemove
}

const comment = async ({ comment, id }) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  return response.data
}

export default { create, getAll, update, remove, setToken, comment }