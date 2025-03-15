import axios from 'axios';

// Base API URL - can be changed based on development or production environment
const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.monaliens.xyz';

// Magic Eden API endpoints
const MAGIC_EDEN_ACTIVITY_API_URL = 'https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/collections/activity/v6';
const MAGIC_EDEN_TOKENS_API_URL = 'https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/tokens/v7';

// Default collection address
const DEFAULT_COLLECTION_ADDRESS = '0xc5c9425d733b9f769593bd2814b6301916f91271';

// Create axios instance with general settings
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - for example token addition
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Terminate session on 401 error
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// NFT related API requests
export const nftService = {
  // Get all NFTs
  getNfts: async (params) => {
    try {
      const response = await apiClient.get('/nfts', { params });
      return response.data;
    } catch (error) {
      console.error('Error while fetching NFTs:', error);
      throw error;
    }
  },

  // Get a specific NFT
  getNftById: async (id) => {
    try {
      const response = await apiClient.get(`/nfts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error while fetching NFT ID: ${id}:`, error);
      throw error;
    }
  },

  // Get user's NFTs
  getUserNfts: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/nfts`);
      return response.data;
    } catch (error) {
      console.error(`Error while fetching NFTs for User ID: ${userId}:`, error);
      throw error;
    }
  },
  
  // Get NFTs from Magic Eden Tokens API
  getMagicEdenNfts: async (collectionAddress = DEFAULT_COLLECTION_ADDRESS) => {
    try {
      const response = await axios.get(MAGIC_EDEN_TOKENS_API_URL, {
        params: {
          includeQuantity: true,
          includeLastSale: true,
          excludeSpam: true,
          excludeBurnt: true,
          collection: collectionAddress,
          sortBy: 'floorAskPrice',
          sortDirection: 'asc',
          limit: 50,
          includeAttributes: false,
          'excludeSources[]': ['nftx.io', 'sudoswap.xyz']
        }
      });

      // Process response to extract NFTs
      if (response.data && response.data.tokens) {
        return response.data.tokens.map(item => {
          const token = item.token;
          const market = item.market;
          
          // Calculate price - use floor ask price if available, otherwise use last sale price
          let price = null;
          let priceSymbol = 'MON';
          
          if (market?.floorAsk?.price?.amount?.decimal) {
            price = market.floorAsk.price.amount.decimal;
            priceSymbol = market.floorAsk.price?.currency?.symbol || 'MON';
          } else if (token.lastSale?.price?.amount?.decimal) {
            price = token.lastSale.price.amount.decimal;
            priceSymbol = token.lastSale.price?.currency?.symbol || 'MON';
          } else if (token.collection?.floorAskPrice?.amount?.decimal) {
            // Use collection floor price as fallback
            price = token.collection.floorAskPrice.amount.decimal;
            priceSymbol = token.collection.floorAskPrice?.currency?.symbol || 'MON';
          }
          
          return {
            id: token.tokenId,
            name: token.name || `NFT #${token.tokenId}`,
            image: token.image || token.imageLarge || token.imageSmall,
            price: price,
            priceSymbol: priceSymbol,
            rarityRank: token.rarityRank,
            rarity: token.rarity,
            collection: {
              name: token.collection?.name || 'Unknown Collection',
              image: token.collection?.image,
              symbol: token.collection?.symbol,
              floorPrice: token.collection?.floorAskPrice?.amount?.decimal
            },
            creator: token.collection?.creator,
            owner: token.owner,
            contract: token.contract,
            tokenId: token.tokenId,
            kind: token.kind,
            supply: token.supply,
            chainId: token.chainId,
            mintedAt: token.mintedAt,
            createdAt: token.createdAt,
            category: token.rarityRank < 100 ? 'legendary' : 
                      token.rarityRank < 300 ? 'epic' : 
                      token.rarityRank < 600 ? 'rare' : 'common',
            attributes: []  // No attributes in this endpoint, would need another call if needed
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching NFTs from Magic Eden:', error);
      throw error;
    }
  },
  
  // Get NFTs from Magic Eden Activity API (old method)
  getMagicEdenActivities: async (collectionAddress) => {
    try {
      const response = await axios.get(MAGIC_EDEN_ACTIVITY_API_URL, { 
        params: { 
          collection: collectionAddress || DEFAULT_COLLECTION_ADDRESS
        } 
      });
      
      // Process response to extract unique NFTs
      if (response.data && response.data.activities) {
        const activities = response.data.activities;
        const uniqueNfts = {};
        
        // Process activities to extract unique NFTs based on tokenId
        activities.forEach(activity => {
          if (activity.token && !uniqueNfts[activity.token.tokenId]) {
            uniqueNfts[activity.token.tokenId] = {
              id: activity.token.tokenId,
              name: activity.token.tokenName,
              image: activity.token.tokenImage,
              price: activity.price?.amount?.decimal || 0,
              priceSymbol: activity.price?.currency?.symbol || 'MON',
              creator: activity.fromAddress,
              rarityRank: activity.token.rarityRank,
              collectionName: activity.collection?.collectionName,
              collectionImage: activity.collection?.collectionImage,
              type: activity.type,
              category: activity.token.rarityRank < 100 ? 'legendary' : 
                        activity.token.rarityRank < 300 ? 'epic' : 
                        activity.token.rarityRank < 600 ? 'rare' : 'common'
            };
          }
        });
        
        // Convert to array
        return Object.values(uniqueNfts);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching NFT activities from Magic Eden:', error);
      throw error;
    }
  }
};

// User authentication services
export const authService = {
  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error while logging in:', error);
      throw error;
    }
  },

  // User logout
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error while registering:', error);
      throw error;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error while fetching user info:', error);
      throw error;
    }
  },
};

// Staking related services
export const stakingService = {
  // Get staked NFTs
  getStakedNfts: async () => {
    try {
      const response = await apiClient.get('/staking/nfts');
      return response.data;
    } catch (error) {
      console.error('Error while fetching staked NFTs:', error);
      throw error;
    }
  },

  // Stake NFT
  stakeNft: async (nftId) => {
    try {
      const response = await apiClient.post('/staking/stake', { nftId });
      return response.data;
    } catch (error) {
      console.error(`Error while staking NFT ID: ${nftId}:`, error);
      throw error;
    }
  },

  // Unstake NFT
  unstakeNft: async (nftId) => {
    try {
      const response = await apiClient.post('/staking/unstake', { nftId });
      return response.data;
    } catch (error) {
      console.error(`Error while unstaking NFT ID: ${nftId}:`, error);
      throw error;
    }
  },

  // View rewards
  getRewards: async () => {
    try {
      const response = await apiClient.get('/staking/rewards');
      return response.data;
    } catch (error) {
      console.error('Error while fetching rewards:', error);
      throw error;
    }
  },
};

export default {
  nftService,
  authService,
  stakingService,
}; 