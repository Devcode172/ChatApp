import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import { userLoginThunk } from '../../store/slice/user/user.thunk'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'
import { useEffect } from 'react'
const Login = () => {
     const dispatch = useDispatch()
    const [loginForm , setLoginForm] = useState({
        username : '', password : ''})
    const navigate = useNavigate()

    const { isAuthenticated} = useSelector((state) => state.user)
    useEffect(() => {
      if(isAuthenticated){
        navigate('/')
      }
    }, [isAuthenticated])
    
    const handleInputChange = (e)=>{
     setLoginForm({...loginForm , [e.target.name] : e.target.value})
    //  console.log(loginForm)
    }

    const handleLogin = async()=>{
     
       const result = await dispatch(userLoginThunk(loginForm))
       if(result.payload.message === 'Login successful'){
       
        navigate('/')
       }
     
    }
    return (
        <div className='width-full h-screen flex items-center justify-center'>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">


                <label className="label">Username</label>
                <input type="text" className="input border-1 outline-none" placeholder="John Doe" name = 'username' value = {loginForm.username} onChange={handleInputChange}/>

                <label className="label">Password</label>
                <input type="password" className="input border-1 outline-none" placeholder="********" name = 'password' value={loginForm.password} onChange={handleInputChange} />

                <button className="btn btn-neutral mt-4" onClick={handleLogin}>Login</button>


                <div className='flex justify-center'>
                <p className='label'>Don`t  have an account ? <span>   </span> <Link to='/signup' className='text-blue-500 text-lg'>Sign up</Link></p>
        </div>
            </fieldset >
        </div >
    )
}

export default Login
