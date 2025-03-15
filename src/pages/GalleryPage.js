import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NftCard from '../components/NftCard';
import apiService from '../services/apiService';

const GalleryContainer = styled.div`
  padding: 3rem 2rem;
  max-width: 1400px;
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

const GalleryLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersSidebar = styled.div`
  background-color: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  position: sticky;
  top: 100px;
  height: calc(100vh - 130px);
  overflow-y: auto;
  
  @media (max-width: 992px) {
    position: static;
    height: auto;
    max-height: ${props => props.isVisible ? '1500px' : '0'};
    overflow: hidden;
    transition: max-height 0.5s ease;
    padding: ${props => props.isVisible ? '1.5rem' : '0'};
    margin-bottom: ${props => props.isVisible ? '2rem' : '0'};
    border: ${props => props.isVisible ? '1px solid var(--border-color)' : 'none'};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent-primary)' : 'rgba(230, 57, 70, 0.1)'};
    border-color: var(--accent-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PriceInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const SearchBar = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.2);
    }
  }
`;

const FiltersToggle = styled.button`
  display: none;
  width: 100%;
  background-color: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 992px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const NftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const ResultsCount = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const SortDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  select {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
    }
  }
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  margin: 2rem auto;
  display: table;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
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

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
  }
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
  
  &:hover {
    color: var(--accent-secondary);
  }
`;

const TraitsSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
`;

const TraitCategoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0.5rem;
  
  .arrow {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const TraitList = styled.div`
  margin-bottom: 1.5rem;
  max-height: ${props => props.isOpen ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const TraitItem = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  input {
    margin-right: 0.5rem;
  }
  
  .count {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
`;

const TraitsSearchBar = styled.div`
  margin-bottom: 1rem;
  
  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9rem;
    
    &::placeholder {
      color: var(--text-secondary);
    }
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.2);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const FilterToggle = styled.button`
  background-color: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const ClearButton = styled.button`
  background-color: transparent;
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-primary);
    color: white;
  }
`;

// Trait categories
const TRAIT_CATEGORIES = [
  { id: 'background', name: 'Background', count: 31 },
  { id: 'body', name: 'Body', count: 8 },
  { id: 'clothing', name: 'Clothing', count: 31 },
  { id: 'eyes', name: 'Eyes', count: 22 },
  { id: 'head', name: 'Head', count: 24 },
  { id: 'item', name: 'Item', count: 24 },
  { id: 'legendary', name: 'Legendary', count: 6 },
  { id: 'mouth', name: 'Mouth', count: 17 },
  { id: 'neck', name: 'Neck', count: 7 },
  { id: 'sidekick', name: 'Sidekick', count: 8 },
  { id: 'special', name: 'Special', count: 4 },
];

// Main component
const GalleryPage = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('rarity');
  const [resultsCount, setResultsCount] = useState(0);
  const [visibleNfts, setVisibleNfts] = useState(12);
  const [showFilters, setShowFilters] = useState(window.innerWidth > 992);
  const [selectedTraits, setSelectedTraits] = useState({});
  const [traitSearchTerm, setTraitSearchTerm] = useState('');
  const [openTraitCategories, setOpenTraitCategories] = useState({});
  const [allTraits, setAllTraits] = useState({});
  
  // Collection address specified by the user
  const collectionAddress = '0xae280ca8dfaaf852b0af828cd72391ce7874fbb6';
  
  // Fetch NFTs from API
  useEffect(() => {
    const fetchNfts = async () => {
      setLoading(true);
      try {
        // Fetch NFT and trait data using apiService
        const data = await apiService.getNfts(collectionAddress, 1, 50);
        
        if (data && data.nfts) {
          setNfts(data.nfts);
          setResultsCount(data.nfts.length);
        } else {
          setError('There was a problem loading NFT data.');
        }
        
        // Fetch trait data
        const traits = await apiService.getCollectionTraits(collectionAddress);
        setAllTraits(traits);
        
        // Set open/closed state for trait categories
        if (traits) {
          const initialOpenState = {};
          Object.keys(traits).forEach((category, index) => {
            initialOpenState[category] = index < 2; // Open first two categories by default
          });
          setOpenTraitCategories(initialOpenState);
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError('An error occurred while loading NFT data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNfts();
  }, [collectionAddress]);
  
  // Filter NFTs based on category, search term, and price filters
  const filteredNfts = useMemo(() => {
    return nfts.filter(nft => {
      // Category filter
      if (activeCategory !== 'all' && nft.category !== activeCategory) {
        return false;
      }
      
      // Search filter
      if (searchTerm && !nft.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Price filter - Minimum price
      if (minPrice && (!nft.price || parseFloat(nft.price) < parseFloat(minPrice))) {
        return false;
      }
      
      // Price filter - Maximum price
      if (maxPrice && (!nft.price || parseFloat(nft.price) > parseFloat(maxPrice))) {
        return false;
      }
      
      // Trait filter
      for (const [category, traits] of Object.entries(selectedTraits)) {
        if (traits.length > 0) {
          // The NFT must have at least one trait in this category
          const hasMatchingTrait = nft.attributes?.some(
            attr => attr.trait_type === category && traits.includes(attr.value)
          );
          
          if (!hasMatchingTrait) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [nfts, activeCategory, searchTerm, minPrice, maxPrice, selectedTraits]);
  
  // After filtering, sort NFTs by the selected sort option
  const sortedNfts = useMemo(() => {
    if (sortOption === 'price-low') {
      return [...filteredNfts].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    } else if (sortOption === 'price-high') {
      return [...filteredNfts].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'name') {
      return [...filteredNfts].sort((a, b) => a.name.localeCompare(b.name));
    } else { // rarity
      return [...filteredNfts].sort((a, b) => (a.rarityRank || 999) - (b.rarityRank || 999));
    }
  }, [filteredNfts, sortOption]);
  
  // Update result count when filters change
  useEffect(() => {
    setResultsCount(sortedNfts.length);
  }, [sortedNfts]);
  
  // Category change handler
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleNfts(12); // Reset visible NFT count when category changes
  };
  
  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleNfts(12); // Reset visible NFT count when search term changes
  };
  
  // Trait search handler
  const handleTraitSearch = (e) => {
    setTraitSearchTerm(e.target.value);
  };
  
  // Trait category toggle handler
  const toggleTraitCategory = (categoryId) => {
    setOpenTraitCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Trait selection handler
  const handleTraitSelection = (category, trait, checked) => {
    setSelectedTraits(prev => {
      const newSelectedTraits = { ...prev };
      
      if (!newSelectedTraits[category]) {
        newSelectedTraits[category] = [];
      }
      
      if (checked) {
        // Add trait as selected
        if (!newSelectedTraits[category].includes(trait)) {
          newSelectedTraits[category] = [...newSelectedTraits[category], trait];
        }
      } else {
        // Remove trait from selected list
        newSelectedTraits[category] = newSelectedTraits[category].filter(t => t !== trait);
        
        // If no traits remain in the category, delete the category
        if (newSelectedTraits[category].length === 0) {
          delete newSelectedTraits[category];
        }
      }
      
      return newSelectedTraits;
    });
    
    setVisibleNfts(12); // Reset visible NFT count when trait selection changes
  };
  
  // Price change handler
  const handlePriceChange = (field, value) => {
    if (field === 'min') {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
    setVisibleNfts(12); // Reset visible NFT count when price changes
  };
  
  // Sort change handler
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Clear all filters handler
  const clearFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setTraitSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('rarity');
    setSelectedTraits({});
    setVisibleNfts(12); // Reset visible NFT count when filters are cleared
  };
  
  // Show/hide filters handler
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Filter trait categories based on search term
  const filteredTraitCategories = useMemo(() => {
    if (!traitSearchTerm) return Object.keys(allTraits);
    
    return Object.keys(allTraits).filter(category => 
      category.toLowerCase().includes(traitSearchTerm.toLowerCase()) ||
      Object.keys(allTraits[category]).some(value => 
        value.toLowerCase().includes(traitSearchTerm.toLowerCase())
      )
    );
  }, [allTraits, traitSearchTerm]);
  
  // Load more NFTs handler
  const loadMore = () => {
    setVisibleNfts(prev => prev + 12);
  };
  
  return (
    <GalleryContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        NFT Gallery
      </PageTitle>
      
      <FilterToggle onClick={toggleFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'} {showFilters ? '▲' : '▼'}
      </FilterToggle>
      
      <ResultsInfo>
        <strong>{resultsCount}</strong> results found
        {(activeCategory !== 'all' || searchTerm || minPrice || maxPrice || Object.keys(selectedTraits).length > 0) && (
          <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
        )}
      </ResultsInfo>
      
      <GalleryLayout>
        {/* Filters sidebar */}
        <FiltersSidebar isVisible={showFilters}>
          {/* Categories filter */}
          <FilterSection>
            <FilterTitle>Categories</FilterTitle>
            <CategoriesContainer>
              <CategoryButton 
                active={activeCategory === 'all'} 
                onClick={() => handleCategoryChange('all')}
              >
                All
              </CategoryButton>
              <CategoryButton 
                active={activeCategory === 'legendary'} 
                onClick={() => handleCategoryChange('legendary')}
                color="#ff7f50"
              >
                Legendary
              </CategoryButton>
              <CategoryButton 
                active={activeCategory === 'epic'} 
                onClick={() => handleCategoryChange('epic')}
                color="#9370db"
              >
                Epic
              </CategoryButton>
              <CategoryButton 
                active={activeCategory === 'rare'} 
                onClick={() => handleCategoryChange('rare')}
                color="#4169e1"
              >
                Rare
              </CategoryButton>
              <CategoryButton 
                active={activeCategory === 'common'} 
                onClick={() => handleCategoryChange('common')}
                color="#2e8b57"
              >
                Common
              </CategoryButton>
            </CategoriesContainer>
          </FilterSection>
          
          {/* Name search filter */}
          <FilterSection>
            <FilterTitle>Name Search</FilterTitle>
            <SearchInput 
              type="text" 
              placeholder="Search NFT name..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </FilterSection>
          
          {/* Price filter */}
          <FilterSection>
            <FilterTitle>Price Range (MON)</FilterTitle>
            <PriceRangeContainer>
              <PriceInput 
                type="number" 
                placeholder="Min"
                value={minPrice}
                onChange={e => handlePriceChange('min', e.target.value)}
              />
              <span>-</span>
              <PriceInput 
                type="number" 
                placeholder="Max"
                value={maxPrice}
                onChange={e => handlePriceChange('max', e.target.value)}
              />
            </PriceRangeContainer>
          </FilterSection>
          
          {/* Sort options */}
          <FilterSection>
            <FilterTitle>Sort By</FilterTitle>
            <Select value={sortOption} onChange={handleSortChange}>
              <option value="rarity">Rarity (Rare → Common)</option>
              <option value="price-low">Price (Low → High)</option>
              <option value="price-high">Price (High → Low)</option>
              <option value="name">Name (A → Z)</option>
            </Select>
          </FilterSection>
          
          {/* Traits filter */}
          <FilterSection>
            <FilterTitle>Traits</FilterTitle>
            <SearchInput 
              type="text" 
              placeholder="Search traits..." 
              value={traitSearchTerm}
              onChange={handleTraitSearch}
              style={{ marginBottom: '1rem' }}
            />
            
            {Object.keys(allTraits).length > 0 ? (
              filteredTraitCategories.map(category => (
                <div key={category}>
                  <TraitCategoryTitle 
                    onClick={() => toggleTraitCategory(category)}
                    isOpen={openTraitCategories[category]}
                  >
                    <span>{category}</span>
                    <span className="arrow">▼</span>
                  </TraitCategoryTitle>
                  
                  <TraitList isOpen={openTraitCategories[category]}>
                    {Object.entries(allTraits[category])
                      .sort(([, countA], [, countB]) => countB - countA)
                      .map(([trait, count]) => (
                        <TraitItem key={`${category}-${trait}`}>
                          <input 
                            type="checkbox"
                            checked={selectedTraits[category]?.includes(trait) || false}
                            onChange={e => handleTraitSelection(category, trait, e.target.checked)}
                          />
                          <span>{trait}</span>
                          <span className="count">{count}</span>
                        </TraitItem>
                      ))
                    }
                  </TraitList>
                </div>
              ))
            ) : (
              <div>No trait information found</div>
            )}
          </FilterSection>
        </FiltersSidebar>
        
        {/* NFT cards section */}
        <div>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner></LoadingSpinner>
            </LoadingContainer>
          ) : error ? (
            <NoResults>
              <h3>Error</h3>
              <p>{error}</p>
              <ClearButton onClick={clearFilters}>Try Again</ClearButton>
            </NoResults>
          ) : sortedNfts.length > 0 ? (
            <>
              <NftGrid>
                {sortedNfts.slice(0, visibleNfts).map(nft => (
                  <NftCard
                    key={nft.tokenId}
                    nft={nft}
                    collectionAddress={collectionAddress}
                  />
                ))}
              </NftGrid>
              
              {visibleNfts < sortedNfts.length && (
                <LoadMoreButton onClick={loadMore}>
                  Load More
                </LoadMoreButton>
              )}
            </>
          ) : (
            <NoResults>
              <h3>No NFTs Found</h3>
              <p>Adjust your filters to see more results.</p>
              <ClearButton onClick={clearFilters}>Clear All Filters</ClearButton>
            </NoResults>
          )}
        </div>
      </GalleryLayout>
    </GalleryContainer>
  );
};

export default GalleryPage;