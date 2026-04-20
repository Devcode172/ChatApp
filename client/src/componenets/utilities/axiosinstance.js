import axios from "axios"; 


const DB_URI = import.meta.env.VITE_URL
export const axiosInstance = axios.create({
  baseURL : DB_URI,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }, 
  // .. other options 
});

export default axiosInstance;