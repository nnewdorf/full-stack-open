import { useEffect } from 'react'
import { useNotificationDispatch, useNotificationValue } from '../contexts/NotificationContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  useEffect(() => {
    if(notification !== null) {
      setTimeout(() => dispatch({ type: 'RESET' }), 5000)
    }
  },[notification])

  if(notification !== null) {
    return (
      <div>
        <Alert severity={notification.class}>
          {notification.message}
        </Alert>
      </div>
    )
  } else {
    return null
  }
}

export default Notification