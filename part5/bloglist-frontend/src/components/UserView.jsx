import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'
import { Card, CardContent, Typography, List, ListItem } from '@mui/material'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    usersService.getById(id).then(setUser).catch(err => console.error(err))
  }, [id])

  if (!user) return <div>user not found</div>

  return (
    <Card sx={{ maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>added blogs</Typography>
        <List>
          {user.blogs && user.blogs.map(b => <ListItem key={b.id}>{b.title}</ListItem>)}
        </List>
      </CardContent>
    </Card>
  )
}

export default UserView
