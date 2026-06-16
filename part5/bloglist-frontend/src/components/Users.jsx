import React, { useEffect, useState } from 'react'
import usersService from '../services/users'
import { Link } from 'react-router-dom'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then(setUsers).catch(err => console.error(err))
  }, [])

  return (
    <div>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell><Link to={`/users/${u.id}`}>{u.name}</Link></TableCell>
                <TableCell>{u.blogs ? u.blogs.length : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
