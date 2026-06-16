import create from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  initBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  addBlog: async (blogObj) => {
    const created = await blogService.create(blogObj)
    set((state) => ({ blogs: state.blogs.concat(created) }))
    return created
  },
  likeBlog: async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    updated.user = blog.user?.id || blog.user?._id || blog.user
    const returned = await blogService.update(blog.id, updated)
    // keep original user info
    returned.user = blog.user
    set((state) => ({ blogs: state.blogs.map(b => b.id !== blog.id ? b : returned) }))
    return returned
  },
  removeBlog: async (blog) => {
    await blogService.remove(blog.id)
    set((state) => ({ blogs: state.blogs.filter(b => b.id !== blog.id) }))
  }
}))

export default useBlogStore
