import { useState, useEffect } from "react";
import "./App.css";
import RoundOne from "./components/RoundOne";
import RoundTwo from "./components/RoundTwo";
import JoyceWall from "./components/JoyceWall";
import Login from "./components/Login";
import GateSequence from "./components/GateSequence";
// import StrangerThingsIntro from './components/StrangerThingsIntro' // Disabled - using video intro instead
import VideoIntro from "./components/VideoIntro";

function App() {
  const [currentRound, setCurrentRound] = useState(1);
  const [loggedInYear, setLoggedInYear] = useState(null);
  const [rollNumber, setRollNumber] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showIntro, setShowIntro] = useState(false); // Will be set based on localStorage check
  const [loginFadeIn, setLoginFadeIn] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showGateSequence, setShowGateSequence] = useState(false);

  useEffect(() => {

    // Logout function
    const forceLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentRound");
      localStorage.removeItem("introPlayed");
      localStorage.removeItem("loggedInYear");
      localStorage.removeItem("rollNumber");
      localStorage.removeItem("user");

      // you can also clear all if needed:
      // localStorage.clear();
      // sessionStorage.clear();

      window.location.reload(); // refresh page
    };

    // Detect DevTools
    let devtoolsOpen = false;

    const checkDevtools = () => {
      const threshold = 160; // width/height threshold
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (
        widthDiff > threshold ||
        heightDiff > threshold ||
        devtoolsOpen
      ) {
        devtoolsOpen = true;
        forceLogout();
      }
    };

    const interval = setInterval(checkDevtools, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Disable right click

    document.addEventListener("contextmenu", e => e.preventDefault());

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    document.onkeydown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    // DevTools detection (basic)
    const detectDevTools = setInterval(() => {
      const start = performance.now();
      debugger;
      if (performance.now() - start > 100) {
        window.location.href = "/"; // or show alert
      }
    }, 500);

    return () => clearInterval(detectDevTools);
  }, []);
  // Auto-hide toast
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  // On mount, check localStorage for a saved login and intro status
  useEffect(() => {
    try {
      const saved = localStorage.getItem("loggedInYear");
      if (saved) {
        setLoggedInYear(saved);
      }
      const savedRollNumber = localStorage.getItem("rollNumber");
      if (savedRollNumber) {
        setRollNumber(savedRollNumber);
      }
      const savedFragments = localStorage.getItem("passwordFragments");
      if (savedFragments) {
        setFragments(JSON.parse(savedFragments));
      }

      // Load saved round progress if user is logged in
      const savedRound = localStorage.getItem("currentRound");
      if (savedRound && saved) {
        const roundNum = parseInt(savedRound, 10);
        if (roundNum >= 1 && roundNum <= 3) {
          setCurrentRound(roundNum);
        }
      }

      // Check if intro has been played before
      const introPlayed = localStorage.getItem("introPlayed");
      if (!introPlayed) {
        // Intro hasn't been played - show it
        setShowIntro(true);
      } else {
        // Intro has been played - skip it and show login immediately
        setShowIntro(false);
        setLoginFadeIn(true);
      }

      // Check if gate sequence has been played for logged in users
      const gateSequencePlayed = localStorage.getItem("gateSequencePlayed");
      if (saved && !gateSequencePlayed) {
        // User is logged in but hasn't seen gate sequence yet
        setShowGateSequence(true);
      }
    } catch (err) {
      // localStorage may be unavailable in some environments; ignore
      // If localStorage fails, show intro by default
      setShowIntro(true);
    }
  }, []);

  // Check for credits only on mount if user is already logged in (refresh after finale completion)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("loggedInYear");
      const finaleComplete = localStorage.getItem("finaleVideoComplete");
      // Only show credits if user is already logged in AND finale is complete (refresh scenario)
      if (saved && finaleComplete === "true") {
        setShowCredits(true);
      }
    } catch (e) {
      // ignore
    }
  }, []); // Only run on mount, not when loggedInYear changes

  // Save fragments to localStorage whenever they change
  useEffect(() => {
    if (fragments.length > 0) {
      try {
        localStorage.setItem("passwordFragments", JSON.stringify(fragments));
      } catch (e) {
        // ignore
      }
    }
  }, [fragments]);

  // Save current round to localStorage whenever it changes (only when logged in)
  useEffect(() => {
    if (loggedInYear) {
      try {
        localStorage.setItem("currentRound", currentRound.toString());
      } catch (e) {
        // ignore
      }
    }
  }, [currentRound, loggedInYear]);

  // Debug: confirm component renders in the browser console
  console.log("App mounted, currentRound=", currentRound);

  // Show intro sequence first, but render login behind it (visible through O's hole)
  if (!loggedInYear) {
    return (
      <>
        {/* Login page - naturally emerges from black background */}
        <div
          className={`app-container login-mode ${
            showIntro && !loginFadeIn ? "login-hidden" : "login-visible"
          }`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: showIntro && !loginFadeIn ? 9998 : 10000,
            transition:
              "opacity 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ease-in-out",
          }}
        >
          <Login
            onLogin={(year, rollNum) => {
              setLoggedInYear(year);
              setRollNumber(rollNum);
              try {
                localStorage.setItem("loggedInYear", year);
                if (rollNum) localStorage.setItem("rollNumber", rollNum);
                // Check if gate sequence has been played before
                const gateSequencePlayed =
                  localStorage.getItem("gateSequencePlayed");
                if (!gateSequencePlayed) {
                  setShowGateSequence(true);
                }
              } catch (e) {
                /* ignore */
              }
            }}
          />
          <footer className="footer">
            <p>CSEA Event Portal - Stranger Things Edition</p>
          </footer>
        </div>

        {/* Video Intro - Stranger Things intro */}
        {showIntro && (
          <VideoIntro
            onComplete={() => {
              setShowIntro(false);
              // Mark intro as played in localStorage
              try {
                localStorage.setItem("introPlayed", "true");
              } catch (e) {
                // ignore
              }
            }}
            onFadeInLogin={() => setLoginFadeIn(true)}
          />
        )}
      </>
    );
  }

  // Show gate sequence after login (before rounds)
  if (showGateSequence && loggedInYear) {
    return (
      <GateSequence
        onComplete={() => {
          setShowGateSequence(false);
          try {
            localStorage.setItem("gateSequencePlayed", "true");
          } catch (e) {
            // ignore
          }
        }}
      />
    );
  }

  // Show credits if game is complete
  if (showCredits) {
    return (
      <Credits
        onComplete={() => {
          // Credits finished - keep credits visible, don't restart
          // Do nothing - credits stay on screen with final message
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Toast (global) */}
      <div
        className={`app-toast ${showToast ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
      {/* User Roll Number Display - Top Right */}
      {rollNumber && (
        <div className="user-roll-badge">
          <span className="user-label">USER:</span>
          <span className="user-roll-number">{rollNumber}</span>
          <button
            className="logout-button"
            onClick={() => {
              try {
                localStorage.removeItem("rollNumber");
                localStorage.removeItem("loggedInYear");
                localStorage.removeItem("token");
              } catch (e) {
                /* ignore */
              }
              setLoggedInYear(null);
              setRollNumber(null);
              setFragments([]);
              setCurrentRound(1);
              setToastMessage("Logged out successfully");
              setShowToast(true);
            }}
          >
            Logout
          </button>
        </div>
      )}
      <main className="main-content">
        {(() => {
          switch (currentRound) {
            case 1:
              return (
                <RoundOne
                  loggedInYear={localStorage.getItem("loggedInYear")}
                  onComplete={() => {
                    setCurrentRound(2);
                    // Round One completion is saved automatically via the useEffect above
                  }}
                />
              );
            case 2:
              return (
                <RoundTwo
                  loggedInYear={loggedInYear}
                  fragments={fragments}
                  setFragments={setFragments}
                  onComplete={() => {
                    setCurrentRound(3);
                  }}
                />
              );
            case 3:
              return (
                <JoyceWall
                  triggerWord="ROUND3"
                  fragments={fragments}
                  loggedInYear={loggedInYear}
                  onComplete={() => {
                    // Round 3 completion - game is finished
                    try {
                      localStorage.setItem("gameComplete", "true");
                    } catch (e) {
                      // ignore
                    }
                  }}
                />
              );
            default:
              return <RoundOne />;
          }
        })()}
      </main>

      {currentRound !== 2 && (
        <footer className="footer">
          <p>CSEA Event Portal - Stranger Things Edition</p>
        </footer>
      )}
    </div>
  );
}

export default App;
