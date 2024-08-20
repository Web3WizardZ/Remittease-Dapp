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
        <p>
          Our platform allows you to send money across borders securely and affordably. Simply sign up, link your bank account or wallet, and start sending funds to your loved ones or business partners.
        </p>
        
        <h2>What currencies are supported?</h2>
        <p>
          We support major global currencies including USD, EUR, GBP, and many African currencies like NGN, ZAR, and KES. You can see the full list of supported currencies in the app.
        </p>
        
        <h2>How long do transfers take?</h2>
        <p>
          Transfers are typically completed within minutes. However, in some cases, it may take up to 24 hours depending on the destination country and the receiving bank.
        </p>

        <h2>What are the fees?</h2>
        <p>
          Our fees are among the lowest in the market. You can check the exact fee for your transfer in the app before confirming your transaction.
        </p>

        <h2>How secure is the platform?</h2>
        <p>
          We use state-of-the-art encryption technology to protect your data and transactions. Additionally, our platform is fully compliant with international financial regulations to ensure the safety of your money.
        </p>

        <h2>Can I track my transfers?</h2>
        <p>
          Yes! Once you initiate a transfer, you can track its progress in real-time through the app, so you always know where your money is.
        </p>

        <h2>How can I contact support?</h2>
        <p>
          Our customer support team is available 24/7. You can reach us via email, phone, or live chat directly in the app.
        </p>
      </section>
    </div>
  );
};

export default FAQ;
