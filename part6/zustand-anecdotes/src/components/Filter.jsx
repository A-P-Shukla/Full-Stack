import React from 'react'
import useAnecdoteStore from '../store'

const Filter = () => {
  const filter = useAnecdoteStore((s) => s.filter)
  const setFilter = useAnecdoteStore((s) => s.setFilter)

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input value={filter} onChange={handleChange} placeholder="filter anecdotes" />
    </div>
  )
}

export default Filter
