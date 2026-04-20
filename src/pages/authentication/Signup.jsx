import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userRegisterThunk } from '../../store/slice/user/user.thunk'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [signupForm , setSignupForm] = useState({
        fullname : '',
        username : '',
        password : '',
        confirmPassword : '',
        gender : 'male'
    })

const { isAuthenticated} = useSelector((state) => state.user)
    useEffect(() => {
      if(isAuthenticated){
        navigate('/', { replace: true })
      }
    }, [isAuthenticated, navigate])

    const handleInputChange = (e)=>{
        setSignupForm({...signupForm , [e.target.name] : e.target.value})
    }

    const handleSignup = async ()=>{
        if(signupForm.password !== signupForm.confirmPassword){
            toast.error('Password and Confirm Password should be same')
            return
        }
        if(signupForm.password.length < 6){
            toast.error('Password should be at least 6 characters long')
            return
        }
    const response = await dispatch(userRegisterThunk(signupForm))
    console.log('response data', response)

    if (userRegisterThunk.fulfilled.match(response)) {
        navigate('/', { replace: true })
    }
    }
  return (
    <div className='width-full h-screen flex items-center justify-center'>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
               
                <label className="label">Full Name</label>
                <input type="text" className="input border-1 outline-none" placeholder="FullName" name = 'fullname' value={signupForm.fullname} onChange={handleInputChange} />

               <label className="label">Username</label>
                <input type="text" className="input border-1 outline-none" placeholder="Username" name = 'username' value={signupForm.username} onChange={handleInputChange} />

                <label className="label">Password</label>
                <input type="password" className="input border-1 outline-none" placeholder="********" name = 'password' value={signupForm.password} onChange={handleInputChange} />

                <label className="label">Confirm Password</label>
                <input type="password" className="input border-1 outline-none" placeholder="********" name = 'confirmPassword' value={signupForm.confirmPassword} onChange={handleInputChange} />

                <div className="flex items-center mt-4">
                    <input type="radio" name="gender" className="radio " value="male" onChange={handleInputChange} />
                    <label className="label ml-2">Male</label>
                    <input type="radio" name="gender" className="radio ml-4" value="female" onChange={handleInputChange} />
                    <label className="label ml-2">Female</label>
                </div>

                <button className="btn btn-neutral mt-4" onClick={handleSignup}>Sign Up</button>
                <div className='flex justify-center'>

                <p className='label'>Already have an account ? <span>   </span> <Link to= '/login' className='text-blue-500 text-lg'>Sign in</Link></p>
                </div>
            </fieldset>
        </div>
  )
}

export default Signup
