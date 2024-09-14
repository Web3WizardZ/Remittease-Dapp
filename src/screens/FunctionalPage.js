import React, { useState, useEffect } from 'react';
import { providers, utils } from 'ethers';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SwapComponent from '../components/SwapComponent';
import TransactionHistory from '../components/TransactionHistory'; // New Component
import './FunctionalPage.css';

const FunctionalPage = () => {
  const [balance, setBalance] = useState('');
  const [address, setAddress] = useState('');
  const [ethRecipientAddress, setEthRecipientAddress] = useState('');
  const [fiatRecipientPublicKey, setFiatRecipientPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('ZAR');
  const [userId, setUserId] = useState('user123');

  const [sendMoneyStatus, setSendMoneyStatus] = useState('');
  const [remitFiatStatus, setRemitFiatStatus] = useState('');
  const [isSendingMoney, setIsSendingMoney] = useState(false);
  const [isRemittingFiat, setIsRemittingFiat] = useState(false);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (window.ethereum) {
        try {
          const provider = new providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          setAddress(userAddress);
          const balance = await provider.getBalance(userAddress);
          setBalance(utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching wallet details:', error);
          setBalance('N/A');
        }
      } else {
        console.warn('window.ethereum is not available');
        setBalance('N/A');
      }
    };

    fetchWalletDetails();
  }, []);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (address) {
        try {
          const apiKey = 'YourEtherscanAPIKey'; // Replace with your Etherscan API Key
          const response = await axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`
          );
          if (response.data.status === '1') {
            setTransactions(response.data.result.slice(0, 10)); // Get the latest 10 transactions
          } else {
            console.error('Error fetching transactions:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching transaction history:', error);
        }
      }
    };

    fetchTransactionHistory();
  }, [address]);

  const sendMoney = async () => {
    if (!ethRecipientAddress || !amount) {
      setSendMoneyStatus('Please enter a valid address and amount.');
      return;
    }

    if (!utils.isAddress(ethRecipientAddress)) {
      setSendMoneyStatus('Please enter a valid Ethereum address.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setSendMoneyStatus('Please enter a valid amount.');
      return;
    }

    try {
      setIsSendingMoney(true);
      setSendMoneyStatus('Transaction pending...');
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: ethRecipientAddress,
        value: utils.parseEther(amount),
      });

      await tx.wait();

      setSendMoneyStatus(`Transaction successful! TX Hash: ${tx.hash}`);
      const userAddress = await signer.getAddress();
      const balance = await provider.getBalance(userAddress);
      setBalance(utils.formatEther(balance));

      // Clear input fields
      setEthRecipientAddress('');
      setAmount('');

      // Refresh transaction history
      setAddress(userAddress);
    } catch (error) {
      console.error('Transaction failed:', error);
      setSendMoneyStatus('Transaction failed. Please try again.');
    } finally {
      setIsSendingMoney(false);
    }
  };

  const remitFiat = async () => {
    if (!fiatAmount || !fiatRecipientPublicKey || !currency || !targetCurrency) {
      setRemitFiatStatus('Please provide all remittance details.');
      return;
    }

    if (isNaN(fiatAmount) || parseFloat(fiatAmount) <= 0) {
      setRemitFiatStatus('Please enter a valid fiat amount.');
      return;
    }

    try {
      setIsRemittingFiat(true);
      setRemitFiatStatus('Remittance in progress...');

      const response = await fetch('http://localhost:3000/remit-fiat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fiatAmount,
          recipientPublicKey: fiatRecipientPublicKey,
          currency,
          targetCurrency,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Remittance details:', data);

        setRemitFiatStatus(
          `Remittance successful! Transaction ID: ${data.transactionHash}`
        );

        // Clear input fields
        setFiatAmount('');
        setFiatRecipientPublicKey('');
      } else {
        setRemitFiatStatus(`Remittance failed: ${data.message || 'Unknown error.'}`);
      }
    } catch (error) {
      console.error('Remittance failed:', error);
      setRemitFiatStatus('Remittance failed. Please try again.');
    } finally {
      setIsRemittingFiat(false);
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
            value={ethRecipientAddress}
            onChange={(e) => setEthRecipientAddress(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
          />
          <button
            onClick={sendMoney}
            className="cta-button"
            disabled={isSendingMoney}
          >
            {isSendingMoney ? 'Sending...' : 'Send'}
          </button>
        </div>
        <p className="status-message">{sendMoneyStatus}</p>
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
          <input
            type="text"
            placeholder="Recipient Public Key"
            value={fiatRecipientPublicKey}
            onChange={(e) => setFiatRecipientPublicKey(e.target.value)}
            className="form-input"
          />

          {/* Source Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="form-select"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
            <option value="NGN">NGN</option>
          </select>

          {/* Target Currency */}
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="form-select"
          >
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="NGN">NGN</option>
          </select>

          <button
            onClick={remitFiat}
            className="cta-button"
            disabled={isRemittingFiat}
          >
            {isRemittingFiat ? 'Remitting...' : 'Remit Fiat'}
          </button>
        </div>
        <p className="status-message">{remitFiatStatus}</p>
      </section>

      {/* Transaction History Section */}
      <section className="transaction-history-section glass-effect">
        <h2>Transaction History</h2>
        <TransactionHistory transactions={transactions} address={address} />
      </section>

      {/* Swap Feature */}
      <section className="swap-feature glass-effect">
        <SwapComponent />
      </section>
    </div>
  );
};

export default FunctionalPage;
