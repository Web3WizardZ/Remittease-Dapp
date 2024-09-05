import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Fetcher, Trade, Route, TokenAmount, TradeType, WETH, Token } from '@uniswap/sdk';
import { parseUnits } from '@ethersproject/units';

const UniswapV2Router02Address = '0x7a250d5630b4cf539739df2c5dacabdb9caa73a3'; // Uniswap V2 Router address

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSwap = async () => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      // Replace with actual token addresses
      const tokenInAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI (for example)
      const tokenOutAddress = WETH[1].address; // WETH on Ethereum Mainnet

      // Fetch token data
      const tokenIn = await Fetcher.fetchTokenData(1, tokenInAddress, provider); // Chain ID 1 is Ethereum mainnet
      const tokenOut = await Fetcher.fetchTokenData(1, tokenOutAddress, provider);

      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut, provider);
      const route = new Route([pair], tokenIn);

      // Create a trade instance
      const trade = new Trade(
        route,
        new TokenAmount(tokenIn, parseUnits(inputAmount, tokenIn.decimals)),
        TradeType.EXACT_INPUT
      );

      // Calculate minimum output amount (slippage tolerance applied here if needed)
      const amountOutMin = trade.minimumAmountOut(parseUnits('1', tokenOut.decimals)).raw.toString();

      // Generate swap call data
      const swapCallData = await generateSwapCallData(
        inputAmount,
        amountOutMin,
        [tokenInAddress, tokenOutAddress],
        account,
        Math.floor(Date.now() / 1000) + 60 * 20,
        provider
      );

      // Approve the token for spending
      const tokenContract = new ethers.Contract(tokenInAddress, [
        'function approve(address _spender, uint256 _value) public returns (bool)',
      ], signer);
      const approval = await tokenContract.approve(UniswapV2Router02Address, trade.inputAmount.raw.toString());
      await approval.wait();

      // Execute the swap transaction
      const tx = await signer.sendTransaction({
        to: UniswapV2Router02Address,
        data: swapCallData, // Encoded swap transaction data
      });
      await tx.wait();

      setStatus('Swap successful!');
    } catch (error) {
      console.error('Swap failed:', error);
      setStatus('Swap failed. Please try again.');
    }
  };

  const generateSwapCallData = async (amountIn, amountOutMin, path, to, deadline, provider) => {
    const UniswapV2Router02ABI = [
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) external returns (uint[] memory amounts)'
    ];

    const contract = new ethers.Contract(UniswapV2Router02Address, UniswapV2Router02ABI, provider);
    const swapCallData = await contract.populateTransaction.swapExactTokensForTokens(
      parseUnits(amountIn, 18),
      parseUnits(amountOutMin, 18),
      path,
      to,
      deadline
    );
    return swapCallData.data;
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
