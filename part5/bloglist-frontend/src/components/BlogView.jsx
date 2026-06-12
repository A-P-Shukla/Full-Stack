import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'

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
      </CardContent>
    </Card>
  )
}

export default BlogView
