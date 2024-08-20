import React from 'react';
import Navbar from '../components/Navbar';
import './PageStyles.css';

const About = () => {
  return (
    <div className="page-container">
      <Navbar />
      <header className="page-header">
        <h1>About Us</h1>
      </header>
      <section className="page-content">
        <p>
          Welcome to the African Remittance Platform. Our mission is to make cross-border money transfers fast, secure, and affordable. We are committed to connecting the African diaspora with their families back home by offering reliable remittance services.
        </p>
      </section>
    </div>
  );
};

export default About;
