import { createSlice } from '@reduxjs/toolkit'
import { getMessageThunk, sendMessageThunk } from './message.thunk'

const appendMessageIfMissing = (messages, message) => {
  if (!message) return messages
  const alreadyExists = messages.some((item) => item.id === message.id)

  if (!alreadyExists) {
    messages.push(message)
  }

  return messages
}

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    buttonLoading: false,
    messages: [],
    screenLoading: false,
  },
  reducers: {
    addMessage: (state, action) => {
      appendMessageIfMissing(state.messages, action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true
    })

    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      appendMessageIfMissing(state.messages, action.payload?.data)
      state.buttonLoading = false
    })

    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.buttonLoading = false
    })

    builder.addCase(getMessageThunk.pending, (state) => {
      state.messages = []
      state.buttonLoading = true
    })

    builder.addCase(getMessageThunk.fulfilled, (state, action) => {
      state.messages = action.payload?.data ?? []
      state.buttonLoading = false
    })

    builder.addCase(getMessageThunk.rejected, (state) => {
      state.messages = []
      state.buttonLoading = false
    })
  },
})

export const { addMessage, clearMessages } = messageSlice.actions

export default messageSlice.reducer
