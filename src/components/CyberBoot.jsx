import React, { useState, useEffect } from 'react';
import { playHoverTick, playAccessGranted } from '../utils/audio';

const SCAN_LOGS = [
  "INITIALIZING NEURAL LINK...",
  "BYPASSING SECURITY MAINFRAMES...",
  "DECRYPTING ARCHIVE DATABASES...",
  "LOADING CORE AUGMENTATIONS...",
  "ESTABLISHING SECURE HANDSHAKE...",
  "VERIFYING OPERATIVE CREDENTIALS...",
  "COMPILING SYSTEM ASSETS...",
  "OVERRIDING DEFAULT PROTOCOLS...",
  "ACCESSING MAINFRAME BACKDOOR..."
];

export default function CyberBoot({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [displayText, setDisplayText] = useState(SCAN_LOGS[0]);
  const [isFading, setIsFading] = useState(false);

  // Handle Progress Bar counting 0 to 100 over exactly 2 seconds
  useEffect(() => {
    let currentProgress = 0;
    const stepTime = 20;

    const tickInterval = setInterval(() => {
      if (currentProgress < 100 && Math.random() > 0.6) {
        playHoverTick();
      }
    }, 150);

    const progressInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(progressInterval);
        clearInterval(tickInterval);
        
        // When it hits 100%, trigger the door split animation
        setTimeout(() => {
          playAccessGranted();
          setIsFading(true);
          // Wait for door split animation (0.8s) before calling onComplete
          setTimeout(onComplete, 800);
        }, 200);
      } else {
        setProgress(currentProgress);
      }
    }, stepTime);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tickInterval);
    };
  }, [onComplete]);

  // Handle log switching interval
  useEffect(() => {
    if (progress >= 100) return;
    const logInterval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev + 1) % SCAN_LOGS.length);
    }, 500); // Switch log every 500ms
    return () => clearInterval(logInterval);
  }, [progress]);

  // Handle Scanning Scramble Effect
  useEffect(() => {
    let currentLog = SCAN_LOGS[currentLogIndex];
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    
    const scrambleInterval = setInterval(() => {
      setDisplayText(
        currentLog.split('').map((char, index) => {
          if (index < iteration) return char;
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iteration >= currentLog.length) {
        clearInterval(scrambleInterval);
      }
      iteration += 1.5; // Speed of resolving
    }, 20); // 20ms per frame

    return () => clearInterval(scrambleInterval);
  }, [currentLogIndex]);

  return (
    <div className={`cyber-boot-container ${isFading ? 'split-open' : ''}`}>
      
      {/* Background Split Doors */}
      <div className="boot-door top-door"></div>
      <div className="boot-door bottom-door"></div>

      <div className="boot-content">
        
        <div className="boot-top-row">
          {/* Scanning Text on the left */}
          <div className="scanning-text-container">
            <span className="status-label">SYS_STATUS //</span>
            <span className="status-log">{displayText}</span>
          </div>

          {/* Number on the right */}
          <div className="progress-number">
            {progress.toString().padStart(3, '0')}
            <span className="percent-symbol">%</span>
          </div>
        </div>
        
        {/* Progress Bar Container below */}
        <div className="progress-bar-wrapper">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
}
