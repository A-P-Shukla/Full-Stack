import React from 'react'
import { useAnecdotesQuery, useVoteAnecdote } from '../hooks/useAnecdotes'
import { useNotify } from '../NotificationContext'

const AnecdoteList = () => {
  const { data: anecdotes } = useAnecdotesQuery()
  const voteMutation = useVoteAnecdote()
  const { notify } = useNotify()

  if (!anecdotes) return null

  const sorted = [...anecdotes].sort((a, b) => (b.votes || 0) - (a.votes || 0))

  return (
    <div>
      {sorted.map(a => (
        <div key={a.id} className="anecdote">
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button style={{ marginLeft: 8 }} onClick={() => voteMutation.mutate(a, {
              onSuccess: () => notify(`you voted '${a.content}'`),
              onError: (err) => notify(`error voting: ${err?.message || err}`)
            })}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
