import React from 'react'
import './Contact.css'
import Github from '../../assets/github.png'
import Snapchat from '../../assets/snapchat.png'
import Tiktok from '../../assets/tiktok.png'
import LinkedIn from '../../assets/linkedin.png'
import Discord from '../../assets/discord.png'
import Instagram from '../../assets/instagram.png'
import WhatsApp from '../../assets/whatsapp.png'
import Gmail from '../../assets/gmail.png'
import Footer from '../Footer/footer'
import ParticleBackground from '../ParticleBackground/ParticleBackground'
import Navbar from '../Navbar/Navbar'


const Contact = () => {

  return (
    
    <div className='contact'>
      <ParticleBackground id='contact-particles' />
      <Navbar/>
      
      <div className="heading">
        <h1><span>Contact</span> Me On </h1>
      </div>

      <div className="caption">
        <p>Let’s connect, collaborate, and bring ideas to life.</p>
      </div>

      <div className="contact-card">
        
        <a href="https://www.snapchat.com/add/only4_mars?share_id=hov0N3l0qSA&locale=en-US" target="_blank" rel="noopener noreferrer">
        <div className="snap" title='Snapchat Profile Link'>
          <img src={Snapchat} className='contact-img'/>
          <p className='name' id='snap'>Snapchat</p>
        </div>
        </a>

        <a href="mailto:solomonagbeko123@gmail.com" target="_blank" rel="noopener noreferrer">
        <div className="gmail" title='Gmail Profile Link'>
          <img src={Gmail} className='contact-img'/>
          <p className='name' id='gmail'>Gmail</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" >
        <div className="tiktok" title='Tiktok Profile Link'>
          <img src={Tiktok} className='contact-img'/>
          <p className='name' id='tiktok'>Tiktok</p>
        </div>
        </a>

        <a href="https://www.linkedin.com/in/solomon-agbeko" target="_blank" rel="noopener noreferrer">
        <div className="linkedin" title='LinkedIn Profile Link'>
          <img src={LinkedIn} className='contact-img'/>
          <p className='name' id='linkedin'>LinkedIn</p>
        </div>
        </a>

        <a href="https://www.instagram.com/callme.sajnr/?hl=en" target="_blank" rel="noopener noreferrer">
        <div className="instagram" title='Instagram Profile Link'>
          <img src={Instagram} className='contact-img'/>
          <p className='name' id='instagram'>Instagram</p>
        </div>
        </a>

        <a href="https://discord.com/users/1445733381613555723" target="_blank" rel="noopener noreferrer">
        <div className="discord" title='Discord Profile Link'>
          <img src={Discord} className='contact-img'/>
          <p className='name' id='discord'>Discord</p>
        </div>
        </a>


        <a href="https://github.com/SAjnr1" target="_blank" rel="noopener noreferrer" >
        <div className="github" title='Github Profile Link'>
          <img src={Github} className='contact-img'/>
          <p className='name' id='github'>Github</p>
        </div>
        </a>

        <a href="https://wa.me/+233244244332" target="_blank" rel="noopener noreferrer" >
        <div className="whatsapp" title='WhatsApp Profile Link'>
          <img src={WhatsApp} className='contact-img'/>
          <p className='name' id='whatsapp'>WhatsApp</p>
        </div>
        </a>


      </div>
      <Footer/>
    </div>
   
  )
}

export default Contact