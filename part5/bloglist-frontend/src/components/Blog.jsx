import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => setVisible(!visible)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogUserId = blog.user && (blog.user.id || blog.user._id || blog.user)
  const blogUserName = blog.user && (blog.user.username || blog.user.name)
  const showDelete = blog.user && user && (blogUserName === user.username || blogUserId === user.id || blogUserId === user.username)

  const idKey = blog.title || blog.id || blog._id

  const idKey = blog.title || blog.id || blog._id

  return (
    <div style={blogStyle} className="blog" data-testid={`blog-${idKey}`}>
      <div className="blogSummary" data-testid={`blog-summary-${idKey}`}>
<<<<<<< HEAD
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
=======
        {blog.title} {blog.author}
>>>>>>> b40c06e6561530f2634198d3145fd86bcc383e66
        <button onClick={toggleVisible}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails" data-testid={`blog-details-${idKey}`}>
          <div className="blogUrl" data-testid={`blog-url-${idKey}`}>{blog.url}</div>
          <div className="blogLikes" data-testid={`blog-likes-${idKey}`}>
<<<<<<< HEAD
            likes {blog.likes} {user && <button onClick={() => handleLike(blog)}>like</button>}
=======
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
>>>>>>> b40c06e6561530f2634198d3145fd86bcc383e66
          </div>
          <div className="blogUser" data-testid={`blog-user-${idKey}`}>{blog.user && (blog.user.name || blog.user.username)}</div>
          {showDelete && <button data-testid={`blog-remove-${idKey}`} onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog