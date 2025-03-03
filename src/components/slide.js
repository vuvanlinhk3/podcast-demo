import React from 'react';
import '../css/slide.css';

function Slide() {
  return (
    <div className="slide">
      <div className="slide-background">
        <img 
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
          alt="Podcast Background" 
        />
        <div className="slide-content">
          <h1 className="slide-title">Discover Amazing Podcasts</h1>
          <p className="slide-subtitle">Your gateway to inspiring stories and insightful conversations</p>
          <div className="wave-menu">
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide;