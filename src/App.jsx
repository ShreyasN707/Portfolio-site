import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import CyberBoot from './components/CyberBoot';
import ModelViewer from './components/ModelViewer';
import { playHoverTick, playSelectClick, setMuted } from './utils/audio';

const ROLES = ["ML", "COMPUTER VISION", "BACKEND ENGINEERING"];
const CYBER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [mutedState, setMutedState] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrambledRole, setScrambledRole] = useState(ROLES[0]);
  const [isScrambling, setIsScrambling] = useState(false);

  // Scramble animation ref to prevent overlapping intervals
  const intervalRef = useRef(null);

  // Smooth Scramble / Decrypt Animation when Role changes
  useEffect(() => {
    if (!isBooted) return;

    const targetText = ROLES[roleIndex];
    let iteration = 0;
    setIsScrambling(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setScrambledRole(() =>
        targetText
          .split('')
          .map((char, idx) => {
            if (idx < iteration) return targetText[idx];
            if (char === ' ') return ' ';
            return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(intervalRef.current);
        setIsScrambling(false);
      }
      iteration += 1.0;
    }, 28);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [roleIndex, isBooted]);

  // Cycle through roles every 3.8 seconds
  useEffect(() => {
    if (!isBooted) return;
    const cycleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3800);
    return () => clearInterval(cycleInterval);
  }, [isBooted]);

  const toggleMute = () => {
    const newState = !mutedState;
    setMutedState(newState);
    setMuted(newState);
    if (!newState) playSelectClick();
  };

  const handleStart = () => {
    playSelectClick();
  };

  return (
    <>
      {/* Initial Loading Page (Kept exactly as requested) */}
      {!isBooted && <CyberBoot onComplete={() => setIsBooted(true)} />}

      {/* Clean Dark Landing Page */}
      {isBooted && (
        <div className="landing-viewport">
          {/* Subtle Audio Toggle */}
          <button
            className={`audio-btn ${mutedState ? 'muted' : ''}`}
            onClick={toggleMute}
            onMouseEnter={playHoverTick}
            aria-label="Toggle sound effects"
            title={mutedState ? 'Unmute Audio' : 'Mute Audio'}
          >
            {mutedState ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* Precision-Aligned Landing Container */}
          <div className="landing-container">
            {/* Interactive 3D Model Grounded to Bottom */}
            <div className="robot-wrapper">
              <ModelViewer />
            </div>

            {/* Intro Content with High-Tech Scramble Decryptor */}
            <div className="intro-wrapper">
              <div className="intro-content">
                <h1 className="intro-hi">HI,</h1>
                <h2 className="intro-name">I am Shreyas</h2>

                {/* 100% Rock-Solid Stable Cyber Decryptor Slot */}
                <div className="dynamic-role-container">
                  <span className="do-label">I do:</span>
                  <div className="role-viewport">
                    <span
                      className={`role-text ${isScrambling ? 'scrambling' : 'resolved'}`}
                    >
                      {scrambledRole}
                    </span>
                  </div>
                </div>

                {/* Carefully Arranged Start Button */}
                <div className="start-btn-container">
                  <button
                    className="start-btn"
                    onClick={handleStart}
                    onMouseEnter={playHoverTick}
                  >
                    <span className="start-btn-label">START</span>
                    <ArrowRight size={24} className="start-btn-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
