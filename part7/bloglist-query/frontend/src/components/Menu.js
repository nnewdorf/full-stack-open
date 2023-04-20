import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Tooltip
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'


const LoggedInMessage = () => {
  const [user, userDispatch] = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    handleClose()
    userDispatch({ type: 'RESET' })
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip tittle={`${user.username} logged in`}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Tooltip>
      <MuiMenu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
      </MuiMenu>
    </>
  )
}

const Menu = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Box>
          <Button component={Link} to='/' sx={{ my: 2, color: 'white' }}>Blogs</Button>
          <Button component={Link} to='/users' sx={{ my: 2, color: 'white' }}>Users</Button>
          <LoggedInMessage />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Menu