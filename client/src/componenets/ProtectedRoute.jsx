import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate()
  const { isAuthenticated , screenLoading} = useSelector((state) => state.user)
   console.log(isAuthenticated)
   useEffect(()=>{
       if (!isAuthenticated && !screenLoading) 
         navigate('/login')
       
   }, [isAuthenticated, screenLoading, navigate])

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute
