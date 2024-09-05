import React, { useState } from 'react';
import './RemittanceForm.css';

const RemittanceForm = () => {
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the backend API to process the remittance
    try {
      const response = await fetch('http://localhost:3000/remit-fiat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          recipientName,
          bankAccount,
          bankName,
          currency,
        }),
      });
      
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      console.error('Error sending remittance:', error);
      setStatus('Failed to send remittance. Please try again.');
    }
  };

  return (
    <div className="remittance-form-container">
      <h2>Send Fiat to Bank Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Bank Account Number"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="ZAR">ZAR</option>
        </select>
        <button type="submit">Send Remittance</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default RemittanceForm;
