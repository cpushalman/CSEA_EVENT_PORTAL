import React, { useState, useEffect, useRef } from "react";
import gateVideo from "../assets/gate.mp4";
import "./GateSequence.css";

const GateSequence = ({ onComplete }) => {
  const [showGateVideo, setShowGateVideo] = useState(false);
  const [gateVideoFadeIn, setGateVideoFadeIn] = useState(false);
  const [showMessagePage, setShowMessagePage] = useState(false);
  const gateVideoRef = useRef(null);

  const message1 = "The Upside Down has been opened.";
  const message2 = "Eleven needs your help to get past the passageway.";

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

  // Handle gate video end - transition to message page
  const handleGateVideoEnd = () => {
    // Smooth transition: hide gate video, show message page
    setShowGateVideo(false);
    setTimeout(() => {
      setShowMessagePage(true);
    }, 300);
  };

  // Handle tap to continue button
  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      {/* Gate Video */}
      {showGateVideo && (
        <div
          className="gate-video-container"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10000,
            opacity: gateVideoFadeIn ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <video
            ref={gateVideoRef}
            src={"https://res.cloudinary.com/drxmhgudx/video/upload/v1763431074/joyvewall-teleki_quend2.mp4"}
            className="gate-video"
            autoPlay
            playsInline
            preload="auto"
            controls={false}
            onEnded={handleGateVideoEnd}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Message Page with Black Background */}
      {showMessagePage && (
        <div
          className="message-page-container"
          onClick={handleContinue}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10001,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            padding: "2rem",
            cursor: "pointer",
          }}
        >
          {/* Message Content with Fade In */}
          <div
            className="message-content fade-in"
            style={{
              maxWidth: "800px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3rem",
              padding: "2rem",
            }}
          >
            {/* Heading in Red - Centered */}
            <h1
              className="fade-in"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#E6194B",
                textAlign: "center",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Message
            </h1>

            {/* Message Text in White - Centered */}
            <div
              className="fade-in"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                width: "100%",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                  fontWeight: 400,
                  textAlign: "center",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                  color: "#ffffff",
                  margin: 0,
                  padding: "0 1rem",
                }}
              >
                {message1}
              </p>

              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                  fontWeight: 400,
                  textAlign: "center",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                  color: "#ffffff",
                  margin: 0,
                  padding: "0 1rem",
                }}
              >
                {message2}
              </p>
            </div>

            {/* Tap to Continue Text - Bottom Right, Low Contrast White */}
            <div
              className="fade-in"
              style={{
                position: "absolute",
                bottom: "1.5rem",
                right: "3rem",
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.08em",
                textTransform: "lowercase",
              }}
            >
              tap to continue
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GateSequence;
