import React from 'react'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import useAnecdoteStore from '../store'
import AnecdoteList from '../components/AnecdoteList'

const makeAnecdote = (id, content, votes = 0) => ({ id, content, votes })

describe('Anecdotes store and components', () => {
  beforeEach(() => {
    // reset store
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('6.12 initializes state with anecdotes returned by backend', async () => {
    const mock = [makeAnecdote('a1','first',2), makeAnecdote('a2','second',0)]
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mock) })))

    await useAnecdoteStore.getState().fetchAnecdotes()

    const state = useAnecdoteStore.getState()
    expect(state.anecdotes).toEqual(mock)
  })

  it('6.13 AnecdoteList receives anecdotes sorted by votes', () => {
    const unsorted = [
      makeAnecdote('a1','low',1),
      makeAnecdote('a2','high',5),
      makeAnecdote('a3','mid',3)
    ]
    useAnecdoteStore.setState({ anecdotes: unsorted })

    const { container } = render(<AnecdoteList />)

    const items = Array.from(container.querySelectorAll('.anecdote'))
    const contents = items.map(el => el.querySelector('div').textContent)
    expect(contents).toEqual(['high','mid','low'])
  })

  it('6.14 filtering produces a properly filtered list', () => {
    const list = [
      makeAnecdote('a1','apple pie',2),
      makeAnecdote('a2','banana split',1),
      makeAnecdote('a3','cherry tart',0)
    ]
    useAnecdoteStore.setState({ anecdotes: list, filter: 'ban' })

    const { container } = render(<AnecdoteList />)
    const items = Array.from(container.querySelectorAll('.anecdote'))
    expect(items.length).toBe(1)
    expect(items[0].textContent).toContain('banana split')
  })

  it('6.15 voting increases the number of votes for an anecdote', async () => {
    const initial = makeAnecdote('a1','vote me',2)
    useAnecdoteStore.setState({ anecdotes: [initial] })

    // mock PATCH response
    const patched = { ...initial, votes: initial.votes + 1 }
    vi.stubGlobal('fetch', vi.fn((url, opts) => {
      if (opts && opts.method === 'PATCH') {
        return Promise.resolve({ json: () => Promise.resolve(patched) })
      }
      return Promise.resolve({ json: () => Promise.resolve([initial]) })
    }))

    const result = await useAnecdoteStore.getState().vote('a1')
    expect(result.votes).toBe(initial.votes + 1)

    const state = useAnecdoteStore.getState()
    expect(state.anecdotes.find(a => a.id === 'a1').votes).toBe(initial.votes + 1)
  })
})
