import create from 'zustand'

const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...'
    + 'The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const createAnecdoteObject = (content) => ({
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,
  content,
  votes: 0
})

const API = 'http://localhost:3001/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  // fetch anecdotes from server
  fetchAnecdotes: async () => {
    try {
      const res = await fetch(API)
      const json = await res.json()
      set({ anecdotes: json })
    } catch (err) {
      console.error('failed to fetch anecdotes', err)
      try {
        const notify = (await import('./notificationStore')).default
        // use store directly to set a notification
        notify.getState().setNotification('failed to fetch anecdotes')
      } catch (_) {
        // ignore if notification store import fails
      }
    }
  },
  vote: async (id) => {
    try {
      // find existing
      let existing
      set((state) => {
        existing = state.anecdotes.find(a => a.id === id)
        return state
      })
      if (!existing) return
      const updated = { ...existing, votes: (existing.votes || 0) + 1 }
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
      })
      const json = await res.json()
      set((state) => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? json : a)
      }))
      return json
    } catch (err) {
      console.error('vote failed', err)
    }
  },
  create: async (content) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 })
      })
      const json = await res.json()
      set((state) => ({ anecdotes: state.anecdotes.concat(json) }))
      return json
    } catch (err) {
      console.error('create anecdote failed', err)
    }
  },
  removeIfZero: async (id) => {
    try {
      const stateSnapshot = (getState())
      const target = stateSnapshot.anecdotes.find(a => a.id === id)
      if (!target) return false
      if ((target.votes || 0) !== 0) return false
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      set((state) => ({ anecdotes: state.anecdotes.filter(a => a.id !== id) }))
      return true
    } catch (err) {
      console.error('delete failed', err)
      return false
    }
  },
  setFilter: (value) => set({ filter: value })
}))

// helper to read state outside setter
const getState = () => useAnecdoteStore.getState()

export default useAnecdoteStore
