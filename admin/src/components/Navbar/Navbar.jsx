import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import cart_logo from '../../assets/profile.jpg'

const Navbar = () => {
  return (
    <div className='Navbar'>
            <div className="navlogo"> 
                <img src={logo} alt="Companylogo" />
            </div>
            <div className="head">
            <h1 className='Admin'>ADMIN</h1></div>
            <div className='bttns'>               
                <img className="cart" src={cart_logo} alt="Cart" />
            </div>    
        </div>
  )
}

export default Navbar