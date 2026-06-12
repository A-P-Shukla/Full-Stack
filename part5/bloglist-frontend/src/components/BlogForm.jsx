import { useState } from 'react'
import { Box, Button, TextField, Paper, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>create new</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField id="title" data-testid="title-input" label="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        <TextField id="author" data-testid="author-input" label="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        <TextField id="url" data-testid="url-input" label="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        <Button id="create-button" data-testid="create-button" type="submit" variant="contained">create</Button>
      </Box>
    </Paper>
  )
}

export default BlogForm
