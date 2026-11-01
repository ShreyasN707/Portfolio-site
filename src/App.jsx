import { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import CyberBoot from './components/CyberBoot';
import { playHoverTick, playSelectClick, setMuted } from './utils/audio';

const ROLES = ["ML", "COMPUTER VISION", "BACKEND ENGINEERING"];

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [mutedState, setMutedState] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  // Cycle through roles smoothly every 3.5 seconds
  useEffect(() => {
    if (!isBooted) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3500);
    return () => clearInterval(interval);
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
      {/* Initial Loading Page (Unmodified) */}
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

          {/* Landing Container */}
          <div className="landing-container">
            {/* Robot Picture Grounded to Bottom */}
            <div className="robot-wrapper">
              <img
                src="/hero-image.png"
                alt="Cybernetic Avatar"
                className="robot-image"
              />
            </div>

            {/* Intro Content with Stable Role Box */}
            <div className="intro-wrapper">
              <div className="intro-content">
                <h1 className="intro-hi">HI,</h1>
                <h2 className="intro-name">I am Shreyas</h2>

                {/* 100% Rock-Solid Stable Role Slot */}
                <div className="dynamic-role-container">
                  <span className="do-label">I do:</span>
                  <div className="role-viewport">
                    <span className="role-text" key={roleIndex}>
                      {ROLES[roleIndex]}
                    </span>
                  </div>
                </div>

                {/* Start Button */}
                <div className="start-btn-container">
                  <button
                    className="start-btn"
                    onClick={handleStart}
                    onMouseEnter={playHoverTick}
                  >
                    <span className="start-btn-label">START</span>
                    <ArrowRight size={26} className="start-btn-icon" />
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
