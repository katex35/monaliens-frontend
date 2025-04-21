import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers, BrowserProvider, formatEther } from 'ethers';

// WalletContext - cüzdan bağlantısı, durum bilgisi ve işlemleri için Context oluşturuluyor
export const WalletContext = createContext(null);

// useWallet hook'u - bileşenlerde kolay kullanım için WalletContext'i wrap eder
export const useWallet = () => useContext(WalletContext);

// MONAD ağı için chain bilgileri
// Testnet RPC ve Chain ID bilgileri
const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz";
const MONAD_TESTNET_CHAIN_ID = 10143;

// WalletProvider - state ve fonksiyonları barındıran ana bileşen
export const WalletProvider = ({ children }) => {
  const [walletState, setWalletState] = useState({
    address: null,
    isConnected: false,
    balance: 0,
    network: 'Monad Testnet',
    connecting: false,
    error: null,
    provider: null,
    web3: null,
    chainId: null
  });

  // Web3 ve ethereum objelerinin varlığını kontrol eder
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        // MetaMask veya başka bir web3 cüzdanı var mı kontrol et
        if (window.ethereum) {
          // Kullanıcı daha önce bağlandıysa, adresini al
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length !== 0) {
            const provider = new BrowserProvider(window.ethereum);
            const web3 = new Web3(window.ethereum);
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const balance = await provider.getBalance(accounts[0]);
            
            setWalletState({
              address: accounts[0],
              isConnected: true,
              balance: formatEther(balance),
              network: getNetworkName(parseInt(chainId, 16)),
              connecting: false,
              error: null,
              provider,
              web3,
              chainId: parseInt(chainId, 16)
            });
          }
        } else {
          console.log("Ethereum objesi bulunamadı. MetaMask kurulu değil.");
        }
      } catch (error) {
        console.error("Wallet bağlantı hatası:", error);
      }
    };

    checkIfWalletIsConnected();

    // Cüzdan olaylarını dinle
    if (window.ethereum) {
      // Kullanıcı hesap değiştirdiğinde
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // Kullanıcı wallet'ı disconnect etti
          disconnectWallet();
        } else {
          // Kullanıcı hesap değiştirdi
          connectWallet();
        }
      });

      // Kullanıcı ağ değiştirdiğinde
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      // Temizlik işlevi: event listener'ları kaldır
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  // ChainID'ye göre ağ adını döndürür
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 10143:
        return 'Monad Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return `Unknown Network (${chainId})`;
    }
  };

  // MONAD Testnet ağına geçiş yap
  const switchToMonadTestnet = async () => {
    try {
      console.log('MONAD Testnet ağına geçiş deneniyor...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x279F' }], // 0x279F = 10143 (decimal)
      });
      console.log('MONAD Testnet ağına geçiş başarılı.');
      return true;
    } catch (switchError) {
      console.error('Ağ değiştirme hatası:', switchError);
      
      // Hata kodu 4902 - Ağ bilinmiyor, ekleyelim
      // Bunun yanında -32603 kod da görülebilir, MetaMask için bu da ağın bilinmediğini gösterir
      if (switchError.code === 4902 || 
          switchError.code === -32603 || 
          (switchError.data && switchError.data.originalError && 
           (switchError.data.originalError.code === 4902 || switchError.data.originalError.code === -32603))) {
        
        console.log('MONAD Testnet ağı bulunamadı, ekleniyor...');
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x279F', // 10143
                chainName: 'Monad Testnet',
                nativeCurrency: {
                  name: 'Monad',
                  symbol: 'MONAD',
                  decimals: 18,
                },
                rpcUrls: [MONAD_TESTNET_RPC],
                blockExplorerUrls: ['https://explorer.monad.xyz/testnet/'],
              },
            ],
          });
          console.log('MONAD Testnet ağı başarıyla eklendi.');
          return true;
        } catch (addError) {
          console.error('Ağ ekleme hatası:', addError);
          return false;
        }
      }
      
      // Kullanıcı red cevabı verdiyse
      if (switchError.code === 4001) {
        console.error('Kullanıcı ağ değişimini reddetti');
        return false;
      }
      
      console.error('Bilinmeyen ağ değiştirme hatası:', switchError);
      return false;
    }
  };

  // Cüzdan bağlantısını başlat
  const connectWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, connecting: true, error: null }));
      
      if (!window.ethereum) {
        throw new Error("MetaMask veya uyumlu bir cüzdan bulunamadı.");
      }
      
      // Kullanıcıdan cüzdan bağlantısı için izin iste
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("Cüzdan erişimi reddedildi.");
      }
      
      // Provider oluştur
      const provider = new BrowserProvider(window.ethereum);
      const web3 = new Web3(window.ethereum);
      
      // Mevcut chain ID al
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);
      
      console.log(`Bağlı zincir ID: ${currentChainId}, Beklenen: ${MONAD_TESTNET_CHAIN_ID}`);
      
      // Eğer MONAD Testnet'te değilse, geçiş yapmayı dene
      if (currentChainId !== MONAD_TESTNET_CHAIN_ID) {
        console.log(`Zincir değiştiriliyor: ${currentChainId} -> ${MONAD_TESTNET_CHAIN_ID}`);
        const switched = await switchToMonadTestnet();
        if (!switched) {
          throw new Error("MONAD Testnet ağına geçiş yapılamadı. Lütfen manuel olarak ağı ekleyin veya yeniden deneyin.");
        }
        // Zincir değiştiği için yeniden provider oluştur
        window.location.reload();
        return;
      }
      
      // Cüzdan bakiyesini al
      try {
        const balance = await provider.getBalance(accounts[0]);
        
        setWalletState({
          address: accounts[0],
          isConnected: true,
          balance: formatEther(balance),
          network: 'Monad Testnet',
          connecting: false,
          error: null,
          provider,
          web3,
          chainId: MONAD_TESTNET_CHAIN_ID
        });
      } catch (balanceError) {
        console.error('Bakiye alınırken hata:', balanceError);
        setWalletState({
          address: accounts[0],
          isConnected: true,
          balance: '0',
          network: 'Monad Testnet',
          connecting: false,
          error: 'Bakiye bilgisi alınamadı',
          provider,
          web3,
          chainId: MONAD_TESTNET_CHAIN_ID
        });
      }
    } catch (error) {
      console.error('Cüzdan bağlantı hatası:', error);
      setWalletState(prev => ({
        ...prev,
        connecting: false,
        error: error.message || 'Cüzdan bağlanamadı'
      }));
    }
  };

  // Cüzdan bağlantısını kes
  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      balance: 0,
      network: 'Monad Testnet',
      connecting: false,
      error: null,
      provider: null,
      web3: null,
      chainId: null
    });
  };

  // Context Provider değerleri
  const contextValue = {
    walletState,
    connectWallet,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider; 