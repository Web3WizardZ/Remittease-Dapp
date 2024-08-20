import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faLock, faMoneyBillWave, faUserCheck, faHandshake, faSmile } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const LandingPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access if needed
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const address = accounts[0];
        
        // Set wallet state
        setWalletConnected(true);
        setWalletAddress(address);

        // Redirect to the functional page
        navigate('/functional-page'); // Replace with your actual functional page route
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  return (
    <div className="landing-container">
      <video autoPlay muted loop className="video-background">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>

      <Navbar /> {/* Navigation Bar */}
      
      <header className="landing-header" id="hero">
        <h1>RemittEase</h1>
        <p>Fast, Secure, and Affordable Cross-Border Transfers</p>

        {/* Get Started Button as Wallet Connection Button */}
        <button className="cta-button" onClick={connectWallet}>
          {walletConnected ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Get Started'}
        </button>
      </header>
      
      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FontAwesomeIcon icon={faBolt} size="3x" className="feature-icon" />
            <h3>Fast Transactions</h3>
            <p>Experience lightning-fast transactions across borders.</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faMoneyBillWave} size="3x" className="feature-icon" />
            <h3>Low Fees</h3>
            <p>Save money with our low transaction fees.</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faLock} size="3x" className="feature-icon" />
            <h3>Secure Payments</h3>
            <p>Your transactions are safe with our top-notch security protocols.</p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <h2>How It Works</h2>
        <div className="how-it-works-grid">
          <div className="how-it-works-item">
            <FontAwesomeIcon icon={faUserCheck} size="3x" className="how-it-works-icon" />
            <h3>Sign Up</h3>
            <p>Create an account in just a few minutes.</p>
          </div>
          <div className="how-it-works-item">
            <FontAwesomeIcon icon={faHandshake} size="3x" className="how-it-works-icon" />
            <h3>Connect</h3>
            <p>Link your account to send and receive funds.</p>
          </div>
          <div className="how-it-works-item">
            <FontAwesomeIcon icon={faSmile} size="3x" className="how-it-works-icon" />
            <h3>Send & Receive</h3>
            <p>Send money across borders with ease.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-item">
            <p>"This platform made sending money to my family easier than ever!"</p>
            <span>- John D.</span>
          </div>
          <div className="testimonial-item">
            <p>"I love how fast and affordable the transactions are."</p>
            <span>- Mary K.</span>
          </div>
          <div className="testimonial-item">
            <p>"Secure and reliable. I trust this platform completely."</p>
            <span>- Peter A.</span>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="social-media-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>
        <form className="newsletter-signup">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
        <p>© 2024 African Remittance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
