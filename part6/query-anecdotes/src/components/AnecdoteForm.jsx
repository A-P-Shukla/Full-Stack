import React from 'react'
import { useCreateAnecdote } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const mutation = useCreateAnecdote()

  const onCreate = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.reset()
    mutation.mutate(content)
  }

  return (
    <form onSubmit={onCreate}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
