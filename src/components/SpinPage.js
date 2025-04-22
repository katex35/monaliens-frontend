import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import '../styles/SpinPage.css';

// Ses dosyalarını import et
import spinSound from '../assets/sounds/spin.mp3';
import winSound from '../assets/sounds/win.mp3';
import tryAgainSound from '../assets/sounds/try-again.mp3';
import monadWinSound from '../assets/sounds/monad-win.mp3';
import monaWinSound from '../assets/sounds/mona-win.mp3';

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
  const { walletState, connectWallet } = useWallet();
  const [freeSpins, setFreeSpins] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const spinRowRef = useRef(null);
  const [rewardRow] = useState(generateRewardRow());
  const [initialPosition, setInitialPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  
  const spinContainerRef = useRef(null);
  
  const spinDuration = 4000;
  const itemWidth = 110;

  const spinSoundRef = useRef(new Audio(spinSound));
  const winSoundRef = useRef(new Audio(winSound));
  const tryAgainSoundRef = useRef(new Audio(tryAgainSound));
  const monadWinSoundRef = useRef(new Audio(monadWinSound));
  const monaWinSoundRef = useRef(new Audio(monaWinSound));

  useEffect(() => {
    const initializeSpinPosition = () => {
      if (!spinContainerRef.current || !spinRowRef.current) return;
      
      const containerWidth = spinContainerRef.current.offsetWidth;
      const centerPosition = containerWidth / 2;
      const initialOffset = centerPosition - itemWidth / 2;
      
      spinRowRef.current.style.transition = 'none';
      spinRowRef.current.style.transform = `translateX(${initialOffset}px)`;
      setLastPosition(initialOffset);
      
      // Force reflow
      void spinRowRef.current.offsetHeight;
      
      // Re-enable transitions after a short delay
      setTimeout(() => {
        if (spinRowRef.current) {
          spinRowRef.current.style.transition = 'transform 0.2s linear';
        }
      }, 50);
    };

    // İlk yüklemede ve pencere boyutu değiştiğinde çalıştır
    initializeSpinPosition();
    window.addEventListener('resize', initializeSpinPosition);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', initializeSpinPosition);
    };
  }, [itemWidth]);

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

  // Monad Testnet'e transaction gönderme fonksiyonu
  const sendSpinTransaction = async (reward) => {
    if (!walletState.isConnected || !walletState.web3 || !walletState.provider) {
      console.error("Wallet not connected or provider not found");
      return null;
    }

    try {
      setTxStatus("pending");
      console.log("Preparing transaction for spin operation...");
      
      // Kullanıcı cüzdanının ağ bilgilerini kontrol et
      let chainId;
      try {
        chainId = await walletState.provider.getNetwork().then(network => network.chainId);
      } catch (networkError) {
        console.error("Ağ bilgisi alınamadı:", networkError);
        setTxStatus("error");
        return null;
      }
      
      // Doğru ağda olduğumuzu kontrol et
      if (chainId !== 10143n) { // BigInt olarak 10143 (Monad Testnet)
        const errMsg = `Yanlış ağ, Monad Testnet (10143) gerekli, şu an: ${chainId.toString()}`;
        console.error(errMsg);
        setTxStatus("error");
        return null;
      }

      // Signer oluştur
      let signer;
      try {
        signer = await walletState.provider.getSigner();
      } catch (signerError) {
        console.error("Signer oluşturulamadı:", signerError);
        setTxStatus("error");
        return null;
      }
      
      // Çok basit bir işlem gönder - sadece minimal değerde token transferi
      const tx = {
        to: walletState.address, // Kendi adresine gönder
        value: ethers.parseEther("0.000001"), // Minimal değer
        // Data alanı olmadan, basit bir transfer işlemi
        gasLimit: 50000, // Daha düşük gas limit ile deneyelim
      };

      console.log("Transaction oluşturuldu, gönderiliyor...");
      
      let txResponse;
      try {
        // İşlemi gönder
        txResponse = await signer.sendTransaction(tx);
        console.log("Transaction gönderildi:", txResponse.hash);
        setTxHash(txResponse.hash);
        setTxStatus("sent");
        
        // Transaction onayını bekle
        console.log("Transaction onayı bekleniyor...");
        await txResponse.wait();
        console.log("Transaction onaylandı!");
        setTxStatus("confirmed");
        
        // Transaction hash ve oluşturulan aktivite kaydıyla birlikte döndür
        return { 
          hash: txResponse.hash, 
          activity: {
            id: Date.now(),
            address: walletState.address,
            reward: { label: reward ? reward.label : 'Unknown' },
            timestamp: new Date(),
            txHash: txResponse.hash
          }
        };
      } catch (txError) {
        // İşlem gönderme hatası durumunda daha detaylı hata mesajı
        console.error("Transaction gönderme hatası:", txError);
        
        // Hata mesajını analiz et
        let errMsg = "Bilinmeyen hata";
        
        if (txError.code === 4001) {
          errMsg = "İşlem kullanıcı tarafından reddedildi";
        } else if (txError.code === -32603) {
          errMsg = "Dahili RPC hatası: " + (txError.message || "");
          
          // Data hatasını kontrol et
          if (txError.message && txError.message.includes("cannot include data")) {
            errMsg = "Bu ağda data alanı kullanılamıyor";
          }
        } else if (txError.reason) {
          errMsg = txError.reason;
        }
        
        console.error("Hata detayı:", errMsg);
        console.error(errMsg);
        setTxStatus("error");
        return null;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setTxStatus("error");
      return null;
    }
  };

  // Ses çalma fonksiyonları
  const playSpinSound = () => {
    spinSoundRef.current.currentTime = 0;
    spinSoundRef.current.play();
  };

  const playRewardSound = (rewardType) => {
    switch(rewardType) {
      case 'try_again':
        tryAgainSoundRef.current.currentTime = 0;
        tryAgainSoundRef.current.play();
        break;
      case 'monad':
        monadWinSoundRef.current.currentTime = 0;
        monadWinSoundRef.current.play();
        break;
      case 'mona':
        monaWinSoundRef.current.currentTime = 0;
        monaWinSoundRef.current.play();
        break;
      default:
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play();
    }
  };

  // Spin fonksiyonu güncelleniyor
  const handleSpin = async () => {
    if (isSpinning) return;
    if (freeSpins <= 0) return;
    if (!spinRowRef.current) return;
    if (!walletState.isConnected) {
      alert('Lütfen cüzdanınızı bağlayın');
      return;
    }
    
    // Monad Testnet'te olduğumuzu kontrol et
    if (walletState.chainId !== 10143) {
      alert('Lütfen Monad Testnet ağına geçiş yapın');
      return;
    }
    
    // UI statelerini hazırla
    setSpinResult(null);
    setShowConfetti(false);
    setTxHash(null);
    setTxStatus(null);
    
    // İşlem başlatıldığını göster
    setTxStatus("initiating");
    
    // Rastgele hedef indeks seç
    const targetIndex = selectRandomIndex();
    const selectedReward = DISPLAY_ORDER[targetIndex];
    
    console.log(`Winning reward: ${selectedReward.label} (index: ${targetIndex})`);
    
    try {
      // Blockchain'e transaction gönder ve sonucunu bekle
      console.log("Spin işlemi öncesi transaction gönderiliyor...");
      
      // Spin öncesi transaction gönder
      const result = await sendSpinTransaction(selectedReward);
      
      if (!result || !result.hash) {
        // Transaction başarısız olduysa, spin işlemini başlatma
        console.error("Transaction başarısız, spin işlemi iptal edildi");
        console.error("Spin işlemi iptal edildi: " + errorMessage);
        return;
      }
      
      console.log("Transaction başarılı, spin başlatılıyor, hash:", result.hash);
      
      // Transaction activity bilgisini daha sonra kullanmak üzere saklayalım
      const pendingActivity = result.activity;
      
      // Transaction başarılıysa, spin işlemini başlat
      setIsSpinning(true);
      setFreeSpins(prev => prev - 1);

      // Spin sesi çal - transaction onaylandıktan sonra
      playSpinSound();
      
      // Şimdi spin animasyonunu başlat, ve activity kaydını bu fonksiyona gönder
      startSpinAnimation(targetIndex, selectedReward, pendingActivity);
      
    } catch (error) {
      console.error("Spin işlemi başlatılırken hata:", error);
      console.error("Spin işlemi başlatılamadı: " + error.message);
    }
  };
  
  // Spin animasyonunu başlatan yeni bir fonksiyon
  const startSpinAnimation = (targetIndex, selectedReward, pendingActivity) => {
    if (!spinRowRef.current) return;
    
    console.log("Spin animasyonu başlatılıyor...");
    
    // Şerit ve konteyner boyutları
    const rowWidth = DISPLAY_ORDER.length * itemWidth;
    const containerWidth = spinContainerRef.current.offsetWidth;
    const centerPosition = containerWidth / 2;
    
    // Mevcut konum
    let currentPosition = lastPosition;
    
    // Şerit çok uzağa kaydıysa yeniden konumlandır
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
    
    // *** YENİ ALGORİTMA - Daha doğru hesaplama için ***
    
    // Şeritin mevcut konumu
    const stripCurrentPosition = currentPosition;
    
    // Görünürdeki en soldaki öğe
    // -1 değeri ekleyerek bu hesaplamayı daha tutarlı hale getiriyoruz
    const firstVisibleItemIndex = Math.floor((-stripCurrentPosition) / itemWidth) - 1;
    console.log(`Leftmost visible item index: ${firstVisibleItemIndex % DISPLAY_ORDER.length}`);
    
    // Merkez gösterge konumu (sabit - ortada)
    const indicatorPosition = centerPosition;
    console.log(`Indicator position: ${indicatorPosition}`);
    
    // Görünürdeki öğelerin konumlarını hesapla
    let visibleItemsPositions = [];
    
    // 15 görünür öğeyi hesapla (ekranda görünenleri ve biraz daha fazlasını)
    // Bu sayıyı 10'dan 15'e çıkararak daha fazla görünür öğeyi hesaba katıyoruz
    for (let i = 0; i < 15; i++) {
      const itemIndex = (firstVisibleItemIndex + i) % DISPLAY_ORDER.length;
      const itemPositionLeft = stripCurrentPosition + (firstVisibleItemIndex + i) * itemWidth;
      const itemCenter = itemPositionLeft + (itemWidth / 2);
      
      visibleItemsPositions.push({
        index: itemIndex,
        center: itemCenter,
        distanceToIndicator: Math.abs(indicatorPosition - itemCenter)
      });
    }
    
    // En yakın öğeyi bul (göstergeye en yakın olan)
    const closestItem = visibleItemsPositions.sort((a, b) => a.distanceToIndicator - b.distanceToIndicator)[0];
    console.log(`Item closest to indicator: ${DISPLAY_ORDER[closestItem.index].label}, distance: ${closestItem.distanceToIndicator}px`);
    
    // Minimum dönüş sayısı - biraz arttırarak daha uzun animasyon sağlıyoruz
    const minTurns = 6;
    
    // Tam dönüş mesafesi
    const fullTurnsDistance = minTurns * (DISPLAY_ORDER.length * itemWidth);
    
    // Hedefe olan mesafeyi hesapla
    // Hedef indeks ile en yakın öğe indeksi arasındaki farkı al
    const itemsBetween = (targetIndex - closestItem.index + DISPLAY_ORDER.length * 2) % DISPLAY_ORDER.length;
    const distanceToTarget = itemsBetween * itemWidth;
    
    console.log(`Steps to target item: ${itemsBetween} items (${distanceToTarget}px)`);
    
    // Toplam hareket mesafesi
    // Daha yakın ve tutarlı sonuçlar için küçük bir ayar ekliyoruz
    // itemWidth/2 ekliyoruz ki gösterge her zaman bir ödülün tam ortasında dursun
    const totalMoveDistance = fullTurnsDistance + distanceToTarget + (itemWidth / 2);
    
    // Yeni konum
    const finalPosition = stripCurrentPosition - totalMoveDistance;
    
    console.log(`Total movement distance: ${totalMoveDistance}px`);
    console.log(`Starting position: ${stripCurrentPosition}px, Final position: ${finalPosition}px`);
    
    let startTime = null;
    
    // Animation function
    const animate = (currentTime) => {
      if (!spinRowRef.current) return;
      
      if (startTime === null) {
        startTime = currentTime;
      }
      
      // Total animation duration in ms, adjusted to be a bit longer
      const duration = 5000;
      const elapsedTime = currentTime - startTime;
      
      // Easing functions for smoother animation
      // Start fast, slow down as it approaches the target
      // Apply a cubic-bezier type easing effect for natural deceleration
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = cubicEaseOut(progress);
      
      // Calculate intermediate position
      const currentMove = totalMoveDistance * easedProgress;
      const position = stripCurrentPosition - currentMove;
      
      // Update transform
      spinRowRef.current.style.transform = `translateX(${position}px)`;
      
      // Continue the animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animasyon tamamlandı, şimdi ödül belirleme işlemine geçiyoruz
        finalizeSpinAndDetermineReward();
      }
    };
    
    // Easing function for natural deceleration
    const cubicEaseOut = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };
    
    // Animasyon bitişini finalize eden ve ödülü belirleyen fonksiyon
    const finalizeSpinAndDetermineReward = () => {
      try {
        // Konteyner ve göstergenin merkez konumunu belirle
        const containerRect = spinContainerRef.current.getBoundingClientRect();
        const indicatorCenterX = containerRect.left + (containerRect.width / 2);
        
        console.log("Container center position:", indicatorCenterX);
        
        // Göstergenin altına gelen ödülü bul
        findRewardUnderIndicator(indicatorCenterX);
      } catch (error) {
        console.error("Error in finalizing spin:", error);
        setIsSpinning(false);
        setSpinResult(selectedReward); // Varsayılan ödülü kullan
      }
    };
    
    // Göstergenin altındaki ödülü bulan fonksiyon
    const findRewardUnderIndicator = (indicatorCenterX) => {
      try {
        // Tüm görünür ödülleri kontrol et
        const rewardItems = document.querySelectorAll('.reward-item');
        if (rewardItems.length === 0) {
          console.error("No reward items found in the DOM");
          setIsSpinning(false);
          return;
        }
        
        let closestItem = null;
        let minDistance = Number.MAX_VALUE;
        
        // Her ödülün göstergeye olan uzaklığını hesapla
        rewardItems.forEach((item, i) => {
          try {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + (itemRect.width / 2);
            const distance = Math.abs(indicatorCenterX - itemCenterX);
            
            const displayIndex = parseInt(item.getAttribute('data-index') || i % DISPLAY_ORDER.length);
            const label = item.getAttribute('data-reward-label') || DISPLAY_ORDER[displayIndex].label;
            
            console.log(`Reward ${displayIndex} (${label}) - distance: ${distance.toFixed(2)}px, position: ${itemCenterX.toFixed(2)}`);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = {
                element: item,
                index: displayIndex,
                distance: distance,
                centerX: itemCenterX
              };
            }
          } catch (itemErr) {
            console.error("Error calculating distance for reward item:", itemErr);
          }
        });
        
        if (!closestItem) {
          console.error("Could not find closest reward item");
          setIsSpinning(false);
          return;
        }
        
        console.log(`Closest item distance: ${minDistance.toFixed(2)}px, threshold: 20px`);
        
        // Eğer uzaklık belirli bir eşiğin üzerindeyse, hizalama düzeltmesi yap
        if (minDistance > 20) {
          console.log(`Warning: Indicator might be in a gap, distance: ${minDistance.toFixed(2)}px`);
          
          const adjustmentNeeded = indicatorCenterX - closestItem.centerX;
          
          // Mevcut X pozisyonunu al
          const currentTransform = getComputedStyle(spinRowRef.current).transform;
          const matrix = new DOMMatrix(currentTransform);
          const currentX = matrix.m41;
          
          // Yeni pozisyonu hesapla
          const newPosition = currentX + adjustmentNeeded;
          console.log(`Adjusting position by ${adjustmentNeeded.toFixed(2)}px, from ${currentX.toFixed(2)} to ${newPosition.toFixed(2)}`);
          
          // Yumuşak geçişle pozisyonu ayarla
          spinRowRef.current.style.transition = 'transform 0.3s ease-out';
          spinRowRef.current.style.transform = `translateX(${newPosition}px)`;
          
          // Son konumu güncelle
          setLastPosition(newPosition);
          
          // Hizalama sonrası kısa bir bekleme ile ödülü belirle
          setTimeout(() => {
            applyWinningReward(closestItem);
          }, 350);
        } else {
          // Doğrudan ödülü belirle
          applyWinningReward(closestItem);
        }
      } catch (error) {
        console.error("Error finding reward under indicator:", error);
        setIsSpinning(false);
        setSpinResult(selectedReward); // Varsayılan ödülü kullan
      }
    };
    
    // Kazanılan ödülü uygulayan fonksiyon
    const applyWinningReward = (closestItem) => {
      try {
        // Doğru indeksi al
        const actualIndex = closestItem.index;
        console.log(`Final reward index: ${actualIndex}`);
        
        // Gerçek ödülü al
        const actualWinningReward = DISPLAY_ORDER[actualIndex];
        console.log(`Final winning reward: ${actualWinningReward.label}`);
        
        // Ödülü ayarla
        setSpinResult(actualWinningReward);
        
        // Ödül sesini çal
        playRewardSound(actualWinningReward.type);
        
        // Konfeti göster (eğer gerçek bir ödülse)
        if (actualWinningReward.type !== 'try_again') {
          setShowConfetti(true);
        }
        
        // Activity kaydını güncelle
        if (pendingActivity) {
          const updatedActivity = {
            ...pendingActivity,
            reward: { label: actualWinningReward.label }
          };
          
          // Activity listesine ekle
          //setActivities(prevActivities => [updatedActivity, ...prevActivities]);
        }
        
        // Spin durumunu güncelle
        setIsSpinning(false);
      } catch (error) {
        console.error("Error applying winning reward:", error);
        setIsSpinning(false);
        setSpinResult(selectedReward); // Varsayılan ödülü kullan
      }
    };
    
    // Start the animation
    requestAnimationFrame(animate);
  };

  // Bildirim gösterme fonksiyonu - artık kullanılmayacak
  const showNotification = (message) => {
    console.log(message); // Sadece konsola yazdırılacak
  };

  // Hata mesajını göster - artık sadece konsola yazdırılacak
  const showErrorMessage = (message) => {
    console.error(message);
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

  // Pop-up bileşeni
  const RewardPopup = ({ reward, onClose }) => {
    return (
      <div className="reward-popup">
        <div className="reward-popup-content">
          <div className="reward-popup-icon">
            {reward.type === 'try_again' ? '😢' : '🎉'}
          </div>
          <h3 className="reward-popup-title">
            {reward.type === 'try_again' ? 'TEKRAR DENE!' : 'TEBRİKLER!'}
          </h3>
          <div className="reward-popup-message">
            {reward.type === 'try_again' ? (
              'Maalesef bu sefer kazanamadın. Tekrar dene!'
            ) : (
              <>
                KAZANDIĞINIZ ÖDÜL: <span className="reward-highlight">{reward.label}</span>!
              </>
            )}
          </div>
          
          {txHash && (
            <div className="tx-info">
              <p className="tx-status">
                İşlem Durumu: 
                <span className={`status-${txStatus}`}>
                  {txStatus === "pending" ? " Hazırlanıyor" : 
                   txStatus === "sent" ? " Gönderildi, Onay Bekleniyor" : 
                   txStatus === "confirmed" ? " Onaylandı ✓" : 
                   txStatus === "error" ? " Başarısız ✗" : " Bilinmiyor"}
                </span>
                
                {(txStatus === "pending" || txStatus === "sent") && (
                  <div className="loading-spinner small-spinner"></div>
                )}
              </p>
              
              <a 
                href={`https://testnet.monadexplorer.com/tx/${txHash}`} 
                className="tx-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Block Explorer'da Görüntüle
              </a>
            </div>
          )}
          
          <button 
            className="reward-popup-close" 
            onClick={onClose}
          >
            DEVAM ET
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="spin-page">
      <div className="unicorn-background">
        <div data-us-project="zKfL2gSUgaRLnbJp2M7p" style={{ width: '100%', height: '100%' }}></div>
      </div>
      
      <div className="spin-content">
        <div className="spin-header">
          <h2>SPIN AND WIN</h2>
          {!walletState.isConnected && (
            <div className="wallet-warning">
              <p>Spin yapmak için bir cüzdan bağlamanız gerekmektedir!</p>
              <button 
                className="connect-wallet-button"
                onClick={() => {
                  if (window.ethereum) {
                    connectWallet(); 
                  } else {
                    alert("Bu işlem için bir web3 cüzdanı (MetaMask gibi) kurulu olması gereklidir. Lütfen web3 cüzdanınızı kurun ve siteyi yeniden ziyaret edin.");
                  }
                }}
              >
                Cüzdan Bağla
              </button>
            </div>
          )}
        </div>
        
        <div className="spin-container" ref={spinContainerRef}>
          <div className="top-decoration"></div>
          <div className="center-indicator"></div>
          
          <div className="rewards-container">
            <div 
              className="rewards-row" 
              ref={spinRowRef}
              style={{
                transform: `translateX(${initialPosition}px)`,
                transition: 'transform 0.2s linear'
              }}
            >
              {rewardRow.map((reward, index) => (
                <div 
                  key={index} 
                  className="reward-item"
                  data-index={index % DISPLAY_ORDER.length}
                  data-reward-type={reward.type}
                  data-reward-label={reward.label}
                >
                  <div className={`reward-icon ${reward.type}`}>
                    {reward.type === 'try_again' ? (
                      <div className="try-again-content">TRY AGAIN</div>
                    ) : reward.type === 'monad' ? (
                      <div className="monad-token">
                        <span className="monad-value">{reward.value}</span>
                        <span className="monad-symbol">M</span>
                      </div>
                    ) : reward.type === 'mona' ? (
                      <div className="mona-token">
                        <span>$Ø</span>
                      </div>
                    ) : (
                      <div className="default-icon">?</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bottom-decoration"></div>
        </div>
        
        <div className="spin-status">
          <h3>YOU HAVE {freeSpins} FREE SPINS</h3>
          
          <div className="spin-actions">
            <button 
              className={`spin-button 
                ${isSpinning ? 'spinning' : ''} 
                ${txStatus === 'initiating' ? 'tx-pending' : ''} 
                ${txStatus === 'pending' ? 'tx-pending' : ''} 
                ${txStatus === 'sent' ? 'tx-sent' : ''}
              `} 
              onClick={handleSpin} 
              disabled={isSpinning || freeSpins <= 0 || !walletState.isConnected || txStatus === 'initiating' || txStatus === 'pending' || txStatus === 'sent'}
            >
              {isSpinning ? 'Spinning...' : 
               txStatus === 'initiating' ? 'Initializing...' : 
               txStatus === 'pending' ? 'Preparing Tx...' : 
               txStatus === 'sent' ? 'Confirming...' : 
               'Spin'}
            </button>
            
            <button 
              className="claim-button" 
              onClick={handleClaimRewards}
              disabled={!walletState.isConnected}
            >
              Claim Prizes
            </button>
          </div>
        </div>
      </div>

      {spinResult && (
        <RewardPopup 
          reward={spinResult} 
          onClose={() => setSpinResult(null)} 
        />
      )}
    </div>
  );
};

export default SpinPage; 