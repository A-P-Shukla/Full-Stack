import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Container, Typography, Button, Alert } from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogView from './components/BlogView'
import Users from './components/Users'
import UserView from './components/UserView'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import persistentUser from './services/persistentUser'

const Notification = () => {
  const notification = useNotificationStore((s) => s.notification)
  if (!notification) return null
  return (
    <Container sx={{ marginTop: 2 }}>
      <Alert severity={notification.type === 'error' ? 'error' : 'success'}>{notification.message}</Alert>
    </Container>
  )
}

const AppContent = () => {
  const navigate = useNavigate()
  const notification = useNotificationStore((s) => s.notification)
  const notify = useNotificationStore((s) => s.setNotification)
  const blogs = useBlogStore((s) => s.blogs)
  const initBlogs = useBlogStore((s) => s.initBlogs)
  const addBlog = useBlogStore((s) => s.addBlog)
  const likeBlog = useBlogStore((s) => s.likeBlog)
  const removeBlog = useBlogStore((s) => s.removeBlog)
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const clearUser = useUserStore((s) => s.clearUser)

  useEffect(() => { initBlogs() }, [initBlogs])

  useEffect(() => {
    const logged = persistentUser.getUser()
    if (logged) {
      setUser(logged)
      blogService.setToken(logged.token)
    }
  }, [setUser])

  const handleLogin = (user) => {
    persistentUser.saveUser(user)
    setUser(user)
    blogService.setToken(user.token)
    navigate('/')
  }

  const handleLogout = () => {
    persistentUser.removeUser()
    clearUser()
    blogService.setToken(null)
    notify('Logged out', 'success')
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const created = await addBlog(blogObject)
      notify(`a new blog ${created.title} by ${created.author} added`, 'success')
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error || 'error creating blog', 'error')
    }
  }

  const blogFormRef = useRef()

  const handleLike = async (blog) => {
    try {
      await likeBlog(blog)
    } catch (err) {
      notify('error liking blog', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await removeBlog(blog)
      notify(`deleted ${blog.title}`, 'success')
      navigate('/')
    } catch (err) {
      notify('error deleting blog', 'error')
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
            <Button color="inherit" component={Link} to="/users">users</Button>
            {user ? <Button color="inherit" onClick={handleLogout}>{user.name} (logout)</Button> : <Button color="inherit" component={Link} to="/login">login</Button>}
          </Container>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 3 }}>
      <ErrorBoundary>
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
        <Route path="/login" element={<LoginForm onLogin={handleLogin} setNotification={(n) => notify(n.message, n.type)} />} />
        <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />} />
        <Route path="/users" element={<div><Users /></div>} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
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