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

const useAnecdoteStore = create((set) => ({
  anecdotes: initialAnecdotes.map(createAnecdoteObject),
  filter: '',
  vote: (id) => set((state) => ({
    anecdotes: state.anecdotes.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
  })),
  create: (content) => set((state) => ({
    anecdotes: state.anecdotes.concat(createAnecdoteObject(content))
  })),
  setFilter: (value) => set({ filter: value })
}))

export default useAnecdoteStore
