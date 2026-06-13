import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div className="container">
      <h1>Anecdotes</h1>
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
