import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import BlogForm from '../components/BlogForm'

test('new blog form calls event handler with right details', async () => {
  const createBlog = vi.fn()
  const { container } = render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')

  await user.type(inputTitle, 'New Blog Title')
  await user.type(inputAuthor, 'Blog Author')
  await user.type(inputUrl, 'http://newblog.com')

  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Blog Title',
    author: 'Blog Author',
    url: 'http://newblog.com'
  })
})
