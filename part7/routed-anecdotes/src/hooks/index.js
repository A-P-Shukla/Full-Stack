import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')

  // return input props separately to avoid spreading reset onto DOM
  return {
    input: { type, value, onChange },
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    let mounted = true
    anecdoteService.getAll().then(data => {
      if (mounted) setAnecdotes(data)
    }).catch(err => {
      console.error('fetch failed', err)
    })
    return () => { mounted = false }
  }, [])

  const addAnecdote = async (anecdote) => {
    const created = await anecdoteService.createNew(anecdote)
    setAnecdotes(prev => prev.concat(created))
    return created
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)
    setAnecdotes(prev => prev.filter(a => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}

export default { useField, useAnecdotes }
