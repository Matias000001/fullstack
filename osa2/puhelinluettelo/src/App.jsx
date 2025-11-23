import { useState, useEffect } from 'react'
import noteService from './services/persons'
import personService from './services/persons'


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

  useEffect(() => {
    noteService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  function handleDelete(id, name) {
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }


function addPerson(event) {
  event.preventDefault()

  const existingPerson = persons.find(p => p.name === newName)

  if (existingPerson) {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (ok) {
      const changedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  } else {
    const personObject = { name: newName, number: newNumber }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
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
