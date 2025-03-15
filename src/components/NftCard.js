import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NftModal from './NftModal';

const Card = styled(motion.div)`
  background-color: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 270px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const RarityBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  color: white;
  background-color: ${props => 
    props.category === 'legendary' ? 'rgba(241, 196, 15, 0.8)' :
    props.category === 'epic' ? 'rgba(155, 89, 182, 0.8)' :
    props.category === 'rare' ? 'rgba(52, 152, 219, 0.8)' :
    'rgba(46, 204, 113, 0.8)'
  };
  z-index: 1;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
`;

const CardCollection = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
`;

const CardDetail = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  margin-top: auto;
  gap: 0.5rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .label {
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .value {
    color: var(--text-primary);
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const Button = styled.button`
  background-color: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--accent-primary);
  color: var(--accent-primary);
  
  &:hover {
    background-color: var(--accent-primary);
    color: white;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const CardPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  .label {
    color: var(--text-secondary);
    font-weight: 500;
  }

  .price {
    color: var(--text-primary);
  }
`;

/**
 * NFT Card Component
 * Displays an individual NFT with its details
 * @param {Object} props - Component props
 * @param {Object} props.nft - NFT data object
 */
const NftCard = ({ nft, collectionAddress }) => {
  const [showModal, setShowModal] = useState(false);
  
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  
  return (
    <>
      <Card onClick={openModal}>
        <CardImage>
          <img src={nft.image} alt={nft.name} />
          {nft.category && (
            <RarityBadge category={nft.category}>
              {nft.category}
            </RarityBadge>
          )}
        </CardImage>
        <CardContent>
          <CardTitle>{nft.name}</CardTitle>
          
          {nft.collection && (
            <CardCollection>
              {nft.collection.image && <img src={nft.collection.image} alt={nft.collection.name} />}
              <span>{nft.collection.name}</span>
            </CardCollection>
          )}
          
          <CardDetail>
            {nft.rarityRank && (
              <div className="rarity">Rank #{nft.rarityRank}</div>
            )}
            {nft.owner && (
              <div className="owner">{nft.owner.substring(0, 6)}...{nft.owner.slice(-4)}</div>
            )}
          </CardDetail>
          
          <CardPriceRow>
            <div className="label">Fiyat</div>
            <div className="price">{nft.price ? `${nft.price} ${nft.priceSymbol || 'MON'}` : 'Satışta değil'}</div>
          </CardPriceRow>
        </CardContent>
      </Card>
      
      <NftModal 
        isOpen={showModal}
        onClose={closeModal}
        tokenId={nft.tokenId}
        collectionAddress={collectionAddress || '0x123456789abcdef0123456789abcdef01234567'}
      />
    </>
  );
};

export default NftCard; 