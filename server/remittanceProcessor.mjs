import StellarSdk from 'stellar-sdk'; // Import the SDK
import fetch from 'node-fetch'; // Remove if using Node.js 18+

const { Keypair, TransactionBuilder, Networks, StellarTomlResolver } = StellarSdk;

// Function to create a Stellar account and fund it using Friendbot
export const createStellarAccount = async () => {
  const pair = Keypair.random();  // Create a new key pair
  console.log('Public Key:', pair.publicKey());
  console.log('Secret Key:', pair.secret());

  try {
    // Use Friendbot to fund the testnet account
    const response = await fetch(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
    const responseJSON = await response.json();
    console.log('Account funded:', responseJSON);
    
    return {
      publicKey: pair.publicKey(),
      secret: pair.secret(),
    };
  } catch (error) {
    console.error('Error funding account:', error);
    throw error;
  }
};

// SEP-10 Authentication (Web Authentication)
export const authenticateWithAnchor = async (homeDomain, publicKey, secretKey) => {
  const toml = await StellarTomlResolver.resolve(homeDomain);
  const webAuthEndpoint = toml.WEB_AUTH_ENDPOINT;

  const challengeResponse = await fetch(`${webAuthEndpoint}?account=${publicKey}`);
  const challengeJson = await challengeResponse.json();

  const keypair = Keypair.fromSecret(secretKey);
  const transaction = new TransactionBuilder.fromXDR(challengeJson.transaction, Networks.TESTNET);
  transaction.sign(keypair);

  const tokenResponse = await fetch(webAuthEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction: transaction.toEnvelope().toXDR('base64') }),
  });

  const tokenJson = await tokenResponse.json();
  return tokenJson.token;
};

// Initiate a cross-border payment (SEP-0031)
export const initiateCrossBorderPayment = async (sendingAnchorDomain, jwtToken, amount, assetCode, assetIssuer, senderId, receiverId) => {
  const toml = await StellarTomlResolver.resolve(sendingAnchorDomain);
  const transferServer = toml.DIRECT_PAYMENT_SERVER;

  const transactionRequest = {
    amount,
    asset_code: assetCode,
    asset_issuer: assetIssuer,
    sender_id: senderId,
    receiver_id: receiverId,
  };

  const response = await fetch(`${transferServer}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(transactionRequest),
  });

  const result = await response.json();
  return result;
};

// SEP-12: Register or Update Customer Information
export const registerCustomer = async (sendingAnchorDomain, jwtToken, customerInfo) => {
    try {
      const toml = await StellarTomlResolver.resolve(sendingAnchorDomain);
      if (!toml) {
        throw new Error('Failed to resolve TOML for the sending anchor domain');
      }
      const kycServer = toml.KYC_SERVER;
      if (!kycServer) {
        throw new Error('KYC_SERVER not found in the TOML file');
      }
  
      const response = await fetch(`${kycServer}/customer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(customerInfo),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (!result.id) {
        throw new Error('Customer ID not returned from the server');
      }
      return result.id;
    } catch (error) {
      console.error('Error in registerCustomer:', error);
      throw error;
    }
  };

// SEP-12: Fetch Customer Information
export const getCustomerStatus = async (sendingAnchorDomain, jwtToken, customerId) => {
  const toml = await StellarTomlResolver.resolve(sendingAnchorDomain);
  const kycServer = toml.KYC_SERVER;

  const response = await fetch(`${kycServer}/customer?id=${customerId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  });

  const result = await response.json();
  return result.status;
};

// SEP-38: Request a quote for asset conversion
export const requestQuote = async (sendingAnchorDomain, jwtToken, sellAsset, buyAsset, sellAmount) => {
  const toml = await StellarTomlResolver.resolve(sendingAnchorDomain);
  const quoteServer = toml.ANCHOR_QUOTE_SERVER;

  const quoteRequest = {
    sell_asset: sellAsset,
    buy_asset: buyAsset,
    sell_amount: sellAmount,
  };

  const response = await fetch(`${quoteServer}/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(quoteRequest),
  });

  const result = await response.json();
  return result;
};
