import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DocsContainer = styled.div`
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

const DocsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
  border: 1px solid var(--border-color);
  
  @media (max-width: 992px) {
    position: static;
    margin-bottom: 2rem;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
  
  a {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-primary)'};
    background-color: ${props => props.active ? 'rgba(230, 57, 70, 0.1)' : 'transparent'};
    font-weight: ${props => props.active ? '600' : '400'};
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(230, 57, 70, 0.1);
      color: var(--accent-primary);
    }
  }
`;

const SubNavList = styled.ul`
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
`;

const ContentArea = styled.div`
  background-color: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
`;

const SubSectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const CodeBlock = styled.pre`
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border-color);
  
  code {
    font-family: 'Courier New', Courier, monospace;
    color: var(--text-primary);
  }
`;

const List = styled.ul`
  padding-left: 2rem;
  margin-bottom: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

const Note = styled.div`
  background-color: rgba(230, 57, 70, 0.1);
  border-left: 4px solid var(--accent-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0.25rem;
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

const MobileSidebarToggle = styled.button`
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

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 992);
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };
  
  const handleNavClick = (section) => {
    setActiveSection(section);
    if (window.innerWidth <= 992) {
      setShowSidebar(false);
    }
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <>
            <SectionTitle>Introduction to MONALIENS</SectionTitle>
            <Paragraph>
              Welcome to the MONALIENS NFT collection documentation! This guide will help you understand
              how to interact with the MONALIENS NFT collection on the MONAD blockchain, including buying,
              selling, staking, and more.
            </Paragraph>
            <Paragraph>
              MONALIENS is a unique collection of 1,111 algorithmically generated NFTs living on the MONAD
              blockchain. Each MONALIEN has its own unique traits and rarity, making them valuable digital
              collectibles.
            </Paragraph>
            <SubSectionTitle>What Makes MONALIENS Special?</SubSectionTitle>
            <List>
              <li>Unique artwork with over 150 different traits</li>
              <li>Built on the high-performance MONAD blockchain</li>
              <li>Staking rewards for holders</li>
              <li>Community governance rights</li>
              <li>Exclusive access to future drops and events</li>
            </List>
            <Note>
              <p>MONALIENS is one of the first NFT collections on the MONAD blockchain, making it a historic collection for early adopters.</p>
            </Note>
          </>
        );
      case 'getting-started':
        return (
          <>
            <SectionTitle>Getting Started</SectionTitle>
            <Paragraph>
              To get started with MONALIENS, you'll need a wallet that supports the MONAD blockchain.
              Currently, MetaMask is the recommended wallet for interacting with MONALIENS.
            </Paragraph>
            <SubSectionTitle>Setting Up Your Wallet</SubSectionTitle>
            <Paragraph>
              Follow these steps to set up your wallet for MONAD:
            </Paragraph>
            <List>
              <li>Install MetaMask from the official website or app store</li>
              <li>Create a new wallet or import an existing one</li>
              <li>Add the MONAD network to MetaMask with the following details:</li>
            </List>
            <CodeBlock>
              <code>
                Network Name: MONAD Mainnet<br />
                RPC URL: https://rpc.monad.xyz<br />
                Chain ID: 32769<br />
                Currency Symbol: MON<br />
                Block Explorer: https://explorer.monad.xyz
              </code>
            </CodeBlock>
            <SubSectionTitle>Connecting Your Wallet</SubSectionTitle>
            <Paragraph>
              Once your wallet is set up, you can connect it to the MONALIENS website by clicking the "Connect Wallet"
              button in the top right corner. This will allow you to view your NFTs, stake them, and participate in
              the MONALIENS ecosystem.
            </Paragraph>
            <Note>
              <p>Always ensure you're on the official MONALIENS website before connecting your wallet to avoid phishing attempts.</p>
            </Note>
          </>
        );
      case 'buying':
        return (
          <>
            <SectionTitle>Buying MONALIENS</SectionTitle>
            <Paragraph>
              There are several ways to acquire MONALIENS NFTs. You can purchase them directly from our website,
              through secondary marketplaces, or participate in special events and giveaways.
            </Paragraph>
            <SubSectionTitle>Primary Market</SubSectionTitle>
            <Paragraph>
              If the initial mint is still ongoing, you can mint new MONALIENS directly from our website:
            </Paragraph>
            <List>
              <li>Connect your wallet to the MONALIENS website</li>
              <li>Navigate to the Mint page</li>
              <li>Select the number of NFTs you wish to mint</li>
              <li>Confirm the transaction in your wallet</li>
              <li>Your new MONALIENS will appear in your wallet and on your profile page</li>
            </List>
            <SubSectionTitle>Secondary Market</SubSectionTitle>
            <Paragraph>
              If the initial mint is complete, you can purchase MONALIENS from other collectors on secondary marketplaces:
            </Paragraph>
            <List>
              <li>Visit the Gallery page on our website or supported marketplaces</li>
              <li>Browse available MONALIENS for sale</li>
              <li>Click on the NFT you wish to purchase</li>
              <li>Click "Buy Now" or place a bid</li>
              <li>Confirm the transaction in your wallet</li>
            </List>
            <Note>
              <p>Always check the rarity and traits of a MONALIEN before purchasing to ensure you're making an informed decision.</p>
            </Note>
          </>
        );
      case 'staking':
        return (
          <>
            <SectionTitle>Staking Your MONALIENS</SectionTitle>
            <Paragraph>
              MONALIENS offers a staking mechanism that allows holders to earn passive income in the form of MONAD tokens.
              By staking your NFTs, you're essentially locking them up for a period of time in exchange for rewards.
            </Paragraph>
            <SubSectionTitle>How to Stake</SubSectionTitle>
            <Paragraph>
              Follow these steps to stake your MONALIENS:
            </Paragraph>
            <List>
              <li>Connect your wallet to the MONALIENS website</li>
              <li>Navigate to the Staking page</li>
              <li>Select the MONALIENS you wish to stake from your collection</li>
              <li>Choose a staking period (longer periods typically offer higher APR)</li>
              <li>Confirm the staking transaction in your wallet</li>
              <li>Your staked MONALIENS will now start earning rewards</li>
            </List>
            <SubSectionTitle>Rewards and Claiming</SubSectionTitle>
            <Paragraph>
              Staking rewards are calculated based on the rarity of your MONALIENS and the duration of staking.
              Rewards accumulate over time and can be claimed at any point:
            </Paragraph>
            <List>
              <li>Visit the Staking page to see your accumulated rewards</li>
              <li>Click the "Claim Rewards" button</li>
              <li>Confirm the transaction in your wallet</li>
              <li>The MONAD tokens will be transferred to your wallet</li>
            </List>
            <Note>
              <p>Unstaking before the end of your chosen period may result in reduced rewards or penalties, depending on the current staking rules.</p>
            </Note>
          </>
        );
      case 'rarity':
        return (
          <>
            <SectionTitle>Understanding Rarity</SectionTitle>
            <Paragraph>
              Each MONALIEN has a unique combination of traits that determines its rarity. Understanding
              rarity is crucial for collectors who want to make informed decisions about which NFTs to acquire.
            </Paragraph>
            <SubSectionTitle>Rarity Categories</SubSectionTitle>
            <Paragraph>
              MONALIENS are divided into four main rarity categories:
            </Paragraph>
            <List>
              <li><strong>Common (60%):</strong> The most frequently occurring MONALIENS</li>
              <li><strong>Rare (30%):</strong> MONALIENS with uncommon trait combinations</li>
              <li><strong>Epic (8%):</strong> MONALIENS with rare trait combinations</li>
              <li><strong>Legendary (2%):</strong> The rarest MONALIENS with the most sought-after traits</li>
            </List>
            <SubSectionTitle>Rarity Score</SubSectionTitle>
            <Paragraph>
              Each MONALIEN has a rarity score calculated based on the rarity of its individual traits.
              The rarity score is a numerical value that represents how rare a MONALIEN is compared to others
              in the collection. Higher scores indicate rarer NFTs.
            </Paragraph>
            <Paragraph>
              You can view the rarity score and rank of any MONALIEN on its detail page in the Gallery.
            </Paragraph>
            <Note>
              <p>Rarity often correlates with market value, but other factors like aesthetic appeal and utility can also influence an NFT's price.</p>
            </Note>
          </>
        );
      case 'faq':
        return (
          <>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            <SubSectionTitle>What is MONAD?</SubSectionTitle>
            <Paragraph>
              MONAD is a high-performance blockchain designed for scalability and efficiency. It offers
              fast transaction speeds and low gas fees, making it ideal for NFT projects like MONALIENS.
            </Paragraph>
            <SubSectionTitle>How many MONALIENS exist?</SubSectionTitle>
            <Paragraph>
              There are exactly 1,111 MONALIENS in the collection. This number is fixed and no more will
              ever be created, ensuring the scarcity of the collection.
            </Paragraph>
            <SubSectionTitle>Can I sell my MONALIEN?</SubSectionTitle>
            <Paragraph>
              Yes, you can sell your MONALIEN on any marketplace that supports MONAD NFTs. You can also
              list it directly on our website's Gallery section.
            </Paragraph>
            <SubSectionTitle>What are the benefits of holding MONALIENS?</SubSectionTitle>
            <Paragraph>
              MONALIENS holders enjoy several benefits, including:
            </Paragraph>
            <List>
              <li>Staking rewards in MONAD tokens</li>
              <li>Access to exclusive community events</li>
              <li>Voting rights on future collection developments</li>
              <li>Whitelist spots for future drops</li>
              <li>Potential airdrops and other rewards</li>
            </List>
            <SubSectionTitle>How do I report issues or get help?</SubSectionTitle>
            <Paragraph>
              If you encounter any issues or have questions, you can reach out to our support team through
              the following channels:
            </Paragraph>
            <List>
              <li>Discord: discord.gg/monaliens</li>
              <li>Twitter: @MonaliensNFT</li>
              <li>Email: support@monaliens.xyz</li>
            </List>
            <Note>
              <p>Our team is committed to providing timely support to all MONALIENS holders and community members.</p>
            </Note>
          </>
        );
      default:
        return (
          <Paragraph>Please select a topic from the sidebar to view documentation.</Paragraph>
        );
    }
  };
  
  return (
    <DocsContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Documentation
      </PageTitle>
      
      <MobileSidebarToggle onClick={toggleSidebar}>
        {showSidebar ? 'Hide Menu' : 'Show Menu'} 
        {showSidebar ? '▲' : '▼'}
      </MobileSidebarToggle>
      
      <DocsLayout>
        {showSidebar && (
          <Sidebar>
            <SidebarTitle>Documentation</SidebarTitle>
            <NavList>
              <NavItem active={activeSection === 'introduction'}>
                <a href="#introduction" onClick={() => handleNavClick('introduction')}>Introduction</a>
              </NavItem>
              <NavItem active={activeSection === 'getting-started'}>
                <a href="#getting-started" onClick={() => handleNavClick('getting-started')}>Getting Started</a>
                {activeSection === 'getting-started' && (
                  <SubNavList>
                    <NavItem>
                      <a href="#wallet-setup">Wallet Setup</a>
                    </NavItem>
                    <NavItem>
                      <a href="#connecting">Connecting</a>
                    </NavItem>
                  </SubNavList>
                )}
              </NavItem>
              <NavItem active={activeSection === 'buying'}>
                <a href="#buying" onClick={() => handleNavClick('buying')}>Buying MONALIENS</a>
              </NavItem>
              <NavItem active={activeSection === 'staking'}>
                <a href="#staking" onClick={() => handleNavClick('staking')}>Staking</a>
              </NavItem>
              <NavItem active={activeSection === 'rarity'}>
                <a href="#rarity" onClick={() => handleNavClick('rarity')}>Rarity Guide</a>
              </NavItem>
              <NavItem active={activeSection === 'faq'}>
                <a href="#faq" onClick={() => handleNavClick('faq')}>FAQ</a>
              </NavItem>
            </NavList>
          </Sidebar>
        )}
        
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </DocsLayout>
    </DocsContainer>
  );
};

export default DocsPage; 