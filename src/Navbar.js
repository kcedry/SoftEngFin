import React from 'react';
import './Navbar.css';
import logo from "./img/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/savings">Savings</Link></li>
        <p className="vbar">|</p>

        <li><Link to="/"><img src={logo} alt='logo' className='logo'/></Link></li>
        <p className="vbar">|</p>

        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
