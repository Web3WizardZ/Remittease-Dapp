import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Fetcher, Trade, Route, TokenAmount, TradeType } from '@uniswap/sdk';

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSwap = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenInAddress = '0xYourInputTokenAddress'; // Replace with actual token address
      const tokenOutAddress = '0xYourOutputTokenAddress'; // Replace with actual token address

      // Fetch token data
      const tokenIn = await Fetcher.fetchTokenData(1, tokenInAddress, provider); // Chain ID 1 is Ethereum mainnet
      const tokenOut = await Fetcher.fetchTokenData(1, tokenOutAddress, provider);

      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut, provider);
      const route = new Route([pair], tokenIn);

      const trade = new Trade(route, new TokenAmount(tokenIn, ethers.parseUnits(inputAmount, tokenIn.decimals)), TradeType.EXACT_INPUT);

      // Approve the token
      const approval = await signer.approve(tokenInAddress, trade.inputAmount.raw.toString());
      await approval.wait();

      // Execute the swap
      const tx = await signer.sendTransaction({
        to: UniswapV2Router02Address, // Uniswap router address
        data: swapCallData, // Encoded swap transaction data
      });
      await tx.wait();

      setStatus('Swap successful!');
    } catch (error) {
      console.error('Swap failed:', error);
      setStatus('Swap failed. Please try again.');
    }
  };

  return (
    <div className="swap-container">
      <h2>Swap Tokens</h2>
      <input
        type="text"
        placeholder="Input Amount"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Output Amount"
        value={outputAmount}
        onChange={(e) => setOutputAmount(e.target.value)}
        disabled
      />
      <button onClick={handleSwap}>Swap</button>
      <p>{status}</p>
    </div>
  );
};

export default SwapComponent;
