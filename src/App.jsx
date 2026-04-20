
import './App.css'
import { Outlet } from "react-router-dom"
import Navbar from "./componenets/Navbar"
import { Toaster } from 'react-hot-toast';
import { useDispatch} from 'react-redux'
import { useEffect } from 'react'
import { getUserProfileThunk } from './store/slice/user/user.thunk'
function App() {
    const dispatch = useDispatch()
  useEffect(() => {
     dispatch(getUserProfileThunk())
    
  }, [])
  
  return (
   <>
   {/* <Navbar/> */}
   <Toaster
  position="top-center"
  reverseOrder={false}
/>
   <Outlet/>
   </>
  )
}

export default App
