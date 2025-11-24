import { useState, useEffect } from 'react'
import noteService from './services/persons'
import personService from './services/persons'
import Notification from './components/Notification'


function Filter(props) {
  return (
    <div>
      filter shown with:{' '}
      <input value={props.filter} onChange={props.handleFilterChange}/>
    </div>
  )
}

function PersonForm(props) {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:{' '}
        <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number:{' '}
        <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

function Persons(props) {
  return (
    <div>
      {props.personsToShow.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          {' '}
          <button onClick={() => props.handleDelete(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const notify = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  useEffect(() => {
    noteService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        notify('Tietojen haku epäonnistui')
      })
  }, [])
  function handleDelete(id, name) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        notify(`Deleted ${name}`, 'success')
      })
      .catch(() => {
        notify(`Information of ${name} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  function addPerson(event) {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      const changedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          notify(`Changed number of ${returnedPerson.name}`, 'success')
        })
        .catch(() => {
          notify(`Information of ${existingPerson.name} has already been removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    } else {
      const personObject = { name: newName, number: newNumber }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          notify(`Added ${returnedPerson.name}`, 'success')
        })
        .catch(() => {
          notify('Creating person failed', 'error')
        })
    }
  }

  function handleNameChange(event) {setNewName(event.target.value)}
  function handleNumberChange(event) {setNewNumber(event.target.value)}
  function handleFilterChange(event) {setFilter(event.target.value)}

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
