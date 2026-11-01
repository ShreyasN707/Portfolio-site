import { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  ExternalLink,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Cpu,
  Eye,
  Layers,
  Wrench,
  Globe,
  Sparkles,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { playHoverTick, playSelectClick } from '../utils/audio';
import { getPortfolioData } from '../utils/portfolioData';

function GithubIcon({ size = 17, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 17, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const ICON_MAP = {
  Eye,
  Cpu,
  Layers,
  Wrench,
  Globe,
  Sparkles
};

export default function PortfolioView({ onBackToLanding, mutedState, onToggleMute, onNavigateEdit }) {
  const [data] = useState(() => getPortfolioData());
  const [activeTab, setActiveTab] = useState('about');
  const [copied, setCopied] = useState(false);
  const contentBodyRef = useRef(null);

  const switchTab = (tabId) => {
    playSelectClick();
    setActiveTab(tabId);
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyEmail = () => {
    playSelectClick();
    navigator.clipboard.writeText(data.contact?.email || 'shreyasnaik81@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseTabs = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const allTabs = [
    ...baseTabs,
    ...(data.customSections || []).map((s) => ({ id: s.id, label: s.label }))
  ];

  const currentTabIdx = allTabs.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIdx > 0 ? allTabs[currentTabIdx - 1] : null;
  const nextTab = currentTabIdx < allTabs.length - 1 ? allTabs[currentTabIdx + 1] : null;

  return (
    <div className="mac-terminal-page">
      {/* Centered Mac Terminal Window */}
      <div className="mac-window">
        {/* Mac Titlebar */}
        <div className="mac-titlebar">
          <div className="mac-traffic-lights">
            <span
              className="mac-dot red"
              onClick={() => {
                playSelectClick();
                onBackToLanding();
              }}
              title="Return to Landing"
            ></span>
            <span className="mac-dot yellow" title="Minimize"></span>
            <span className="mac-dot green" title="Zoom"></span>
          </div>

          <div className="mac-window-title">
            <span className="window-title-name-yellow">{data.profile?.displayName || 'Shreyas N'}</span>
          </div>

          {/* Quick Header Controls */}
          <div className="mac-header-actions">
            {onNavigateEdit && (
              <button
                className="mac-action-btn admin-portal-btn"
                onClick={() => {
                  playSelectClick();
                  onNavigateEdit();
                }}
                onMouseEnter={playHoverTick}
                title="Open Owner Admin / Edit Page (/edit)"
                aria-label="Admin Edit Mode"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            )}

            <a
              href={data.contact?.github || "https://github.com/ShreyasN707"}
              target="_blank"
              rel="noreferrer"
              className="mac-action-btn"
              onMouseEnter={playHoverTick}
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={15} />
            </a>

            <button
              className={`mac-action-btn ${mutedState ? 'muted' : ''}`}
              onClick={onToggleMute}
              onMouseEnter={playHoverTick}
              title={mutedState ? 'Unmute Audio' : 'Mute Audio'}
              aria-label="Toggle Audio"
            >
              {mutedState ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Clean Mac Tab Bar */}
        <div className="mac-tabbar">
          <div className="tab-pills-wrap">
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                onMouseEnter={playHoverTick}
                className={`mac-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mac-tab-guide">
            <span>Section {currentTabIdx + 1} of {allTabs.length}</span>
          </div>
        </div>

        {/* Terminal Window Content Area */}
        <div className="mac-content-body" ref={contentBodyRef}>
          {/* ==========================================
              TAB 1: ABOUT
              ========================================== */}
          {activeTab === 'about' && (
            <div className="mac-pane fade-in">
              <div className="about-hero-section">
                <div className="badge-cute">
                  <span>{data.profile?.roleTag || 'Machine Learning & Computer Vision'}</span>
                </div>
                <h1 className="about-name-title">
                  Hi, I'm <span className="highlight-cute">{data.profile?.name || 'Shreyas Naik'}</span>
                </h1>
                <p className="about-description">
                  {data.profile?.bio}
                </p>
              </div>

              {/* Information Cards */}
              <div className="about-triplet-grid">
                {(data.aboutCards || []).map((card) => {
                  const Icon = ICON_MAP[card.iconName] || Layers;
                  return (
                    <div key={card.id} className="mac-card">
                      <div className="card-header-cute">
                        <div className="cute-icon-box">
                          <Icon size={17} />
                        </div>
                        <h2 className="cute-card-title">{card.title}</h2>
                      </div>
                      <p className="cute-card-desc">{card.desc}</p>
                      <div className="cute-tags-row">
                        {(card.tags || []).map((tag, i) => (
                          <span key={i} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Footer Pill */}
              <div className="mac-status-strip">
                <div className="status-segment">
                  <span className="status-label-cute">Location:</span>
                  <span className="status-value-cute">{data.profile?.location || 'Bengaluru, India'}</span>
                </div>
                <div className="status-segment">
                  <span className="status-label-cute">Focus:</span>
                  <span className="status-value-cute">{data.profile?.focus || 'Computer Vision & Edge ML'}</span>
                </div>
                <div className="status-segment status-available">
                  <span className="live-dot"></span>
                  <span>{data.profile?.availability || 'Available for Engineering Roles'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: SKILLS
              ========================================== */}
          {activeTab === 'skills' && (
            <div className="mac-pane fade-in">
              <div className="pane-intro">
                <h1 className="pane-heading">Technical Skills</h1>
                <p className="pane-subtitle">Technologies and tools I use to build intelligent applications.</p>
              </div>

              <div className="skills-grid-compact">
                {(data.skillGroups || []).map((group, idx) => {
                  const Icon = ICON_MAP[group.iconName] || Wrench;
                  return (
                    <div key={group.id || idx} className="mac-card skill-card-clean">
                      <div className="skill-card-top">
                        <div className="cute-icon-box">
                          <Icon size={16} />
                        </div>
                        <h2 className="skill-card-heading">{group.title}</h2>
                      </div>
                      <div className="skill-tags-wrap">
                        {(group.items || []).map((item, i) => (
                          <span key={i} className="skill-tag-cute" onMouseEnter={playHoverTick}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: PROJECTS
              ========================================== */}
          {activeTab === 'projects' && (
            <div className="mac-pane fade-in">
              <div className="pane-intro">
                <h1 className="pane-heading">Featured Projects</h1>
                <p className="pane-subtitle">Practical systems built with computer vision, edge machine learning, and web services.</p>
              </div>

              <div className="projects-grid-compact">
                {(data.projects || []).map((proj) => (
                  <div key={proj.id} className="mac-card project-card-compact">
                    {/* Header format: [project name] | [ tech stack used ] ........... repo link */}
                    <div className="project-header-row">
                      <div className="project-header-info">
                        <span className="project-name-text">{proj.title}</span>
                        <span className="project-pipe-divider">|</span>
                        <span className="project-tech-text">
                          {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                        </span>
                      </div>

                      <a
                        href={proj.repoLink || proj.link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="project-repo-link"
                        onMouseEnter={playHoverTick}
                        title={`View ${proj.title} on GitHub`}
                      >
                        <GithubIcon size={14} />
                        <span>Repository</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    {/* Description of the project */}
                    <p className="project-desc-cute">{proj.desc}</p>

                    {/* Below: Live link (if present) */}
                    {proj.liveLink && (
                      <div className="project-live-container">
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="project-live-btn"
                          onMouseEnter={playHoverTick}
                          title={`Open Live Demo for ${proj.title}`}
                        >
                          <ExternalLink size={13} />
                          <span className="live-link-label">Live Link:</span>
                          <span className="live-link-url">{proj.liveLink}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: CONTACT
              ========================================== */}
          {activeTab === 'contact' && (
            <div className="mac-pane fade-in">
              <div className="pane-intro">
                <h1 className="pane-heading">Get in Touch</h1>
                <p className="pane-subtitle">Looking for an ML engineer or want to discuss a project? I would love to hear from you.</p>
              </div>

              <div className="contact-grid-compact">
                {/* Email */}
                <a
                  href={`mailto:${data.contact?.email || 'shreyasnaik81@gmail.com'}`}
                  className="mac-card contact-card-clean"
                  onMouseEnter={playHoverTick}
                >
                  <div className="cute-icon-box">
                    <Mail size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">Email</span>
                    <span className="contact-main-text">{data.contact?.email || 'shreyasnaik81@gmail.com'}</span>
                  </div>
                  <ArrowRight size={15} className="contact-hover-arrow" />
                </a>

                {/* Copy Email */}
                <div
                  className="mac-card contact-card-clean copy-action-card"
                  onClick={copyEmail}
                  onMouseEnter={playHoverTick}
                  role="button"
                  tabIndex={0}
                  title="Click to copy email address"
                >
                  <div className={`cute-icon-box ${copied ? 'copied-box' : ''}`}>
                    {copied ? <Check size={18} className="check-mark-icon" /> : <Copy size={18} />}
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">Quick Copy</span>
                    <span className="contact-main-text">{copied ? 'Copied to clipboard!' : 'Click to copy email'}</span>
                  </div>
                </div>

                {/* GitHub */}
                <a
                  href={data.contact?.github || "https://github.com/ShreyasN707"}
                  target="_blank"
                  rel="noreferrer"
                  className="mac-card contact-card-clean"
                  onMouseEnter={playHoverTick}
                >
                  <div className="cute-icon-box">
                    <GithubIcon size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">GitHub</span>
                    <span className="contact-main-text">
                      {(data.contact?.github || 'https://github.com/ShreyasN707').replace('https://', '')}
                    </span>
                  </div>
                  <ExternalLink size={15} className="contact-hover-arrow" />
                </a>

                {/* LinkedIn */}
                <a
                  href={data.contact?.linkedin || "https://linkedin.com/in/shreyasnaik"}
                  target="_blank"
                  rel="noreferrer"
                  className="mac-card contact-card-clean"
                  onMouseEnter={playHoverTick}
                >
                  <div className="cute-icon-box">
                    <LinkedinIcon size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">LinkedIn</span>
                    <span className="contact-main-text">
                      {(data.contact?.linkedin || 'https://linkedin.com/in/shreyasnaik').replace('https://', '')}
                    </span>
                  </div>
                  <ExternalLink size={15} className="contact-hover-arrow" />
                </a>
              </div>

              {/* Availability Note */}
              <div className="contact-footer-note">
                <span className="status-label-cute">Note: </span>
                <span>{data.contact?.note || 'Always open to discuss machine learning systems, edge optimization, and interesting engineering projects.'}</span>
              </div>
            </div>
          )}

          {/* ==========================================
              CUSTOM SECTIONS
              ========================================== */}
          {data.customSections && data.customSections.find((s) => s.id === activeTab) && (
            (() => {
              const sec = data.customSections.find((s) => s.id === activeTab);
              return (
                <div className="mac-pane fade-in">
                  <div className="pane-intro">
                    <h1 className="pane-heading">{sec.heading || sec.label}</h1>
                  </div>
                  <div className="mac-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '1.02rem', lineHeight: '1.7', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                      {sec.desc}
                    </p>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Window Footer Bar */}
        <div className="mac-window-footer">
          {/* Previous Button */}
          <div className="footer-side-nav">
            {prevTab ? (
              <button
                className="footer-btn prev-btn"
                onClick={() => switchTab(prevTab.id)}
                onMouseEnter={playHoverTick}
              >
                <ArrowLeft size={15} />
                <span>Prev: {prevTab.label}</span>
              </button>
            ) : (
              <span className="footer-placeholder"></span>
            )}
          </div>

          {/* Center Dots with Current Page Indicator */}
          <div className="footer-center-nav">
            <div className="mac-dot-pagination">
              {allTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`pagination-circle ${activeTab === tab.id ? 'active' : ''}`}
                  title={`Go to ${tab.label}`}
                  aria-label={`Switch to ${tab.label}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="footer-side-nav right">
            {nextTab ? (
              <button
                className="footer-btn next-btn"
                onClick={() => switchTab(nextTab.id)}
                onMouseEnter={playHoverTick}
              >
                <span>Next: {nextTab.label}</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                className="footer-btn restart-btn"
                onClick={() => switchTab('about')}
                onMouseEnter={playHoverTick}
              >
                <RotateCcw size={14} />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
