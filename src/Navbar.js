import React from 'react';
import './Navbar.css';
import logo from "./img/logo.png"

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about"><img src={logo} alt='logo' className='logo'/></a></li>
        <li><a href="#contact">Profile</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
