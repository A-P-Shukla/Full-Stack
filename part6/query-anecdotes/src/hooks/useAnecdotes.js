import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, voteAnecdote } from '../services/anecdotes'

export const useAnecdotesQuery = () => {
  return useQuery({ queryKey: ['anecdotes'], queryFn: getAnecdotes, retry: false })
}

export const useCreateAnecdote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content) => createAnecdote(content),
    onSuccess: () => qc.invalidateQueries(['anecdotes'])
  })
}

export const useVoteAnecdote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (anecdote) => voteAnecdote(anecdote),
    onSuccess: () => qc.invalidateQueries(['anecdotes'])
  })
}

export default {
  useAnecdotesQuery,
  useCreateAnecdote,
  useVoteAnecdote
}
