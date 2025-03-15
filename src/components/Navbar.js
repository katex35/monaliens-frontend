import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';

const Nav = styled.nav`
  background-color: var(--bg-primary);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    width: 40px;
    height: 40px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const ConnectButton = styled.button`
  background-color: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(NavLink)`
  display: block;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isConnected, connectWallet, disconnectWallet } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleWalletConnection = async () => {
    try {
      if (isConnected) {
        disconnectWallet();
      } else {
        await connectWallet();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Cüzdan bağlantısında bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    }
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <img src="/monaliens.jpg" alt="MONALIENS" />
          MONALIENS
        </Logo>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/staking">Staking</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/docs">Docs</NavLink>
        </NavLinks>

        <NavButtons>
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </ThemeToggle>
          
          <ConnectButton onClick={handleWalletConnection}>
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </ConnectButton>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </NavButtons>
      </NavContainer>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={toggleMobileMenu}>Home</MobileNavLink>
        <MobileNavLink to="/gallery" onClick={toggleMobileMenu}>Gallery</MobileNavLink>
        <MobileNavLink to="/staking" onClick={toggleMobileMenu}>Staking</MobileNavLink>
        <MobileNavLink to="/profile" onClick={toggleMobileMenu}>Profile</MobileNavLink>
        <MobileNavLink to="/docs" onClick={toggleMobileMenu}>Docs</MobileNavLink>
      </MobileMenu>
    </Nav>
  );
};

export default Navbar; 