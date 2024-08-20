import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './PageStyles.css';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    // Here you can add form submission logic, such as sending data to a server
  };

  return (
    <div className="page-container">
      <Navbar />
      <header className="page-header">
        <h1>Contact Us</h1>
      </header>
      <section className="page-content">
        <p>
          We’re here to help! Whether you have a question, need support, or just want to provide feedback, feel free to get in touch with us through any of the methods below.
        </p>
        <ul>
          <li><strong>Email:</strong> support@remittease.com</li>
          <li><strong>Phone:</strong> +123 456 7890</li>
          <li><strong>Address:</strong> 123 Remittance Avenue, Nairobi, Kenya</li>
        </ul>
        <h2>Contact Form</h2>
        {formSubmitted ? (
          <p className="success-message">Thank you! Your message has been sent.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="cta-button">Send Message</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Contact;
