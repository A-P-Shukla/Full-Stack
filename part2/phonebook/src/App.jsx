import { useEffect, useRef, useState } from 'react'
import personService from './services/persons'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const baseStyle = {
    background: '#f3f4f6',
    border: '2px solid',
    borderRadius: '6px',
    color: '#0f172a',
    marginBottom: '12px',
    padding: '10px 12px'
  }

  const style =
    notification.type === 'error'
      ? { ...baseStyle, borderColor: '#dc2626', color: '#991b1b' }
      : { ...baseStyle, borderColor: '#16a34a', color: '#166534' }

  return <div style={style}>{notification.message}</div>
}

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}{' '}
        <button type="button" onClick={() => onDelete(person)}>
          delete
        </button>
      </p>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutRef = useRef(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    setNotification({ message, type })
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      const shouldUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!shouldUpdate) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id === existingPerson.id ? returnedPerson : person
            )
          )
          showNotification(`Updated ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter((person) => person.id !== existingPerson.id))
        })
      return
    }

    const personObject = { name: newName, number: newNumber }

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      showNotification(`Added ${returnedPerson.name}`)
      setNewName('')
      setNewNumber('')
    })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleDeletePerson = (person) => {
    const shouldDelete = window.confirm(`Delete ${person.name}?`)
    if (!shouldDelete) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((entry) => entry.id !== person.id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(() => {
        showNotification(
          `Information of ${person.name} has already been removed from server`,
          'error'
        )
        setPersons(persons.filter((entry) => entry.id !== person.id))
      })
  }

  const personsToShow =
    filter.trim() === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App
