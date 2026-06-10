import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const Notification = ({ notification }) => {
  if (!notification) return null
  const style = {
    border: '1px solid black',
    padding: 10,
    marginBottom: 10,
    color: notification.type === 'error' ? 'red' : 'green'
  }
  return (
    <div style={style} className="notification">
      {notification.message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (user) => {
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
    setUser(user)
    blogService.setToken(user.token)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.setToken(null)
    setNotification({ message: 'Logged out', type: 'success' })
    setTimeout(() => setNotification(null), 3000)
  }

  const createBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      setBlogs(blogs.concat(created))
      setNotification({ message: `a new blog ${created.title} by ${created.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({ message: error.response?.data?.error || 'error creating blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} setNotification={setNotification} />
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <BlogForm createBlog={createBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App