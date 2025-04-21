import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import WalletModal from './WalletModal';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { walletState, connectWallet, disconnectWallet } = useWallet();
  const { isConnected, connecting, address, network, error } = walletState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  // Hata mesajı geldiğinde göster ve 10 saniye sonra gizle
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 10000); // 10 saniye sonra hata mesajını gizle
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleWalletAction = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      // Web3 cüzdanı var mı kontrol et
      if (window.ethereum) {
        connectWallet();
      } else {
        // Web3 cüzdanı yoksa modal göster
        setIsModalOpen(true);
      }
    }
  };

  // Kısaltılmış cüzdan adresi
  const shortenAddress = (addr) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  return (
    <>
      <header>
        <div className="header-left">
          <Link to="/">
            <img src="/monaliens.jpg" alt="Monaliens Logo" className="logo" />
            <h1>MONALIENS</h1>
          </Link>
        </div>
        
        <div className="header-center">
          <button className="nav-button" onClick={() => navigate('/spin')}>SPIN & WIN</button>
          <button className="nav-button">RAFFLE</button>
          <button className="nav-button">STAKE</button>
        </div>
        
        <div className="header-right">
          {isConnected && (
            <div className="network-indicator">
              <span className="network-dot"></span>
              {network}
            </div>
          )}
          <button 
            className={`connect-wallet ${isConnected ? 'connected' : ''}`} 
            onClick={handleWalletAction}
            disabled={connecting}
          >
            {connecting 
              ? 'BAĞLANIYOR...' 
              : isConnected 
                ? shortenAddress(address)
                : 'CONNECT WALLET'
            }
          </button>
        </div>
      </header>

      {/* Cüzdan bilgi modalı */}
      <WalletModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (window.ethereum) connectWallet(); 
        }}
      />

      {/* Hata mesajı */}
      {error && showError && (
        <div className="wallet-error" onClick={() => setShowError(false)}>
          <span className="error-message">{error}</span>
          <span className="error-close">×</span>
        </div>
      )}
    </>
  );
};

export default Header; 