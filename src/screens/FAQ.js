import React from 'react';
import Navbar from '../components/Navbar';
import './PageStyles.css';

const FAQ = () => {
  return (
    <div className="page-container">
      <Navbar />
      <header className="page-header">
        <h1>Frequently Asked Questions</h1>
      </header>
      <section className="page-content">
        <h2>How does the platform work?</h2>
        <p>Our platform allows you to send money across borders securely and affordably. Simply sign up, link your account, and start sending funds.</p>
        
        <h2>What currencies are supported?</h2>
        <p>We support major global currencies, including USD, EUR, GBP, and many African currencies.</p>
        
        <h2>What are the fees?</h2>
        <p>Our fees are among the lowest in the market. You can find detailed fee information on our pricing page.</p>
      </section>
    </div>
  );
};

export default FAQ;
