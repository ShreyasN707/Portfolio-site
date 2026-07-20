import { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Shield, ArrowRight, Mail, Cpu, Terminal, FileText, Briefcase, User, Layers, Fingerprint
} from 'lucide-react';
import CyberBoot from './components/CyberBoot';
import { playHoverTick, playSelectClick, setMuted } from './utils/audio';

const PROJECTS = [
  {
    id: 'dar',
    title: 'Digital Ad Replacement',
    tag: 'Computer Vision',
    tech: 'YOLO v8 • SAM • CUDA',
    desc: 'Engineered an optimized CV pipeline to detect billboards in video streams and seamlessly replace them with custom ads in real time.'
  },
  {
    id: 'naakshatra',
    title: 'Naakshatra Edge',
    tag: 'IoT & Edge ML',
    tech: 'Node.js • ONNX • Random Forest',
    desc: 'Developed a physical IoT device and backend for real-time hazardous gas monitoring and toxicity predictions at the edge.'
  },
  {
    id: 'github_analyzer',
    title: 'GitHub Analyzer',
    tag: 'Full-Stack Analytics',
    tech: 'Express.js • GraphQL • Caching',
    desc: 'A performance metrics platform to audit GitHub accounts, aggregate contribution streaks, and compare developer profiles.'
  }
];

