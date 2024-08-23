import React, { useState } from 'react';
import { ethers } from 'ethers';  // Correct import for ethers
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { Percent, CurrencyAmount } from '@uniswap/sdk-core';
import ERC20ABI from '../abis/ERC20ABI.json';

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');

  const UniswapV2Router02Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap Router address on Ethereum Mainnet

  const handleSwap = async () => {
    try {
      if (!window.ethereum) {
        setStatus('Please connect to a wallet.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tokenInAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
      const tokenOutAddress = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'; // USDT

      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20ABI, signer);
      const amountIn = ethers.utils.parseUnits(inputAmount, 6);

      const approval = await tokenInContract.approve(UniswapV2Router02Address, amountIn);
      await approval.wait();

      const router = new AlphaRouter({ chainId: 1, provider });

      const route = await router.route(
        CurrencyAmount.fromRawAmount(tokenInAddress, amountIn.toString()),
        tokenOutAddress,
        SwapType.SWAP_ROUTER_02,
        {
          recipient: await signer.getAddress(),
          slippageTolerance: new Percent(50, 10000),
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        }
      );

      if (!route || !route.methodParameters) {
        setStatus('Failed to get route.');
        return;
      }

      const tx = await signer.sendTransaction({
        to: UniswapV2Router02Address,
        data: route.methodParameters.calldata,
        value: route.methodParameters.value,
        gasLimit: ethers.BigNumber.from(300000),
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
