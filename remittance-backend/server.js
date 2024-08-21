const express = require('express');
const mongoose = require('mongoose');
const { ethers } = require('ethers');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/remittance', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  depositAddress: String,
  balance: Number,
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

// Generate a new deposit address
app.post('/generate-deposit-address', async (req, res) => {
  const { username } = req.body;

  // Generate a new Ethereum wallet (this is a simplified example; you'd typically use a wallet management service)
  const wallet = ethers.Wallet.createRandom();

  // Save user with generated deposit address
  const user = new User({
    username,
    depositAddress: wallet.address,
    balance: 0,
  });

  await user.save();

  res.json({ depositAddress: wallet.address });
});

// Monitor transactions (This would ideally be a background service)
const monitorTransactions = async () => {
  const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_API_KEY');

  const users = await User.find();

  users.forEach(async (user) => {
    const balance = await provider.getBalance(user.depositAddress);

    // If new balance is detected, update the user's balance
    if (parseFloat(ethers.utils.formatEther(balance)) > user.balance) {
      user.balance = parseFloat(ethers.utils.formatEther(balance));
      await user.save();

      console.log(`Updated balance for user ${user.username}: ${user.balance} ETH`);
    }
  });
};

// Run the transaction monitor every minute
setInterval(monitorTransactions, 60000);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
