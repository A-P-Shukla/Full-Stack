import React from 'react'
import useAnecdoteStore from '../store'

const AnecdoteForm = () => {
  const create = useAnecdoteStore((s) => s.create)

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (content) {
      create(content)
      e.target.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" placeholder="write an anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
