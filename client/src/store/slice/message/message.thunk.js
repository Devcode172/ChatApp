import { createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { axiosInstance } from '../../../componenets/utilities/axiosinstance'
export const sendMessageThunk = createAsyncThunk(
  'message/send',
  async ({receiverId , message},{rejectWithValue}) => {
    console.log(receiverId, message)
    try {
     const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        message
     })
    //  console.log('response', response)
    // toast.success('Login Successfully')
     return response.data
    }
    catch (error) {
        console.log('error', error.response?.data?.message)
        const errorOuput = error.response?.data?.message || 'Failed to send message'
        toast.error(errorOuput)
        return rejectWithValue(errorOuput) 
       }    

  },
)


export const getMessageThunk = createAsyncThunk(
  'message/get',
  async ({receiverId},{rejectWithValue}) => {
    try {
     const response = await axiosInstance.get(`/message/get/${receiverId}`,)
    //  console.log('response', response)
    // toast.success('Login Successfully')
     return response.data
    }
    catch (error) {
        console.log('error', error.response?.data?.message)
        const errorOuput = error.response?.data?.message || 'Failed to get message'
        toast.error(errorOuput)
        return rejectWithValue(errorOuput) 
       }    

  },
)





