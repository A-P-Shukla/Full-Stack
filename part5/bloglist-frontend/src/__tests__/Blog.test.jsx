import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, test, expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import Blog from '../components/Blog'
import { MemoryRouter } from 'react-router-dom'

describe('Blog component', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { username: 'user1', name: 'User One', id: 'u1' }
  }

  afterEach(() => cleanup())

  test('unauthenticated users see info and likes but no buttons', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const { container } = render(<MemoryRouter><Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={null} /></MemoryRouter>)

    const viewButton = container.querySelector('.blogSummary button')
    const userEvt = userEvent.setup()
    await userEvt.click(viewButton)

    const url = container.querySelector('.blogUrl')
    const likes = container.querySelector('.blogLikes')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(likes.textContent).toContain('likes 5')
    const likeBtn = container.querySelector('.blogLikes button')
    const removeBtn = container.querySelector('button[data-testid^="blog-remove"]')
    expect(likeBtn).toBeNull()
    expect(removeBtn).toBeNull()
  })

  test('authenticated non-creator sees like button only', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const { container } = render(<MemoryRouter><Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'other', id: 'u2' }} /></MemoryRouter>)
    const userEvt = userEvent.setup()
    const viewButton = container.querySelector('.blogSummary button')
    await userEvt.click(viewButton)
    const likeBtn = container.querySelector('.blogLikes button')
    const removeBtn = container.querySelector('button[data-testid^="blog-remove"]')
    expect(likeBtn).toBeDefined()
    expect(removeBtn).toBeNull()
  })

  test('blog creator sees like and remove buttons', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const { container } = render(<MemoryRouter><Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} user={{ username: 'user1', id: 'u1' }} /></MemoryRouter>)
    const userEvt = userEvent.setup()
    const viewButton = container.querySelector('.blogSummary button')
    await userEvt.click(viewButton)
    const likeBtn = container.querySelector('.blogLikes button')
    const removeBtn = container.querySelector('button[data-testid^="blog-remove"]')
    expect(likeBtn).toBeDefined()
    expect(removeBtn).toBeDefined()
  })
})
