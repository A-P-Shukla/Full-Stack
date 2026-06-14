import React from 'react'
import { useCreateAnecdote } from '../hooks/useAnecdotes'
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const mutation = useCreateAnecdote()
  const { notify } = useNotify()

  const onCreate = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.reset()
    mutation.mutate(content, {
      onSuccess: () => notify(`a new anecdote '${content}' created`),
      onError: (err) => notify(`error creating anecdote: ${err?.message || err}`)
    })
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
