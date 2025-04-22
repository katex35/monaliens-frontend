import React, { useState, useRef } from 'react';
import '../styles/BuildAliens.css';
import html2canvas from 'html2canvas';
import BaseBody from '../assets/Body/Base body.png';

const BuildAliens = () => {
  const previewRef = useRef(null);
  const [selectedParts, setSelectedParts] = useState({
    background: 'Sky.png',
    head: 'Alien Antennae.png',
    eyes: 'Normal Eyes.png',
    mouth: 'Normal.png',
    hands: 'Monad Staff.png',
    clothes: 'Black Shirt.png'
  });

  const parts = {
    background: [
      'Sky.png', 'Swirl.png', 'Olive.png', 'Parmesan.png', 'Lilac.png',
      'Marigold.png', 'Fuchsia.png', 'Grey.png', 'Flame.png'
    ],
    head: [
      'Alien Antennae.png', 'Angel Halo.png', 'Arrow.png', 'Bucket Hat.png',
      'Chef Hat.png', 'Crown.png', 'Devil_s Horn.png', 'Fedora hat.png',
      'Jester hat.png', 'Judge_s wig.png', 'Monad Bonnet.png', 'Monalien Cap.png',
      'Pirate Hat.png', 'Plain Green Cap.png', 'Propeller Hat.png',
      'Skull and brain.png', 'UFO.png', 'Viking Helm.png'
    ],
    eyes: [
      'Normal Eyes.png', '3D glasses.png', 'Angry.png', 'Crossed eye.png',
      'Crying.png', 'Hollow.png', 'Laser.png', 'Monad glasses.png',
      'Popped out eyes.png', 'Sleepy eyes.png', 'Square glasses.png',
      'Swag.png', 'Stoned.png', 'Visor.png', 'Wink.png'
    ],
    mouth: [
      'Normal.png', 'Buck tooth.png', 'Dirty teeth.png', 'Drool.png',
      'Gold Teeth.png', 'Gold tooth.png', 'Grin.png', 'Happy.png',
      'Long tongue.png', 'Mad.png', 'Monster Mouth.png', 'Mustache.png',
      'Pipe.png', 'Puckered lips.png', 'Rainbow Teeth.png', 'Surprised.png',
      'Tongue out.png', 'Toothy mouth.png'
    ],
    hands: [
      'Monad Staff.png', 'Axe.png', 'Balloon sword.png', 'Banana.png',
      'Baseball bat.png', 'Broom.png', 'Butcher_s knife.png', 'Candy cane.png',
      'Chicken leg.png', 'Flower.png', 'Katana.png', 'Money.png',
      'Monad flag.png', 'Ray gun.png', 'Soda bottle.png'
    ],
    clothes: [
      'Black Shirt.png', 'Barbarian Armor.png', 'Blue Cloak.png', 'Caveman.png',
      'Celestial Garb.png', 'Chef Uniform.png', 'Commander Suit.png', 'Cowboy.png',
      'Flame Armor.png', 'Floater.png', 'Floral polo.png', 'Fur coat.png',
      'Golden Armor.png', 'Hazmat suit.png', 'Lab Coat.png', 'Leather Jacket.png',
      'Loose tank top.png', 'Mime Shirt.png', 'Monad Jacket.png', 'Monalien shirt.png',
      'Monk.png', 'Pilot uniform.png', 'Red Cloak.png', 'Robot Suit.png',
      'Scarf.png', 'Scientist Coat.png', 'Silver Jacket.png', 'Space Suit.png',
      'Suit and Tie.png', 'Turtleneck.png'
    ]
  };

  const handlePartChange = (part, value) => {
    setSelectedParts(prev => ({
      ...prev,
      [part]: value
    }));
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 2
        });
        
        const link = document.createElement('a');
        link.download = 'my-monalien.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error downloading alien:', error);
      }
    }
  };

  return (
    <div className="build-aliens-page">
      <h1>BUILD-A-LIEN</h1>
      
      <div className="build-container">
        <div className="preview-section">
          <div className="preview-container" ref={previewRef}>
            {/* Background is rendered first */}
            <div className="preview-layer">
              <img
                src={`${process.env.PUBLIC_URL}/assets/Background/${selectedParts.background}`}
                alt="Background"
              />
            </div>
            {/* Then base body */}
            <div className="preview-layer">
              <img src={BaseBody} alt="Base body" />
            </div>
            {/* Then all other parts */}
            {Object.entries(selectedParts).map(([part, value]) => {
              if (part !== 'background') {
                return (
                  <div key={part} className="preview-layer">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/${part}/${value}`}
                      alt={`${part} ${value}`}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="controls-section">
          {Object.entries(parts).map(([part, options]) => (
            <div key={part} className="control-group">
              <label>{part.toUpperCase()}</label>
              <select
                value={selectedParts[part]}
                onChange={(e) => handlePartChange(part, e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option.replace('.png', '')}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button className="download-button" onClick={handleDownload}>
            DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildAliens; 