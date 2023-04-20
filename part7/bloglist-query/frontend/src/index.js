import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CssBaseline } from '@mui/material'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <Router>
          <CssBaseline />
          <App/>
        </Router>
      </UserContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>
)