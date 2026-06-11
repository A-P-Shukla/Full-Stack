import { useState } from 'react'

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
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input id="title" data-testid="title-input" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input id="author" data-testid="author-input" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input id="url" data-testid="url-input" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button id="create-button" data-testid="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
