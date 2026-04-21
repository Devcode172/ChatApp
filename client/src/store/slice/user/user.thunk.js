import { createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { axiosInstance } from '../../../componenets/utilities/axiosinstance'
export const userLoginThunk = createAsyncThunk(
  'user/login',
  async ({username , password},{rejectWithValue}) => {
    try {
     const response = await axiosInstance.post('/user/login', {
        username , 
        password 
     })
    //  console.log('response', response)
    toast.success('Login Successfully')
     return response.data
    }
    catch (error) {
        console.log('error', error.response.data.message)
        const errorOuput = error.response.data.message
        toast.error(errorOuput)
        return rejectWithValue(errorOuput) 
       }    

  },
)

export const userRegisterThunk = createAsyncThunk(
  'user/signup',
  async ({fullname ,username , password , gender},{rejectWithValue}) => {
    // console.log(fullname, username , password , gender)
    try {
     const response = await axiosInstance.post('/user/register', {
        fullname ,
        username , 
        password ,
        gender
     })
    //  console.log('response', response)
    toast.success('Registered Successfully')
     return response.data
    }
    catch (error) {
        console.log('error', error.response.data.message)
        const errorOuput = error.response.data.message
        toast.error(errorOuput)
        return rejectWithValue(errorOuput) 
       }    

  },
)

export const userLogoutThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/logout');
      toast.success('Logged out successfully');
      return response.data;
    } catch (error) {
      console.log('error', error.response.data.message);
      const errorOutput = error.response.data.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  'user/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/getprofile');
      return response.data;
    } catch (error) {
      console.log('error', error.response.data.message);
      const errorOutput = error.response.data.message;
    //   toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUserProfileThunk = createAsyncThunk(
  'user/otherusers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/getotherusers');
      return response.data;
    } catch (error) {
      console.log('error', error.response.data.message);
      const errorOutput = error.response.data.message;
    //   toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const searchUsersThunk = createAsyncThunk(
  'user/search',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/search?q=${searchQuery}`);
      return response.data;
    } catch (error) {
      console.log('error', error.response?.data?.message);
      const errorOutput = error.response?.data?.message || 'Failed to search users';
      return rejectWithValue(errorOutput);
    }
  }
);
