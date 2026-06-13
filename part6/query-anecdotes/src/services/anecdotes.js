const API = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('failed to fetch anecdotes')
  return res.json()
}

export const createAnecdote = async (content) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  })
  if (!res.ok) throw new Error('failed to create anecdote')
  return res.json()
}

export const voteAnecdote = async (anecdote) => {
  const res = await fetch(`${API}/${anecdote.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: (anecdote.votes || 0) + 1 })
  })
  if (!res.ok) throw new Error('failed to vote')
  return res.json()
}
