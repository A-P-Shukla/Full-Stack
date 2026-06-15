import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => (
  <div className="menu">
    <Link to="/">anecdotes</Link>
    <Link to="/create">create new</Link>
    <Link to="/about">about</Link>
  </div>
)

export default Menu