const ROLES = ["ML", "COMPUTER VISION", "BACKEND ENGINEERING"];

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [mutedState, setMutedState] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [viewState, setViewState] = useState('landing'); // 'landing', 'transitioning', 'content'

  // Cycle through roles every 4 seconds
  useEffect(() => {
    if (!isBooted || viewState !== 'landing') return;
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % ROLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBooted, viewState]);

  const toggleMute = () => {
    const newState = !mutedState;
    setMutedState(newState);
    setMuted(newState);
    if (!newState) playSelectClick();
  };

  const handleExplore = () => {
    playSelectClick();
    setViewState('transitioning');
    setTimeout(() => {
      setViewState('content');
      window.scrollTo(0, 0);
    }, 1500); // Wait for transition animation
  };

  return (
    <>
      {!isBooted && <CyberBoot onComplete={() => setIsBooted(true)} />}

      {isBooted && (
        <div className="crt-effect" style={{ backgroundColor: 'var(--obsidian-black)', minHeight: '100vh', width: '100vw' }}>

          {viewState === 'landing' && (
            <div className="nft-landing-container">
              {/* Full SVG Frame */}
              <svg className="nft-frame" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="
M 5,0
L 95,0
L 100,5
L 100,95
L 95,100
L 5,100
L 0,95
L 0,5
Z"
                  fill="none"
                  stroke="var(--electric-yellow)"
                  strokeWidth="0.01"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Audio Toggle */}
              <button style={{ position: 'fixed', top: '40px', left: '40px', zIndex: 1001, background: 'none', border: 'none', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); toggleMute(); }} onMouseEnter={playHoverTick}>
                {mutedState ? <VolumeX size={28} className="text-white" /> : <Volume2 size={28} className="text-electric" />}
              </button>

              {/* Small Hero Image */}
              <img src="/hero-image.png" alt="Cyberpunk Head" className="nft-hero-image-small" />

              {/* Right Side Introduction Text */}
              <div className="nft-intro-text">
                <h1 className="nft-intro-hi text-white">HI,</h1>
                <h2 className="nft-intro-name text-white">I am shreyas</h2>
                <div className="nft-dynamic-panel text-electric">
                  <div className="panel-text-do">do:</div>
                  <div className="hologram-container">
                    <div className="hologram-content" key={roleIndex}>
                      {ROLES[roleIndex]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Explore Button */}
              <div className="explore-container fade-in-up delay-1">
                <button className="explore-btn" onClick={handleExplore} onMouseEnter={playHoverTick}>
                  <Fingerprint className="explore-icon" size={36} />
                  <span className="text-white" style={{ marginLeft: '10px' }}>EXPLORE</span>
                </button>
              </div>
            </div>
          )}

          {viewState === 'transitioning' && (
            <div className="cyber-transition-screen">
              <div className="transition-door top-door"></div>
              <div className="transition-door bottom-door"></div>
              <div className="transition-glitch-text">ACCESSING_DATABANKS...</div>
            </div>
          )}

          {viewState === 'content' && (
            <main className="content-view" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px', backgroundColor: 'var(--electric-yellow)', minHeight: '100vh' }}>
              {/* REDESIGNED ABSTRACT SECTIONS */}

              {/* ABOUT */}
              <section id="about" className="abstract-section content-dark-theme">
                <h2 className="section-title">ABOUT_</h2>
                <div className="text-black" style={{ maxWidth: '800px', fontSize: '1.25rem', lineHeight: '2' }}>
                  <p className="mb-6">
                    I am a results-oriented student and engineer dedicated to constructing high-efficiency machine learning models and neural object segmentation networks (YOLO, SAM).
                  </p>
                  <p>
                    Beyond pure ML, I excel in building lightweight edge intelligence platforms and robust backend API setups, bridging the gap between hardware sensors and cloud computation.
                  </p>
                  <p className="mt-8 font-bold" style={{ fontFamily: 'var(--font-hud)' }}>STATUS: OPTIMAL // 100% CAPACITY</p>
                </div>
              </section>

              {/* SKILLS */}
              <section id="skills" className="abstract-section content-dark-theme">
                <h2 className="section-title">SKILLS_</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                  <div>
                    <h3 className="text-black mb-6" style={{ fontFamily: 'var(--font-hud)', fontSize: '1.5rem' }}>CORE LANGUAGES</h3>
                    <ul className="abstract-list text-muted-dark">
                      <li><span>Python</span> <span className="font-bold text-black">95%</span></li>
                      <li><span>JavaScript / Node</span> <span className="font-bold text-black">90%</span></li>
                      <li><span>C++</span> <span className="font-bold text-black">80%</span></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-black mb-6" style={{ fontFamily: 'var(--font-hud)', fontSize: '1.5rem' }}>NEURAL INTERFACES</h3>
                    <ul className="abstract-list text-muted-dark">
                      <li><span>OpenCV</span> <span className="font-bold text-black">95%</span></li>
                      <li><span>YOLO</span> <span className="font-bold text-black">92%</span></li>
                      <li><span>TensorFlow</span> <span className="font-bold text-black">88%</span></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* PROJECTS */}
              <section id="projects" className="abstract-section content-dark-theme">
                <h2 className="section-title">PROJECTS_</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {PROJECTS.map(proj => (
                    <div key={proj.id} style={{ borderLeft: '4px solid var(--obsidian-black)', paddingLeft: '30px' }}>
                      <span className="font-bold text-black" style={{ fontFamily: 'var(--font-hud)' }}>{proj.tag}</span>
                      <h3 className="text-black mb-4" style={{ fontSize: '2.5rem', lineHeight: '1' }}>{proj.title}</h3>
                      <p className="text-muted-dark mb-4" style={{ maxWidth: '800px', fontSize: '1.25rem' }}>{proj.desc}</p>
                      <span className="text-muted-dark" style={{ fontFamily: 'var(--font-hud)', letterSpacing: '0.2em' }}>{proj.tech}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* RESUME */}
              <section id="resume" className="abstract-section content-dark-theme">
                <h2 className="section-title">RESUME_</h2>
                <a href="#" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="explore-btn-dark" style={{ fontSize: '2rem' }}>
                  DOWNLOAD DOSSIER <ArrowRight className="explore-icon" size={36} />
                </a>
              </section>

              {/* CONTACT */}
              <section id="contact" className="abstract-section content-dark-theme">
                <h2 className="section-title">CONTACT_</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                  <a href="mailto:shreyasnaik81@gmail.com" onMouseEnter={playHoverTick} className="text-black contact-link" style={{ fontSize: '1.5rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '10px' }}>
                    <span>EMAIL</span> <span className="font-bold">shreyasnaik81@gmail.com</span>
                  </a>
                  <a href="https://github.com/ShreyasN707" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="text-black contact-link" style={{ fontSize: '1.5rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '10px' }}>
                    <span>GITHUB</span> <span className="font-bold">ShreyasN707</span>
                  </a>
                  <a href="https://linkedin.com/in/shreyas-n-44717b32" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="text-black contact-link" style={{ fontSize: '1.5rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '10px' }}>
                    <span>LINKEDIN</span> <span className="font-bold">Professional Index</span>
                  </a>
                </div>
              </section>

            </main>
          )}
        </div>
      )}
    </>
  );
}
