import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import useAnecdoteStore from './store'
import { useEffect } from 'react'

const App = () => {
  const fetchAnecdotes = useAnecdoteStore((s) => s.fetchAnecdotes)
  useEffect(() => { fetchAnecdotes() }, [fetchAnecdotes])
  return (
    <div className="container">
      <Notification />
      <h1>Anecdotes</h1>
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
