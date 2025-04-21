import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
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
  const { walletState, connectWallet } = useWallet();
  const [freeSpins, setFreeSpins] = useState(3); // 3 free spins as shown in the visual
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const spinRowRef = useRef(null);
  const [rewardRow] = useState(generateRewardRow());
  const [initialPosition, setInitialPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(null); // New state to remember the last position
  const [showConfetti, setShowConfetti] = useState(false);
  const [txHash, setTxHash] = useState(null); // Transaction hash için state
  const [txStatus, setTxStatus] = useState(null); // Transaction durumu için state
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajları için
  const [showError, setShowError] = useState(false); // Hata gösterim durumu
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
      // İlk görünür ödül öğesini göstergeyle hizala
      // Merkez hizalama için gerekli ilk ofset değerini hesapla
      // Görünür ekranın ortasındaki işaretçi ile ilk ödülün hizalanması için
      const initialOffset = centerPosition - itemWidth / 2;
      
      // Geçiş animasyonunu devre dışı bırak ve konuma anında taşı
      spinRowRef.current.style.transition = 'none';
      spinRowRef.current.style.transform = `translateX(${initialOffset}px)`;
      
      // Son konumu kaydet
      setLastPosition(initialOffset);
      
      console.log(`Initial position set: ${initialOffset}`);
    } else {
      // Şerit yanlış konuma kaydıysa yeniden merkezle
      const totalItems = rewardRow.length;
      const totalWidth = totalItems * itemWidth;
      
      // Mevcut konumun ekranın çok dışında olup olmadığını kontrol et
      if (Math.abs(lastPosition) > totalWidth / 2) {
        const newPosition = centerPosition - itemWidth / 2;
        
        spinRowRef.current.style.transition = 'none';
        spinRowRef.current.style.transform = `translateX(${newPosition}px)`;
        
        setLastPosition(newPosition);
        console.log(`Recentered at: ${newPosition}`);
      }
    }
    
    // Yeniden akışı zorla
    void spinRowRef.current.offsetHeight;
    
    // Animasyonu etkinleştir
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
      
      // Transaction hash'i kaydet
      setTxHash(txResponse.hash);
      setTxStatus("sent");
      
      // Kazanılan ödülü console'a kaydet
      console.log(`Reward earned: ${reward ? reward.label : 'Unknown'}`);
      
      // Activity kaydını şimdi oluşturmuyoruz, spin animasyonu bitince eklenecek
      const newActivity = {
        id: Date.now(),
        address: walletState.address,
        reward: { label: reward ? reward.label : 'Unknown' },
        timestamp: new Date(),
        txHash: txResponse.hash
      };
      
      // Daha sonra kullanmak üzere oluşturulan aktivite kaydını döndürüyoruz
      // Activity listesine şimdi eklemiyoruz
      
      // Transaction onayını bekle
      console.log("Waiting for transaction confirmation...");
      try {
        await txResponse.wait();
        console.log("Transaction confirmed!");
        setTxStatus("confirmed");
      } catch (waitError) {
        console.error("Transaction confirmation error:", waitError);
        // Onaylama hatası olsa bile hash elimizde, başarılı sayabiliriz
      }
      
      // Transaction hash ve oluşturulan aktivite kaydıyla birlikte döndür
      return { hash: txResponse.hash, activity: newActivity };
    } catch (error) {
      console.error("Transaction error:", error);
      setTxStatus("error");
      return null;
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
    
    // İşlem başlatıldığını göster (tam olarak dönmeye başlamayacak)
    // Burada sadece "İşlem gönderiliyor..." gibi bir durum gösterilecek
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
        // Store final position for next spin
        // Pozisyonu yuvarlayarak daha kesin bir hizalama sağlayalım
        // itemWidth'e böl ve çarp ki tam ödül genişliğinin katlarına hizalansın
        const finalAdjustedPosition = Math.round(finalPosition / itemWidth) * itemWidth;
        spinRowRef.current.style.transform = `translateX(${finalAdjustedPosition}px)`;
        setLastPosition(finalAdjustedPosition);
        
        console.log(`Animation complete. Final position: ${finalAdjustedPosition}px`);
        
        // Göstergeye en yakın ödülü daha doğru hesaplama
        // Bu, göstergenin tam altındaki ödülü bulacak
        setTimeout(() => {
          // İlk olarak göstergenin tam pozisyonunu alalım
          const indicatorRect = document.querySelector('.indicator').getBoundingClientRect();
          const indicatorCenterX = indicatorRect.left + (indicatorRect.width / 2);
          
          // Tüm görünür ödülleri kontrol edelim ve hangisinin göstergenin altında olduğunu bulalım
          const rewardItems = document.querySelectorAll('.reward-item');
          let closestItem = null;
          let minDistance = Number.MAX_VALUE;
          
          rewardItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + (itemRect.width / 2);
            const distance = Math.abs(indicatorCenterX - itemCenterX);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = {
                element: item,
                index: index % DISPLAY_ORDER.length
              };
            }
          });
          
          // Eğer alınan mesafe çok büyükse (30px'den fazla), muhtemelen siyah bir boşlukta kalmıştır
          // Bu durumda pozisyonu yeniden ayarlayalım
          if (minDistance > 30 && rewardItems.length > 0) {
            console.log(`Warning: Indicator might be in a gap, distance: ${minDistance}px`);
            
            // En yakın öğeyi alalım ve şeridi yeniden konumlandıralım
            const closestItemRect = closestItem.element.getBoundingClientRect();
            const closestItemCenterX = closestItemRect.left + (closestItemRect.width / 2);
            const indicatorX = indicatorRect.left + (indicatorRect.width / 2);
            
            // Şeridi kaydırmak için gereken mesafeyi hesaplayalım
            const adjustmentNeeded = indicatorX - closestItemCenterX;
            
            // Mevcut konumu alalım ve ayarlayalım
            const currentTransform = getComputedStyle(spinRowRef.current).transform;
            const matrix = new DOMMatrix(currentTransform);
            const currentX = matrix.m41; // mevcut X transform değeri
            
            const newPosition = currentX - adjustmentNeeded;
            spinRowRef.current.style.transition = 'transform 0.3s ease-out';
            spinRowRef.current.style.transform = `translateX(${newPosition}px)`;
            
            // Son konumu güncelle
            setLastPosition(newPosition);
            
            // Kısa bir süre bekleyip tekrar ödülü belirleme
            setTimeout(() => determineWinningReward(), 350);
            return;
          }
          
          // Ödülü belirle ve UI'ı güncelle
          determineWinningReward();
          
          function determineWinningReward() {
            // Bu işlev önceki kodun aynısını içeriyor, sadece daha düzenli bir şekilde
            if (closestItem) {
              const actualIndex = closestItem.index % DISPLAY_ORDER.length;
              console.log(`Closest visible item index: ${actualIndex}`);
              
              // Gerçekte göstergenin altında duran ödülü al
              const actualWinningReward = DISPLAY_ORDER[actualIndex];
              console.log(`Actual reward under indicator: ${actualWinningReward.label}`);
              
              // Kazanılan ödülü ayarla
              setSpinResult(actualWinningReward);
              
              // Konfeti göster (eğer gerçek bir ödülse)
              if (actualWinningReward.type !== 'try_again') {
                setShowConfetti(true);
              }
              
              // Analitik için log
              console.log(`Reward earned: ${actualWinningReward.label}`);
              
              // Spin animasyonu tamamlandıktan sonra activity'yi güncelle
              if (pendingActivity) {
                // Activity'nin ödül bilgisini gerçekte kazanılan ödül olarak güncelle
                const updatedActivity = {
                  ...pendingActivity,
                  reward: { label: actualWinningReward.label }
                };
                
                // Şimdi activity listesine ekle - animasyon bittikten sonra
                setActivities(prevActivities => [updatedActivity, ...prevActivities]);
              }
              
              setIsSpinning(false);
            } else {
              // Görünür öğe bulunamadıysa varsayılan seçilen ödülü kullan
              console.log(`Fallback to original selected reward: ${selectedReward.label}`);
              setSpinResult(selectedReward);
              
              if (selectedReward.type !== 'try_again') {
                setShowConfetti(true);
              }
              
              // Yine de activity'yi ekleyelim, ama spin bittikten sonra
              if (pendingActivity) {
                setActivities(prevActivities => [pendingActivity, ...prevActivities]);
              }
              
              setIsSpinning(false);
            }
          }
        }, 300);
      }
    };
    
    // Easing function for natural deceleration
    const cubicEaseOut = (t) => {
      return 1 - Math.pow(1 - t, 3);
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

  return (
    <div className="spin-page">
      {/* UnicornStudio arkaplan animasyonu */}
      <div className="unicorn-background">
        <div data-us-project="zKfL2gSUgaRLnbJp2M7p" style={{ width: '100%', height: '100%' }}></div>
      </div>
      
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
      
      {/* Pop-up şeklinde gösterilecek kazanılan ödül bildirimi */}
      {spinResult && spinResult.type !== 'try_again' && (
        <div className="reward-popup">
          <div className="reward-popup-content">
            <div className="reward-popup-icon">{showConfetti && '🎉'}</div>
            <h3 className="reward-popup-title">CONGRATULATIONS!</h3>
            <div className="reward-popup-message">
              YOU WON <span className="reward-highlight">{spinResult.label}</span>!
            </div>
            
            {/* Transaction bilgisini göster */}
            {txHash && (
              <div className="tx-info">
                <p className="tx-status">
                  Transaction Status: 
                  <span className={`status-${txStatus}`}>
                    {txStatus === "pending" ? " Preparing" : 
                     txStatus === "sent" ? " Sent, Awaiting Confirmation" : 
                     txStatus === "confirmed" ? " Confirmed ✓" : 
                     txStatus === "error" ? " Failed ✗" : " Unknown"}
                  </span>
                  
                  {(txStatus === "pending" || txStatus === "sent") && (
                    <div className="loading-spinner small-spinner"></div>
                  )}
                </p>
                
                <p className="tx-explainer">
                  {txStatus === "confirmed" ? 
                    "Your transaction has been successfully confirmed on the blockchain." :
                    txStatus === "sent" ? 
                    "Your transaction has been sent to the network and is awaiting confirmation." :
                    ""}
                </p>
                
                <a 
                  href={`https://testnet.monadexplorer.com/tx/${txHash}`} 
                  className="tx-link"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on Block Explorer
                </a>
              </div>
            )}
            
            <button className="reward-popup-close" onClick={() => setSpinResult(null)}>CONTINUE</button>
          </div>
        </div>
      )}
      
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
                  {activity.txHash && (
                    <a 
                      href={`https://testnet.monadexplorer.com/tx/${activity.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="activity-tx-link"
                      title="View transaction on explorer"
                    >
                      <span className="tx-icon">↗</span>
                    </a>
                  )}
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