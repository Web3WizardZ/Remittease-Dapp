import React from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ transactions, address }) => {
  return (
    <div className="transaction-history">
      {transactions.length === 0 ? (
        <p>No recent transactions.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx) => (
            <li key={tx.hash} className="transaction-item">
              <p>
                <strong>Hash:</strong>{' '}
                <a
                  href={`https://etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.hash.substring(0, 20)}...
                </a>
              </p>
              <p>
                <strong>From:</strong>{' '}
                {tx.from.toLowerCase() === address.toLowerCase()
                  ? 'You'
                  : tx.from.substring(0, 20) + '...'}
              </p>
              <p>
                <strong>To:</strong>{' '}
                {tx.to.toLowerCase() === address.toLowerCase()
                  ? 'You'
                  : tx.to.substring(0, 20) + '...'}
              </p>
              <p>
                <strong>Value:</strong> {utils.formatEther(tx.value)} ETH
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
