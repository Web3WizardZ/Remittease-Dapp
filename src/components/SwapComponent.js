import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Fetcher, Trade, Route, TokenAmount, TradeType } from '@uniswap/sdk';
import { parseUnits } from '@ethersproject/units';

// Uniswap V2 Router address on Ethereum mainnet
const UniswapV2Router02Address = '0x7a250d5630b4cf539739df2c5dacabdb9caa73a3';

const SwapComponent = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSwap = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenInAddress = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'; // Replace with actual token address
      const tokenOutAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Replace with actual token address

      // Fetch token data
      const tokenIn = await Fetcher.fetchTokenData(1, tokenInAddress, provider); // Chain ID 1 is Ethereum mainnet
      const tokenOut = await Fetcher.fetchTokenData(1, tokenOutAddress, provider);

      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut, provider);
      const route = new Route([pair], tokenIn);

      const trade = new Trade(route, new TokenAmount(tokenIn, parseUnits(inputAmount, tokenIn.decimals)), TradeType.EXACT_INPUT);

      // Generate swap call data
      const swapCallData = await generateSwapCallData(
        inputAmount,
        outputAmount,
        [tokenInAddress, tokenOutAddress],
        await signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 20,
        provider // Pass provider here
      );

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

  const generateSwapCallData = async (amountIn, amountOutMin, path, to, deadline, provider) => {
    const UniswapV2Router02ABI = [
        [
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
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
