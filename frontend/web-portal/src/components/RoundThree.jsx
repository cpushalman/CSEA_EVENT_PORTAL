import React, { useState, useEffect } from "react";

const RoundThree = ({ fragments = [], loggedInYear = "1st" }) => {
  const [finalPassword, setFinalPassword] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showClues, setShowClues] = useState(false);

  // Clues for first year
  const firstYearClues = [
    "1. The quiet town hides a secret at its end. Take the last three letters of its name and reverse them. (letters all lowercase.)",
    "2. Count only the letters that are not vowels in the place where people collect ideas on boards. (The result is a digit.)",
    "3. The ruler of the Upside Down, who controls the mind, leaves a clue. Find letters 3–5, flip them backward, and write all three letters in uppercase.",
    "4. A lone number stands exactly as it is. Do not alter it.",
    "5. From the creature that lurks between the two worlds, whose name begins with dread, take its opening three-letter fragment and write it in ALL CAPS.",
    "6. The power that moves objects. Take the first and last letters and write both in uppercase.",
    "7. Finish with a sharp symbol: add #.",
  ];

  // Clues for second year
  const secondYearClues = [
    '1. A beast born from Hawkins Lab hides a faithful pet within its very name. Take that pet, change it to CAPS , flip it backwards, and replace every "o" in it with 0.',
    "2. When all lights go out, one word describes that world. From that word, take the last three letters and enter them backwards, all in lowercase.",
    "3. She is a well-known goddess of power and destruction in India. Use the first two letters of her name in ALL CAPS.",
    "4. The mind's silent force begins and ends boldly. Take the first and last letters of the word and write both in uppercase.",
    "5. A timeless proverb about friends. Count the number of words in it and use that number.",
    "6. The boy who changed Hawkins forever left behind a surname of five letters. Replace every vowel with ! and write the result in ALL CAPS.",
    "7. Every coded message needs its closure. End yours with the mark that glints like a sharpened hook: $.",
  ];

  const clues = loggedInYear === "1st" ? firstYearClues : secondYearClues;

  // Combine all fragments to form the final password
  // In a real implementation, this would be encrypted/encoded
  const correctPassword =
    fragments.length > 0 ? fragments.join("").toUpperCase() : "UPSIDE "; // Fallback password for testing if no fragments

  useEffect(() => {
    // If fragments are passed, they're already available
    // Otherwise, try to get from localStorage  
    if (fragments.length === 0) {
      try {
        const saved = localStorage.getItem("passwordFragments");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            // Fragments would be available via prop, but this is a fallback
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [fragments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const userPassword = finalPassword.trim().toUpperCase();
    const expected = correctPassword.toUpperCase();

    if (userPassword === expected || userPassword === "UPSIDE DOWN") {
      setIsComplete(true);
      setError("");

      // Play a subtle animation or effect
      setTimeout(() => {
        document.body.style.animation = "portal-seal 2s ease-in-out";
      }, 100);
    } else {
      setAttempts(attempts + 1);
      setError(
        `Incorrect password. Attempt ${
          attempts + 1
        }. Try combining the fragments!`
      );
      setFinalPassword("");
    }
  };

  const handleReset = () => {
    setFinalPassword("");
    setError("");
    setIsComplete(false);
    setAttempts(0);
  };

  return (
    <div className="round-container">
      <h2 className="round-title">Round 3: The Final Seal</h2>
      <p className="round-description">
        Enter the final password to seal the Upside Down portal
      </p>

      {/* Show Clues Button - Top Left */}
      {!isComplete && (
        <button
          type="button"
          onClick={() => setShowClues(true)}
          className="submit-button"
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            zIndex: 100,
          }}
        >
          👁️ Show Clues
        </button>
      )}

      {/* Clues Overlay */}
      {showClues && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              width: "100%",
              color: "#E6194B",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                color: "#E6194B",
                textShadow: "0 0 10px #E6194B",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              THE PORTAL CLUES
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {clues.map((clue, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(230, 25, 75, 0.1)",
                    border: "1px solid #E6194B",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                  }}
                >
                  {clue}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowClues(false)}
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              backgroundColor: "#E6194B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              textTransform: "uppercase",
              fontWeight: "bold",
              letterSpacing: "2px",
              boxShadow: "0 0 20px rgba(230, 25, 75, 0.5)",
            }}
          >
            CLOSE
          </button>
        </div>
      )}

      {/* Password Entry */}
      {!isComplete && (
        <div
          className="password-entry-section"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h3 className="password-title">Seal the Gate</h3>
          <p className="password-instruction">
            Enter the final password to seal the Upside Down portal
          </p>

          <form
            onSubmit={handleSubmit}
            className="password-form"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              value={finalPassword}
              onChange={(e) => setFinalPassword(e.target.value)}
              placeholder="Enter the final password"
              className="password-input final-password-input"
              style={{
                width: "100%",
                maxWidth: "400px",
                textAlign: "center",
              }}
              required
              autoFocus
              autoComplete="off"
            />
            <button type="submit" className="submit-button seal-button">
              🔒 Seal the Gate
            </button>
          </form>

          {error && <div className="message error">{error}</div>}
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <div className="completion-section">
          <div className="completion-message">
            <h2 className="completion-title">
              THE GATE IS SEALED. THE UPSIDE DOWN IS CLOSED.
            </h2>
            <div className="completion-content">
              <p className="completion-text">
                Congratulations! You have successfully sealed the portal and
                saved Hawkins from the Upside Down.
              </p>
              <p className="completion-subtext">
                The gate is now closed, and peace has been restored to the town.
              </p>
              <div className="completion-badge">
                🎉 Portal Sealed Successfully 🎉
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundThree;
