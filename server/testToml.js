import { StellarTomlResolver } from 'stellar-sdk';
import fetch from 'node-fetch'; // Remove if using Node.js 18+

(async () => {
  try {
    const homeDomain = 'testanchor.stellar.org';
    const toml = await StellarTomlResolver.resolve(homeDomain);
    console.log('Stellar TOML:', toml);
  } catch (error) {
    console.error('Error resolving Stellar TOML:', error);
  }
})();
