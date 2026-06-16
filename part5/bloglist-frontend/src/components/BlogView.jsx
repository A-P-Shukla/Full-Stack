import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import blogService from '../services/blogs'
import { useState } from 'react'
import { Box, TextField, Button, List, ListItem } from '@mui/material'

const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>blog not found</div>

  const blogUserId = blog.user && (blog.user.id || blog.user._id || blog.user)
  const blogUserName = blog.user && (blog.user.username || blog.user.name)
  const showDelete = blog.user && user && (blogUserName === user.username || blogUserId === user.id || blogUserId === user.username)

  const onLike = async () => {
    await handleLike(blog)
  }

  const onDelete = async () => {
    await handleDelete(blog)
    navigate('/')
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h4">{blog.title} {blog.author}</Typography>
        <Typography sx={{ marginTop: 1 }}>{blog.url}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
          <Typography>likes {blog.likes}</Typography>
          {user && <Button variant="contained" size="small" onClick={onLike}>like</Button>}
          {showDelete && <Button color="error" onClick={onDelete}>remove</Button>}
        </Box>
        <Typography sx={{ marginTop: 2 }}>{blog.user && (blog.user.name || blog.user.username)}</Typography>
        <Box sx={{ marginTop: 2 }}>
          <h3>comments</h3>
          <List>
            {(blog.comments || []).map((c, i) => <ListItem key={i}>{c}</ListItem>)}
          </List>
          <CommentForm id={blog.id} />
        </Box>
      </CardContent>
    </Card>
  )
}

const CommentForm = ({ id }) => {
  const [text, setText] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!text) return
    try {
      await blogService.addComment(id, text)
      window.location.reload()
    } catch (err) {
      console.error('comment failed', err)
    }
  }
  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
      <TextField size="small" value={text} onChange={(e) => setText(e.target.value)} />
      <Button type="submit" variant="contained">add comment</Button>
    </Box>
  )
}

export default BlogView
