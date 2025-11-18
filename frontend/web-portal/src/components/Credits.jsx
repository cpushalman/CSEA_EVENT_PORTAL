import React, { useEffect, useRef } from "react";
import "./Credits.css";

const Credits = ({ onComplete }) => {
  const creditsRef = useRef(null);

  // Credits data organized by sections
  const creditsData = [
    {
      title: "FRONTEND",
      items: [
        { role: "", name: "Suganth" },
        { role: "", name: "Shloka" },
        { role: "", name: "Vishwanath" },
        { role: "", name: "Hari Krishna" },
        { role: "", name: "Nyajum" },
      ],
    },
    {
      title: "BACKEND",
      items: [
        { role: "", name: "Ahamed Shalman H" },
        { role: "", name: "Srivarshini" },
        { role: "", name: "Dharaneesh S.L" },
        { role: "", name: "Thejas Achyuth J" },
        { role: "", name: "Preethi P S" },
        { role: "", name: "Sukesh" },
        { role: "", name: "Moorthi" },
        { role: "", name: "Santhosh S" },
      ],
    },
    {
      title: "PORTAL CHALLENGES",
      items: [
    
        { role: "", name: "Praveen" },
        { role: "", name: "Deepakkumar S" },
        { role: "", name: "Avantika" },
      
    
        { role: "", name: "Swetha" },
        { role: "", name: "Avanthika" },
      ],
    },
    {
      title: "POSTERS",
      items: [
        { role: "", name: "Shruthi" },
        { role: "", name: "Harsha" },
        { role: "", name: "Shakthi" },
        { role: "", name: "Harikesava" },
      ],
    },
    {
      title: "REELS AND EDITS",
      items: [
        { role: "Editor", name: "Nathan" },
      
        { role: "", name: "Alamelu" },
     
      
        { role: "", name: "Deepakkumar S" },
      ],
    },
    {
      title: "PUBLICITY",
      items: [
        { role: "", name: "Delicia" },
        { role: "", name: "Deepakkumar S" },
        { role: "", name: "Praveen" },
        { role: "", name: "Sneha" },
        { role: "", name: "Nathan" },
        { role: "", name: "Akshaya" },
      ],
    },
    {
      title: "DOCUMENTATION",
      items: [
        { role: "", name: "Shahana" },
 
      ],
    },
    {
      title: "SPECIAL THANKS",
      items: [
        { role: "Secretary", name: "Arulkumara B R" },
        { role: "Joint Secretary", name: "Sanjay Jayakumar" },
        { role: "Joint Secretary", name: "Delicia Angeline" },
         { role: "Executive Member", name: "Ahamed Shalman H" },
         { role: "Executive Member", name: " Dharanesh K" },

        { role: "", name: "CSEA" },
        { role: "", name: "Computer Science and Engineering Association" },
        { role: "", name: "PSG College of Technology" },
      ],
    },
    {
      title: "DEDICATED TO",
      items: [
        { role: "", name: "All the Players Who" },
        { role: "", name: "Dared to Enter" },
        { role: "", name: "The Upside Down" },
        { role: "", name: "And Saved Hawkins" },
      ],
    },
  ];

  useEffect(() => {
    // Simple CSS animation approach - let CSS handle the scrolling
    // The animation is defined in Credits.css
    // Optional: call onComplete after animation finishes (60s)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 60000); // 60 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="credits-container">
      <div className="credits-scroll">
        <div ref={creditsRef} className="credits-content">
          {/* Opening Title */}
          <div className="credits-opening">
            <div className="credits-main-title">THE GATE IS CLOSED</div>
            <div className="credits-main-subtitle">CSEA EVENT PORTAL</div>
          </div>

          {/* Credits Sections */}
          {creditsData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="credits-section">
              <div className="credits-section-title">{section.title}</div>
              <div className="credits-divider"></div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="credits-item">
                  {item.role && <div className="credits-role">{item.role}</div>}
                  <div className="credits-name">{item.name}</div>
                </div>
              ))}
            </div>
          ))}

          {/* Closing Message */}
          <div className="credits-closing">
            <div className="credits-closing-line">HAWKINS IS SAFE</div>
            <div className="credits-closing-line">UNTIL NEXT TIME...</div>
            <div className="credits-logo">CSEA EVENT PORTAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
