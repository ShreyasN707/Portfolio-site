import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import CyberBoot from './components/CyberBoot';
import PageTransition from './components/PageTransition';
import ModelViewer from './components/ModelViewer';
import PortfolioView from './components/PortfolioView';
import AdminEditView from './components/AdminEditView';
import { playHoverTick, playSelectClick, playAccessGranted } from './utils/audio';

const DESKTOP_ROLES = ["ML", "DEV-OPS", "Photography", "Video-Editing"];
const MOBILE_ROLES = ["I do: ML", "I do: DEV-OPS", "I do: Photography", "I do: Video-Editing"];
const UPPER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const LOWER_GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

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

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'portfolio'
  const [transitionTarget, setTransitionTarget] = useState(null); // null | 'portfolio' | 'landing'
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrambledRole, setScrambledRole] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return MOBILE_ROLES[0];
    }
    return DESKTOP_ROLES[0];
  });
  const [isScrambling, setIsScrambling] = useState(false);

  // Scramble animation ref to prevent overlapping intervals
  const intervalRef = useRef(null);

  // Handle responsive isMobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Smooth Scramble / Decrypt Animation when Role or device view changes
  useEffect(() => {
    if (!isBooted || route === 'edit') return;

    const currentRoles = isMobile ? MOBILE_ROLES : DESKTOP_ROLES;
    const targetText = currentRoles[roleIndex % currentRoles.length];
    
    // Check if targetText has a prefix like "I do: "
    const prefixMatch = targetText.match(/^(I do:\s*|I DO:\s*)/i);
    const prefixLen = prefixMatch ? prefixMatch[0].length : 0;

    let iteration = prefixLen;
    setIsScrambling(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setScrambledRole(() =>
        targetText
          .split('')
          .map((char, idx) => {
            if (idx < prefixLen) return targetText[idx];
            if (idx < iteration) return targetText[idx];
            if (char === ' ') return ' ';
            const glyphs = char >= 'a' && char <= 'z' ? LOWER_GLYPHS : UPPER_GLYPHS;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
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
  }, [roleIndex, isBooted, route, isMobile]);

  // Cycle through roles smoothly every 3.2 seconds
  useEffect(() => {
    if (!isBooted || route === 'edit') return;
    const cycleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % DESKTOP_ROLES.length);
    }, 3200);
    return () => clearInterval(cycleInterval);
  }, [isBooted, route]);

  // Keep window locked / non-scrollable as requested
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const handleStart = () => {
    if (transitionTarget) return;
    playAccessGranted();
    setTransitionTarget('portfolio');
  };

  const handleBackToLanding = () => {
    if (transitionTarget) return;
    playSelectClick();
    setTransitionTarget('landing');
  };

  // Dedicated Route: /edit (Admin / Owner Page)
  if (route === 'edit') {
    return <AdminEditView onNavigateHome={navigateToHome} />;
  }

  return (
    <>
      {/* Initial Loading Page (Kept exactly as requested) */}
      {!isBooted && <CyberBoot onComplete={() => setIsBooted(true)} />}

      {/* Page Transition (Yellow Split-Doors Close then Open, No Text) */}
      {isBooted && transitionTarget && (
        <PageTransition
          onCovered={() => {
            setCurrentView(transitionTarget);
          }}
          onDone={() => {
            setTransitionTarget(null);
          }}
        />
      )}

      {/* Clean Dark Landing Page */}
      {isBooted && currentView === 'landing' && (
        <div className="landing-viewport">
          {/* Precision-Aligned Landing Container */}
          <div className="landing-container">
            {/* Interactive 3D Model Grounded to Bottom */}
            <div className="robot-wrapper">
              <ModelViewer />
            </div>

            {/* Intro Content with High-Tech Scramble Decryptor */}
            <div className="intro-wrapper">
              <div className="intro-content">
                <div className="intro-text-group">
                  <h1 className="intro-hi">HI,</h1>
                  <h2 className="intro-name">I <span className="name-am">am</span> Shreyas</h2>

                  {/* 100% Rock-Solid Stable Cyber Decryptor Slot */}
                  <div className="dynamic-role-container">
                    <span className="do-label">I do:</span>
                    <div className="role-viewport">
                      <span
                        className={`role-text ${isScrambling ? 'scrambling' : 'resolved'}`}
                      >
                        {(() => {
                          const match = scrambledRole.match(/^(I do:\s*|I DO:\s*)(.*)/i);
                          if (match) {
                            return (
                              <>
                                <span className="role-do-prefix">{match[1]}</span>
                                <span className="role-do-val">{match[2]}</span>
                              </>
                            );
                          }
                          return scrambledRole;
                        })()}
                      </span>
                    </div>
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
          onNavigateEdit={navigateToEdit}
        />
      )}
    </>
  );
}
