import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import NFTScroll from './components/NFTScroll';
import MagicEdenCard from './components/MagicEdenCard';

function App() {
  useEffect(() => {
    // Unicorn Studio script'ini ekle
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.17/dist/unicornStudio.umd.js";
      script.onload = function() {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="first-page">
        <div 
          data-us-project="MdCXQQFs4xkeVlwhrGKV" 
          style={{width: "100vw", height: "100vh"}}
        />
        <MagicEdenCard />
        <NFTScroll />
      </div>
      <div 
        data-us-project="az8Fz0DbSJR8dREhGlUY" 
        style={{width: "100vw", height: "100vh"}}
      />
    </div>
  );
}

export default App; 