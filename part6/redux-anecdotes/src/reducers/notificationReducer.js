import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    }
  }
})

export const setNotification = (notification, ms = 5000) => {
  console.log(notification, ms)
  return async dispatch => {
    dispatch(notificationSlice.actions.setNotification(notification))
    setTimeout(() => dispatch(notificationSlice.actions.removeNotification()), ms)
  }
}

export default notificationSlice.reducer