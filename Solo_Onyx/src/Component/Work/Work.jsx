import React from 'react'
import './Work.css'
import ParticleBackground from '../ParticleBackground/ParticleBackground'
import Footer from '../Footer/footer'
import Navbar from '../Navbar/Navbar'
import SAVOS from '../../assets/savos_site.png'
import play_icon from '../../assets/play-icon.png'
import SAjnr from '../../assets/sajnr.png'
import Frieren from '../../assets/frieren.png'
import Wiseman from '../../assets/wiseman.png'
import EngineeringModel from '../../assets/engineering-model.png'
import Gachiakuta from '../../assets/gachiakuta.png'
import StrangerThings from '../../assets/stranger_things.png'
import Ragna from '../../assets/ragna.png'
import Engineering from '../../assets/engineering_site.png'
import BlackStarGate from '../../assets/black_star_gate.png'
import { PlayCircle } from 'lucide-react'


const Work = () => {

  return (
    <>
    <div className='work'>
      <Navbar/>
      <ParticleBackground id='work-particles'  />'
            
      <div className="heading">
        <h1>My <span>Works </span> and <span> Projects</span></h1>
      </div>

      <div className="caption">
        <p>A collection of ideas, projects, and experiences I’ve brought to life.</p>
      </div>

      <div className="work-set">

        <a href="https://savos.vervel.app">
        <div className="work-card" id='savos' title='Click to view'>
          <img src={SAVOS} className='image' alt="" />
          <p className="work-name">SAVOS</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7676176203635494164?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='sajnr' title='Click to play'>
          <img src={SAjnr} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">ASANA x Anime Edit</p>
        </div>
        </a>

        <a href="https://presecengineering.vervel.app">
        <div className="work-card" id='engineering' title='Click to view'>
          <img src={Engineering} className='image' alt="" />
          <p className="work-name">Presec Engineering Unit</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7670080807091965205?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='frieren' title='Click to play'>
          <img src={Frieren} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">Frieren Edit</p>
        </div>
        </a>

        <a href="https://cad.onshape.com/documents/938a3a827a51152b136acdb6/w/ca9165854d2fd6dbef4a848f/e/9762dc3bdb8540eadf8a5961?renderMode=0&uiState=6abf90a91e0744329ada78f6">
        <div className="work-card" id='black_star_gate' title='Click to view'>
          <img src={BlackStarGate} className='image' alt="" />
          <p className="work-name">Black Star Gate (3D Model)</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7650150044598881557?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='ragna' title='Click to play'>
          <img src={Ragna} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">Ragna Crimson Edit</p>
        </div>
        </a>

        <a href="https://cad.onshape.com/documents/fdeab9aad92eb514841dbcc9/w/57c87ae4faf3587a032324d1/e/2dc6bad6737fea8734641b2e?renderMode=0&uiState=6abfc48c06945a51a45c6e38">
        <div className="work-card" id='engineering-model' title='Click to view'>
          <img src={EngineeringModel} className='image' alt="" />
          <p className="work-name">Presec Engineering Logo (3D Model)</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7680211143989742868?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='gachiakuta' title='Click to play'>
          <img src={Gachiakuta} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">Gachiakuta Edit</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7639539252207848724?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='wiseman' title='Click to play'>
          <img src={Wiseman} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">The Wiseman's Grandchild Edit</p>
        </div>
        </a>

        <a href="https://www.tiktok.com/@callme.solo.onyx/video/7677204798843751700?is_from_webapp=1&sender_device=pc&web_id=7603321254900844048">
        <div className="work-card" id='stranger' title='Click to play'>
          <img src={StrangerThings} className='image' alt="" />
          <img src={play_icon} className='play-icon' alt="" />
          <p className="work-name">Stranger Things Edit</p>
        </div>
        </a>

      </div>
      


     <Footer/> 
    </div>
    </>
  )
}

export default Work