import React from 'react'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
      <nav>
        <li> <Link to ='/'>Home</Link></li>
        <li> <Link to = '/login'>Login</Link></li>
        <li> <Link to = '/signup'>SignUp</Link></li>
      </nav>
    </div>
  )
}

export default Navbar
