import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef(null)

  const notify = useCallback((msg, ttl = 5000) => {
    setMessage(msg)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setMessage(''), ttl)
  }, [])

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMessage('')
  }, [])

  return (
    <NotificationContext.Provider value={{ message, notify, clear }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider')
  return ctx
}

export const Notification = () => {
  const { message } = useContext(NotificationContext) || {}
  const style = {
    border: 'solid 1px #333',
    padding: '8px 12px',
    marginBottom: 12,
    background: '#f9f9f9'
  }
  if (!message) return null
  return <div style={style}>{message}</div>
}

export default NotificationContext
