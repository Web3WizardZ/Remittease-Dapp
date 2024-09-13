import fetch from 'node-fetch';

// Function to fetch anchor info (already exists)
export const fetchAnchorInfo = async () => {
    try {
        const anchorDomain = 'example-anchor.com'; // Replace with actual anchor's domain
        const response = await fetch(`https://${anchorDomain}/.well-known/stellar.toml`);
        const anchorInfo = await response.text();
        console.log(anchorInfo);
        return anchorInfo;
    } catch (error) {
        console.error('Error fetching anchor info:', error);
        throw error;
    }
};

// Function to initiate a deposit to the Stellar anchor
export const initiateAnchorDeposit = async (amount, currency, userPublicKey) => { 
    const anchorDomain = 'example-anchor.com'; // Replace with the actual anchor's domain
    const depositEndpoint = `https://${anchorDomain}/deposit`; // Anchor's deposit endpoint

    const depositRequestBody = {
        asset_code: currency,
        account: userPublicKey,
        amount: amount,
        memo: 'YourMemoHere' // Optional
    };

    try {
        const response = await fetch(depositEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(depositRequestBody)
        });

        const depositResponse = await response.json();
        console.log('Deposit initiated:', depositResponse);

        // The response usually includes instructions to complete the deposit (e.g., bank transfer details).
        return depositResponse;
    } catch (error) {
        console.error('Error initiating deposit:', error);
        throw error;
    }
};

// Function to initiate a withdrawal from the Stellar anchor
export const initiateAnchorWithdrawal = async (amount, currency, userPublicKey) => {
    const anchorDomain = 'example-anchor.com'; // Replace with the actual anchor's domain
    const withdrawalEndpoint = `https://${anchorDomain}/withdraw`; // Anchor's withdrawal endpoint

    const withdrawalRequestBody = {
        asset_code: currency,
        account: userPublicKey,
        amount: amount,
        memo: 'YourMemoHere' // Optional
    };

    try {
        const response = await fetch(withdrawalEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(withdrawalRequestBody)
        });

        const withdrawalResponse = await response.json();
        console.log('Withdrawal initiated:', withdrawalResponse);

        // The response usually includes instructions to complete the withdrawal (e.g., bank transfer details).
        return withdrawalResponse;
    } catch (error) {
        console.error('Error initiating withdrawal:', error);
        throw error;
    }
};
