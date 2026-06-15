import React from 'react'
import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(a => (
        <div key={a.id} className="anecdote">
          <div>{a.content}</div>
          <div>has {a.votes}</div>
          <button onClick={() => deleteAnecdote(a.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
