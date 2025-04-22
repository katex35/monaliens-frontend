import React from 'react';
import MagicEdenCard from './MagicEdenCard';
import NFTScroll from './NFTScroll';
import NFTStats from './NFTStats';
import About from './About';
import StakingStats from './StakingStats';

const HomePage = () => {
  return (
    <>
      <div className="first-page">
        <div 
          data-us-project="MdCXQQFs4xkeVlwhrGKV" 
          style={{width: "100vw", height: "100vh"}}
        />
        <MagicEdenCard />
        <NFTScroll />
      </div>
      <div className="second-page">
        <div 
          data-us-project="az8Fz0DbSJR8dREhGlUY" 
          className="background-animation"
        />
        <NFTStats />
        <About />
        <StakingStats />
      </div>
    </>
  );
};

export default HomePage; 