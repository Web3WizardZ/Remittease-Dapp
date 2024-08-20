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
        <p>
          The African Remittance Platform offers a range of services designed to make sending and receiving money across borders easier, faster, and more secure. Here’s what we offer:
        </p>
        <h2>Fast and Secure Cross-Border Transfers</h2>
        <p>
          With our platform, you can send money to your loved ones in minutes, no matter where they are. Our secure technology ensures that your transactions are protected every step of the way.
        </p>
        <h2>Low Fees</h2>
        <p>
          We believe that sending money home shouldn’t cost a fortune. That’s why we offer some of the lowest fees in the industry, ensuring that more of your money goes where it’s needed most.
        </p>
        <h2>Multi-Currency Support</h2>
        <p>
          Whether you’re sending dollars, euros, pounds, or local African currencies, we’ve got you covered. Our platform supports a wide range of currencies to make your transfers as convenient as possible.
        </p>
        <h2>24/7 Customer Support</h2>
        <p>
          Our dedicated customer support team is available around the clock to assist you with any questions or issues. We’re here to make sure your experience with our platform is smooth and stress-free.
        </p>
        <h2>Business Solutions</h2>
        <p>
          In addition to personal remittances, we offer tailored solutions for businesses looking to make international payments. Whether you’re paying suppliers or employees, our platform provides the tools you need to manage your cross-border transactions efficiently.
        </p>
      </section>
    </div>
  );
};

export default Services;
