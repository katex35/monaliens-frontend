import React from 'react';
import './NFTScroll.css';

const NFTScroll = () => {
  return (
    <div className="nft-scroll">
      <div className="scroll-container">
        <div className="scroll-content">
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <img src="/nft2.png" alt="NFT 2" />
              <img src="/nft3.png" alt="NFT 3" />
            </React.Fragment>
          ))}
        </div>
        <div className="scroll-content" aria-hidden="true">
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <img src="/nft2.png" alt="NFT 2" />
              <img src="/nft3.png" alt="NFT 3" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NFTScroll; 