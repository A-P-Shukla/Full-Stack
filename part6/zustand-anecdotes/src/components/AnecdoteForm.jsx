import React from 'react'
import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteForm = () => {
  const create = useAnecdoteStore((s) => s.create)
  const notify = useNotificationStore((s) => s.setNotification)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    try {
      const created = await create(content)
      if (created) notify(`you created '${content}'`)
      else notify('failed to create anecdote')
    } catch (err) {
      notify(`error creating anecdote: ${err?.message || err}`)
    }
    e.target.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" placeholder="write an anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
