import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import StakingPage from './pages/StakingPage';
import ProfilePage from './pages/ProfilePage';
import DocsPage from './pages/DocsPage';
import ScrollToTop from './components/ScrollToTop';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/staking" element={<StakingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/docs" element={<DocsPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App; 