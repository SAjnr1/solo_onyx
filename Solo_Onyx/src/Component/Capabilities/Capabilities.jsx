import React from 'react'
import './Capabilities.css'
import Capcut from '../../assets/capcut.png'
import CSS from '../../assets/css.png'
import HTML from '../../assets/html.png'
import Arduino from '../../assets/arduino.png'
import Canva from '../../assets/canva.png'
import JSX from '../../assets/react.png'
import Onshape from '../../assets/onshape.png'
import Jupyter from '../../assets/jupyter.png'
import TinkerCAD from '../../assets/tinkercad.png'
import EV3 from '../../assets/ev3.png'
import Spike from '../../assets/spike.png'
import JS from '../../assets/js.png'
import ParticleBackground from '../ParticleBackground/ParticleBackground'
import Footer from '../Footer/footer'
import Navbar from '../Navbar/Navbar'


const Capabilities = () => {
  
  return (
    <>
    <div className='capabilities'>
      <Navbar/>
      <ParticleBackground id='capabilities-particles' />

      <div className="heading">
        <h1>My <span>Capabilities</span></h1>
      </div>

      <div className="caption">
        <p>Skills and technologies I use to turn ideas into reality.</p>
      </div>

      <div className="skill-set">

        <div className="card" id='css'>
          <img src={CSS} className='img'/>
          <p className='capability-name'>CSS Code</p>
        </div>

        <div className="card" id='capcut'>
          <img src={Capcut} className='img'/>
          <p className='capability-name'>Capcut</p>
        </div>
        <div className="card" id='jsx'>
          <img src={JSX} className='img'/>
          <p className='capability-name'>React JSX</p>
        </div>
        <div className="card" id='canva'>
          <img src={Canva} className='img'/>
          <p className='capability-name'>Canva</p>
        </div>
        
        <div className="card" id='html'>
          <img src={HTML} className='img'/>
          <p className='capability-name'>HTML Code</p>
        </div>
        <div className="card" id='onshape'>
          <img src={Onshape} className='img'/>
          <p className='capability-name'>Onshape</p>
        </div>

        <div className="card" id='spike'>
          <img src={JS} className='img'/>
          <p className='capability-name'>JS Code</p>
        </div>

        <div className="card" id='ev3'>
          <img src={EV3} className='img'/>
          <p className='capability-name'>EV3</p>
        </div>

        <div className="card" id='arduino'>
          <img src={Arduino} className='img'/>
          <p className='capability-name'>Arduino</p>
        </div>

        <div className="card" id='tinkercad'>
          <img src={TinkerCAD} className='img'/>
          <p className='capability-name'>TinkerCAD</p>
        </div>

        <div className="card" id='spike'>
          <img src={Spike} className='img'/>
          <p className='capability-name'>Spike</p>
        </div>


        <div className="card" id='jupyter'>
          <img src={Jupyter} className='img'/>
          <p className='capability-name'>Jupyter Notebook</p>
        </div>


      </div>
      <Footer/>
    </div>
   
    </>
  )
}

export default Capabilities