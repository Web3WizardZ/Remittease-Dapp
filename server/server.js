import express from 'express';
import {
  createStellarAccount,
  authenticateWithAnchor,
  initiateCrossBorderPayment,
  registerCustomer,  // Only import this function
  getCustomerStatus,
  requestQuote
} from './remittanceProcessor.mjs';

const app = express();
app.use(express.json());

// Endpoint: Create Stellar Account
app.post('/create-account', async (req, res) => {
  try {
    const account = await createStellarAccount();
    res.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Account creation failed.', error: error.message });
  }
});

// Endpoint: Initiate Remittance (Cross-Border Payment)
app.post('/remit-fiat', async (req, res) => {
  const { amount, assetCode, assetIssuer, senderId, receiverId, homeDomain, senderPublicKey, senderSecret } = req.body;

  try {
    // Step 1: Authenticate with the Receiving Anchor (SEP-10)
    const jwtToken = await authenticateWithAnchor(homeDomain, senderPublicKey, senderSecret);

    // Step 2: Initiate the payment
    const paymentResult = await initiateCrossBorderPayment(homeDomain, jwtToken, amount, assetCode, assetIssuer, senderId, receiverId);
    
    res.json({ paymentResult });
  } catch (error) {
    console.error('Error during remittance:', error);
    res.status(500).json({ message: 'Remittance failed.', error: error.message });
  }
});

// Endpoint: Register Customer (SEP-12)
app.post('/register-customer', async (req, res) => {
  const { customerInfo, homeDomain, senderPublicKey, senderSecret } = req.body;

  try {
    // Step 1: Authenticate with the Anchor (SEP-10)
    const jwtToken = await authenticateWithAnchor(homeDomain, senderPublicKey, senderSecret);

    // Step 2: Register the customer
    const customerId = await registerCustomer(homeDomain, jwtToken, customerInfo);
    
    res.json({ customerId });
  } catch (error) {
    console.error('Error registering customer:', error);
    res.status(500).json({ message: 'Customer registration failed.', error: error.message });
  }
});

// Endpoint: Request a Quote (SEP-38)
app.post('/request-quote', async (req, res) => {
  const { sellAsset, buyAsset, sellAmount, homeDomain, senderPublicKey, senderSecret } = req.body;

  try {
    // Step 1: Authenticate with the Anchor (SEP-10)
    const jwtToken = await authenticateWithAnchor(homeDomain, senderPublicKey, senderSecret);

    // Step 2: Request a quote for asset conversion
    const quote = await requestQuote(homeDomain, jwtToken, sellAsset, buyAsset, sellAmount);
    
    res.json({ quote });
  } catch (error) {
    console.error('Error requesting quote:', error);
    res.status(500).json({ message: 'Quote request failed.', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
