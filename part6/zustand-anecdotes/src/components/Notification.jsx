import React from 'react'
import useNotificationStore from '../notificationStore'

const Notification = () => {
  const message = useNotificationStore((s) => s.message)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }
  if (!message) return null
  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
