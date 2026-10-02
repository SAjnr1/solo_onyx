import React from 'react'
import './footer.css'
import { Link } from 'react-router-dom'
import { CopyrightIcon } from 'lucide-react'

const Footer = () => {
  return (
    <>
    <div className='footer'>
      <div className="rights"><p><CopyrightIcon className='link' strokeWidth={2}/>2026 Solo Onyx</p><p>  All rights reserved</p></div>
        <ul>
            <li>Terms of services</li>
            <li>Privacy Policy</li>
        </ul>
    </div>
    </>
  )
}

export default Footer