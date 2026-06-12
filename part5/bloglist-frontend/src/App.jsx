import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Container, Typography, Button, Alert } from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogView from './components/BlogView'

const Notification = ({ notification }) => {
  if (!notification) return null
  return (
    <Container sx={{ marginTop: 2 }}>
      <Alert severity={notification.type === 'error' ? 'error' : 'success'}>{notification.message}</Alert>
    </Container>
  )
}

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

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
    navigate('/')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.setToken(null)
    setNotification({ message: 'Logged out', type: 'success' })
    setTimeout(() => setNotification(null), 3000)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      setBlogs(blogs.concat(created))
      setNotification({ message: `a new blog ${created.title} by ${created.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
      navigate('/')
    } catch (error) {
      setNotification({ message: error.response?.data?.error || 'error creating blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const blogFormRef = useRef()

  const handleLike = async (blog) => {
    try {
      const updated = { ...blog, likes: blog.likes + 1 }
      // ensure user field is id string
      updated.user = blog.user?.id || blog.user?._id || blog.user
      const returned = await blogService.update(blog.id, updated)
      // Keep user info from existing blog for display
      returned.user = blog.user
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returned))
    } catch {
      setNotification({ message: 'error liking blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotification({ message: `deleted ${blog.title}`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
      navigate('/')
    } catch {
      setNotification({ message: 'error deleting blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  return (
    <div>
      <Notification notification={notification} />
      <AppBar position="static">
        <Toolbar>
          <Container sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bloglist
            </Typography>
            <Button color="inherit" component={Link} to="/">blogs</Button>
            <Button color="inherit" component={Link} to="/create">create new</Button>
            {user ? <Button color="inherit" onClick={handleLogout}>{user.name} (logout)</Button> : <Button color="inherit" component={Link} to="/login">login</Button>}
          </Container>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 3 }}>
      <Routes>
        <Route path="/" element={(
          <div>
            <h2>blogs</h2>
            {user && <Togglable buttonLabel="create new blog" ref={blogFormRef}><BlogForm createBlog={createBlog} /></Togglable>}
            {blogs
              .slice()
              .sort((a, b) => (b.likes || 0) - (a.likes || 0))
              .map(blog => (
                <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
              ))}
          </div>
        )} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} setNotification={setNotification} />} />
        <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />} />
      </Routes>
      </Container>
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
)

export default App