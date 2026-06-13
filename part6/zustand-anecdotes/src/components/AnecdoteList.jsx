import React from 'react'
import useAnecdoteStore from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((s) => s.anecdotes)
  const vote = useAnecdoteStore((s) => s.vote)

  const sorted = anecdotes.toSorted((a, b) => (b.votes || 0) - (a.votes || 0))

  return (
    <div>
      {sorted.map(anecdote => (
        <div key={anecdote.id} className="anecdote">
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
