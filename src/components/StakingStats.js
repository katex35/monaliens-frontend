import React from 'react';
import './StakingStats.css';

const StakingStats = () => {
  return (
    <div className="staking-stats-container">
      <div className="staking-stats-header">
        <div className="free-spins">
          STAKING WILL GIVE YOU FREE SPINS!
        </div>
        <h2 className="staking-title">STAKING STATS</h2>
        <button className="wanna-stake">WANNA STAKE?</button>
      </div>
      
      <div className="staking-stats-content">
        <div className="stat-box">
          <h4>% OF MONOALIENS STAKED</h4>
          <span>50%</span>
        </div>
        <div className="stat-box">
          <h4>STAKED AMOUNT OF MONOALIENS</h4>
          <span>1630</span>
        </div>
        <div className="stat-box">
          <h4>TOTAL LOCKED VALUE</h4>
          <span>$15,000</span>
        </div>
      </div>
    </div>
  );
};

export default StakingStats; 