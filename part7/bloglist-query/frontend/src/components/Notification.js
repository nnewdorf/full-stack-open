import { useEffect } from 'react'
import { useNotificationDispatch, useNotificationValue } from '../contexts/NotificationContext'
import './Notification.css'

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
      <div className={notification.class}>
        {notification.message}
      </div>
    )
  } else {
    return null
  }
}

export default Notification