import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import './FunctionalPage.css';

const FunctionalPage = () => {
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [cryptoDepositStatus, setCryptoDepositStatus] = useState('');

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));

        // Fetch recent transactions (to be implemented with a blockchain API)
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      });

      setStatus(`Transaction successful! TX Hash: ${tx.hash}`);

      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  const generateDepositAddress = () => {
    // Generate or retrieve a unique deposit address for the user
    const address = '0xYourGeneratedDepositAddress'; // Replace with actual logic
    setDepositAddress(address);
    setCryptoDepositStatus('Deposit address generated successfully!');
  };

  return (
    <div className="functional-page-container">
      <Navbar />
      <header className="functional-header">
        <h1>Your Dashboard</h1>
      </header>

      <section className="wallet-overview">
        <h2>Wallet Balance</h2>
        <p>{balance} ETH</p>
      </section>

      <section className="deposit-section">
        <h2>Deposit Funds</h2>

        {/* Crypto Deposit */}
        <div className="deposit-option">
          <h3>Deposit with Crypto</h3>
          <button onClick={generateDepositAddress}>Get Deposit Address</button>
          {depositAddress && <p>Your deposit address: {depositAddress}</p>}
          <p>{cryptoDepositStatus}</p>
        </div>

        {/* Fiat Deposit */}
        <div className="deposit-option">
          <h3>Deposit with Fiat</h3>
          {/* Placeholder for fiat deposit integration */}
          <p>Integrate with a payment processor like Stripe or PayPal.</p>
        </div>

        {/* Debit/Credit Card Deposit */}
        <div className="deposit-option">
          <h3>Deposit with Debit/Credit Card</h3>
          {/* Placeholder for card deposit integration */}
          <p>Integrate with a payment gateway for card payments.</p>
        </div>
      </section>

      <section className="send-money-section">
        <h2>Send Money</h2>
        <div className="send-money-form">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={sendMoney}>Send</button>
        </div>
        <p>{status}</p>
      </section>

      <section className="transaction-history-section">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <ul className="transaction-list">
            {transactions.map((tx, index) => (
              <li key={index}>
                <p>TX Hash: {tx.hash}</p>
                <p>Amount: {ethers.formatEther(tx.value)} ETH</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions.</p>
        )}
      </section>
    </div>
  );
};

export default FunctionalPage;
