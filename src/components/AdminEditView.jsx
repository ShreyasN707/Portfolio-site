import { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Eye,
  Cpu,
  Layers,
  Wrench,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mail,
  Upload
} from 'lucide-react';
import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData
} from '../utils/portfolioData';
import { playHoverTick, playSelectClick, playAccessGranted } from '../utils/audio';

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = '' }) {
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

export default function AdminEditView({ onNavigateHome }) {
  const [data, setData] = useState(() => getPortfolioData());
  const [activeTab, setActiveTab] = useState('about');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const contentBodyRef = useRef(null);

  // Modal State
  const [modalType, setModalType] = useState(null); // 'profile' | 'aboutCard' | 'skillGroup' | 'project' | 'contact' | 'customSection'
  const [editingItem, setEditingItem] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const switchTab = (tabId) => {
    playSelectClick();
    setActiveTab(tabId);
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = () => {
    playAccessGranted();
    savePortfolioData(data);
    setHasUnsavedChanges(false);
    setPublishMessage('Published successfully! Live portfolio has been updated.');
    setTimeout(() => setPublishMessage(''), 3500);
  };

  const handleReset = () => {
    playSelectClick();
    if (window.confirm('Reset all changes back to original defaults?')) {
      const reset = resetPortfolioData();
      setData(reset);
      setHasUnsavedChanges(false);
      setPublishMessage('Restored default portfolio data.');
      setTimeout(() => setPublishMessage(''), 3000);
    }
  };

  // Profile Edit
  const openEditProfile = () => {
    playSelectClick();
    setEditingItem({ ...data.profile });
    setModalType('profile');
    setIsNewItem(false);
  };

  const saveProfile = (updatedProfile) => {
    setData((prev) => ({ ...prev, profile: updatedProfile }));
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // About Cards
  const openAddAboutCard = () => {
    playSelectClick();
    setEditingItem({
      id: `about-${Date.now()}`,
      title: 'New Focus Area',
      desc: 'Description of this engineering domain and what you build.',
      tags: ['Tool1', 'Tool2'],
      iconName: 'Cpu'
    });
    setModalType('aboutCard');
    setIsNewItem(true);
  };

  const openEditAboutCard = (card) => {
    playSelectClick();
    setEditingItem({ ...card, tags: Array.isArray(card.tags) ? [...card.tags] : [] });
    setModalType('aboutCard');
    setIsNewItem(false);
  };

  const deleteAboutCard = (id) => {
    playSelectClick();
    if (window.confirm('Delete this info card?')) {
      setData((prev) => ({
        ...prev,
        aboutCards: prev.aboutCards.filter((c) => c.id !== id)
      }));
      setHasUnsavedChanges(true);
    }
  };

  const duplicateAboutCard = (card) => {
    playSelectClick();
    const newCard = {
      ...card,
      id: `about-${Date.now()}`,
      title: `${card.title} (Copy)`
    };
    setData((prev) => ({
      ...prev,
      aboutCards: [...prev.aboutCards, newCard]
    }));
    setHasUnsavedChanges(true);
  };

  const saveAboutCard = (card) => {
    if (isNewItem) {
      setData((prev) => ({ ...prev, aboutCards: [...prev.aboutCards, card] }));
    } else {
      setData((prev) => ({
        ...prev,
        aboutCards: prev.aboutCards.map((c) => (c.id === card.id ? card : c))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // Skills
  const openAddSkillGroup = () => {
    playSelectClick();
    setEditingItem({
      id: `skill-${Date.now()}`,
      title: 'New Skill Category',
      iconName: 'Wrench',
      items: ['Skill A', 'Skill B', 'Skill C']
    });
    setModalType('skillGroup');
    setIsNewItem(true);
  };

  const openEditSkillGroup = (group) => {
    playSelectClick();
    setEditingItem({ ...group, items: Array.isArray(group.items) ? [...group.items] : [] });
    setModalType('skillGroup');
    setIsNewItem(false);
  };

  const deleteSkillGroup = (id) => {
    playSelectClick();
    if (window.confirm('Delete this skill category?')) {
      setData((prev) => ({
        ...prev,
        skillGroups: prev.skillGroups.filter((g) => g.id !== id)
      }));
      setHasUnsavedChanges(true);
    }
  };

  const duplicateSkillGroup = (group) => {
    playSelectClick();
    const newGroup = {
      ...group,
      id: `skill-${Date.now()}`,
      title: `${group.title} (Copy)`
    };
    setData((prev) => ({
      ...prev,
      skillGroups: [...prev.skillGroups, newGroup]
    }));
    setHasUnsavedChanges(true);
  };

  const saveSkillGroup = (group) => {
    if (isNewItem) {
      setData((prev) => ({ ...prev, skillGroups: [...prev.skillGroups, group] }));
    } else {
      setData((prev) => ({
        ...prev,
        skillGroups: prev.skillGroups.map((g) => (g.id === group.id ? group : g))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // Projects
  const openAddProject = () => {
    playSelectClick();
    setEditingItem({
      id: `proj-${Date.now()}`,
      title: 'New Featured Project',
      tag: 'Engineering',
      desc: 'Clear summary of what this project does and key technologies used.',
      tech: ['Python', 'FastAPI'],
      repoLink: 'https://github.com/ShreyasN707',
      liveLink: ''
    });
    setModalType('project');
    setIsNewItem(true);
  };

  const openEditProject = (proj) => {
    playSelectClick();
    setEditingItem({
      ...proj,
      tech: Array.isArray(proj.tech) ? [...proj.tech] : [proj.tech]
    });
    setModalType('project');
    setIsNewItem(false);
  };

  const deleteProject = (id) => {
    playSelectClick();
    if (window.confirm('Delete this project?')) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id)
      }));
      setHasUnsavedChanges(true);
    }
  };

  const duplicateProject = (proj) => {
    playSelectClick();
    const newProj = {
      ...proj,
      id: `proj-${Date.now()}`,
      title: `${proj.title} (Copy)`
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setHasUnsavedChanges(true);
  };

  const saveProject = (proj) => {
    if (isNewItem) {
      setData((prev) => ({ ...prev, projects: [...prev.projects, proj] }));
    } else {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === proj.id ? proj : p))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // Contact Edit
  const openEditContact = () => {
    playSelectClick();
    setEditingItem({ ...data.contact });
    setModalType('contact');
    setIsNewItem(false);
  };

  const saveContact = (contact) => {
    setData((prev) => ({ ...prev, contact }));
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // Custom Section
  const openAddCustomSection = () => {
    playSelectClick();
    setEditingItem({
      id: `sec-${Date.now()}`,
      label: 'Experience',
      heading: 'Work & Research Experience',
      desc: 'Summary of roles, achievements, and technical contributions.'
    });
    setModalType('customSection');
    setIsNewItem(true);
  };

  const saveCustomSection = (sec) => {
    setData((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), sec]
    }));
    setHasUnsavedChanges(true);
    setModalType(null);
    setActiveTab(sec.id);
  };

  const deleteCustomSection = (id) => {
    playSelectClick();
    if (window.confirm('Delete this custom section?')) {
      setData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).filter((s) => s.id !== id)
      }));
      setHasUnsavedChanges(true);
      setActiveTab('about');
    }
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
      {/* Toast Notification Banner */}
      {publishMessage && (
        <div className="admin-toast-banner fade-in">
          <Check size={16} />
          <span>{publishMessage}</span>
        </div>
      )}

      {/* Terminal Window Container */}
      <div className="mac-window">
        {/* Titlebar with Admin Tag & Actions */}
        <div className="mac-titlebar">
          <div className="mac-traffic-lights">
            <span
              className="mac-dot red"
              onClick={() => {
                playSelectClick();
                onNavigateHome();
              }}
              title="Return to Live Site"
            ></span>
            <span className="mac-dot yellow" title="Admin Window"></span>
            <span className="mac-dot green" title="Admin Active"></span>
          </div>

          <div className="mac-window-title">
            <span className="window-title-name-yellow">{data.profile.displayName || 'Shreyas N'}</span>
            <span className="admin-status-badge">ADMIN / EDIT MODE</span>
          </div>

          {/* Quick Header Actions */}
          <div className="mac-header-actions">
            <button
              className="mac-action-btn admin-reset-btn"
              onClick={handleReset}
              onMouseEnter={playHoverTick}
              title="Reset all content to original defaults"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              className="mac-action-btn admin-live-btn"
              onClick={() => {
                playSelectClick();
                onNavigateHome();
              }}
              onMouseEnter={playHoverTick}
              title="View live portfolio website"
            >
              <Eye size={14} />
              <span>Live Site</span>
            </button>

            <button
              className={`mac-action-btn admin-publish-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
              onClick={handlePublish}
              onMouseEnter={playHoverTick}
              title="Publish all changes to live portfolio"
            >
              <Upload size={14} />
              <span>{hasUnsavedChanges ? 'Publish Changes *' : 'Publish Changes'}</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
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

            <button
              className="mac-tab-btn add-tab-btn"
              onClick={openAddCustomSection}
              onMouseEnter={playHoverTick}
              title="Add a new custom section/tab"
            >
              <Plus size={13} />
              <span>Section</span>
            </button>
          </div>

          <div className="mac-tab-guide">
            <span>Click any section or widget below to edit</span>
          </div>
        </div>

        {/* Content Body Area */}
        <div className="mac-content-body" ref={contentBodyRef}>
          {/* ==========================================
              TAB 1: ABOUT (EDITABLE)
              ========================================== */}
          {activeTab === 'about' && (
            <div className="mac-pane fade-in">
              {/* Hero Section with Direct Edit Trigger */}
              <div className="admin-editable-block hero-block" onClick={openEditProfile}>
                <div className="editable-hover-banner">
                  <Edit3 size={14} />
                  <span>Click to Edit Profile Header & Bio</span>
                </div>

                <div className="about-hero-section">
                  <div className="badge-cute">
                    <span>{data.profile.roleTag}</span>
                  </div>
                  <h1 className="about-name-title">
                    Hi, I'm <span className="highlight-cute">{data.profile.name}</span>
                  </h1>
                  <p className="about-description">{data.profile.bio}</p>
                </div>
              </div>

              {/* 3 Information Cards / Focus Areas */}
              <div className="admin-section-subheader">
                <span className="subheader-title">Focus Areas & Domain Cards ({data.aboutCards.length})</span>
                <button className="admin-add-item-btn" onClick={openAddAboutCard} onMouseEnter={playHoverTick}>
                  <Plus size={14} />
                  <span>Add Focus Card</span>
                </button>
              </div>

              <div className="about-triplet-grid">
                {data.aboutCards.map((card) => {
                  const Icon = ICON_MAP[card.iconName] || Layers;
                  return (
                    <div key={card.id} className="mac-card admin-editable-card">
                      <div className="card-admin-action-row">
                        <button
                          className="card-mini-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditAboutCard(card);
                          }}
                          title="Edit Card"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="card-mini-btn copy"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateAboutCard(card);
                          }}
                          title="Duplicate Card"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          className="card-mini-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAboutCard(card.id);
                          }}
                          title="Delete Card"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="card-header-cute" onClick={() => openEditAboutCard(card)}>
                        <div className="cute-icon-box">
                          <Icon size={17} />
                        </div>
                        <h2 className="cute-card-title">{card.title}</h2>
                      </div>
                      <p className="cute-card-desc" onClick={() => openEditAboutCard(card)}>
                        {card.desc}
                      </p>
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
              <div className="admin-editable-block status-block" onClick={openEditProfile}>
                <div className="mac-status-strip">
                  <div className="status-segment">
                    <span className="status-label-cute">Location:</span>
                    <span className="status-value-cute">{data.profile.location}</span>
                  </div>
                  <div className="status-segment">
                    <span className="status-label-cute">Focus:</span>
                    <span className="status-value-cute">{data.profile.focus}</span>
                  </div>
                  <div className="status-segment status-available">
                    <span className="live-dot"></span>
                    <span>{data.profile.availability}</span>
                  </div>
                  <span className="mini-edit-hint">Click to edit</span>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: SKILLS (EDITABLE)
              ========================================== */}
          {activeTab === 'skills' && (
            <div className="mac-pane fade-in">
              <div className="admin-section-subheader">
                <div className="pane-intro" style={{ marginBottom: 0 }}>
                  <h1 className="pane-heading">Technical Skills</h1>
                  <p className="pane-subtitle">Manage skill categories, frameworks, and tools.</p>
                </div>
                <button className="admin-add-item-btn" onClick={openAddSkillGroup} onMouseEnter={playHoverTick}>
                  <Plus size={14} />
                  <span>Add Skill Category</span>
                </button>
              </div>

              <div className="skills-grid-compact" style={{ marginTop: '16px' }}>
                {data.skillGroups.map((group) => {
                  const Icon = ICON_MAP[group.iconName] || Wrench;
                  return (
                    <div key={group.id} className="mac-card skill-card-clean admin-editable-card">
                      <div className="card-admin-action-row">
                        <button
                          className="card-mini-btn edit"
                          onClick={() => openEditSkillGroup(group)}
                          title="Edit Category"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="card-mini-btn copy"
                          onClick={() => duplicateSkillGroup(group)}
                          title="Duplicate Category"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          className="card-mini-btn delete"
                          onClick={() => deleteSkillGroup(group.id)}
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="skill-card-top" onClick={() => openEditSkillGroup(group)}>
                        <div className="cute-icon-box">
                          <Icon size={16} />
                        </div>
                        <h2 className="skill-card-heading">{group.title}</h2>
                      </div>

                      <div className="skill-tags-wrap" onClick={() => openEditSkillGroup(group)}>
                        {(group.items || []).map((item, i) => (
                          <span key={i} className="skill-tag-cute">
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
              TAB 3: PROJECTS (EDITABLE)
              ========================================== */}
          {activeTab === 'projects' && (
            <div className="mac-pane fade-in">
              <div className="admin-section-subheader">
                <div className="pane-intro" style={{ marginBottom: 0 }}>
                  <h1 className="pane-heading">Featured Projects</h1>
                  <p className="pane-subtitle">Create, reorder, or edit showcase engineering projects.</p>
                </div>
                <button className="admin-add-item-btn" onClick={openAddProject} onMouseEnter={playHoverTick}>
                  <Plus size={14} />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="projects-grid-compact" style={{ marginTop: '16px' }}>
                {data.projects.map((proj) => (
                  <div key={proj.id} className="mac-card project-card-compact admin-editable-card">
                    <div className="card-admin-action-row">
                      <button
                        className="card-mini-btn edit"
                        onClick={() => openEditProject(proj)}
                        title="Edit Project"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        className="card-mini-btn copy"
                        onClick={() => duplicateProject(proj)}
                        title="Duplicate Project"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        className="card-mini-btn delete"
                        onClick={() => deleteProject(proj.id)}
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Header format: [project name] | [ tech stack used ] ........... repo link */}
                    <div className="project-header-row" onClick={() => openEditProject(proj)}>
                      <div className="project-header-info">
                        <span className="project-name-text">{proj.title}</span>
                        <span className="project-pipe-divider">|</span>
                        <span className="project-tech-text">
                          {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                        </span>
                      </div>

                      <div className="project-repo-link" style={{ pointerEvents: 'none' }}>
                        <GithubIcon size={14} />
                        <span>Repository</span>
                        <ExternalLink size={13} />
                      </div>
                    </div>

                    {/* Description of the project */}
                    <p className="project-desc-cute" onClick={() => openEditProject(proj)}>
                      {proj.desc}
                    </p>

                    {/* Below: Live link (if present) */}
                    {proj.liveLink ? (
                      <div className="project-live-container" onClick={() => openEditProject(proj)}>
                        <div className="project-live-btn" style={{ pointerEvents: 'none' }}>
                          <ExternalLink size={13} />
                          <span className="live-link-label">Live Link:</span>
                          <span className="live-link-url">{proj.liveLink}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="project-live-container" onClick={() => openEditProject(proj)}>
                        <span className="no-live-link-hint">+ Click to add live preview URL</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: CONTACT (EDITABLE)
              ========================================== */}
          {activeTab === 'contact' && (
            <div className="mac-pane fade-in">
              <div className="admin-section-subheader">
                <div className="pane-intro" style={{ marginBottom: 0 }}>
                  <h1 className="pane-heading">Contact Information</h1>
                  <p className="pane-subtitle">Manage direct contact channels, social profiles, and response note.</p>
                </div>
                <button className="admin-add-item-btn" onClick={openEditContact} onMouseEnter={playHoverTick}>
                  <Edit3 size={14} />
                  <span>Edit Contact Details</span>
                </button>
              </div>

              <div className="contact-grid-compact" style={{ marginTop: '16px' }}>
                <div className="mac-card contact-card-clean admin-editable-card" onClick={openEditContact}>
                  <div className="cute-icon-box">
                    <Mail size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">Email Address</span>
                    <span className="contact-main-text">{data.contact.email}</span>
                  </div>
                  <Edit3 size={15} className="contact-hover-arrow" />
                </div>

                <div className="mac-card contact-card-clean admin-editable-card" onClick={openEditContact}>
                  <div className="cute-icon-box">
                    <LinkedinIcon size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-type-label">LinkedIn Profile</span>
                    <span className="contact-main-text">
                      {data.contact.linkedin ? data.contact.linkedin.replace('https://', '') : 'Not configured'}
                    </span>
                  </div>
                  <Edit3 size={15} className="contact-hover-arrow" />
                </div>
              </div>

              <div className="contact-footer-note admin-editable-card" onClick={openEditContact} style={{ marginTop: '16px', cursor: 'pointer' }}>
                <span className="status-label-cute">Availability Note: </span>
                <span>{data.contact.note}</span>
                <span className="mini-edit-hint" style={{ marginLeft: '10px' }}>(Click to edit)</span>
              </div>
            </div>
          )}

          {/* ==========================================
              CUSTOM USER-CREATED SECTIONS
              ========================================== */}
          {data.customSections && data.customSections.find((s) => s.id === activeTab) && (
            (() => {
              const sec = data.customSections.find((s) => s.id === activeTab);
              return (
                <div className="mac-pane fade-in">
                  <div className="admin-section-subheader">
                    <div className="pane-intro" style={{ marginBottom: 0 }}>
                      <h1 className="pane-heading">{sec.heading || sec.label}</h1>
                      <p className="pane-subtitle">Custom Section</p>
                    </div>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteCustomSection(sec.id)}
                      onMouseEnter={playHoverTick}
                    >
                      <Trash2 size={14} />
                      <span>Delete Section</span>
                    </button>
                  </div>

                  <div className="mac-card admin-editable-card" style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
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
                <span>First Section</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          MODAL: PROFILE / BIO EDITOR
          ========================================== */}
      {modalType === 'profile' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile Information</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Full Name</label>
              <input
                className="modal-input"
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />

              <label className="modal-field-label">Window Title Display Name</label>
              <input
                className="modal-input"
                value={editingItem.displayName || ''}
                onChange={(e) => setEditingItem({ ...editingItem, displayName: e.target.value })}
              />

              <label className="modal-field-label">Role Badge Tag</label>
              <input
                className="modal-input"
                value={editingItem.roleTag || ''}
                onChange={(e) => setEditingItem({ ...editingItem, roleTag: e.target.value })}
              />

              <label className="modal-field-label">Bio Description</label>
              <textarea
                className="modal-textarea"
                rows={4}
                value={editingItem.bio || ''}
                onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
              />

              <div className="modal-grid-2">
                <div>
                  <label className="modal-field-label">Location</label>
                  <input
                    className="modal-input"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="modal-field-label">Focus Area</label>
                  <input
                    className="modal-input"
                    value={editingItem.focus || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, focus: e.target.value })}
                  />
                </div>
              </div>

              <label className="modal-field-label">Availability Status</label>
              <input
                className="modal-input"
                value={editingItem.availability || ''}
                onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveProfile(editingItem)}>Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ABOUT FOCUS CARD EDITOR
          ========================================== */}
      {modalType === 'aboutCard' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">{isNewItem ? 'Add Focus Area Card' : 'Edit Focus Area Card'}</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Card Title</label>
              <input
                className="modal-input"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              />

              <label className="modal-field-label">Icon</label>
              <select
                className="modal-select"
                value={editingItem.iconName || 'Eye'}
                onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
              >
                <option value="Eye">Eye (Computer Vision / AI)</option>
                <option value="Cpu">Cpu (Edge / Hardware / Embedded)</option>
                <option value="Layers">Layers (Backend / Systems)</option>
                <option value="Wrench">Wrench (Tools / Workflow)</option>
                <option value="Globe">Globe (Web / Network)</option>
                <option value="Sparkles">Sparkles (Special / Innovation)</option>
              </select>

              <label className="modal-field-label">Description</label>
              <textarea
                className="modal-textarea"
                rows={3}
                value={editingItem.desc || ''}
                onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
              />

              <label className="modal-field-label">Tags (comma separated)</label>
              <input
                className="modal-input"
                placeholder="e.g. YOLOv8, OpenCV, CUDA"
                value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })
                }
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveAboutCard(editingItem)}>Save Card</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SKILL GROUP EDITOR
          ========================================== */}
      {modalType === 'skillGroup' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">{isNewItem ? 'Add Skill Category' : 'Edit Skill Category'}</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Category Title</label>
              <input
                className="modal-input"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              />

              <label className="modal-field-label">Icon</label>
              <select
                className="modal-select"
                value={editingItem.iconName || 'Wrench'}
                onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
              >
                <option value="Eye">Eye (Vision / Deep Learning)</option>
                <option value="Cpu">Cpu (Edge AI / Hardware)</option>
                <option value="Layers">Layers (Backend / Infrastructure)</option>
                <option value="Wrench">Wrench (Tools / DevOps)</option>
                <option value="Globe">Globe (Cloud / APIs)</option>
              </select>

              <label className="modal-field-label">Skills / Technologies (comma separated)</label>
              <textarea
                className="modal-textarea"
                rows={4}
                placeholder="e.g. Python, PyTorch, YOLOv8, OpenCV, SAM, CUDA Acceleration"
                value={Array.isArray(editingItem.items) ? editingItem.items.join(', ') : ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })
                }
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveSkillGroup(editingItem)}>Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PROJECT EDITOR
          ========================================== */}
      {modalType === 'project' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">{isNewItem ? 'Add Featured Project' : 'Edit Project Details'}</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Project Name</label>
              <input
                className="modal-input"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              />

              <label className="modal-field-label">Tech Stack (comma separated)</label>
              <input
                className="modal-input"
                placeholder="e.g. Python, YOLOv8, OpenCV, CUDA"
                value={Array.isArray(editingItem.tech) ? editingItem.tech.join(', ') : (editingItem.tech || '')}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })
                }
              />

              <label className="modal-field-label">Repository Link</label>
              <input
                className="modal-input"
                placeholder="https://github.com/ShreyasN707/..."
                value={editingItem.repoLink || ''}
                onChange={(e) => setEditingItem({ ...editingItem, repoLink: e.target.value })}
              />

              <label className="modal-field-label">Live Demo Link (optional)</label>
              <input
                className="modal-input"
                placeholder="https://your-demo-site.com (leave blank if none)"
                value={editingItem.liveLink || ''}
                onChange={(e) => setEditingItem({ ...editingItem, liveLink: e.target.value })}
              />

              <label className="modal-field-label">Project Description</label>
              <textarea
                className="modal-textarea"
                rows={3}
                value={editingItem.desc || ''}
                onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveProject(editingItem)}>Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CONTACT DETAILS EDITOR
          ========================================== */}
      {modalType === 'contact' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Edit Contact Information</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Email Address</label>
              <input
                className="modal-input"
                value={editingItem.email || ''}
                onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
              />

              <label className="modal-field-label">LinkedIn Profile URL</label>
              <input
                className="modal-input"
                value={editingItem.linkedin || ''}
                onChange={(e) => setEditingItem({ ...editingItem, linkedin: e.target.value })}
              />

              <label className="modal-field-label">GitHub Profile URL</label>
              <input
                className="modal-input"
                value={editingItem.github || ''}
                onChange={(e) => setEditingItem({ ...editingItem, github: e.target.value })}
              />

              <label className="modal-field-label">Availability / Working Note</label>
              <textarea
                className="modal-textarea"
                rows={3}
                value={editingItem.note || ''}
                onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveContact(editingItem)}>Save Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CUSTOM SECTION EDITOR
          ========================================== */}
      {modalType === 'customSection' && editingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Add New Section / Tab</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Tab Label</label>
              <input
                className="modal-input"
                placeholder="e.g. Experience, Certifications, Publications"
                value={editingItem.label || ''}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
              />

              <label className="modal-field-label">Section Heading</label>
              <input
                className="modal-input"
                placeholder="e.g. Work & Engineering Experience"
                value={editingItem.heading || ''}
                onChange={(e) => setEditingItem({ ...editingItem, heading: e.target.value })}
              />

              <label className="modal-field-label">Content</label>
              <textarea
                className="modal-textarea"
                rows={5}
                placeholder="Write summary, bullet points, or achievements..."
                value={editingItem.desc || ''}
                onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={() => saveCustomSection(editingItem)}>Create Section</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
