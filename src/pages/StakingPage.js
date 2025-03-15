import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { stakingService } from '../services/api';
import { useWallet } from '../context/WalletContext';

const StakingContainer = styled.div`
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

const PageDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.6;
`;

const StakingStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background-color: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--border-color);
  
  h3 {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
  }
  
  .description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 1rem;
  }
`;

const StakingTabs = styled.div`
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

const StakingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const StakingCard = styled(motion.div)`
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

const CardImage = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${StakingCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardInfo = styled.div`
  margin: 1rem 0;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    
    .label {
      color: var(--text-secondary);
    }
    
    .value {
      font-weight: 600;
    }
  }
`;

const StakeButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.staked ? 'var(--bg-primary)' : 'var(--accent-primary)'};
  color: ${props => props.staked ? 'var(--accent-primary)' : 'white'};
  border: 1px solid var(--accent-primary);
  
  &:hover {
    background-color: ${props => props.staked ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
    color: white;
  }
`;

const RewardsSection = styled.div`
  margin-top: 4rem;
`;

const RewardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ClaimButton = styled.button`
  background-color: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-secondary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RewardsCard = styled.div`
  background-color: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
  
  .rewards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .reward-item {
    text-align: center;
    
    .label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }
    
    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-primary);
    }
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

// Example NFT data
const mockStakableNfts = [
  {
    id: 1,
    name: 'Alien Explorer #042',
    image: 'https://via.placeholder.com/300x300/1a8fe3/ffffff?text=Alien+1',
    apr: '12%',
    lockPeriod: '30 days',
    rewards: '0.05 MONAD/day',
    staked: false
  },
  {
    id: 2,
    name: 'Space Traveler #128',
    image: 'https://via.placeholder.com/300x300/e31a8f/ffffff?text=Alien+2',
    apr: '15%',
    lockPeriod: '60 days',
    rewards: '0.08 MONAD/day',
    staked: true
  },
  {
    id: 3,
    name: 'Galactic Guardian #076',
    image: 'https://via.placeholder.com/300x300/8fe31a/000000?text=Alien+3',
    apr: '18%',
    lockPeriod: '90 days',
    rewards: '0.1 MONAD/day',
    staked: false
  },
  {
    id: 4,
    name: 'Star Voyager #211',
    image: 'https://via.placeholder.com/300x300/e3701a/ffffff?text=Alien+4',
    apr: '10%',
    lockPeriod: 'Flexible',
    rewards: '0.04 MONAD/day',
    staked: false
  },
];

const StakingPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [stakableNfts, setStakableNfts] = useState([]);
  const [stakedNfts, setStakedNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaked: '358 NFTs',
    avgApr: '14.7%',
    totalRewards: '1,245 MONAD'
  });
  const [rewards, setRewards] = useState({
    available: '0.85 MONAD',
    nextClaim: '12 hours',
    lifetime: '12.75 MONAD'
  });
  
  const { isConnected, connectWallet } = useWallet();

  // Load NFTs
  useEffect(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with real API:
        // const data = await stakingService.getStakedNfts();
        
        // Example data simulation:
        setTimeout(() => {
          const available = mockStakableNfts.filter(nft => !nft.staked);
          const staked = mockStakableNfts.filter(nft => nft.staked);
          
          setStakableNfts(available);
          setStakedNfts(staked);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading NFTs:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected]);

  // Stake/unstake NFT
  const toggleStake = async (id) => {
    try {
      // Replace with real API:
      // const result = await stakingService.stakeNft(id);
      
      // Data simulation:
      if (activeTab === 'available') {
        const nft = stakableNfts.find(n => n.id === id);
        if (nft) {
          nft.staked = true;
          setStakedNfts([...stakedNfts, nft]);
          setStakableNfts(stakableNfts.filter(n => n.id !== id));
        }
      } else {
        const nft = stakedNfts.find(n => n.id === id);
        if (nft) {
          nft.staked = false;
          setStakableNfts([...stakableNfts, nft]);
          setStakedNfts(stakedNfts.filter(n => n.id !== id));
        }
      }
    } catch (error) {
      console.error('Error during operation:', error);
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    try {
      // Replace with real API:
      // const result = await stakingService.claimRewards();
      
      // Data simulation:
      setTimeout(() => {
        alert('0.85 MONAD tokens successfully claimed!');
        setRewards({
          ...rewards,
          available: '0 MONAD'
        });
      }, 1000);
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  // Render content based on wallet connection status
  const renderContent = () => {
    if (!isConnected) {
      return (
        <ConnectWalletMessage>
          <h2>Connect Your Wallet to Start Staking</h2>
          <p>
            To view your NFTs and start earning rewards, please connect your wallet.
            Staking your MONALIENS NFTs allows you to earn passive income in MONAD tokens.
          </p>
          <ConnectButton onClick={connectWallet}>
            Connect Wallet
          </ConnectButton>
        </ConnectWalletMessage>
      );
    }

    return (
      <>
        <StakingStats>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3>Total Staked</h3>
            <div className="value">{stats.totalStaked}</div>
            <div className="description">38% of all MONALIENS NFTs worldwide</div>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>Average APR</h3>
            <div className="value">{stats.avgApr}</div>
            <div className="description">Varies based on the level of your staked NFTs</div>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3>Total Rewards</h3>
            <div className="value">{stats.totalRewards}</div>
            <div className="description">Total MONAD distributed to date</div>
          </StatCard>
        </StakingStats>
        
        <StakingTabs>
          <Tab 
            active={activeTab === 'available'} 
            onClick={() => setActiveTab('available')}
          >
            Available NFTs
          </Tab>
          <Tab 
            active={activeTab === 'staked'} 
            onClick={() => setActiveTab('staked')}
          >
            Staked NFTs
          </Tab>
        </StakingTabs>
        
        <StakingGrid>
          {activeTab === 'available' ? (
            stakableNfts.length > 0 ? 
              stakableNfts.map(nft => (
                <StakingCard key={nft.id}>
                  <CardImage>
                    <img src={nft.image} alt={nft.name} />
                  </CardImage>
                  <CardContent>
                    <CardTitle>{nft.name}</CardTitle>
                    <CardInfo>
                      <div className="info-item">
                        <span className="label">APR:</span>
                        <span className="value">{nft.apr}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Lock Period:</span>
                        <span className="value">{nft.lockPeriod}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Rewards:</span>
                        <span className="value">{nft.rewards}</span>
                      </div>
                    </CardInfo>
                    <StakeButton onClick={() => toggleStake(nft.id)}>
                      Stake
                    </StakeButton>
                  </CardContent>
                </StakingCard>
              ))
              : <p>No available NFTs found to stake.</p>
          ) : (
            stakedNfts.length > 0 ?
              stakedNfts.map(nft => (
                <StakingCard key={nft.id}>
                  <CardImage>
                    <img src={nft.image} alt={nft.name} />
                  </CardImage>
                  <CardContent>
                    <CardTitle>{nft.name}</CardTitle>
                    <CardInfo>
                      <div className="info-item">
                        <span className="label">APR:</span>
                        <span className="value">{nft.apr}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Lock Period:</span>
                        <span className="value">{nft.lockPeriod}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Rewards:</span>
                        <span className="value">{nft.rewards}</span>
                      </div>
                    </CardInfo>
                    <StakeButton staked onClick={() => toggleStake(nft.id)}>
                      Unstake
                    </StakeButton>
                  </CardContent>
                </StakingCard>
              ))
              : <p>No staked NFTs found.</p>
          )}
        </StakingGrid>
        
        <RewardsSection>
          <RewardsHeader>
            <h2>Your Rewards</h2>
            <ClaimButton 
              onClick={claimRewards}
              disabled={rewards.available === '0 MONAD'}
            >
              Claim Rewards
            </ClaimButton>
          </RewardsHeader>
          
          <RewardsCard>
            <div className="rewards-grid">
              <div className="reward-item">
                <div className="label">Available Rewards</div>
                <div className="value">{rewards.available}</div>
              </div>
              <div className="reward-item">
                <div className="label">Next Reward</div>
                <div className="value">{rewards.nextClaim}</div>
              </div>
              <div className="reward-item">
                <div className="label">Total Earned</div>
                <div className="value">{rewards.lifetime}</div>
              </div>
            </div>
          </RewardsCard>
        </RewardsSection>
      </>
    );
  };

  return (
    <StakingContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        NFT Staking
      </PageTitle>
      
      <PageDescription
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Earn passive income by staking your MONALIENS NFTs. Lock your NFTs to receive MONAD tokens as rewards.
      </PageDescription>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ width: 50, height: 50, border: '5px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : renderContent()}
    </StakingContainer>
  );
};

export default StakingPage; 