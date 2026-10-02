import React from 'react'
import './Navbar.css'
import { BriefcaseBusinessIcon, Home, Send, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="menu">

        <Link to='/' className='nav' title='Home'>
        <Home />
        </Link>

        <Link to='/capabilities' className='nav' title='Capabilities'>
        <SparklesIcon/>
        </Link>

        <Link to='/work' className='nav' title='Works and Projects'>
        <BriefcaseBusinessIcon/>
        </Link>

        <Link to='/contact' className='nav' title='Contact'>
        <Send/>
        </Link>


      </div>
    </div>
  )
}

export default Navbar
