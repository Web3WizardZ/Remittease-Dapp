import React from 'react';
import Navbar from '../components/Navbar';
import './PageStyles.css';

const Contact = () => {
  return (
    <div className="page-container">
      <Navbar />
      <header className="page-header">
        <h1>Contact Us</h1>
      </header>
      <section className="page-content">
        <p>If you have any questions or need assistance, please reach out to us:</p>
        <ul>
          <li>Email: support@remittanceplatform.com</li>
          <li>Phone: +123 456 7890</li>
          <li>Address: 123 Remittance Avenue, Nairobi, Kenya</li>
        </ul>
      </section>
    </div>
  );
};

export default Contact;
