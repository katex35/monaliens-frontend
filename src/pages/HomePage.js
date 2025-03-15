import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import NftCard from '../components/NftCard';
import apiService from '../services/apiService';

const HeroSection = styled.section`
  width: 100%;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(230, 57, 70, 0.15) 0%, rgba(0, 0, 0, 0) 60%);
    z-index: -1;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(26, 8, 8, 0) 0%, var(--bg-primary) 100%);
  z-index: -1;
`;

const BackgroundParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  overflow: hidden;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      radial-gradient(circle at 25% 35%, rgba(230, 57, 70, 0.15) 0%, rgba(230, 57, 70, 0) 12%),
      radial-gradient(circle at 75% 65%, rgba(241, 196, 15, 0.1) 0%, rgba(241, 196, 15, 0) 12%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: var(--text-primary);
  max-width: 700px;
  margin-bottom: 2.5rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const HeroContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 900px;
  width: 100%;
`;

const HeroImageContainer = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 2.5rem;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
  }
`;

const HeroStats = styled(motion.div)`
  display: flex;
  gap: 3rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0 auto;

  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  letter-spacing: 1px;

  &.primary {
    background-color: var(--accent-primary);
    color: white;
    border: none;
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background-color: transparent;
    border: 2px solid var(--accent-primary);
    color: var(--accent-primary);
    
    &:hover {
      background-color: var(--accent-primary);
      color: white;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ExploreButton = styled(ActionButton).attrs({ className: 'primary' })``;
const StakeButton = styled(ActionButton).attrs({ className: 'secondary' })``;

const Section = styled.section`
  padding: 6rem 0;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const FeaturedSection = styled(Section)`
  background-color: var(--bg-secondary);
  padding: 6rem 2rem;
`;

const SectionContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  
  span {
    color: var(--accent-primary);
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const NftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const NFTGrid = styled(NftGrid)``;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-primary);
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-error);
  font-size: 1.1rem;
`;

const ViewAllButton = styled(Link)`
  background-color: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 0.8rem 1.8rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin: 4rem auto 0;
  display: table;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background-color: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
  }
`;

const FeatureSection = styled.section`
  padding: 7rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
    z-index: -1;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-color: var(--accent-primary);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(230, 57, 70, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: var(--accent-primary);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const ViewMoreButton = styled(Link)`
  background-color: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 0.8rem 1.8rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin: 4rem auto 0;
  display: table;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background-color: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
  }
`;

const HomePage = () => {
  const [featuredNfts, setFeaturedNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Collection address for the Magic Eden-listed collection as per user's request
  const collectionAddress = '0xae280ca8dfaaf852b0af828cd72391ce7874fbb6';
  
  // Animation controllers
  const featureControls = useAnimation();
  const heroControls = useAnimation();
  const [featureRef, featureInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Listen for route changes (for page transitions)
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };
    
    handleRouteChange();
  }, []);
  
  // Trigger animations based on visibility
  useEffect(() => {
    if (heroInView) {
      heroControls.start('visible');
    }
    if (featureInView) {
      featureControls.start('visible');
    }
  }, [heroControls, featureControls, heroInView, featureInView]);
  
  // Fetch NFT data
  useEffect(() => {
    const fetchNfts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get NFT data using apiService
        const data = await apiService.getNfts(collectionAddress, 1, 6);
        
        if (data && data.nfts) {
          // Set featured NFTs
          setFeaturedNfts(data.nfts);
        } else {
          setError('There was a problem loading NFT data.');
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('An error occurred while loading NFT data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNfts();
  }, [collectionAddress]);
  
  // Statistics for NFT count, owners and floor price
  const stats = {
    totalItems: '1,000',
    owners: '420',
    floorPrice: '0.8 MON'
  };
  
  return (
    <div>
      <HeroSection ref={heroRef}>
        <GradientOverlay />
        <BackgroundParticles />
        
        <HeroImageContainer
          animate={heroControls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
          }}
        >
          <img src="/monaliens.jpg" alt="MONALIENS" />
        </HeroImageContainer>
        
        <HeroContent
          animate={heroControls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
          }}
        >
          <HeroTitle>
            MONALIENS
          </HeroTitle>
          <HeroSubtitle>
            Alien Variations of the Mona Lisa Collection
          </HeroSubtitle>
          
          <HeroStats>
            <StatItem>
              <StatValue>{stats.totalItems}</StatValue>
              <StatLabel>Total NFTs</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.owners}</StatValue>
              <StatLabel>Owners</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.floorPrice}</StatValue>
              <StatLabel>Floor Price</StatLabel>
            </StatItem>
          </HeroStats>
          
          <ActionButtons>
            <ExploreButton to="/gallery">Explore Collection</ExploreButton>
            <StakeButton to="/staking">Start Staking</StakeButton>
          </ActionButtons>
        </HeroContent>
      </HeroSection>
      
      <FeaturedSection>
        <SectionTitle>Featured NFTs</SectionTitle>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <NFTGrid>
            {featuredNfts.map(nft => (
              <NftCard 
                key={nft.tokenId} 
                nft={nft}
                collectionAddress={collectionAddress} 
              />
            ))}
          </NFTGrid>
        )}
        
        <ViewAllButton to="/gallery">View All NFTs</ViewAllButton>
      </FeaturedSection>
      
      <FeatureSection ref={featureRef}>
        <SectionTitle
          animate={featureControls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          MONALIENS Features
        </SectionTitle>
        
        <FeatureGrid>
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
            }}
          >
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>True Ownership</FeatureTitle>
            <FeatureText>
              Real ownership on the MONAD blockchain. Your NFTs are secure and under your complete control.
            </FeatureText>
          </FeatureCard>
          
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
            }}
          >
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Staking Rewards</FeatureTitle>
            <FeatureText>
              Earn passive income by staking your NFTs. Extra benefits for long-term holders.
            </FeatureText>
          </FeatureCard>
          
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
            }}
          >
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>Community Access</FeatureTitle>
            <FeatureText>
              Access to exclusive Discord channels and decision-making processes. Be an active part of the community.
            </FeatureText>
          </FeatureCard>
          
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
            }}
          >
            <FeatureIcon>🎭</FeatureIcon>
            <FeatureTitle>Exclusive Events</FeatureTitle>
            <FeatureText>
              Rights to participate in virtual and real-life events exclusively for NFT holders.
            </FeatureText>
          </FeatureCard>
          
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } }
            }}
          >
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>Unique Artwork</FeatureTitle>
            <FeatureText>
              Each MONALIEN is a high-quality and unique piece of art. Discover rare traits.
            </FeatureText>
          </FeatureCard>
          
          <FeatureCard
            animate={featureControls}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.6 } }
            }}
          >
            <FeatureIcon>🚀</FeatureIcon>
            <FeatureTitle>Future Projects</FeatureTitle>
            <FeatureText>
              Early access rights to new projects in the MONALIENS ecosystem.
            </FeatureText>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>
    </div>
  );
};

export default HomePage; 