import { useState } from 'react'
import axios from 'axios'

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
    } catch (error) {
      setNotification({ message: 'invalid username or password', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
