import React from 'react';
import './WalletModal.css';

const WalletModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="wallet-modal-header">
          <h2>Cüzdan Bağlantısı Gerekiyor</h2>
        </div>
        
        <div className="wallet-modal-content">
          <p>Bu işlemi gerçekleştirmek için bir web3 cüzdanı bağlamanız gerekmektedir.</p>
          
          <div className="wallet-section">
            <h3>Web3 Cüzdanınız yok mu?</h3>
            <p>MONAD blockchain'i ile etkileşim kurmak için bir web3 cüzdanı kurmanız gerekiyor:</p>
            
            <div className="wallet-options">
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="wallet-option">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" />
                <span>MetaMask</span>
              </a>
              
              <a href="https://wallet.coinbase.com/" target="_blank" rel="noopener noreferrer" className="wallet-option">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg" alt="Coinbase Wallet" />
                <span>Coinbase Wallet</span>
              </a>
            </div>
          </div>
          
          <div className="network-section">
            <h3>MONAD Ağını Ekleyin</h3>
            <p>Wallet bağlandıktan sonra MONAD Testnet ağına geçiş yapmanız gerekebilir.</p>
            <p>Eğer cüzdan uygulaması izin isterse, uygulamamızın <strong>MONAD Testnet</strong> ağını cüzdanınıza eklemesine izin verin.</p>
            
            <div className="network-info">
              <div className="network-item">
                <strong>Ağ Adı:</strong> Monad Testnet
              </div>
              <div className="network-item">
                <strong>RPC URL:</strong> https://testnet-rpc.monad.xyz
              </div>
              <div className="network-item">
                <strong>Chain ID:</strong> 10143
              </div>
              <div className="network-item">
                <strong>Para Birimi Sembolü:</strong> MONAD
              </div>
              <div className="network-item">
                <strong>Block Explorer:</strong> https://explorer.monad.xyz/testnet/
              </div>
            </div>
          </div>
          
          <button className="connect-wallet-button" onClick={onClose}>
            Anladım, Şimdi Cüzdan Bağla
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal; 