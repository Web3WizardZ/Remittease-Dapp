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

  useEffect(() => {
    // Fetch wallet balance and transaction history
    const fetchWalletDetails = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Fetch balance using provider and address
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));

        // Fetch recent transactions (you will need to implement this based on your blockchain API)
        // setTransactions(mockTransactionData);
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
      
      // Fetch updated balance after the transaction
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
      
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('Transaction failed. Please try again.');
    }
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
