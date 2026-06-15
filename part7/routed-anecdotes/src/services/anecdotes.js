const API = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('failed to fetch')
  return res.json()
}

export const createNew = async (anecdote) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.error || 'failed to create')
  }
  return res.json()
}

export const deleteAnecdote = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('failed to delete')
  return true
}

export default { getAll, createNew, deleteAnecdote }
