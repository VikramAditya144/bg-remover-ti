import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
              <path d="M3 8V7C3 5.34315 4.34315 4 6 4H7M16 3H17C19.2091 3 21 4.79086 21 7V8M21 16V17C21 19.2091 19.2091 21 17 21H16M8 21H7C4.79086 21 3 19.2091 3 17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="logo-text">AI Background Remover</span>
        </Link>

        <div className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link active" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/gallery" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/how-it-works" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </Link>
          </li>
        </ul>

        <div className="navbar-buttons">
          <a href="#pricing" className="btn btn-secondary">Pricing</a>
          <a href="#get-started" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;