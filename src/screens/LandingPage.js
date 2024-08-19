// src/screens/LandingPage.js
import React from 'react';
import './LandingPage.css';
import { useSpring, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faLock, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  const fadeIn = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 500,
  });

  return (
    <div className="landing-container">
      <header
        className="landing-header"
        style={{
          backgroundImage: `url('/kids.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="overlay"></div>
        <h1>Welcome to the African Remittance Platform</h1>
        <p>Fast, Secure, and Affordable Cross-Border Transfers</p>
        <button className="cta-button">Get Started</button>
      </header>
      
      <animated.section style={fadeIn} className="features-section">
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
      </animated.section>

      <footer className="landing-footer">
        <p>© 2024 African Remittance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
