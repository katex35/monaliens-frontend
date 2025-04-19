import React from 'react';
import './MagicEdenCard.css';

const MagicEdenCard = () => {
  return (
    <a 
      href="https://magiceden.io" 
      target="_blank" 
      rel="noreferrer" 
      className="group magic-eden-card"
    >
      <img 
        src="/magiceden.png" 
        alt="Magic Eden Logo" 
        className="magic-eden-logo"
      />
      <div className="text-container">
        <p className="buy-text">Buy now on</p>
        <p className="platform-text">Magic Eden</p>
      </div>
    </a>
  );
};

export default MagicEdenCard; 