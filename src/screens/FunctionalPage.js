import React, { useState, useEffect } from 'react';
import { providers, utils } from 'ethers'; // Updated import to directly access `providers` and `utils`
import Navbar from '../components/Navbar';
import SwapComponent from '../components/SwapComponent'; // Swap feature component
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
        const provider = new providers.Web3Provider(window.ethereum); // Corrected provider
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const balance = await provider.getBalance(address);
        setBalance(utils.formatEther(balance)); // Corrected formatEther import
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
      const provider = new providers.Web3Provider(window.ethereum); // Corrected provider
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: utils.parseEther(amount), // Corrected parseEther import
      });

      setStatus(`Transaction successful! TX Hash: ${tx.hash}`);

      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(utils.formatEther(balance)); // Corrected formatEther import
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  const generateDepositAddress = () => {
    const address = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setDepositAddress(address);
    setCryptoDepositStatus('Simulated deposit address generated successfully!');
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

      {/* Send Money */}
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

      {/* Swap Feature */}
      <section className="swap-feature glass-effect">
        <SwapComponent />
      </section>

      {/* Deposit Section */}
      <section className="deposit-section">
        <h2>Deposit Funds</h2>
        <div className="deposit-grid">
          <div className="deposit-option neumorphism-effect">
            <h3>Deposit with Crypto</h3>
            <button onClick={generateDepositAddress} className="cta-button">Get Deposit Address</button>
            {depositAddress && <p>Your deposit address: <span>{depositAddress}</span></p>}
            <p className="status-message">{cryptoDepositStatus}</p>
          </div>

          <div className="deposit-option neumorphism-effect">
            <h3>Deposit with Fiat</h3>
            <p>Coming Soon!</p>
          </div>

          <div className="deposit-option neumorphism-effect">
            <h3>Deposit with Debit/Credit Card</h3>
            <p>Coming soon!</p>
          </div>
        </div>
      </section>

      {/* Transaction History */}
      <section className="transaction-history-section">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <ul className="transaction-list">
            {transactions.map((tx, index) => (
              <li key={index} className="transaction-item glass-effect">
                <p>TX Hash: {tx.hash}</p>
                <p>Amount: {utils.formatEther(tx.value)} ETH</p> {/* Corrected formatEther usage */}
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
