import React from 'react';
import './App.css';
import Header from './components/Header';
import NFTScroll from './components/NFTScroll';
import MagicEdenCard from './components/MagicEdenCard';

function App() {
  return (
    <div className="app">
      <Header />
      <div 
        data-us-project="MdCXQQFs4xkeVlwhrGKV" 
        className="background-animation"
      />
      <MagicEdenCard />
      <NFTScroll />
    </div>
  );
}

export default App; 