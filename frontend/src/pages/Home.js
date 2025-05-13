// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import '../styles/Home.css';

// Import your slide images
import slide1 from '../assets/Hero-bg.webp';
import slide2 from '../assets/slide-2.jpg';
import slide3 from '../assets/slide-3.jpg';
import slide4 from '../assets/slide-4.jpg';
import slide5 from '../assets/slide-5.JPG';
import slide6 from '../assets/slide-6.JPG';

export default function Home() {
  // track whether we’re on a narrow screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const slides = [
    { src: slide1, caption: 'Weave Haven: Where Fashion Meets Comfort' },
    { src: slide2, caption: 'Discover Our Latest Arrivals' },
    { src: slide3, caption: 'Bangladeshi Grace: Pure Jamdani Artistry' },
    { src: slide4, caption: 'Father & Son: United in Heritage' },
    { src: slide5, caption: 'Eco-Friendly Fabrics, Kid-Approved Fun' },
    { src: slide6, caption: 'Celebrate South Indian Splendor in Every Drape' }
  ];

  return (
    <div className="home-carousel">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        interval={3000}
        transitionTime={400}
        axis={isMobile ? 'horizontal' : 'vertical'}   // ← key change
        swipeable
        emulateTouch
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="slide">
            <img src={slide.src} alt={slide.caption} />
            <p className="legend">{slide.caption}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
