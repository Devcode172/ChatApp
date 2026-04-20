import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'

export const socketSlice = createSlice({
    name : 'socket',
    initialState :{
        socket : null,
        onlineUsers : []
    },
    reducers:{
        initializeSocket : (state, action) => {
            const socket = io(import.meta.env.VITE_SOCKET_URL , {
                query : {
                    userId : action.payload
                },
                autoConnect: false,
            })
            state.socket = socket
        },
        setOnlineUsers : (state, action) => {
            state.onlineUsers = action.payload
        },
    },
    
})
// Action creators are generated for each case reducer function
export const { initializeSocket, setOnlineUsers } = socketSlice.actions

export default socketSlice.reducer  
