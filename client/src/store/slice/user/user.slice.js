import { createSlice } from '@reduxjs/toolkit'
import { userLoginThunk , userRegisterThunk, userLogoutThunk, getUserProfileThunk, getOtherUserProfileThunk, searchUsersThunk } from './user.thunk'


export const userSlice = createSlice({
    name : 'user',
    initialState :{
        isAuthenticated : false,
        userProfile : null,
        buttonloading : false,
        screenLoading : true,
        otherUsers : null,
        searchResults : null,
        isSearching : false,
        selectedUser : localStorage.getItem('selectedUser') ? JSON.parse(localStorage.getItem('selectedUser')) : null,
        unreadMessages : {}
        // selectedUser : null
    },
    reducers:{
        setSelectedUser : (state, action) => {
          localStorage.setItem('selectedUser', JSON.stringify(action.payload))
            state.selectedUser = action.payload
            if (action.payload?.user_id) {
              delete state.unreadMessages[action.payload.user_id]
            }
        },
        incrementUnreadMessages : (state, action) => {
          const senderId = action.payload
          state.unreadMessages[senderId] = (state.unreadMessages[senderId] || 0) + 1
        },
        clearUnreadMessages : (state, action) => {
          delete state.unreadMessages[action.payload]
        },
        updateConversationPreview : (state, action) => {
          const { userId, lastMessage, lastMessageAt, lastMessageSenderId } = action.payload

          if (!state.otherUsers) return

          const user = state.otherUsers.find((otherUser) => otherUser.user_id === userId)

          if (user) {
            user.last_message = lastMessage
            user.last_message_at = lastMessageAt
            user.last_message_sender_id = lastMessageSenderId
          }
        },
    },
    extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(userLoginThunk.pending, (state, action) => {
      // Add user to the state array
      state.buttonloading = true
      console.log('pending')
    })
     builder.addCase(userLoginThunk.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('fulfilled', action.payload.data)
      state.isAuthenticated = true
      state.userProfile = action.payload.data
      state.buttonloading = false
    })
     builder.addCase(userLoginThunk.rejected, (state, action) => {
      // Add user to the state array
      state.buttonloading = false
      console.log('rejected')
    })


    // register

    builder.addCase(userRegisterThunk.pending, (state, action) => {
      // Add user to the state array
      state.buttonloading = true
      console.log('pending')
    })
     builder.addCase(userRegisterThunk.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('fulfilled', action.payload)
      state.isAuthenticated = true
      state.userProfile = action.payload.data
      state.buttonloading = false
    })
     builder.addCase(userRegisterThunk.rejected, (state, action) => {
      // Add user to the state array
      state.buttonloading = false
      console.log('rejected')
    })

    // logout

    builder.addCase(userLogoutThunk.pending, (state, action) => {
      // Add user to the state array
      state.buttonloading = true
      console.log('pending')
    })
     builder.addCase(userLogoutThunk.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('fulfilled', action.payload)
      state.isAuthenticated = false
      state.userProfile = null
      state.otherUsers = null
      state.searchResults = null
      state.isSearching = false
      state.selectedUser = null
      state.unreadMessages = {}
      state.buttonloading = false
      localStorage.clear()
    })
     builder.addCase(userLogoutThunk.rejected, (state, action) => {
      // Add user to the state array
      state.buttonloading = false
      console.log('rejected')
    })

    // get profile
    builder.addCase(getUserProfileThunk.pending, (state, action) => {
      // Add user to the state array
      console.log('pending')
    })
     builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('fulfilled required', action.payload)
      state.isAuthenticated = true
      state.userProfile = action.payload.data
      state.screenLoading = false
    })
     builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      // Add user to the state array
      state.isAuthenticated = false
      state.userProfile = null
      state.screenLoading = false
      console.log('rejected')
    })

    // get other users

    builder.addCase(getOtherUserProfileThunk.pending, (state, action) => {
      // Add user to the state array
      console.log('pending')
    })
     builder.addCase(getOtherUserProfileThunk.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('fulfilled', action.payload)
      state.otherUsers = action.payload.data
      state.screenLoading = false
    })
     builder.addCase(getOtherUserProfileThunk.rejected, (state, action) => {
      // Add user to the state array
      state.screenLoading = false
      console.log('rejected')
    })

    builder.addCase(searchUsersThunk.pending, (state) => {
      state.isSearching = true
    })
    builder.addCase(searchUsersThunk.fulfilled, (state, action) => {
      state.isSearching = false
      state.searchResults = action.payload.data
    })
    builder.addCase(searchUsersThunk.rejected, (state) => {
      state.isSearching = false
      state.searchResults = null
    })
  },
})
// Action creators are generated for each case reducer function
export const { setSelectedUser, incrementUnreadMessages, clearUnreadMessages, updateConversationPreview } = userSlice.actions

export default userSlice.reducer  
