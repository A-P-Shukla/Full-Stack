import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, test, expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import Blog from '../components/Blog'

describe('Blog component', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { username: 'user1', name: 'User One', id: 'u1' }
  }

  afterEach(() => cleanup())

  test('renders title and author, but not url or likes by default', () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const { container } = render(<Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'user1', id: 'u1' }} />)

    const summary = container.querySelector('.blogSummary')
    expect(summary).toBeDefined()
    expect(summary.textContent).toContain('Test Title')
    expect(summary.textContent).toContain('Test Author')

    const url = container.querySelector('.blogUrl')
    const likes = container.querySelector('.blogLikes')
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('shows url and likes when view button is clicked', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const { container } = render(<Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'user1', id: 'u1' }} />)

    const user = userEvent.setup()
    const viewButton = container.querySelector('.blogSummary button')
    await user.click(viewButton)

    const url = container.querySelector('.blogUrl')
    const likes = container.querySelector('.blogLikes')
    expect(url).toBeDefined()
    expect(url.textContent).toContain('http://test.com')
    expect(likes).toBeDefined()
    expect(likes.textContent).toContain('likes 5')
  })

  test('clicking the like button twice calls handler twice', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    render(<Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'user1', id: 'u1' }} />)

    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'user1', id: 'u1' }} />)
    const viewButton = container.querySelector('.blogSummary button')
    await user.click(viewButton)
    const likeButton = container.querySelector('.blogLikes button')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike).toHaveBeenCalledTimes(2)
  })
})
