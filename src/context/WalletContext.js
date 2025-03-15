import React, { createContext, useContext, useState, useEffect } from 'react';
import walletService from '../services/walletService';

// Create wallet context
const WalletContext = createContext();

/**
 * Wallet provider component to manage wallet state
 * @param {Object} props Component props
 */
export const WalletProvider = ({ children }) => {
  const [walletState, setWalletState] = useState({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Initialize wallet state
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check if wallet was previously connected
      if (localStorage.getItem('walletConnected') === 'true') {
        await connectWallet();
      }
    };

    checkWalletConnection();
  }, []);

  /**
   * Connect to wallet
   */
  const connectWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      const result = await walletService.connectWallet();
      
      setWalletState({
        address: result.address,
        chainId: result.chainId,
        isConnected: result.isConnected,
        isConnecting: false,
        error: null
      });
      
      // Save connection state to localStorage
      localStorage.setItem('walletConnected', 'true');
      
      // Check if we need to switch to MONAD network
      if (result.chainId !== 32769) { // 32769 is the decimal value of 0x8001 (MONAD chain ID)
        await switchToMonadNetwork();
      }
      
      return result;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletState({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      });
      
      localStorage.removeItem('walletConnected');
      throw error;
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    walletService.disconnectWallet();
    
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    
    localStorage.removeItem('walletConnected');
  };

  /**
   * Switch to MONAD network
   */
  const switchToMonadNetwork = async () => {
    try {
      const success = await walletService.switchToMonadNetwork();
      if (success) {
        const status = walletService.getWalletStatus();
        setWalletState(prev => ({
          ...prev,
          chainId: status.chainId
        }));
      }
      return success;
    } catch (error) {
      console.error('Failed to switch to MONAD network:', error);
      return false;
    }
  };

  /**
   * Format wallet address for display
   * @param {string} address The full wallet address
   * @returns {string} Shortened address (e.g. 0x1234...5678)
   */
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Context value
  const value = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToMonadNetwork,
    formatAddress
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Custom hook to use wallet context
 * @returns {Object} Wallet context value
 */
export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};

export default WalletContext; 