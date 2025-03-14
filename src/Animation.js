import React from 'react';
import './Animation.css';

function Animation() {
  return (
    <video className="background-video" loop autoPlay muted>
      <source src="/animation.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default Animation; 