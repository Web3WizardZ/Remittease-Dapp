// src/components/WalletConnectButton.js
import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther, Contract } from 'ethers';

const WalletConnectButton = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contractData, setContractData] = useState(null);

  // Your contract ABI and address
  const contractABI = [
    // Add your contract's ABI here
  ];
  const contractAddress = "0xYourContractAddress";

  // Connect with MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider for MetaMask connection
        await provider.send("eth_requestAccounts", []); // Request access to MetaMask
        const signer = provider.getSigner();
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        onConnect(userAccount);

        // Fetch and display balance
        const userBalance = await signer.getBalance();
        setBalance(formatEther(userBalance)); // Convert balance from wei to ether

        // Interact with the smart contract
        const contract = new Contract(contractAddress, contractABI, signer);
        const data = await contract.someMethod(); // Replace with your contract's method
        setContractData(data);

      } catch (error) {
        console.error("MetaMask connection error", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask!");
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected as {account}</p>
          <p>Balance: {balance} ETH</p>
          <p>Contract Data: {contractData}</p> {/* Display fetched contract data */}
        </div>
      ) : (
        <button onClick={connectMetaMask}>Connect with MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnectButton;
