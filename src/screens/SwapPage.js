import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getSwapQuote } from '../utils/swapHelper'; // Import the helper function
import './SwapPage.css';

const SwapPage = () => {
  const [tokenIn, setTokenIn] = useState(''); 
  const [tokenOut, setTokenOut] = useState(''); 
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [status, setStatus] = useState('');

  const fetchQuote = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const quote = await getSwapQuote(provider, tokenIn, tokenOut, amountIn, FeeAmount.MEDIUM); 
      setAmountOut(quote);
      setStatus('Quote fetched successfully.');
    } catch (error) {
      console.error('Error fetching quote:', error);
      setStatus('Failed to fetch quote.');
    }
  };

  return (
    <div className="swap-page">
      <h1>Swap Tokens</h1>
      <div className="swap-form">
        <input
          type="text"
          placeholder="Token In (Address)"
          value={tokenIn}
          onChange={(e) => setTokenIn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token Out (Address)"
          value={tokenOut}
          onChange={(e) => setTokenOut(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount In"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <button onClick={fetchQuote}>Get Quote</button>
        {amountOut && <p>Expected Output: {amountOut}</p>}
        <p>{status}</p>
      </div>
    </div>
  );
};

export default SwapPage;
