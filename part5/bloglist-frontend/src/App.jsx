import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogView from './components/BlogView'

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
      <nav>
        <Link to="/">blogs</Link> | <Link to="/create">create new</Link> | {user ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span> : <Link to="/login">login</Link>}
      </nav>
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
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
)

export default App