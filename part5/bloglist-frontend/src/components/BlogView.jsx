import { useParams, useNavigate } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>blog not found</div>

  const blogUserId = blog.user && (blog.user.id || blog.user._id || blog.user)
  const blogUserName = blog.user && (blog.user.username || blog.user.name)
  const showDelete = blog.user && (user && (blogUserName === user.username || blogUserId === user.id || blogUserId === user.username))

  const onLike = async () => {
    await handleLike(blog)
  }

  const onDelete = async () => {
    await handleDelete(blog)
    navigate('/')
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} {user && <button onClick={onLike}>like</button>}
      </div>
      <div>{blog.user && (blog.user.name || blog.user.username)}</div>
      {showDelete && <button onClick={onDelete}>remove</button>}
    </div>
  )
}

export default BlogView
