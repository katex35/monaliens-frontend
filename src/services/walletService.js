import { ethers } from 'ethers';

/**
 * Cüzdan bağlantısı ve EVM işlemleri için servis
 */
class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    
    // MONAD ağı için gerekli bilgiler
    this.MONAD_CHAIN_ID = '0x8001'; // MONAD Chain ID (32769)
    this.MONAD_CHAIN_ID_DECIMAL = 32769;
    this.MONAD_NETWORK_INFO = {
      chainId: this.MONAD_CHAIN_ID,
      chainName: 'MONAD Mainnet',
      nativeCurrency: {
        name: 'MONAD',
        symbol: 'MON',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.monad.xyz/'],
      blockExplorerUrls: ['https://explorer.monad.xyz/'],
    };
    
    // Event listeners ekle
    if (window.ethereum) {
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
    }
  }
  
  /**
   * Zincir değişikliklerini dinle
   * @param {string} chainId Yeni zincir ID
   */
  handleChainChanged(chainId) {
    console.log('Chain changed to:', chainId);
    window.location.reload();
  }
  
  /**
   * Hesap değişikliklerini dinle
   * @param {Array} accounts Hesap adresleri
   */
  handleAccountsChanged(accounts) {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      this.disconnectWallet();
    }
  }
  
  /**
   * Bağlantı kesilme olayı
   */
  handleDisconnect() {
    console.log('Wallet disconnected');
    this.disconnectWallet();
  }

  /**
   * Cüzdan bağlantısını kontrol et
   * @returns {Object} Bağlantı durumu objesi
   */
  getWalletStatus() {
    const isConnected = !!this.signer;
    let address = null;
    let chainId = null;

    if (this.signer) {
      address = this.signer.address;
      chainId = this.provider?.network?.chainId;
    }

    return {
      isConnected,
      address,
      chainId
    };
  }

  /**
   * Cüzdana bağlan
   * @returns {Promise<Object>} Bağlantı sonucunu içeren promise
   */
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask or any other Web3 provider not detected');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Hesap erişimi iste
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Signer'ı al
      this.signer = await this.provider.getSigner();
      
      // Bağlı olduğumuz ağı kontrol et
      const network = await this.provider.getNetwork();
      
      // Ağ MONAD değilse otomatik geçiş için sor
      if (network.chainId !== this.MONAD_CHAIN_ID_DECIMAL) {
        try {
          await this.switchToMonadNetwork();
          // MONAD ağına geçişin ardından network bilgisini güncelle
          const updatedNetwork = await this.provider.getNetwork();
          return {
            address: accounts[0],
            chainId: updatedNetwork.chainId,
            isConnected: true
          };
        } catch (switchError) {
          console.warn('Could not switch to MONAD network automatically', switchError);
          // Başarısız olsa bile bağlantıyı koru
        }
      }
      
      return {
        address: accounts[0],
        chainId: network.chainId,
        isConnected: true
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  /**
   * Cüzdan bağlantısını kes
   */
  disconnectWallet() {
    this.provider = null;
    this.signer = null;
  }

  /**
   * MONAD ağına geç
   * @returns {Promise<boolean>} İşlem başarılı ise true döner
   */
  async switchToMonadNetwork() {
    if (!window.ethereum) return false;
    
    try {
      // MONAD ağına geçmeyi dene
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.MONAD_CHAIN_ID }],
      });
      
      // Provider'ı ve Signer'ı yeniden yapılandır
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      return true;
    } catch (error) {
      // Ağ bulunamadıysa, eklemeyi dene (4902 error code)
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [this.MONAD_NETWORK_INFO],
          });
          
          // Provider'ı ve Signer'ı yeniden yapılandır
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
          
          return true;
        } catch (addError) {
          console.error('Failed to add MONAD network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch network:', error);
        throw error;
      }
    }
  }

  /**
   * Transaction gönder
   * @param {string} to Hedef adres
   * @param {string} value Wei cinsinden değer
   * @returns {Promise<ethers.TransactionResponse>} Transaction response
   */
  async sendTransaction(to, value) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    // Önce doğru ağda olduğumuzu kontrol et
    const network = await this.provider.getNetwork();
    if (network.chainId !== this.MONAD_CHAIN_ID_DECIMAL) {
      await this.switchToMonadNetwork();
    }

    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(value)
    });

    return tx;
  }

  /**
   * NFT koleksiyonu için okuma işlemleri
   * @param {string} contractAddress Kontrat adresi
   * @param {string} abi Kontrat ABI'si
   * @returns {ethers.Contract} Salt okunabilir kontrat
   */
  getReadOnlyContract(contractAddress, abi) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return new ethers.Contract(contractAddress, abi, this.provider);
  }

  /**
   * NFT koleksiyonu için yazma işlemleri
   * @param {string} contractAddress Kontrat adresi
   * @param {string} abi Kontrat ABI'si
   * @returns {ethers.Contract} Yazılabilir kontrat
   */
  getWritableContract(contractAddress, abi) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return new ethers.Contract(contractAddress, abi, this.signer);
  }
  
  /**
   * Cüzdan doğru ağda mı kontrol et
   * @returns {Promise<boolean>} Doğru ağda ise true
   */
  async isOnCorrectNetwork() {
    if (!this.provider) return false;
    
    const network = await this.provider.getNetwork();
    return network.chainId === this.MONAD_CHAIN_ID_DECIMAL;
  }
}

export default new WalletService(); 