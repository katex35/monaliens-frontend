import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SpinPage from './components/SpinPage';
import WalletProvider from './context/WalletContext';
import HomePage from './components/HomePage';
import BuildAliens from './components/BuildAliens';

// UnicornStudio'yu yükleme ve başlatma fonksiyonu
const initUnicornStudio = () => {
  if (!window.UnicornStudio) {
    window.UnicornStudio = { isInitialized: false };
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.18/dist/unicornStudio.umd.js";
    script.onload = function() {
      if (!window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    (document.head || document.body).appendChild(script);
  } else if (window.UnicornStudio.isInitialized) {
    // Eğer zaten yüklenmiş ve başlatılmışsa, yeniden başlat
    window.UnicornStudio.init();
  }
};

// Sayfa değişimlerini izleyen bir bileşen
function AnimationHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Sayfa değiştiğinde animasyonları yeniden başlat
    initUnicornStudio();
  }, [location]);
  
  return null;
}

function App() {
  // Uygulama başlatılırken UnicornStudio'yu yükle
  useEffect(() => {
    initUnicornStudio();
  }, []);

  return (
    <WalletProvider>
      <Router>
        <div className="app">
          <Header />
          <AnimationHandler /> {/* Animasyonları takip eden bileşen */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spin" element={<SpinPage />} />
            <Route path="/build-aliens" element={<BuildAliens />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App; 