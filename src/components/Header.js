import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="header-left">
        <img src="/monaliens.jpg" alt="Monaliens Logo" className="logo" />
        <h1>MONALIENS</h1>
      </div>
      
      <div className="header-center">
        <button className="nav-button">SPIN & WIN</button>
        <button className="nav-button">RAFFLE</button>
        <button className="nav-button">STAKE</button>
      </div>
      
      <div className="header-right">
        <button className="connect-wallet">CONNECT WALLET</button>
      </div>
    </header>
  );
};

export default Header; 