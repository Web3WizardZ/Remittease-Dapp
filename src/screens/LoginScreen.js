// src/screens/LoginScreen.js
import React, { useState } from 'react';
import WalletConnectButton from '../components/WalletConnectButton';

const LoginScreen = () => {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const handleConnect = (account) => {
    setConnectedAccount(account);
    // Use the connected account in your application logic
    console.log("Connected account:", account);
  };

  return (
    <div>
      <h2>Login</h2>
      {connectedAccount ? (
        <p>Welcome, {connectedAccount}</p>
      ) : (
        <WalletConnectButton onConnect={handleConnect} />
      )}
    </div>
  );
};

export default LoginScreen;
