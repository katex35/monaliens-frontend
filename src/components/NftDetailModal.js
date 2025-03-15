import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalContainer = styled(motion.div)`
  background-color: var(--card-bg);
  border-radius: 1rem;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-height: 85vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(230, 57, 70, 0.8);
  }
`;

const DetailContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const InfoSection = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Collection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  
  span {
    color: var(--text-secondary);
  }
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const RarityBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  
  background-color: ${props => {
    switch(props.category) {
      case 'legendary': return 'rgba(255, 127, 80, 0.2)';
      case 'epic': return 'rgba(147, 112, 219, 0.2)';
      case 'rare': return 'rgba(65, 105, 225, 0.2)';
      default: return 'rgba(46, 139, 87, 0.2)';
    }
  }};
  
  color: ${props => {
    switch(props.category) {
      case 'legendary': return '#ff7f50';
      case 'epic': return '#9370db';
      case 'rare': return '#4169e1';
      default: return '#2e8b57';
    }
  }};
`;

const AttributesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const AttributeCard = styled.div`
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  
  .trait-type {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .rarity {
    font-size: 0.8rem;
    color: var(--accent-primary);
    margin-top: 0.25rem;
  }
`;

const StatsContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    color: var(--text-secondary);
  }
  
  .value {
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: var(--accent-primary);
    color: white;
    border: none;
    
    &:hover {
      filter: brightness(1.1);
    }
  }
  
  &.secondary {
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    
    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
  }
`;

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

const NftDetailModal = ({ isOpen, onClose, nft }) => {
  const [loading, setLoading] = useState(true);
  const [nftDetails, setNftDetails] = useState(null);
  
  useEffect(() => {
    if (isOpen && nft) {
      fetchNftDetails();
    }
  }, [isOpen, nft]);
  
  const fetchNftDetails = async () => {
    if (!nft || !nft.contract || !nft.tokenId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Construct the API URL
      const apiUrl = `https://api-mainnet.magiceden.io/v3/rtp/monad-testnet/tokens/v7`;
      const params = {
        tokens: [`${nft.contract}:${nft.tokenId}`],
        limit: 1,
        excludeSpam: true,
        includeTopBid: true,
        includeAttributes: true,
        includeQuantity: true,
        includeLastSale: true
      };
      
      const response = await axios.get(apiUrl, { params });
      
      if (response.data && response.data.tokens && response.data.tokens.length > 0) {
        setNftDetails(response.data.tokens[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      setLoading(false);
    }
  };
  
  // Early return if the modal is not open
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>✕</CloseButton>
            
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : nftDetails ? (
              <DetailContent>
                <ImageSection>
                  <img src={nftDetails.token?.image || nft.image} alt={nftDetails.token?.name || nft.name} />
                </ImageSection>
                
                <InfoSection>
                  <Title>{nftDetails.token?.name || nft.name}</Title>
                  
                  <Collection>
                    <img src={nftDetails.token?.collection?.image || nft.collection?.image} alt="Collection" />
                    <span>{nftDetails.token?.collection?.name || nft.collection?.name}</span>
                  </Collection>
                  
                  {(nftDetails.market?.floorAsk?.price?.amount?.decimal || nft.price) && (
                    <Price>
                      {nftDetails.market?.floorAsk?.price?.amount?.decimal || nft.price} {nftDetails.market?.floorAsk?.price?.currency?.symbol || nft.priceSymbol || 'MON'}
                    </Price>
                  )}
                  
                  <RarityBadge category={nft.category}>
                    {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)} • Rank #{nftDetails.token?.rarityRank || nft.rarityRank || 'N/A'}
                  </RarityBadge>
                  
                  <StatsContainer>
                    <StatRow>
                      <span className="label">Token ID</span>
                      <span className="value">{nftDetails.token?.tokenId || nft.tokenId}</span>
                    </StatRow>
                    <StatRow>
                      <span className="label">Contract</span>
                      <span className="value">{nftDetails.token?.contract?.substring(0, 6)}...{nftDetails.token?.contract?.slice(-4) || nft.contract}</span>
                    </StatRow>
                    {nftDetails.token?.lastSale && (
                      <StatRow>
                        <span className="label">Last Sale</span>
                        <span className="value">
                          {nftDetails.token.lastSale.price?.amount?.decimal} {nftDetails.token.lastSale.price?.currency?.symbol || 'MON'}
                        </span>
                      </StatRow>
                    )}
                    {nftDetails.token?.mintedAt && (
                      <StatRow>
                        <span className="label">Minted</span>
                        <span className="value">{new Date(nftDetails.token.mintedAt).toLocaleDateString()}</span>
                      </StatRow>
                    )}
                  </StatsContainer>
                  
                  {nftDetails.token?.attributes && nftDetails.token.attributes.length > 0 && (
                    <>
                      <h3>Attributes</h3>
                      <AttributesGrid>
                        {nftDetails.token.attributes.map((attr, index) => (
                          <AttributeCard key={index}>
                            <div className="trait-type">{attr.trait_type}</div>
                            <div className="value">{attr.value}</div>
                            {attr.rarity && (
                              <div className="rarity">Rarity: {(attr.rarity * 100).toFixed(1)}%</div>
                            )}
                          </AttributeCard>
                        ))}
                      </AttributesGrid>
                    </>
                  )}
                  
                  <ButtonGroup>
                    <Button className="primary" 
                      href={`https://explorer.monad.xyz/address/${nftDetails.token?.contract || nft.contract}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View on Explorer
                    </Button>
                    <Button className="secondary"
                      href={`https://magiceden.io/item-details/monad/${nftDetails.token?.contract || nft.contract}/${nftDetails.token?.tokenId || nft.tokenId}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View on Magic Eden
                    </Button>
                  </ButtonGroup>
                </InfoSection>
              </DetailContent>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>NFT details could not be loaded</h3>
                <p>Sorry, we couldn't fetch the details for this NFT.</p>
              </div>
            )}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default NftDetailModal; 