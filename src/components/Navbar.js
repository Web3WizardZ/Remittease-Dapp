// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-scroll';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="hero" smooth={true} duration={1000}>
            Home
          </Link>
        </li>
        <li>
          <Link to="features" smooth={true} duration={1000}>
            Features
          </Link>
        </li>
        <li>
          <Link to="how-it-works" smooth={true} duration={1000}>
            How It Works
          </Link>
        </li>
        <li>
          <Link to="testimonials" smooth={true} duration={1000}>
            Testimonials
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
