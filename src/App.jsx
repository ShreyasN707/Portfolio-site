import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import CyberBoot from './components/CyberBoot';
import ModelViewer from './components/ModelViewer';
import PortfolioView from './components/PortfolioView';
import AdminEditView from './components/AdminEditView';
import { playHoverTick, playSelectClick, playAccessGranted, setMuted } from './utils/audio';

const ROLES = ["ML", "COMPUTER VISION", "BACKEND ENGINEERING"];
const CYBER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export default function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/edit') || window.location.hash === '#edit'
        ? 'edit'
        : 'portfolio_or_landing';
    }
    return 'portfolio_or_landing';
  });

  const [isBooted, setIsBooted] = useState(() => {
    // If starting directly on /edit, bypass the boot animation directly to editor
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/edit') || window.location.hash === '#edit';
    }
    return false;
  });

  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'transitioning' | 'portfolio'
  const [mutedState, setMutedState] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrambledRole, setScrambledRole] = useState(ROLES[0]);
  const [isScrambling, setIsScrambling] = useState(false);

  // Scramble animation ref to prevent overlapping intervals
  const intervalRef = useRef(null);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const isEdit = window.location.pathname.startsWith('/edit') || window.location.hash === '#edit';
      setRoute(isEdit ? 'edit' : 'portfolio_or_landing');
      if (isEdit) setIsBooted(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToEdit = () => {
    window.history.pushState({}, '', '/edit');
    setRoute('edit');
    setIsBooted(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setRoute('portfolio_or_landing');
    setCurrentView('portfolio');
  };

  // Smooth Scramble / Decrypt Animation when Role changes
  useEffect(() => {
    if (!isBooted || route === 'edit') return;

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
  }, [roleIndex, isBooted, route]);

  // Cycle through roles every 3.8 seconds
  useEffect(() => {
    if (!isBooted || route === 'edit') return;
    const cycleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3800);
    return () => clearInterval(cycleInterval);
  }, [isBooted, route]);

  // Keep window locked / non-scrollable as requested
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const toggleMute = () => {
    const newState = !mutedState;
    setMutedState(newState);
    setMuted(newState);
    if (!newState) playSelectClick();
  };

  const handleStart = () => {
    playAccessGranted();
    setCurrentView('transitioning');
    setTimeout(() => {
      setCurrentView('portfolio');
    }, 450);
  };

  const handleBackToLanding = () => {
    playSelectClick();
    setCurrentView('transitioning');
    setTimeout(() => {
      setCurrentView('landing');
    }, 350);
  };

  // Dedicated Route: /edit (Admin / Owner Page)
  if (route === 'edit') {
    return <AdminEditView onNavigateHome={navigateToHome} />;
  }

  return (
    <>
      {/* Initial Loading Page (Kept exactly as requested) */}
      {!isBooted && <CyberBoot onComplete={() => setIsBooted(true)} />}

      {/* Clean Mac Terminal Transition Shutter */}
      {isBooted && currentView === 'transitioning' && (
        <div className="anime-transition-screen">
          <div className="transition-shutter top"></div>
          <div className="transition-shutter bottom"></div>
          <div className="transition-hud-label">
            <span className="hud-kanji">OPENING TERMINAL</span>
            <span className="hud-metric">LOADING PORTFOLIO...</span>
          </div>
        </div>
      )}

      {/* Clean Dark Landing Page */}
      {isBooted && currentView === 'landing' && (
        <div className="landing-viewport">
          {/* Top-Left Corner Brand / Funny Logo Badge */}
          <div
            className="landing-brand-badge"
            title="Retro Cyber PC // 99% Bug-Free (the other 1% are features 💾)"
            onClick={playSelectClick}
            onMouseEnter={playHoverTick}
          >
            <img src="/favicon.svg" alt="Derpy Retro PC Logo" className="landing-logo-icon" />
            <div className="landing-logo-labels">
              <span className="landing-logo-title">shreyas.exe</span>
              <span className="landing-logo-status"><span className="status-ping"></span>99% bug-free</span>
            </div>
          </div>

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
                <h2 className="intro-name">I <span className="name-am">am</span> Shreyas</h2>

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

      {/* Clean Anime-Style Modular Portfolio View */}
      {isBooted && currentView === 'portfolio' && (
        <PortfolioView
          onBackToLanding={handleBackToLanding}
          mutedState={mutedState}
          onToggleMute={toggleMute}
          onNavigateEdit={navigateToEdit}
        />
      )}
    </>
  );
}
