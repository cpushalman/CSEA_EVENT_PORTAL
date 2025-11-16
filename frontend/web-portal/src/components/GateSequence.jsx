import React, { useState, useEffect, useRef } from 'react';
import gateVideo from '../assets/gate.mp4';
import './GateSequence.css';

const GateSequence = ({ onComplete }) => {
  const [showGateVideo, setShowGateVideo] = useState(false);
  const [gateVideoFadeIn, setGateVideoFadeIn] = useState(false);
  const [showTypingPage, setShowTypingPage] = useState(false);
  const [startLine1Reveal, setStartLine1Reveal] = useState(false);
  const [startLine2Reveal, setStartLine2Reveal] = useState(false);
  const gateVideoRef = useRef(null);

  const fullText1 = "The Upside Down has been opened.";
  const fullText2 = "Eleven needs your help to get past the passageway";

  // Start gate video after 1 second delay, then fade in
  useEffect(() => {
    let timer2 = null;
    const timer1 = setTimeout(() => {
      setShowGateVideo(true);
      // Trigger fade-in after video is shown
      timer2 = setTimeout(() => {
        setGateVideoFadeIn(true);
      }, 100);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, []);

  // Handle gate video end - transition to typing page
  const handleGateVideoEnd = () => {
    // Smooth transition: hide gate video, show typing page, then start animation
    setShowGateVideo(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowTypingPage(true);
      // Start typing animation after a brief moment to ensure page is visible
      setTimeout(() => {
        startTypingAnimation();
      }, 100);
    }, 300);
  };

  // Start fade in animation
  const startTypingAnimation = () => {
    // Reset states to ensure clean start
    setStartLine1Reveal(false);
    setStartLine2Reveal(false);
    
    // Start both lines fading in together
    setTimeout(() => {
      setStartLine1Reveal(true);
      setStartLine2Reveal(true);
      
      // After 1.5 seconds, fade out and transition to Round 1
      setTimeout(() => {
        setStartLine1Reveal(false);
        setStartLine2Reveal(false);
        
        // Wait for fade out to complete, then transition
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500); // Wait for fade out animation (2.5 seconds)
      }, 1500); // Show text for 1.5 seconds
    }, 100);
  };


  return (
    <>
      {/* Gate Video */}
      {showGateVideo && (
        <div 
          className="gate-video-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            opacity: gateVideoFadeIn ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          <video
            ref={gateVideoRef}
            src={gateVideo}
            className="gate-video"
            autoPlay
            playsInline
            preload="auto"
            controls={false}
            onEnded={handleGateVideoEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Typing Page with Black Background */}
      {showTypingPage && (
        <div 
          className="typing-page-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            opacity: 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          {/* Typing Text Content */}
          <div 
            className="typing-text-content"
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '80%',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div 
              className={`typing-line-1 ${startLine1Reveal ? 'fade-in-active' : 'fade-out'}`}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: 400,
                textAlign: 'justify',
                textAlignLast: 'justify',
                minHeight: '1.5em',
                letterSpacing: '1px',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.9)',
                direction: 'ltr',
                width: '100%',
                maxWidth: '100%',
                position: 'relative'
              }}
            >
              {fullText1}
            </div>
            
            <div 
              className={`typing-line-2 ${startLine2Reveal ? 'fade-in-active' : 'fade-out'}`}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: 400,
                textAlign: 'justify',
                textAlignLast: 'justify',
                minHeight: '1.5em',
                letterSpacing: '1px',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.9)',
                direction: 'ltr',
                width: '100%',
                maxWidth: '100%',
                position: 'relative'
              }}
            >
              {fullText2}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GateSequence;

