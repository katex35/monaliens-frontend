import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { nftService } from '../services/api';

const ProfileContainer = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-primary);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProfileAddress = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
  
  .copy-icon {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--accent-primary);
    }
  }
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-primary);
  }
  
  .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  border-bottom: 3px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const NftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const NftCard = styled.div`
  background-color: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const NftImage = styled.div`
  width: 100%;
  height: 280px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${NftCard}:hover & img {
    transform: scale(1.05);
  }
`;

const NftContent = styled.div`
  padding: 1.5rem;
`;

const NftTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NftPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 1rem;
`;

const NftInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ActivityTable = styled.div`
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  
  &.type {
    color: ${props => {
      switch (props.value) {
        case 'buy': return 'var(--success)';
        case 'sell': return 'var(--error)';
        case 'mint': return 'var(--accent-secondary)';
        default: return 'var(--text-primary)';
      }
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
`;

const ConnectWalletMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  margin: 2rem 0;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ConnectButton = styled.button`
  background-color: var(--accent-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

// Example data
const mockUserNfts = [
  {
    id: 1,
    name: 'Alien Explorer #042',
    image: 'https://via.placeholder.com/300x300/1a8fe3/ffffff?text=Alien+1',
    price: '1,200 MONAD',
    rarity: 'Legendary',
    collection: 'MONALIENS'
  },
  {
    id: 2,
    name: 'Space Traveler #128',
    image: 'https://via.placeholder.com/300x300/e31a8f/ffffff?text=Alien+2',
    price: '950 MONAD',
    rarity: 'Epic',
    collection: 'MONALIENS'
  },
  {
    id: 3,
    name: 'Galactic Guardian #076',
    image: 'https://via.placeholder.com/300x300/8fe31a/000000?text=Alien+3',
    price: '1,500 MONAD',
    rarity: 'Legendary',
    collection: 'MONALIENS'
  }
];

const mockActivity = [
  {
    id: 1,
    type: 'buy',
    item: 'Alien Explorer #042',
    price: '1,200 MONAD',
    from: '0x1a2b...3c4d',
    date: '2023-11-15'
  },
  {
    id: 2,
    type: 'sell',
    item: 'Space Voyager #211',
    price: '850 MONAD',
    from: '0x5e6f...7g8h',
    date: '2023-11-10'
  },
  {
    id: 3,
    type: 'mint',
    item: 'Galactic Guardian #076',
    price: '500 MONAD',
    from: 'MONALIENS',
    date: '2023-11-05'
  }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const [userNfts, setUserNfts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isConnected, connectWallet, address, formatAddress } = useWallet();

  // Load user data
  useEffect(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with real API:
        // const nfts = await nftService.getUserNfts(address);
        // const userActivity = await userService.getUserActivity(address);
        
        // Example data simulation:
        setTimeout(() => {
          setUserNfts(mockUserNfts);
          setActivity(mockActivity);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address]);

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    }
  };

  // Render content based on wallet connection status
  const renderContent = () => {
    if (!isConnected) {
      return (
        <ConnectWalletMessage>
          <h2>Connect Your Wallet to View Your Profile</h2>
          <p>
            To view your NFT collection, transaction history, and profile information,
            please connect your wallet.
          </p>
          <ConnectButton onClick={connectWallet}>
            Connect Wallet
          </ConnectButton>
        </ConnectWalletMessage>
      );
    }

    return (
      <>
        <ProfileHeader>
          <ProfileAvatar>
            <img src="https://via.placeholder.com/120x120/1a1a1a/e63946?text=M" alt="Profile" />
          </ProfileAvatar>
          
          <ProfileInfo>
            <ProfileName>MONAD Collector</ProfileName>
            <ProfileAddress>
              {formatAddress(address)}
              <span className="copy-icon" onClick={copyAddress}>📋</span>
            </ProfileAddress>
            
            <ProfileStats>
              <StatItem>
                <div className="value">{userNfts.length}</div>
                <div className="label">Items</div>
              </StatItem>
              
              <StatItem>
                <div className="value">5</div>
                <div className="label">Collections</div>
              </StatItem>
              
              <StatItem>
                <div className="value">3,650</div>
                <div className="label">MONAD Volume</div>
              </StatItem>
            </ProfileStats>
          </ProfileInfo>
        </ProfileHeader>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'collection'} 
            onClick={() => setActiveTab('collection')}
          >
            Collection
          </Tab>
          <Tab 
            active={activeTab === 'activity'} 
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </Tab>
        </TabsContainer>
        
        {activeTab === 'collection' ? (
          userNfts.length > 0 ? (
            <NftGrid>
              {userNfts.map(nft => (
                <NftCard key={nft.id}>
                  <NftImage>
                    <img src={nft.image} alt={nft.name} />
                  </NftImage>
                  <NftContent>
                    <NftTitle>{nft.name}</NftTitle>
                    <NftPrice>{nft.price}</NftPrice>
                    <NftInfo>
                      <span>{nft.collection}</span>
                      <span>{nft.rarity}</span>
                    </NftInfo>
                  </NftContent>
                </NftCard>
              ))}
            </NftGrid>
          ) : (
            <EmptyState>
              <h3>No NFTs Found</h3>
              <p>You don't have any NFTs in your collection yet.</p>
              <ConnectButton as="a" href="/gallery">Browse Gallery</ConnectButton>
            </EmptyState>
          )
        ) : (
          activity.length > 0 ? (
            <ActivityTable>
              <TableHeader>
                <TableCell>Type</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell className="hide-mobile">From</TableCell>
                <TableCell className="hide-mobile">Date</TableCell>
              </TableHeader>
              
              {activity.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="type" value={item.type}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className="hide-mobile">{item.from}</TableCell>
                  <TableCell className="hide-mobile">{item.date}</TableCell>
                </TableRow>
              ))}
            </ActivityTable>
          ) : (
            <EmptyState>
              <h3>No Activity Found</h3>
              <p>You don't have any transaction history yet.</p>
              <ConnectButton as="a" href="/gallery">Browse Gallery</ConnectButton>
            </EmptyState>
          )
        )}
      </>
    );
  };

  return (
    <ProfileContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Profile
      </PageTitle>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ width: 50, height: 50, border: '5px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : renderContent()}
    </ProfileContainer>
  );
};

export default ProfilePage; 