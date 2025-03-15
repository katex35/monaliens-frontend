import axios from 'axios';

/**
 * Service class for API requests
 */
class ApiService {
  constructor() {
    // Magic Eden API endpoints
    this.MAGIC_EDEN_ACTIVITY_API_URL = 'https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/collections/activity/v6';
    this.MAGIC_EDEN_TOKENS_API_URL = 'https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/tokens/v7';
    
    // Default collection address
    this.DEFAULT_COLLECTION_ADDRESS = '0xae280ca8dfaaf852b0af828cd72391ce7874fbb6';
    
    // Mock data mode - we're now using real API data
    this.mockData = false;
  }

  /**
   * Get NFTs for the specified page in the NFT collection
   * @param {string} collectionAddress Collection address
   * @param {number} page Page number
   * @param {number} pageSize Number of NFTs per page
   * @param {Object} filters Filtering criteria
   * @returns {Promise<Object>} NFT list and metadata
   */
  async getNfts(collectionAddress = this.DEFAULT_COLLECTION_ADDRESS, page = 1, pageSize = 20, filters = {}) {
    if (this.mockData) {
      // Return mock data
      return this._getMockNfts(page, pageSize, filters);
    }
    
    try {
      // Get NFTs from Magic Eden Tokens API
      const response = await axios.get(this.MAGIC_EDEN_TOKENS_API_URL, {
        params: {
          includeQuantity: true,
          includeLastSale: true,
          excludeSpam: true,
          excludeBurnt: true,
          collection: collectionAddress,
          sortBy: 'floorAskPrice',
          sortDirection: 'asc',
          limit: pageSize,
          includeAttributes: true,
          'excludeSources[]': ['nftx.io', 'sudoswap.xyz']
        }
      });
      
      // Process API response and return formatted NFTs
      if (response.data && response.data.tokens) {
        const nfts = response.data.tokens.map(item => {
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
          }
          
          // Format attributes
          const attributes = token.attributes ? token.attributes.map(attr => ({
            trait_type: attr.key,
            value: attr.value,
            rarity: attr.rarity
          })) : [];
          
          return {
            tokenId: token.tokenId,
            name: token.name || `MONALIEN #${token.tokenId}`,
            image: token.image || token.imageLarge || token.imageSmall,
            price: price,
            priceSymbol: priceSymbol,
            rarityRank: token.rarityRank,
            attributes: attributes,
            contract: token.contract,
            collection: {
              name: token.collection?.name || 'MONALIENS',
              image: token.collection?.image,
              address: token.collection?.id || collectionAddress
            },
            category: token.rarityRank < 100 ? 'legendary' : 
                     token.rarityRank < 300 ? 'epic' : 
                     token.rarityRank < 600 ? 'rare' : 'common',
          };
        });
        
        return {
          nfts,
          pagination: {
            page,
            pageSize,
            totalCount: response.data.tokenCount || nfts.length,
            totalPages: Math.ceil((response.data.tokenCount || nfts.length) / pageSize)
          }
        };
      }
      
      return { nfts: [], pagination: { page, pageSize, totalCount: 0, totalPages: 0 } };
    } catch (error) {
      console.error('Error fetching NFTs from Magic Eden API:', error);
      // Return empty mock data in case of error
      return this._getMockNfts(page, pageSize, filters);
    }
  }
  
  /**
   * Get details of a specific NFT
   * @param {string} collectionAddress Collection address
   * @param {string} tokenId Token ID
   * @returns {Promise<Object>} NFT details
   */
  async getNftDetails(collectionAddress, tokenId) {
    if (this.mockData) {
      // Return mock data
      return this._getMockNftDetails(tokenId);
    }
    
    try {
      // Get NFT details from Magic Eden Tokens API
      const response = await axios.get(this.MAGIC_EDEN_TOKENS_API_URL, {
        params: {
          tokens: [`${collectionAddress}:${tokenId}`],
          includeQuantity: true,
          includeLastSale: true,
          excludeSpam: true,
          excludeBurnt: true,
          includeAttributes: true,
        }
      });
      
      // Process API response and format NFT details
      if (response.data && response.data.tokens && response.data.tokens.length > 0) {
        const item = response.data.tokens[0];
        const token = item.token;
        const market = item.market;
        
        // Calculate price
        let price = null;
        let priceSymbol = 'MON';
        
        if (market?.floorAsk?.price?.amount?.decimal) {
          price = market.floorAsk.price.amount.decimal;
          priceSymbol = market.floorAsk.price?.currency?.symbol || 'MON';
        } else if (token.lastSale?.price?.amount?.decimal) {
          price = token.lastSale.price.amount.decimal;
          priceSymbol = token.lastSale.price?.currency?.symbol || 'MON';
        }
        
        // Format attributes
        const attributes = token.attributes ? token.attributes.map(attr => ({
          trait_type: attr.key,
          value: attr.value,
          rarity: attr.rarity
        })) : [];
        
        return {
          tokenId: token.tokenId,
          name: token.name || `MONALIEN #${token.tokenId}`,
          image: token.image || token.imageLarge || token.imageSmall,
          description: token.description || "MONALIENS is a collection of alien variations of the Mona Lisa. Created on the MONAD blockchain, these pieces represent the intersection of classical art and future vision.",
          price: price,
          priceSymbol: priceSymbol,
          rarityRank: token.rarityRank,
          attributes: attributes,
          contract: token.contract,
          owner: token.owner,
          lastSale: token.lastSale ? {
            price: token.lastSale.price?.amount?.decimal,
            date: token.lastSale.timestamp
          } : null,
          collection: {
            name: token.collection?.name || 'MONALIENS',
            image: token.collection?.image,
            address: token.collection?.id || collectionAddress
          }
        };
      }
      
      // Return mock data if NFT is not found
      return this._getMockNftDetails(tokenId);
    } catch (error) {
      console.error('Error fetching NFT details from Magic Eden API:', error);
      // Return mock data in case of error
      return this._getMockNftDetails(tokenId);
    }
  }
  
  /**
   * Get NFTs in user's wallet
   * @param {string} walletAddress Wallet address
   * @returns {Promise<Array>} NFT list
   */
  async getUserNfts(walletAddress) {
    if (this.mockData) {
      // Return mock data
      return this._getMockUserNfts();
    }
    
    try {
      // Get user NFTs from Magic Eden Activity API
      const response = await axios.get(this.MAGIC_EDEN_ACTIVITY_API_URL, {
        params: {
          userAddress: walletAddress
        }
      });
      
      // Process API response and format user's NFTs
      if (response.data && response.data.activities) {
        const activities = response.data.activities;
        const uniqueNfts = {};
        
        // Extract unique NFTs from activities
        activities.forEach(activity => {
          if (activity.token && activity.toAddress === walletAddress && !uniqueNfts[activity.token.tokenId]) {
            uniqueNfts[activity.token.tokenId] = {
              tokenId: activity.token.tokenId,
              name: activity.token.name || `MONALIEN #${activity.token.tokenId}`,
              image: activity.token.image || activity.token.imageLarge || activity.token.imageSmall,
              collection: {
                name: activity.collection?.name || 'MONALIENS',
                image: activity.collection?.image,
                address: activity.collection?.id || this.DEFAULT_COLLECTION_ADDRESS
              },
              contract: activity.contract,
              rarityRank: activity.token.rarityRank,
              category: activity.token.rarityRank < 100 ? 'legendary' : 
                       activity.token.rarityRank < 300 ? 'epic' : 
                       activity.token.rarityRank < 600 ? 'rare' : 'common',
            };
          }
        });
        
        return Object.values(uniqueNfts);
      }
      
      // Return mock data if no activity is found
      return this._getMockUserNfts();
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      // Return mock data in case of error
      return this._getMockUserNfts();
    }
  }
  
  /**
   * Get collection details
   * @param {string} collectionAddress Collection address
   * @returns {Promise<Object>} Collection details
   */
  async getCollectionDetails(collectionAddress = this.DEFAULT_COLLECTION_ADDRESS) {
    if (this.mockData) {
      // Return mock data
      return this._getMockCollectionDetails();
    }
    
    try {
      // Get collection details from Magic Eden API
      const response = await axios.get(`https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/collections/information`, {
        params: {
          collection: collectionAddress
        }
      });
      
      if (response.data && response.data.collection) {
        const collection = response.data.collection;
        
        return {
          name: collection.name || 'MONALIENS',
          description: collection.description || "MONALIENS is a collection of alien variations of the Mona Lisa. Created on the MONAD blockchain, these pieces represent the intersection of classical art and future vision.",
          address: collection.id || collectionAddress,
          creator: collection.creator,
          totalSupply: collection.tokenCount || 1000,
          floorPrice: collection.floorPrice?.amount?.decimal || 0.8,
          totalVolume: collection.volume?.allTime?.amount?.decimal || 0,
          owners: collection.ownerCount || 0
        };
      }
      
      // Return mock data if collection is not found
      return this._getMockCollectionDetails();
    } catch (error) {
      console.error('Error fetching collection details:', error);
      // Return mock data in case of error
      return this._getMockCollectionDetails();
    }
  }
  
  /**
   * Get possible traits in the collection
   * @param {string} collectionAddress Collection address
   * @returns {Promise<Object>} Traits and their values
   */
  async getCollectionTraits(collectionAddress = this.DEFAULT_COLLECTION_ADDRESS) {
    if (this.mockData) {
      // Return mock data
      return this._getMockCollectionTraits();
    }
    
    try {
      // Get collection traits from Magic Eden API
      const response = await axios.get(`https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/collections/attributes`, {
        params: {
          collection: collectionAddress
        }
      });
      
      if (response.data && response.data.attributes) {
        const attributes = response.data.attributes;
        const formattedTraits = {};
        
        // Format traits from API
        Object.entries(attributes).forEach(([traitType, values]) => {
          formattedTraits[traitType] = {};
          
          values.forEach(item => {
            formattedTraits[traitType][item.value] = item.tokenCount || 0;
          });
        });
        
        return formattedTraits;
      }
      
      // Return mock data if traits are not found
      return this._getMockCollectionTraits();
    } catch (error) {
      console.error('Error fetching collection traits:', error);
      // Return mock data in case of error
      return this._getMockCollectionTraits();
    }
  }
  
  // ----- MOCK DATA METHODS -----
  
  /**
   * Create mock NFT list
   * @private
   */
  _getMockNfts(page, pageSize, filters) {
    // Pretend there are 1000 NFTs in total
    const totalCount = 1000;
    const startIndex = (page - 1) * pageSize;
    const nfts = [];
    
    // If there is filtering, show NFTs that contain these trait values
    const hasTraitFilters = filters?.traits && Object.keys(filters.traits).length > 0;
    
    for (let i = 0; i < pageSize; i++) {
      const tokenId = startIndex + i + 1;
      
      // If tokenId exceeds total NFT count, break out of the loop
      if (tokenId > totalCount) break;
      
      const nft = this._createMockNft(tokenId);
      
      // If there are filters and this NFT doesn't match the criteria, don't add it
      if (hasTraitFilters) {
        let matchesFilter = true;
        
        for (const [traitType, traitValue] of Object.entries(filters.traits)) {
          const hasTrait = nft.attributes.some(
            attr => attr.trait_type === traitType && attr.value === traitValue
          );
          
          if (!hasTrait) {
            matchesFilter = false;
            break;
          }
        }
        
        if (!matchesFilter) continue;
      }
      
      nfts.push(nft);
    }
    
    return {
      nfts,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };
  }
  
  /**
   * Create mock NFT details
   * @private
   */
  _getMockNftDetails(tokenId) {
    return {
      ...this._createMockNft(tokenId),
      description: "MONALIENS is a collection of alien variations of the Mona Lisa. Created on the MONAD blockchain, these pieces represent the intersection of classical art and future vision.",
      owner: "0x" + Math.random().toString(16).substring(2, 42),
      lastSale: {
        price: (Math.random() * 5).toFixed(2),
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
      },
      collection: {
        name: "MONALIENS",
        address: "0x" + Math.random().toString(16).substring(2, 42),
        creator: "0x" + Math.random().toString(16).substring(2, 42),
        totalSupply: 1000,
        floorPrice: 0.8
      }
    };
  }
  
  /**
   * Create mock user NFTs
   * @private
   */
  _getMockUserNfts() {
    const nfts = [];
    const count = 5 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < count; i++) {
      nfts.push(this._createMockNft(Math.floor(Math.random() * 1000) + 1));
    }
    
    return nfts;
  }
  
  /**
   * Create mock collection details
   * @private
   */
  _getMockCollectionDetails() {
    return {
      name: "MONALIENS",
      description: "MONALIENS is a collection of alien variations of the Mona Lisa. Created on the MONAD blockchain, these pieces represent the intersection of classical art and future vision.",
      address: "0x" + Math.random().toString(16).substring(2, 42),
      creator: "0x" + Math.random().toString(16).substring(2, 42),
      totalSupply: 1000,
      floorPrice: 0.8,
      totalVolume: 5400.25,
      owners: 320
    };
  }
  
  /**
   * Create mock collection traits
   * @private
   */
  _getMockCollectionTraits() {
    return {
      "Background": ["Uzay", "Galaksi", "Yıldızlar", "Nebula", "Kara Delik"],
      "Skin": ["Yeşil", "Mavi", "Mor", "Gri", "Altın"],
      "Eyes": ["Büyük", "Çekik", "Parıltılı", "Robot", "Tek"],
      "Mouth": ["Gülümseyen", "Ciddi", "Şaşkın", "Robotik", "Kızgın"],
      "Clothes": ["Klasik", "Futuristik", "Royal", "Zırh", "Yok"],
      "Accessories": ["Taç", "Kulaklık", "Gözlük", "Kolye", "Silah"]
    };
  }
  
  /**
   * Create a mock NFT
   * @private
   */
  _createMockNft(tokenId) {
    // Randomly select traits
    const backgrounds = ["Uzay", "Galaksi", "Yıldızlar", "Nebula", "Kara Delik"];
    const skins = ["Yeşil", "Mavi", "Mor", "Gri", "Altın"];
    const eyes = ["Büyük", "Çekik", "Parıltılı", "Robot", "Tek"];
    const mouths = ["Gülümseyen", "Ciddi", "Şaşkın", "Robotik", "Kızgın"];
    const clothes = ["Klasik", "Futuristik", "Royal", "Zırh", "Yok"];
    const accessories = ["Taç", "Kulaklık", "Gözlük", "Kolye", "Silah"];
    
    // Use tokenId to select deterministic traits for each token
    const hash = (tokenId * 13) % 100;
    
    // Limit image number to 25 different images
    const imageNumber = (tokenId % 25) + 1;
    
    return {
      tokenId: tokenId.toString(),
      name: `MONALIEN #${tokenId}`,
      image: `https://picsum.photos/seed/monalien${imageNumber}/400/400`,
      attributes: [
        { trait_type: "Background", value: backgrounds[hash % 5] },
        { trait_type: "Skin", value: skins[(hash + 1) % 5] },
        { trait_type: "Eyes", value: eyes[(hash + 2) % 5] },
        { trait_type: "Mouth", value: mouths[(hash + 3) % 5] },
        // Clothes and accessories may not be present
        ...(hash % 10 > 2 ? [{ trait_type: "Clothes", value: clothes[(hash + 4) % 5] }] : []),
        ...(hash % 10 > 5 ? [{ trait_type: "Accessories", value: accessories[(hash + 5) % 5] }] : [])
      ],
      price: hash % 10 === 0 ? (Math.random() * 5).toFixed(2) : null // Some NFTs are not for sale
    };
  }
}

// Singleton to create a single instance
export default new ApiService();