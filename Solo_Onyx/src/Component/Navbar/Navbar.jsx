import React from 'react'
import './Navbar.css'
import { BriefcaseBusinessIcon, Home, Send, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="menu">

        <Link to='/' className='nav'>
        <Home/>
        </Link>

        <Link to='/capabilities' className='nav'>
        <SparklesIcon/>
        </Link>

        <Link to='/work' className='nav'>
        <BriefcaseBusinessIcon/>
        </Link>

        <Link to='/contact' className='nav'>
        <Send/>
        </Link>


      </div>
    </div>
  )
}

export default Navbar
