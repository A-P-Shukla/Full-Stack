import React from 'react'
import { useAnecdotesQuery, useVoteAnecdote } from '../hooks/useAnecdotes'

const AnecdoteList = () => {
  const { data: anecdotes } = useAnecdotesQuery()
  const voteMutation = useVoteAnecdote()

  if (!anecdotes) return null

  const sorted = [...anecdotes].sort((a, b) => (b.votes || 0) - (a.votes || 0))

  return (
    <div>
      {sorted.map(a => (
        <div key={a.id} className="anecdote">
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button style={{ marginLeft: 8 }} onClick={() => voteMutation.mutate(a)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
