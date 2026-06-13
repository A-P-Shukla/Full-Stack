import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useAnecdotesQuery } from './hooks/useAnecdotes'

const App = () => {
  const result = useAnecdotesQuery()

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h1>Anecdotes</h1>
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
