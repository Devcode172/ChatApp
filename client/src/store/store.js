import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slice/user/user.slice'
import { messageSlice } from './slice/message/message.slice'
import { socketSlice } from './slice/socket/socket.slice'

export const store = configureStore({
  reducer: {
    user : userSlice.reducer,
    message : messageSlice.reducer,
    socket : socketSlice.reducer
  },
  middleware : (getDefaultMiddleware) => (

    getDefaultMiddleware({
      serializableCheck : {
        ignoredPaths :['socket.socket'],
      },
    })
  )

  

})