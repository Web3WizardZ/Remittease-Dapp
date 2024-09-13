import React, { useState, useEffect } from 'react';
import { providers, utils } from 'ethers';
import Navbar from '../components/Navbar';
import SwapComponent from '../components/SwapComponent'; // Swap feature component
import './FunctionalPage.css';

const FunctionalPage = () => {
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Source currency
  const [targetCurrency, setTargetCurrency] = useState('ZAR'); // Target currency
  const [userId, setUserId] = useState('user123'); // Example user ID
  
  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (window.ethereum) {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setBalance(utils.formatEther(balance));
      }
    };
    fetchWalletDetails();
  }, []);

  const sendMoney = async () => {
    if (!recipientAddress || !amount) {
      setStatus('Please enter a valid address and amount.');
      return;
    }

    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: utils.parseEther(amount),
      });

      setStatus(`Transaction successful! TX Hash: ${tx.hash}`);
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(utils.formatEther(balance));
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  const remitFiat = async () => {
    if (!fiatAmount || !recipientAddress || !currency || !targetCurrency) {
      setStatus('Please provide all remittance details.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/remit-fiat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fiatAmount,
          recipientPublicKey: recipientAddress, // Use recipientAddress as public key
          currency,
          targetCurrency,
          userId, // Send user ID to the backend for Stellar key retrieval
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Log the details to the console
        console.log('Sender account key:', data.senderPublicKey);
        console.log('Amount sent:', data.amountSent);
        console.log('Currency:', data.currency);
        console.log('Receiver account key:', data.recipientPublicKey);
        console.log('Amount received:', data.amountReceived);
        console.log('Transaction hash:', data.transactionHash);
        console.log('Transaction Successful!');
        
        setStatus(`Remittance successful! Transaction ID: ${data.transactionHash}`);
      } else {
        setStatus('Remittance failed.');
      }
    } catch (error) {
      console.error('Remittance failed:', error);
      setStatus('Remittance failed.');
    }
};


  return (
    <div className="functional-page-container">
      <Navbar />
      <header className="functional-header glass-effect">
        <h1>Your Dashboard</h1>
      </header>

      {/* Wallet Balance */} 
      <section className="wallet-overview small-card neumorphism-effect">
        <h2>Wallet Balance</h2>
        <p className="balance">{balance} ETH</p>
      </section>

      {/* Send ETH Section */}
      <section className="send-money-section glass-effect">
        <h2>Send Money</h2>
        <div className="send-money-form">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
          />
          <button onClick={sendMoney} className="cta-button">Send</button>
        </div>
        <p className="status-message">{status}</p>
      </section>

      {/* Fiat Remittance Section */}
      <section className="fiat-remittance-section glass-effect">
        <h2>Remit Fiat</h2>
        <div className="fiat-remittance-form">
          <input
            type="text"
            placeholder="Amount (Fiat)"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(e.target.value)}
            className="form-input"
          />
          
          {/* Source Currency */}
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="form-select">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
            <option value="NGN">NGN</option>
          </select>

          {/* Target Currency */}
          <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} className="form-select">
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="NGN">NGN</option>
          </select>

          <button onClick={remitFiat} className="cta-button">Remit Fiat</button>
        </div>
        <p className="status-message">{status}</p>
      </section>

      {/* Swap Feature */}
      <section className="swap-feature glass-effect">
        <SwapComponent />
      </section>
    </div>
  );
};

export default FunctionalPage;
