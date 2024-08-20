import React from 'react';
import Navbar from '../components/Navbar';
import './PageStyles.css';

const Services = () => {
  return (
    <div className="page-container">
      <Navbar />
      <header className="page-header">
        <h1>Our Services</h1>
      </header>
      <section className="page-content">
        <ul>
          <li>Fast cross-border transactions</li>
          <li>Low fees for remittances</li>
          <li>Secure payments and transfers</li>
          <li>Multi-currency support</li>
          <li>24/7 customer service</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
