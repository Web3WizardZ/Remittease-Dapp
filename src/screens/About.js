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
          At the African Remittance Platform, we believe that everyone deserves access to affordable and secure money transfers, no matter where they are. Our platform is designed to help the African diaspora send money home quickly, securely, and with minimal fees.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to bridge the financial gap between Africa and the world by providing fast, reliable, and affordable cross-border remittance services. We aim to empower individuals and businesses to connect with their loved ones and communities through seamless financial transactions.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Transparency:</strong> We believe in clear and upfront pricing with no hidden fees.</li>
          <li><strong>Security:</strong> Protecting your money and data is our top priority.</li>
          <li><strong>Accessibility:</strong> Our platform is built to be easy to use for everyone, regardless of tech-savviness.</li>
          <li><strong>Community:</strong> We are committed to supporting African communities and fostering economic growth.</li>
        </ul>
        <h2>Meet Our Team</h2>
        <p>
          We are a passionate team of entrepreneurs, engineers, and financial experts with deep connections to Africa. Our goal is to build a platform that helps families stay connected and supports the growth of African economies.
        </p>
      </section>
    </div>
  );
};

export default About;
