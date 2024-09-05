import { ethers } from 'ethers';
import { computePoolAddress } from '@uniswap/v3-sdk';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export const getSwapQuote = async (provider, tokenIn, tokenOut, amountIn, fee) => {
  const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, Quoter.abi, provider);

  const poolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: fee,
  });

  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider);

  const [token0, token1, poolFee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  const amountOut = await quoterContract.callStatic.quoteExactInputSingle(
    token0,
    token1,
    poolFee,
    ethers.utils.parseUnits(amountIn.toString(), tokenIn.decimals),
    0
  );

  return ethers.utils.formatUnits(amountOut, tokenOut.decimals);
};
