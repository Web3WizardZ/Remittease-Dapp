import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Fetcher, Trade, Route, TokenAmount, TradeType, Percent, Router } from '@uniswap/sdk';
import { parseUnits, hexlify } from 'ethers'; // Import hexlify and parseUnits directly

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');

  const UniswapV2Router02Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap Router address on Ethereum Mainnet

  const handleSwap = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenInAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
      const tokenOutAddress = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'; // USDT

      // Fetch token data
      const tokenIn = await Fetcher.fetchTokenData(1, tokenInAddress, provider); // Chain ID 1 is Ethereum mainnet
      const tokenOut = await Fetcher.fetchTokenData(1, tokenOutAddress, provider);

      // Create a trading route
      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut, provider);
      const route = new Route([pair], tokenIn);

      // Create the trade instance
      const trade = new Trade(route, new TokenAmount(tokenIn, parseUnits(inputAmount, tokenIn.decimals)), TradeType.EXACT_INPUT);

      // Set slippage tolerance (e.g., 0.50%)
      const slippageTolerance = new Percent('50', '10000');

      // Get the swap parameters from Uniswap SDK
      const swapParameters = Router.swapCallParameters(trade, {
        slippageTolerance,
        recipient: await signer.getAddress(),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      });

      const swapCallData = swapParameters.calldata;

      // Create a contract instance for tokenIn (USDC)
      const tokenInContract = new ethers.Contract(tokenInAddress, ['function approve(address spender, uint256 amount)'], signer);

      // Approve the Uniswap Router to spend the tokenIn (USDC)
      const approval = await tokenInContract.approve(UniswapV2Router02Address, trade.inputAmount.raw.toString());
      await approval.wait();

      // Execute the swap transaction
      const tx = await signer.sendTransaction({
        to: UniswapV2Router02Address,
        data: swapCallData,
        gasLimit: hexlify(300000), // Specify a gas limit for the swap
      });
      await tx.wait();

      setStatus('Swap successful!');
    } catch (error) {
      console.error('Swap failed:', error);
      setStatus(`Swap failed: ${error.message}`);
    }
  };

  return (
    <div className="swap-container">
      <h2>Swap Tokens</h2>
      <input
        type="text"
        placeholder="Input Amount USDC"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Output Amount USDT"
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
