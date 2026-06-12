import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => setVisible(!visible)

  const blogUserId = blog.user && (blog.user.id || blog.user._id || blog.user)
  const blogUserName = blog.user && (blog.user.username || blog.user.name)
  const showDelete = blog.user && user && (blogUserName === user.username || blogUserId === user.id || blogUserId === user.username)

  const idKey = blog.title || blog.id || blog._id

  return (
    <Card sx={{ marginBottom: 2 }} className="blog" data-testid={`blog-${idKey}`}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" className="blogSummary" data-testid={`blog-summary-${idKey}`}>
            <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{blog.title} {blog.author}</Link>
          </Typography>
          <Button size="small" onClick={toggleVisible}>{visible ? 'hide' : 'view'}</Button>
        </Box>
        {visible && (
          <Box className="blogDetails" data-testid={`blog-details-${idKey}`} sx={{ marginTop: 2 }}>
            <Typography className="blogUrl" data-testid={`blog-url-${idKey}`}>{blog.url}</Typography>
            <Box className="blogLikes" data-testid={`blog-likes-${idKey}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
              <span className="blogLikesText">likes {blog.likes}</span>
                {user && <Button size="small" onClick={() => handleLike(blog)}>like</Button>}
            </Box>
            <Typography className="blogUser" data-testid={`blog-user-${idKey}`} sx={{ marginTop: 1 }}>{blog.user && (blog.user.name || blog.user.username)}</Typography>
            {showDelete && <Button color="error" data-testid={`blog-remove-${idKey}`} onClick={() => handleDelete(blog)} sx={{ marginTop: 1 }}>remove</Button>}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog