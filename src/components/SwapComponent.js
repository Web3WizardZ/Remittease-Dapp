import React, { useState } from 'react';
import { ethers } from 'ethers';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { Percent, CurrencyAmount } from '@uniswap/sdk-core';
import ERC20ABI from '../abis/ERC20ABI.json';

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const UniswapV2Router02Address = process.env.REACT_APP_UNISWAP_ROUTER_ADDRESS;

  const handleSwap = async () => {
    if (!inputAmount || isNaN(parseFloat(inputAmount))) {
      setStatus('Please enter a valid input amount.');
      return;
    }

    setIsLoading(true);
    setStatus('Initiating swap...');

    try {
      if (!window.ethereum) {
        throw new Error('Please connect to a wallet.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tokenInAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
      const tokenOutAddress = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'; // USDT

      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20ABI, signer);
      const amountIn = ethers.utils.parseUnits(inputAmount, 6);

      setStatus('Approving token spend...');
      const approval = await tokenInContract.approve(UniswapV2Router02Address, amountIn);
      await approval.wait();

      setStatus('Finding best swap route...');
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
        throw new Error('Failed to get route.');
      }

      setStatus('Executing swap...');
      const tx = await signer.sendTransaction({
        to: UniswapV2Router02Address,
        data: route.methodParameters.calldata,
        value: route.methodParameters.value,
        gasLimit: ethers.BigNumber.from(300000),
      });
      
      setStatus('Waiting for transaction confirmation...');
      const receipt = await tx.wait();

      setOutputAmount(ethers.utils.formatUnits(route.quote.toFixed(), 6));
      setStatus(`Swap successful! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Swap failed:', error);
      setStatus(`Swap failed: ${error.message}`);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Output Amount USDT"
        value={outputAmount}
        disabled
      />
      <button onClick={handleSwap} disabled={isLoading}>
        {isLoading ? 'Swapping...' : 'Swap'}
      </button>
      <p>{status}</p>
    </div>
  );
};

export default SwapComponent;