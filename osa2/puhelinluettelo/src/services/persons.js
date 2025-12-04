import axios from 'axios'

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://puhelinluettelo-backend-nnym.onrender.com/api/persons'
  : '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default { getAll, create, remove, update }
