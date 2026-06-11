import { useState } from 'react'

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
  const showDelete = blog.user && (blogUserName === user.username || blogUserId === user.id || blogUserId === user.id || blogUserId === user.username)

  return (
    <div style={blogStyle} className="blog">
      <div className="blogSummary">
        {blog.title} {blog.author}
        <button onClick={toggleVisible}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div className="blogUser">{blog.user && (blog.user.name || blog.user.username)}</div>
          {showDelete && <button onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog