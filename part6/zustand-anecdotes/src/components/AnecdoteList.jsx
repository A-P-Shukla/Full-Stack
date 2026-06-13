import React from 'react'
import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((s) => s.anecdotes)
  const vote = useAnecdoteStore((s) => s.vote)
  const removeIfZero = useAnecdoteStore((s) => s.removeIfZero)
  const notify = useNotificationStore((s) => s.setNotification)
  const filter = useAnecdoteStore((s) => s.filter)

  const normalized = filter.trim().toLowerCase()
  const filtered = normalized ? anecdotes.filter(a => a.content.toLowerCase().includes(normalized)) : anecdotes
  const sorted = filtered.toSorted((a, b) => (b.votes || 0) - (a.votes || 0))

  return (
    <div>
      {sorted.map(anecdote => (
        <div key={anecdote.id} className="anecdote">
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} <button onClick={async () => {
              const updated = await vote(anecdote.id)
              notify(`you voted '${anecdote.content}'`)
            }}>vote</button>
            { (anecdote.votes || 0) === 0 && (
              <button style={{ marginLeft: 8 }} onClick={async () => {
                const ok = await removeIfZero(anecdote.id)
                if (ok) notify(`deleted '${anecdote.content}'`)
              }}>delete</button>
            ) }
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
