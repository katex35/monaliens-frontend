import React from 'react';
import './NFTStats.css';

const NFTStats = () => {
  return (
    <div className="nft-stats-container">
      <div className="nft-stats">
        <div className="nft-stats-left">
          <h2>NFT STATS</h2>
        </div>
        
        <div className="nft-stats-center">
          <div className="stat-item">
            <span>FLOOR PRICE: </span>
            <span className="value">12 <img src="/monad.png" alt="Monad" /> (+100%)</span>
          </div>
          <div className="stat-item">
            <span>MINTED: </span>
            <span className="value">3333/3333</span>
          </div>
          <div className="stat-item">
            <span>TOP BID: </span>
            <span className="value">10 <img src="/monad.png" alt="Monad" /></span>
          </div>
        </div>
        
        <div className="nft-stats-right">
          <button className="click-to-buy">CLICK TO BUY</button>
        </div>
      </div>
    </div>
  );
};

export default NFTStats; 