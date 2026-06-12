import { useState } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material'

const LoginForm = ({ onLogin, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/login', { username, password })
      const user = response.data
      onLogin(user)
      setUsername('')
      setPassword('')
      setNotification({ message: `Welcome ${user.name}`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification({ message: 'invalid username or password', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 6 }}>
        <Typography variant="h6" component="h2" gutterBottom>Log in to application</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField id="username" data-testid="username-input" label="username" value={username} onChange={({ target }) => setUsername(target.value)} />
          <TextField id="password" data-testid="password-input" label="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          <Button id="login-button" data-testid="login-button" type="submit" variant="contained">login</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginForm
