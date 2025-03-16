import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import '../styles/SpinPage.css';

// Definition of rewards - Arranged as shown in the visual
const REWARDS = [
  { id: 1, type: 'try_again', label: 'TRY AGAIN', chance: 25 },
  { id: 2, type: 'monad', value: 10, label: '10 MONAD', chance: 10 },
  { id: 3, type: 'mona', value: 500, label: '500 $MONA', chance: 5 },
  { id: 4, type: 'monad', value: 100, label: '100 MONAD', chance: 2 },
  { id: 5, type: 'mona', value: 100, label: '100 $MONA', chance: 8 },
  { id: 6, type: 'monad', value: 1, label: '1 MONAD', chance: 15 },
  { id: 7, type: 'try_again', label: 'TRY AGAIN', chance: 35 },
];

// Reward order to be displayed on screen - Exactly matched to the screen image
const DISPLAY_ORDER = [
  { id: 7, type: 'monad', value: 10, label: '10 MONAD', chance: 10 },      // 0 - 10 MONAD - leftmost
  { id: 1, type: 'try_again', label: 'TRY AGAIN', chance: 25 },        // 1 - TRY AGAIN
  { id: 3, type: 'mona', value: 500, label: '500 $MONA', chance: 5 }, // 2 - 500 $MONA
  { id: 4, type: 'monad', value: 100, label: '100 MONAD', chance: 2 },     // 3 - 100 MONAD
  { id: 5, type: 'mona', value: 100, label: '100 $MONA', chance: 8 }, // 4 - 100 $MONA
  { id: 6, type: 'monad', value: 1, label: '1 MONAD', chance: 15 },        // 5 - 1 MONAD
  { id: 7, type: 'try_again', label: 'TRY AGAIN', chance: 25 },        // 6 - TRY AGAIN
  { id: 7, type: 'try_again', label: 'TRY AGAIN', chance: 25 },        // 7 - TRY AGAIN - right side
  { id: 8, type: 'monad', value: 10, label: '10 MONAD', chance: 10 },      // 8 - 10 MONAD - rightmost  
];

// Multiply the rewards
const generateRewardRow = (count = 40) => {
  const repeatedRewards = [];
  for (let i = 0; i < count; i++) {
    repeatedRewards.push(...DISPLAY_ORDER);
  }
  return repeatedRewards;
};

const SpinPage = () => {
  const { walletState } = useWallet();
  const [freeSpins, setFreeSpins] = useState(3); // 3 free spins as shown in the visual
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const spinRowRef = useRef(null);
  const [rewardRow] = useState(generateRewardRow());
  const [initialPosition, setInitialPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(null); // New state to remember the last position
  const [showConfetti, setShowConfetti] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 1,
      address: 'Javid',
      reward: { label: '0.1 MONAD' },
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 2,
      address: '0x4f...6fdb',
      reward: { label: '100 $MONA' },
      timestamp: new Date(Date.now() - 960000) // 16 minutes ago
    },
    {
      id: 3,
      address: '0xad...0c7b',
      reward: { label: '0.1 MONAD' },
      timestamp: new Date(Date.now() - 1140000) // 19 minutes ago
    }
  ]);
  
  const spinContainerRef = useRef(null);
  
  // Setting animation values
  const spinDuration = 4000; // 4 seconds
  const itemWidth = 110; // Narrower reward items as in the visual
  
  // Prepare rewards on initial load
  useEffect(() => {
    if (spinContainerRef.current && spinRowRef.current) {
      // Center the rewards on initial load
      initializeRewards();
      
      // Recenter when browser size changes
      window.addEventListener('resize', initializeRewards);
      
      return () => {
        window.removeEventListener('resize', initializeRewards);
      };
    }
  }, []);
  
  // Preparation and centering of the reward strip
  const initializeRewards = () => {
    if (!spinContainerRef.current || !spinRowRef.current) return;
    
    const containerWidth = spinContainerRef.current.offsetWidth;
    // Center position of the indicator
    const centerPosition = containerWidth / 2;
    
    if (lastPosition === null) {
      // Calculate the amount of offset needed to center the first reward
      // Calculation to align the center of the reward element with the center of the indicator
      const initialOffset = centerPosition - (itemWidth / 2);
      
      // Disable transition and move to position immediately
      spinRowRef.current.style.transition = 'none';
      spinRowRef.current.style.transform = `translateX(${initialOffset}px)`;
      
      // Save the last position
      setLastPosition(initialOffset);
      
      console.log(`Initial position set: ${initialOffset}`);
    }
    
    // Force reflow
    void spinRowRef.current.offsetHeight;
    
    // Enable animation
    setTimeout(() => {
      spinRowRef.current.style.transition = 'transform 0.2s linear';
    }, 50);
  };

  // Reward selection function
  const selectRandomIndex = () => {
  const forcedIndex = null;

  if (isForcedIndexValid.call(this, forcedIndex, DISPLAY_ORDER)) {
    console.log(`Forced reward: ${DISPLAY_ORDER[forcedIndex].label}`);
    return forcedIndex;
  }

  const totalChance = DISPLAY_ORDER.reduce((sum, reward) => sum + reward.chance, 0);
  const random = Math.random() * totalChance;
  let accumulatedChance = 0;

  for (let i = 0; i < DISPLAY_ORDER.length; i++) {
    accumulatedChance += DISPLAY_ORDER[i].chance;
    if (random <= accumulatedChance) {
      console.log(`Selected reward: ${DISPLAY_ORDER[i].label} (index: ${i})`);
      return i;
    }
  }

  return 0;
};

function isForcedIndexValid(forcedIndex, displayOrder) {
  return forcedIndex !== null && forcedIndex >= 0 && forcedIndex < displayOrder.length;
}

  // Sinusoidal easing function - for more natural movement
  const easeInOutSine = (t) => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  // Spin function
  const handleSpin = () => {
    //if (isSpinning || freeSpins <= 0 || !spinRowRef.current) return;
    if (isSpinning) return;
    if (freeSpins <= 0 ) return;
    if (!spinRowRef.current) return;
    setIsSpinning(true);
    setFreeSpins(prev => prev - 1);
    setSpinResult(null);
    setShowConfetti(false);
    
    // Select a random target index
    const targetIndex = selectRandomIndex();
    const selectedReward = DISPLAY_ORDER[targetIndex];
    
    console.log(`Winning reward: ${selectedReward.label} (index: ${targetIndex})`);
    
    // Strip and container dimensions
    const rowWidth = DISPLAY_ORDER.length * itemWidth;
    const containerWidth = spinContainerRef.current.offsetWidth;
    
    // Current position and center
    let currentPosition = lastPosition;
    const centerPosition = containerWidth / 2;
    
    // Reposition the strip if it has moved too far away
    const moveThreshold = -10000; 
    if (currentPosition < moveThreshold) {
      const resetDistance = rowWidth * 3;
      currentPosition += resetDistance;
      
      spinRowRef.current.style.transition = 'none';
      spinRowRef.current.style.transform = `translateX(${currentPosition}px)`;
      
      void spinRowRef.current.offsetHeight;
      spinRowRef.current.style.transition = 'transform 0.2s linear';
      
      setLastPosition(currentPosition);
      console.log(`Strip repositioned: ${currentPosition}`);
    }
    
    // *** NEW ALGORITHM - For more accurate calculation ***
    
    // Current exact position of the strip
    const stripCurrentPosition = currentPosition;
    
    // Leftmost visible item in the viewport
    const firstVisibleItemIndex = Math.floor((-stripCurrentPosition) / itemWidth);
    console.log(`Leftmost visible item index: ${firstVisibleItemIndex % DISPLAY_ORDER.length}`);
    
    // Center indicator position (fixed - in the middle)
    const indicatorPosition = containerWidth / 2;
    console.log(`Indicator position: ${indicatorPosition}`);
    
    // Calculate positions of items in the viewport
    let visibleItemsPositions = [];
    
    // Calculate 10 visible items (those visible on screen and a bit more)
    for (let i = 0; i < 10; i++) {
      const itemIndex = (firstVisibleItemIndex + i) % DISPLAY_ORDER.length;
      const itemPositionLeft = stripCurrentPosition + (firstVisibleItemIndex + i) * itemWidth;
      const itemCenter = itemPositionLeft + (itemWidth / 2);
      
      visibleItemsPositions.push({
        index: itemIndex,
        center: itemCenter,
        distanceToIndicator: Math.abs(indicatorPosition - itemCenter)
      });
    }
    
    // Find the closest item (the one closest to the indicator)
    const closestItem = visibleItemsPositions.sort((a, b) => a.distanceToIndicator - b.distanceToIndicator)[0];
    console.log(`Item closest to indicator: ${DISPLAY_ORDER[closestItem.index].label}, distance: ${closestItem.distanceToIndicator}px`);
    
    // Minimum number of turns
    const minTurns = 5;
    
    // Full turn distance
    const fullTurnsDistance = minTurns * (DISPLAY_ORDER.length * itemWidth);
    
    // Calculate distance to target
    // Take the difference between target index and closest item index, add to full turn distance
    // This ensures the spin will always stop at the target item
    const itemsBetween = (targetIndex - closestItem.index + DISPLAY_ORDER.length) % DISPLAY_ORDER.length;
    const distanceToTarget = itemsBetween * itemWidth;
    
    console.log(`Steps to target item: ${itemsBetween} items (${distanceToTarget}px)`);
    
    // Total movement distance
    const totalMoveDistance = fullTurnsDistance + distanceToTarget;
    
    // New position
    const finalPosition = stripCurrentPosition - totalMoveDistance;
    
    console.log(`Total movement distance: ${totalMoveDistance}px`);
    console.log(`Starting position: ${stripCurrentPosition}px, Final position: ${finalPosition}px`);
    
    // Animation timer
    let startTime = null;
    
    // Using requestAnimationFrame for smooth animation
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Is animation complete?
      if (elapsed >= spinDuration) {
        // Move to final position and stop animation
        spinRowRef.current.style.transform = `translateX(${finalPosition}px)`;
        setLastPosition(finalPosition); // Update last position
        setIsSpinning(false);
        setSpinResult(selectedReward);
        
        console.log(`Animation completed. Final position: ${finalPosition}`);
        console.log(`Winning reward: ${selectedReward.label}`);
        
        // Win check and activity update
        if (selectedReward.type !== 'try_again') {
          setShowConfetti(true);
          
          const walletAddress = walletState && walletState.address 
                           ? walletState.address 
                           : '0xef...09206';
          
          const newActivity = {
            id: Date.now(),
            address: walletAddress,
            reward: selectedReward,
            timestamp: new Date()
          };
          setActivities(prev => [newActivity, ...prev]);
        }
        return;
      }
      
      // Animation progress (between 0 and 1)
      const progress = elapsed / spinDuration;
      
      // More natural easing function
      const easeValue = easeInOutSine(progress);
      
      // Calculate the total distance and apply new position
      const moveAmount = totalMoveDistance * easeValue;
      const newPosition = stripCurrentPosition - moveAmount;
      
      // Apply new position
      spinRowRef.current.style.transform = `translateX(${newPosition}px)`;
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    console.log(`Spin starting! Target: ${selectedReward.label} (index: ${targetIndex})`);
    
    // Start animation
    requestAnimationFrame(animate);
  };

  // Claim rewards
  const handleClaimRewards = () => {
    // Here rewards can be sent to blockchain
    alert('Rewards successfully claimed!');
  };

  // Time format adjustment
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="spin-page">
      <div className="spin-header">
        <h2>SPIN AND WIN</h2>
      </div>
      
      <div className="spin-container" ref={spinContainerRef}>
        <div className="rewards-row" ref={spinRowRef}>
          {rewardRow.map((reward, index) => (
            <div key={index} className="reward-item">
              <div className={`reward-icon ${reward.type}`}>
                {reward.type === 'try_again' ? (
                  <div className="try-again-content">TRY AGAIN</div>
                ) : reward.type === 'monad' ? (
                  <div className="monad-token">
                    <div className="monad-stripes"></div>
                  </div>
                ) : reward.type === 'mona' ? (
                  <div className="mona-token">
                    <span>$Ø</span>
                  </div>
                ) : (
                  <div className="default-icon">?</div>
                )}
              </div>
              <div className="reward-label">{reward.label}</div>
            </div>
          ))}
        </div>
        
        <div className="indicator-container">
          <div className="indicator"></div>
        </div>
      </div>
      
      <div className="spin-status">
        <h3>YOU HAVE {freeSpins} FREE SPINS</h3>
        
        <div className="spin-actions">
          <button 
            className={`spin-button ${isSpinning ? 'spinning' : ''}`} 
            onClick={handleSpin} 
            disabled={isSpinning || freeSpins <= 0}
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
          
          <button 
            className="claim-button" 
            onClick={handleClaimRewards}
          >
            Claim Prizes
          </button>
        </div>
        
        {spinResult && spinResult.type !== 'try_again' && (
          <div className="win-notification">
            <div className="win-icon">{showConfetti && '🎉'}</div>
            <div className="win-message">
              Congratulations! You won {spinResult.label}!
            </div>
          </div>
        )}
      </div>
      
      <div className="activity-section">
        <h3>ACTIVITY</h3>
        <div className="activity-log">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-user">
                  <div className="user-avatar"></div>
                  <span className="user-address">
                    {typeof activity.address === 'string' && activity.address.includes('0x') 
                      ? `${activity.address.substring(0, 4)}...${activity.address.substring(activity.address.length - 4)}`
                      : activity.address}
                  </span>
                </div>
                <div className="activity-details">
                  has won {activity.reward.label}
                </div>
                <div className="activity-time">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">No activity yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinPage; 