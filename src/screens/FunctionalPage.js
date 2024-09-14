import React, { useState, useEffect } from 'react';
import { providers, utils } from 'ethers';
import Navbar from '../components/Navbar';
import SwapComponent from '../components/SwapComponent'; // Swap feature component
import './FunctionalPage.css';

const FunctionalPage = () => {
  const [balance, setBalance] = useState('');
  const [ethRecipientAddress, setEthRecipientAddress] = useState('');
  const [fiatRecipientPublicKey, setFiatRecipientPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Source currency
  const [targetCurrency, setTargetCurrency] = useState('ZAR'); // Target currency
  const [userId, setUserId] = useState('user123'); // Example user ID

  const [sendMoneyStatus, setSendMoneyStatus] = useState('');
  const [remitFiatStatus, setRemitFiatStatus] = useState('');
  const [isSendingMoney, setIsSendingMoney] = useState(false);
  const [isRemittingFiat, setIsRemittingFiat] = useState(false);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (window.ethereum) {
        try {
          const provider = new providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
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
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(utils.formatEther(balance));

      // Clear input fields
      setEthRecipientAddress('');
      setAmount('');
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
        // Log the details to the console
        console.log('Sender account key:', data.senderPublicKey);
        console.log('Amount sent:', data.amountSent);
        console.log('Currency:', data.currency);
        console.log('Receiver account key:', data.recipientPublicKey);
        console.log('Amount received:', data.amountReceived);
        console.log('Transaction hash:', data.transactionHash);
        console.log('Transaction Successful!');

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

      {/* Swap Feature */}
      <section className="swap-feature glass-effect">
        <SwapComponent />
      </section>
    </div>
  );
};

export default FunctionalPage;
