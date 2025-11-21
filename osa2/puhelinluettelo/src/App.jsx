import { useState } from 'react'

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
      {props.personsToShow.map(person => (<p key={person.name}>{person.name} {person.number}</p>))}
    </div>
  )
}

function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  function addPerson(event) {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {name: newName, number: newNumber}

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App
