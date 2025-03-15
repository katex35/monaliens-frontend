import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaEthereum } from 'react-icons/fa';
import apiService from '../services/apiService';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 95%;
    flex-direction: column;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailsSection = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textColor};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  
  &:hover {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const NftImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const NftName = styled.h2`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.textColor};
`;

const NftCollection = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  a {
    color: ${({ theme }) => theme.primaryColor};
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NftDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textColor};
`;

const TraitsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const TraitItem = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 10px;
  text-align: center;
`;

const TraitType = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 5px;
`;

const TraitValue = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textColor};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textColor};
  
  svg {
    margin-right: 5px;
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.primaryColor};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primaryColorHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 20px 0 10px;
  color: ${({ theme }) => theme.textColor};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${({ theme }) => theme.primaryColor};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 50px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.errorColor};
  text-align: center;
  margin: 20px;
`;

const NftModal = ({ isOpen, onClose, tokenId, collectionAddress }) => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchNftData() {
      if (!isOpen || !tokenId || !collectionAddress) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // API servisi üzerinden NFT detaylarını getir
        const data = await apiService.getNftDetails(collectionAddress, tokenId);
        setNftData(data);
      } catch (err) {
        console.error('Error fetching NFT details:', err);
        setError('NFT detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchNftData();
  }, [isOpen, tokenId, collectionAddress]);
  
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Framer Motion animasyon varyantları
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
  };
  
  // Eğer NFT datası henüz mevcut değilse yükleme spinner'ı göster
  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={handleClose}
          >
            <ModalContainer
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <LoadingSpinner />
            </ModalContainer>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          </ModalOverlay>
        )}
      </AnimatePresence>
    );
  }
  
  // Hata durumunda hata mesajı göster
  if (error) {
    return (
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={handleClose}
          >
            <ModalContainer
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <ErrorMessage>{error}</ErrorMessage>
            </ModalContainer>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          </ModalOverlay>
        )}
      </AnimatePresence>
    );
  }
  
  return (
    <AnimatePresence>
      {isOpen && nftData && (
        <ModalOverlay
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={handleClose}
        >
          <ModalContainer
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalContent>
              <ImageSection>
                <NftImage src={nftData.image} alt={nftData.name} />
              </ImageSection>
              
              <DetailsSection>
                <NftName>{nftData.name}</NftName>
                <NftCollection>
                  Koleksiyon: 
                  <a href={`https://explorer.monad.xyz/address/${collectionAddress}`} target="_blank" rel="noopener noreferrer">
                    {nftData.collection?.name || 'MONALIENS'} <FaExternalLinkAlt size={12} />
                  </a>
                </NftCollection>
                
                <NftDescription>
                  {nftData.description || 'Bu NFT için açıklama bulunmamaktadır.'}
                </NftDescription>
                
                {nftData.price && (
                  <PriceInfo>
                    <FaEthereum /> {nftData.price} MON
                  </PriceInfo>
                )}
                
                <SectionTitle>Özellikler</SectionTitle>
                <TraitsContainer>
                  {nftData.attributes?.map((trait, index) => (
                    <TraitItem key={index}>
                      <TraitType>{trait.trait_type}</TraitType>
                      <TraitValue>{trait.value}</TraitValue>
                    </TraitItem>
                  ))}
                  
                  {(!nftData.attributes || nftData.attributes.length === 0) && (
                    <div>Bu NFT için özellik bilgisi bulunmamaktadır.</div>
                  )}
                </TraitsContainer>
                
                <div>
                  <ActionButton onClick={() => window.open(`https://explorer.monad.xyz/token/${collectionAddress}/instance/${tokenId}`, '_blank')}>
                    MONAD Explorer'da Görüntüle
                  </ActionButton>
                </div>
              </DetailsSection>
            </ModalContent>
          </ModalContainer>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default NftModal; 