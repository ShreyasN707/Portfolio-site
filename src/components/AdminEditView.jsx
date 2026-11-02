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
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Upload,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react';
import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  DEFAULT_TAB_ORDER
} from '../utils/portfolioData';
import { playHoverTick, playSelectClick, playAccessGranted } from '../utils/audio';
import RichTextFloatingBar from './RichTextFloatingBar';
import RichTextEditorBox from './RichTextEditorBox';
import AdminDocsToolbar from './AdminDocsToolbar';

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

  // Quick Inline Add State for Skill Cards
  const [quickSkillInputGroup, setQuickSkillInputGroup] = useState(null); // groupId
  const [quickSkillText, setQuickSkillText] = useState('');

  // Quick Inline Add State for About Focus Cards
  const [quickTagInputCard, setQuickTagInputCard] = useState(null); // cardId
  const [quickTagText, setQuickTagText] = useState('');

  // Modal State with Dedicated String Buffers for Flawless Comma Typing
  const [modalType, setModalType] = useState(null); // 'profile' | 'aboutCard' | 'skillGroup' | 'project' | 'contact' | 'customSection' | 'sectionTitles' | 'customItem'
  const [formFields, setFormFields] = useState({});
  const [isNewItem, setIsNewItem] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);

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

  const handleInlineSave = (field, newHtml) => {
    if (!field) return;
    setData((prev) => {
      let updated = prev;
      if (field === 'profile.bio') {
        updated = { ...prev, profile: { ...prev.profile, bio: newHtml } };
      } else if (field === 'profile.name') {
        updated = { ...prev, profile: { ...prev.profile, name: newHtml } };
      } else if (field === 'profile.roleTag') {
        updated = { ...prev, profile: { ...prev.profile, roleTag: newHtml } };
      } else if (field.startsWith('aboutCardTitle.')) {
        const cardId = field.split('.')[1];
        updated = { ...prev, aboutCards: prev.aboutCards.map((c) => (c.id === cardId ? { ...c, title: newHtml } : c)) };
      } else if (field.startsWith('aboutCard.')) {
        const cardId = field.split('.')[1];
        updated = { ...prev, aboutCards: prev.aboutCards.map((c) => (c.id === cardId ? { ...c, desc: newHtml } : c)) };
      } else if (field.startsWith('projectTitle.')) {
        const projId = field.split('.')[1];
        updated = { ...prev, projects: prev.projects.map((p) => (p.id === projId ? { ...p, title: newHtml } : p)) };
      } else if (field.startsWith('project.')) {
        const projId = field.split('.')[1];
        updated = { ...prev, projects: prev.projects.map((p) => (p.id === projId ? { ...p, desc: newHtml } : p)) };
      } else if (field.startsWith('customSection.')) {
        const secId = field.split('.')[1];
        updated = { ...prev, customSections: (prev.customSections || []).map((s) => (s.id === secId ? { ...s, desc: newHtml } : s)) };
      } else if (field.startsWith('customSectionHeading.')) {
        const secId = field.split('.')[1];
        updated = { ...prev, customSections: (prev.customSections || []).map((s) => (s.id === secId ? { ...s, heading: newHtml } : s)) };
      } else if (field === 'contact.note') {
        updated = { ...prev, contact: { ...prev.contact, note: newHtml } };
      }
      savePortfolioData(updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleFloatingFormat = (editableParent, element) => {
    const target = editableParent || element?.closest('[data-rich-field]');
    if (!target) return;
    const field = target.getAttribute('data-rich-field');
    if (field) {
      handleInlineSave(field, target.innerHTML);
    }
  };

  const handleMoveTab = (tabId, direction) => {
    playSelectClick();
    setData((prev) => {
      const currentOrder = [...(prev.tabOrder || DEFAULT_TAB_ORDER)];
      const currentIndex = currentOrder.indexOf(tabId);
      if (currentIndex === -1) return prev;
      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return prev;

      // Swap
      const temp = currentOrder[currentIndex];
      currentOrder[currentIndex] = currentOrder[targetIndex];
      currentOrder[targetIndex] = temp;

      const updated = { ...prev, tabOrder: currentOrder };
      savePortfolioData(updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // ==========================================
  // PROFILE / HERO
  // ==========================================
  const openEditProfile = () => {
    playSelectClick();
    setFormFields({
      name: data.profile?.name || '',
      displayName: data.profile?.displayName || '',
      roleTag: data.profile?.roleTag || '',
      bio: data.profile?.bio || '',
      location: data.profile?.location || '',
      focus: data.profile?.focus || '',
      availability: data.profile?.availability || ''
    });
    setModalType('profile');
    setIsNewItem(false);
  };

  const saveProfile = () => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: (formFields.name || '').trim(),
        displayName: (formFields.displayName || '').trim() || 'Shreyas N',
        roleTag: (formFields.roleTag || '').trim(),
        bio: (formFields.bio || '').trim(),
        location: (formFields.location || '').trim(),
        focus: (formFields.focus || '').trim(),
        availability: (formFields.availability || '').trim()
      }
    }));
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // ==========================================
  // ABOUT CARDS
  // ==========================================
  const openAddAboutCard = () => {
    playSelectClick();
    setFormFields({
      id: `about-${Date.now()}`,
      title: 'New Focus Area',
      desc: 'Description of this engineering domain and what you build.',
      tagsInput: 'Tool1, Tool2, Tool3',
      iconName: 'Cpu',
      image: ''
    });
    setModalType('aboutCard');
    setIsNewItem(true);
  };

  const openEditAboutCard = (card) => {
    playSelectClick();
    setFormFields({
      id: card.id,
      title: card.title || '',
      desc: card.desc || '',
      tagsInput: Array.isArray(card.tags) ? card.tags.join(', ') : '',
      iconName: card.iconName || 'Eye',
      image: card.image || ''
    });
    setModalType('aboutCard');
    setIsNewItem(false);
  };

  const saveAboutCard = () => {
    const parsedTags = formFields.tagsInput
      ? formFields.tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newCard = {
      id: formFields.id || `about-${Date.now()}`,
      title: (formFields.title || '').trim() || 'Focus Area',
      desc: (formFields.desc || '').trim(),
      tags: parsedTags,
      iconName: formFields.iconName || 'Eye',
      image: (formFields.image || '').trim() || null
    };

    if (isNewItem) {
      setData((prev) => ({ ...prev, aboutCards: [...prev.aboutCards, newCard] }));
    } else {
      setData((prev) => ({
        ...prev,
        aboutCards: prev.aboutCards.map((c) => (c.id === newCard.id ? newCard : c))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  const deleteAboutCard = (id) => {
    playSelectClick();
    if (window.confirm('Delete this focus card?')) {
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
      title: `${card.title} (Copy)`,
      image: card.image || null,
      tags: Array.isArray(card.tags) ? [...card.tags] : []
    };
    setData((prev) => ({
      ...prev,
      aboutCards: [...prev.aboutCards, newCard]
    }));
    setHasUnsavedChanges(true);
  };

  // Inline Quick-Add Tag to About Card
  const handleQuickAddTag = (cardId) => {
    const trimmed = quickTagText.trim();
    if (!trimmed) {
      setQuickTagInputCard(null);
      return;
    }
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.map((c) => {
        if (c.id === cardId) {
          const existing = Array.isArray(c.tags) ? c.tags : [];
          return { ...c, tags: [...existing, trimmed] };
        }
        return c;
      })
    }));
    setQuickTagText('');
    setQuickTagInputCard(null);
    setHasUnsavedChanges(true);
  };

  const handleQuickRemoveTag = (cardId, tagIndex) => {
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.map((c) => {
        if (c.id === cardId) {
          const tags = [...(c.tags || [])];
          tags.splice(tagIndex, 1);
          return { ...c, tags };
        }
        return c;
      })
    }));
    setHasUnsavedChanges(true);
  };

  // ==========================================
  // SKILLS (WITH FLAWLESS COMMA TYPING & INLINE ADD)
  // ==========================================
  const openAddSkillGroup = () => {
    playSelectClick();
    setFormFields({
      id: `skill-${Date.now()}`,
      title: 'New Skill Category',
      iconName: 'Wrench',
      image: '',
      itemsInput: 'Python, PyTorch, YOLOv8, OpenCV'
    });
    setModalType('skillGroup');
    setIsNewItem(true);
  };

  const openEditSkillGroup = (group) => {
    playSelectClick();
    setFormFields({
      id: group.id,
      title: group.title || '',
      iconName: group.iconName || 'Wrench',
      image: group.image || '',
      itemsInput: Array.isArray(group.items) ? group.items.join(', ') : ''
    });
    setModalType('skillGroup');
    setIsNewItem(false);
  };

  const saveSkillGroup = () => {
    const parsedItems = formFields.itemsInput
      ? formFields.itemsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newGroup = {
      id: formFields.id || `skill-${Date.now()}`,
      title: formFields.title.trim() || 'Skill Category',
      iconName: formFields.iconName || 'Wrench',
      image: (formFields.image || '').trim() || null,
      items: parsedItems
    };

    if (isNewItem) {
      setData((prev) => ({ ...prev, skillGroups: [...prev.skillGroups, newGroup] }));
    } else {
      setData((prev) => ({
        ...prev,
        skillGroups: prev.skillGroups.map((g) => (g.id === newGroup.id ? newGroup : g))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
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
      title: `${group.title} (Copy)`,
      image: group.image || null,
      items: Array.isArray(group.items) ? [...group.items] : []
    };
    setData((prev) => ({
      ...prev,
      skillGroups: [...prev.skillGroups, newGroup]
    }));
    setHasUnsavedChanges(true);
  };

  // Inline Quick-Add Skill to Group
  const handleQuickAddSkill = (groupId) => {
    const trimmed = quickSkillText.trim();
    if (!trimmed) {
      setQuickSkillInputGroup(null);
      return;
    }
    setData((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((g) => {
        if (g.id === groupId) {
          const existing = Array.isArray(g.items) ? g.items : [];
          return { ...g, items: [...existing, trimmed] };
        }
        return g;
      })
    }));
    setQuickSkillText('');
    setQuickSkillInputGroup(null);
    setHasUnsavedChanges(true);
  };

  const handleQuickRemoveSkill = (groupId, itemIndex) => {
    setData((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((g) => {
        if (g.id === groupId) {
          const items = [...(g.items || [])];
          items.splice(itemIndex, 1);
          return { ...g, items };
        }
        return g;
      })
    }));
    setHasUnsavedChanges(true);
  };

  // ==========================================
  // PROJECTS (WITH FLAWLESS COMMA TYPING)
  // ==========================================
  const openAddProject = () => {
    playSelectClick();
    setFormFields({
      id: `proj-${Date.now()}`,
      title: 'New Featured Project',
      techInput: 'Python, YOLOv8, OpenCV, CUDA',
      repoLink: 'https://github.com/ShreyasN707',
      liveLink: '',
      image: '',
      desc: 'Clear summary of what this project does and key technologies used.'
    });
    setModalType('project');
    setIsNewItem(true);
  };

  const openEditProject = (proj, focusLive = false) => {
    playSelectClick();
    setFormFields({
      id: proj.id,
      title: proj.title || '',
      techInput: Array.isArray(proj.tech) ? proj.tech.join(', ') : (proj.tech || ''),
      repoLink: proj.repoLink || proj.link || '',
      liveLink: proj.liveLink || '',
      image: proj.image || '',
      desc: proj.desc || '',
      focusLive
    });
    setModalType('project');
    setIsNewItem(false);
  };

  const saveProject = () => {
    const parsedTech = formFields.techInput
      ? formFields.techInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newProj = {
      id: formFields.id || `proj-${Date.now()}`,
      title: (formFields.title || '').trim() || 'Project Title',
      tech: parsedTech,
      repoLink: (formFields.repoLink || '').trim() || 'https://github.com/ShreyasN707',
      liveLink: (formFields.liveLink || '').trim() || null,
      image: (formFields.image || '').trim() || null,
      desc: (formFields.desc || '').trim()
    };

    if (isNewItem) {
      setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    } else {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === newProj.id ? newProj : p))
      }));
    }
    setHasUnsavedChanges(true);
    setModalType(null);
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
      title: `${proj.title} (Copy)`,
      tech: Array.isArray(proj.tech) ? [...proj.tech] : [],
      image: proj.image || null
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setHasUnsavedChanges(true);
  };

  // ==========================================
  // CONTACT
  // ==========================================
  const openEditContact = () => {
    playSelectClick();
    setFormFields({
      email: data.contact?.email || '',
      linkedin: data.contact?.linkedin || '',
      github: data.contact?.github || '',
      note: data.contact?.note || ''
    });
    setModalType('contact');
    setIsNewItem(false);
  };

  const saveContact = () => {
    setData((prev) => ({
      ...prev,
      contact: {
        email: formFields.email.trim(),
        linkedin: formFields.linkedin.trim(),
        github: formFields.github.trim(),
        note: formFields.note.trim()
      }
    }));
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // ==========================================
  // SECTION TITLES / HEADINGS
  // ==========================================
  const openEditSectionTitles = (sectionKey) => {
    playSelectClick();
    setFormFields({
      sectionKey,
      heading: data.sectionTitles?.[`${sectionKey}Heading`] || '',
      subtitle: data.sectionTitles?.[`${sectionKey}Subtitle`] || ''
    });
    setModalType('sectionTitles');
  };

  const saveSectionTitles = () => {
    const key = formFields.sectionKey;
    setData((prev) => ({
      ...prev,
      sectionTitles: {
        ...(prev.sectionTitles || {}),
        [`${key}Heading`]: formFields.heading.trim(),
        [`${key}Subtitle`]: formFields.subtitle.trim()
      }
    }));
    setHasUnsavedChanges(true);
    setModalType(null);
  };

  // ==========================================
  // CUSTOM SECTIONS & MEDIA BUILDER (Cards, Images, PDFs, Notes)
  // ==========================================
  const openAddCustomSection = () => {
    playSelectClick();
    setFormFields({
      id: `sec-${Date.now()}`,
      label: 'Experience',
      heading: 'Work & Engineering Experience',
      desc: 'Summary of roles, achievements, and technical contributions.',
      items: []
    });
    setModalType('customSection');
    setIsNewItem(true);
  };

  const openEditCustomSection = (sec) => {
    playSelectClick();
    setFormFields({
      id: sec.id,
      label: sec.label || '',
      heading: sec.heading || '',
      desc: sec.desc || '',
      items: sec.items || []
    });
    setModalType('customSection');
    setIsNewItem(false);
  };

  const saveCustomSection = () => {
    const secId = formFields.id || `sec-${Date.now()}`;
    const newSec = {
      id: secId,
      label: (formFields.label || '').trim() || 'New Tab',
      heading: (formFields.heading || '').trim() || (formFields.label || '').trim(),
      desc: (formFields.desc || '').trim(),
      items: formFields.items || []
    };

    setData((prev) => {
      let nextSections;
      if (isNewItem) {
        nextSections = [...(prev.customSections || []), newSec];
      } else {
        nextSections = (prev.customSections || []).map((s) => (s.id === secId ? { ...s, ...newSec, items: s.items || [] } : s));
      }
      let nextTabOrder = prev.tabOrder ? [...prev.tabOrder] : [...DEFAULT_TAB_ORDER];
      if (!nextTabOrder.includes(secId)) {
        nextTabOrder.push(secId);
      }
      const updated = { ...prev, customSections: nextSections, tabOrder: nextTabOrder };
      savePortfolioData(updated);
      return updated;
    });

    setHasUnsavedChanges(true);
    setModalType(null);
    setActiveTab(secId);
  };

  const deleteAnyTab = (tabId) => {
    playSelectClick();
    const tabObj = allTabs.find((t) => t.id === tabId);
    const tabName = tabObj?.label || tabId;
    if (!window.confirm(`Delete the "${tabName}" tab from your portfolio? You can restore it anytime from the Reorder Tabs menu.`)) {
      return;
    }

    setData((prev) => {
      const nextDeleted = Array.isArray(prev.deletedTabs) ? [...prev.deletedTabs] : [];
      if (!nextDeleted.includes(tabId)) {
        nextDeleted.push(tabId);
      }
      const nextTabOrder = (prev.tabOrder || []).filter((id) => id !== tabId);
      const nextCustomSections = (prev.customSections || []).filter((s) => s.id !== tabId);
      const updated = {
        ...prev,
        deletedTabs: nextDeleted,
        tabOrder: nextTabOrder,
        customSections: nextCustomSections
      };
      savePortfolioData(updated);
      return updated;
    });

    setHasUnsavedChanges(true);

    const remainingTabs = allTabs.filter((t) => t.id !== tabId);
    if (remainingTabs.length > 0) {
      setActiveTab(remainingTabs[0].id);
    }
  };

  const restoreTab = (tabId) => {
    playAccessGranted();
    setData((prev) => {
      const nextDeleted = (prev.deletedTabs || []).filter((id) => id !== tabId);
      const nextTabOrder = prev.tabOrder ? [...prev.tabOrder] : [];
      if (!nextTabOrder.includes(tabId)) {
        nextTabOrder.push(tabId);
      }
      const updated = {
        ...prev,
        deletedTabs: nextDeleted,
        tabOrder: nextTabOrder
      };
      savePortfolioData(updated);
      return updated;
    });
    setHasUnsavedChanges(true);
    setActiveTab(tabId);
  };

  const toggleSectionVisibility = (sectionKey, sectionName) => {
    playSelectClick();
    const isCurrentlyHidden = Boolean(data.hiddenSections?.[sectionKey]);
    if (!isCurrentlyHidden) {
      if (!window.confirm(`Delete/hide the "${sectionName}" section? You can restore it anytime.`)) {
        return;
      }
    }
    setData((prev) => {
      const updated = {
        ...prev,
        hiddenSections: {
          ...(prev.hiddenSections || {}),
          [sectionKey]: !isCurrentlyHidden
        }
      };
      savePortfolioData(updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const openAddCustomItem = (secId, itemType) => {
    playSelectClick();
    setFormFields({
      secId,
      itemType,
      title: '',
      desc: '',
      tagsInput: '',
      iconName: 'Sparkles',
      url: '',
      caption: '',
      fileName: '',
      fileSize: '',
      content: ''
    });
    setModalType('customItem');
    setIsNewItem(true);
  };

  const openEditCustomItem = (secId, item) => {
    playSelectClick();
    setFormFields({
      secId,
      id: item.id,
      itemType: item.type,
      title: item.title || '',
      desc: item.desc || '',
      tagsInput: (item.tags || []).join(', '),
      iconName: item.iconName || 'Sparkles',
      url: item.url || '',
      caption: item.caption || '',
      fileName: item.fileName || '',
      fileSize: item.fileSize || '',
      content: item.content || ''
    });
    setModalType('customItem');
    setIsNewItem(false);
  };

  const handleFileUpload = (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeText = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormFields((prev) => ({
        ...prev,
        [targetField]: dataUrl,
        fileName: file.name,
        fileSize: sizeText,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveCustomItem = () => {
    playAccessGranted();
    const secId = formFields.secId;
    const itemType = formFields.itemType;

    let newItem = {
      id: formFields.id || `item-${Date.now()}`,
      type: itemType
    };

    if (itemType === 'card') {
      const parsedTags = formFields.tagsInput
        ? formFields.tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      newItem = {
        ...newItem,
        title: (formFields.title || '').trim() || 'Focus Card',
        desc: (formFields.desc || '').trim(),
        tags: parsedTags,
        iconName: formFields.iconName || 'Sparkles'
      };
    } else if (itemType === 'image') {
      newItem = {
        ...newItem,
        title: (formFields.title || '').trim(),
        caption: (formFields.caption || formFields.title || '').trim(),
        url: (formFields.url || '').trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        alt: (formFields.title || 'Portfolio image').trim()
      };
    } else if (itemType === 'pdf') {
      newItem = {
        ...newItem,
        title: (formFields.title || '').trim() || 'Document.pdf',
        fileName: (formFields.fileName || 'document.pdf').trim(),
        fileSize: (formFields.fileSize || 'PDF Document').trim(),
        desc: (formFields.desc || '').trim(),
        url: (formFields.url || '').trim() || '#'
      };
    } else if (itemType === 'text') {
      newItem = {
        ...newItem,
        title: (formFields.title || '').trim(),
        content: (formFields.content || '').trim()
      };
    }

    const updatedSections = (data.customSections || []).map((sec) => {
      if (sec.id !== secId) return sec;
      const currentItems = Array.isArray(sec.items) ? sec.items : [];
      let nextItems;
      if (isNewItem) {
        nextItems = [...currentItems, newItem];
      } else {
        nextItems = currentItems.map((it) => (it.id === newItem.id ? newItem : it));
      }
      return { ...sec, items: nextItems };
    });

    const updated = { ...data, customSections: updatedSections };
    setData(updated);
    setHasUnsavedChanges(true);
    savePortfolioData(updated);
    setModalType(null);
  };

  const deleteCustomItem = (secId, itemId) => {
    playSelectClick();
    if (window.confirm('Delete this item from this tab?')) {
      const updatedSections = (data.customSections || []).map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          items: (sec.items || []).filter((it) => it.id !== itemId)
        };
      });
      const updated = { ...data, customSections: updatedSections };
      setData(updated);
      setHasUnsavedChanges(true);
      savePortfolioData(updated);
    }
  };

  const moveCustomItem = (secId, itemId, direction) => {
    playSelectClick();
    const updatedSections = (data.customSections || []).map((sec) => {
      if (sec.id !== secId) return sec;
      const items = [...(sec.items || [])];
      const idx = items.findIndex((it) => it.id === itemId);
      if (idx === -1) return sec;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= items.length) return sec;
      const temp = items[idx];
      items[idx] = items[targetIdx];
      items[targetIdx] = temp;
      return { ...sec, items };
    });
    const updated = { ...data, customSections: updatedSections };
    setData(updated);
    setHasUnsavedChanges(true);
    savePortfolioData(updated);
  };

  const deletedTabs = data.deletedTabs || [];
  const unorderedTabs = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
    ...(data.customSections || []).map((s) => ({ id: s.id, label: s.label }))
  ].filter((t) => !deletedTabs.includes(t.id));

  const tabOrder = data.tabOrder || DEFAULT_TAB_ORDER;
  const allTabs = [...unorderedTabs].sort((a, b) => {
    let idxA = tabOrder.indexOf(a.id);
    let idxB = tabOrder.indexOf(b.id);
    if (idxA === -1) idxA = 999;
    if (idxB === -1) idxB = 999;
    return idxA - idxB;
  });

  const effectiveActiveTab = allTabs.some((t) => t.id === activeTab)
    ? activeTab
    : (allTabs[0]?.id || 'about');

  const currentTabIdx = allTabs.findIndex((t) => t.id === effectiveActiveTab);
  const prevTab = currentTabIdx > 0 ? allTabs[currentTabIdx - 1] : null;
  const nextTab = currentTabIdx < allTabs.length - 1 ? allTabs[currentTabIdx + 1] : null;

  return (
    <div className="mac-terminal-page">
      {/* Floating Google Docs Toolbar on Mouse Selection */}
      <RichTextFloatingBar onApplyFormat={handleFloatingFormat} />
      {/* Toast Notification Banner */}
      {publishMessage && (
        <div className="admin-toast-banner fade-in">
          <Check size={16} />
          <span>{publishMessage}</span>
        </div>
      )}

      {/* Terminal Window Container */}
      <div className="mac-window">
        {/* Titlebar with Left-Aligned Title and Non-Overlapping Action Buttons */}
        <div className="mac-titlebar admin-titlebar-layout">
          <div className="admin-titlebar-left">
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

            <div className="admin-branding-group">
              <img
                src="/favicon.svg"
                alt="Funny Logo"
                className="titlebar-funny-logo"
                title="Derpy Retro PC // Beep Boop!"
                onClick={playSelectClick}
              />
              <span className="window-title-name-yellow">{data.profile?.displayName || 'Shreyas N'}</span>
              <span className="admin-status-badge">ADMIN MODE</span>
            </div>
          </div>

          {/* Quick Header Actions (Never Overlaps) */}
          <div className="admin-titlebar-actions">
            <button
              className="mac-action-btn admin-reset-btn"
              onClick={handleReset}
              onMouseEnter={playHoverTick}
              title="Reset all content to original defaults"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
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
            {allTabs.map((tab, idx) => (
              <div key={tab.id} className="mac-tab-pill-group">
                <button
                  onClick={() => switchTab(tab.id)}
                  onMouseEnter={playHoverTick}
                  className={`mac-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                </button>
                {activeTab === tab.id && (
                  <div className="tab-reorder-arrows">
                    <button
                      type="button"
                      className="tab-arrow-btn"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTab(tab.id, -1);
                      }}
                      title="Move Tab Left"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      className="tab-arrow-btn"
                      disabled={idx === allTabs.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTab(tab.id, 1);
                      }}
                      title="Move Tab Right"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              className="mac-tab-btn add-tab-btn"
              onClick={openAddCustomSection}
              onMouseEnter={playHoverTick}
              title="Add a new custom section/tab"
            >
              <Plus size={13} />
              <span>Add Tab</span>
            </button>

            <button
              className="mac-tab-btn reorder-modal-trigger-btn"
              onClick={() => setShowReorderModal(true)}
              onMouseEnter={playHoverTick}
              title="Reorder all tabs"
            >
              <ArrowUpDown size={13} />
              <span>Reorder Tabs</span>
            </button>
          </div>

          <div className="mac-tab-guide">
            <span>Tab {currentTabIdx + 1} of {allTabs.length}</span>
          </div>
        </div>

        {/* Docked Google Docs Formatting Toolbar directly visible on the terminal */}
        <AdminDocsToolbar
          onApplyFormat={handleFloatingFormat}
          onOpenReorderModal={() => setShowReorderModal(true)}
        />

        {/* Content Body Area */}
        <div className="mac-content-body" ref={contentBodyRef}>
          {/* ==========================================
              TAB 1: ABOUT (EDITABLE)
              ========================================== */}
          {effectiveActiveTab === 'about' && (
            <div className="mac-pane fade-in">
              <div className="admin-section-subheader" style={{ marginBottom: '14px' }}>
                <div className="section-title-wrap">
                  <h1 className="pane-heading">Profile & Overview</h1>
                  <p className="pane-subtitle">Core introduction, bio, and focus area cards.</p>
                </div>
                <div className="subheader-actions-row">
                  <button
                    className="admin-add-item-btn delete-sec"
                    onClick={() => deleteAnyTab('about')}
                    title="Delete the About tab from your portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Delete Tab</span>
                  </button>
                </div>
              </div>

              {/* Hero Section with Direct Edit Trigger */}
              {!data.hiddenSections?.profileHero ? (
                <div className="admin-editable-block hero-block" onClick={openEditProfile} style={{ position: 'relative' }}>
                  <div className="editable-hover-banner">
                    <Edit3 size={14} />
                    <span>Click to Edit Profile Header & Bio</span>
                  </div>

                  <button
                    type="button"
                    className="card-mini-btn delete section-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility('profileHero', 'Profile Header & Bio');
                    }}
                    title="Delete Profile Header & Bio section"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="about-hero-section">
                    <h1 className="about-name-title">
                      Hi, I'm{' '}
                      <span
                        className="highlight-cute rich-inline-editable"
                        contentEditable
                        suppressContentEditableWarning
                        data-rich-editable="true"
                        data-rich-field="profile.name"
                        title="Highlight text to change color, font, and size!"
                        onBlur={(e) => handleInlineSave('profile.name', e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: data.profile?.name || 'Shreyas Naik' }}
                      />
                    </h1>
                    <div
                      className="about-description rich-inline-editable"
                      contentEditable
                      suppressContentEditableWarning
                      data-rich-editable="true"
                      data-rich-field="profile.bio"
                      title="Highlight words with mouse to style color, font, and size!"
                      onBlur={(e) => handleInlineSave('profile.bio', e.currentTarget.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: data.profile?.bio || '' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Profile Header & Bio" section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('profileHero', 'Profile Header & Bio')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}

              {/* Focus Areas & Cards */}
              {!data.hiddenSections?.aboutCards ? (
                <>
                  <div className="admin-section-subheader" style={{ marginTop: '18px' }}>
                    <span className="subheader-title">Focus Areas & Domain Cards ({data.aboutCards?.length || 0})</span>
                    <div className="subheader-actions-row">
                      <button className="admin-add-item-btn" onClick={openAddAboutCard} onMouseEnter={playHoverTick}>
                        <Plus size={14} />
                        <span>Add Focus Card</span>
                      </button>
                      <button
                        type="button"
                        className="admin-add-item-btn delete-sec"
                        onClick={() => toggleSectionVisibility('aboutCards', 'Focus Areas')}
                        title="Delete Focus Areas Section"
                      >
                        <Trash2 size={13} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>

              <div className="about-triplet-grid">
                {(data.aboutCards || []).map((card) => {
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
                        {card.image ? (
                          <img src={card.image} alt={card.title} className="cute-card-custom-img" />
                        ) : (
                          <div className="cute-icon-box">
                            <Icon size={17} />
                          </div>
                        )}
                        <h2 className="cute-card-title">{card.title}</h2>
                      </div>
                      <div
                        className="cute-card-desc rich-inline-editable"
                        contentEditable
                        suppressContentEditableWarning
                        data-rich-editable="true"
                        data-rich-field={`aboutCard.${card.id}`}
                        title="Highlight words with mouse to style color, font, and size!"
                        onBlur={(e) => handleInlineSave(`aboutCard.${card.id}`, e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: card.desc || '' }}
                      />

                      {/* Tag list with quick remove and quick add */}
                      <div className="cute-tags-row">
                        {(card.tags || []).map((tag, i) => (
                          <span key={i} className="tag-pill tag-pill-interactive">
                            <span>{tag}</span>
                            <button
                              className="pill-quick-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickRemoveTag(card.id, i);
                              }}
                              title="Remove tag"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}

                        {quickTagInputCard === card.id ? (
                          <div className="inline-quick-add-form" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="inline-quick-input"
                              placeholder="Tag name..."
                              autoFocus
                              value={quickTagText}
                              onChange={(e) => setQuickTagText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleQuickAddTag(card.id);
                                if (e.key === 'Escape') setQuickTagInputCard(null);
                              }}
                            />
                            <button className="inline-quick-confirm" onClick={() => handleQuickAddTag(card.id)}>
                              Add
                            </button>
                            <button className="inline-quick-cancel" onClick={() => setQuickTagInputCard(null)}>
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="inline-add-pill-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickTagInputCard(card.id);
                              setQuickTagText('');
                            }}
                            title="Add tag directly"
                          >
                            <Plus size={11} />
                            <span>Tag</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

                </>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Focus Areas" cards section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('aboutCards', 'Focus Areas')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}

              {/* Status Footer Pill */}
              {!data.hiddenSections?.statusStrip ? (
                <div className="admin-editable-block status-block" onClick={openEditProfile} style={{ marginTop: '16px', position: 'relative' }}>
                  <button
                    type="button"
                    className="card-mini-btn delete section-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility('statusStrip', 'Location & Availability Status');
                    }}
                    title="Delete Status & Location footer strip"
                  >
                    <Trash2 size={13} />
                  </button>
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
                    <span className="mini-edit-hint">Click to edit location & status</span>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Location & Availability Status" footer is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('statusStrip', 'Location & Availability Status')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 2: SKILLS (WITH FLAWLESS COMMA & INLINE ADD)
              ========================================== */}
          {effectiveActiveTab === 'skills' && (
            <div className="mac-pane fade-in">
              {!data.hiddenSections?.skillsHeader ? (
                <div className="admin-section-subheader">
                  <div className="section-title-wrap">
                    <h1 className="pane-heading">
                      {data.sectionTitles?.skillsHeading || 'Technical Skills'}
                      <button
                        className="inline-header-edit-btn"
                        onClick={() => openEditSectionTitles('skills')}
                        title="Edit Section Title & Subtitle"
                      >
                        <Edit3 size={13} />
                      </button>
                    </h1>
                    <p className="pane-subtitle">
                      {data.sectionTitles?.skillsSubtitle || 'Technologies and tools I use to build intelligent applications.'}
                    </p>
                  </div>
                  <div className="subheader-actions-row">
                    <button
                      type="button"
                      className="admin-add-item-btn delete-sec"
                      onClick={() => toggleSectionVisibility('skillsHeader', 'Skills Header & Intro')}
                      title="Delete Skills Header & Intro section"
                    >
                      <Trash2 size={13} />
                      <span>Delete Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('skills')}
                      title="Delete the Skills tab from your portfolio"
                    >
                      <Trash2 size={13} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Skills Header & Intro" section is currently deleted/hidden.</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="restore-placeholder-btn"
                      onClick={() => toggleSectionVisibility('skillsHeader', 'Skills Header & Intro')}
                    >
                      <RotateCcw size={12} />
                      <span>Restore Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('skills')}
                      title="Delete the entire Skills tab"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={12} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              )}

              {!data.hiddenSections?.skillsCards ? (
                <div style={{ position: 'relative' }}>
                  <div className="admin-section-subheader" style={{ marginTop: '16px' }}>
                    <span className="subheader-title">Skill Categories & Cards ({(data.skillGroups || []).length})</span>
                    <div className="subheader-actions-row">
                      <button className="admin-add-item-btn" onClick={openAddSkillGroup} onMouseEnter={playHoverTick}>
                        <Plus size={14} />
                        <span>Add Skill Category</span>
                      </button>
                      <button
                        type="button"
                        className="admin-add-item-btn delete-sec"
                        onClick={() => toggleSectionVisibility('skillsCards', 'Skill Cards Grid')}
                        title="Delete Skill Cards Grid Section"
                      >
                        <Trash2 size={13} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>

                  <div className="skills-grid-compact" style={{ marginTop: '14px' }}>
                    {(data.skillGroups || []).map((group) => {
                      const Icon = ICON_MAP[group.iconName] || Wrench;
                      return (
                        <div key={group.id} className="mac-card skill-card-clean admin-editable-card">
                          <div className="card-admin-action-row">
                            <button
                              className="card-mini-btn edit"
                              onClick={() => openEditSkillGroup(group)}
                              title="Edit Category & Skills"
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
                            {group.image ? (
                              <img src={group.image} alt={group.title} className="skill-card-custom-img" />
                            ) : (
                              <div className="cute-icon-box">
                                <Icon size={16} />
                              </div>
                            )}
                            <h2 className="skill-card-heading">{group.title}</h2>
                            <span className="card-badge-count">{(group.items || []).length} skills</span>
                          </div>

                          <div className="skill-tags-wrap">
                            {(group.items || []).map((item, i) => (
                              <span key={i} className="skill-tag-cute skill-tag-interactive">
                                <span>{item}</span>
                                <button
                                  className="pill-quick-remove"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickRemoveSkill(group.id, i);
                                  }}
                                  title={`Remove ${item}`}
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}

                            {/* Inline Quick Add Skill Input */}
                            {quickSkillInputGroup === group.id ? (
                              <div className="inline-quick-add-form" onClick={(e) => e.stopPropagation()}>
                                <input
                                  className="inline-quick-input"
                                  placeholder="e.g. TensorRT, PyTorch..."
                                  autoFocus
                                  value={quickSkillText}
                                  onChange={(e) => setQuickSkillText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuickAddSkill(group.id);
                                    if (e.key === 'Escape') setQuickSkillInputGroup(null);
                                  }}
                                />
                                <button className="inline-quick-confirm" onClick={() => handleQuickAddSkill(group.id)}>
                                  Add
                                </button>
                                <button className="inline-quick-cancel" onClick={() => setQuickSkillInputGroup(null)}>
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="inline-add-pill-trigger skill-add-trigger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickSkillInputGroup(group.id);
                                  setQuickSkillText('');
                                }}
                                title="Quickly add a skill to this card"
                              >
                                <Plus size={12} />
                                <span>Add Skill</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Skill Cards Grid" section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('skillsCards', 'Skill Cards Grid')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 3: PROJECTS (WITH FLAWLESS COMMA & LIVE LINK)
              ========================================== */}
          {effectiveActiveTab === 'projects' && (
            <div className="mac-pane fade-in">
              {!data.hiddenSections?.projectsHeader ? (
                <div className="admin-section-subheader">
                  <div className="section-title-wrap">
                    <h1 className="pane-heading">
                      {data.sectionTitles?.projectsHeading || 'Featured Projects'}
                      <button
                        className="inline-header-edit-btn"
                        onClick={() => openEditSectionTitles('projects')}
                        title="Edit Section Title & Subtitle"
                      >
                        <Edit3 size={13} />
                      </button>
                    </h1>
                    <p className="pane-subtitle">
                      {data.sectionTitles?.projectsSubtitle || 'Practical systems built with computer vision, edge machine learning, and web services.'}
                    </p>
                  </div>
                  <div className="subheader-actions-row">
                    <button
                      type="button"
                      className="admin-add-item-btn delete-sec"
                      onClick={() => toggleSectionVisibility('projectsHeader', 'Projects Header & Intro')}
                      title="Delete Projects Header & Intro section"
                    >
                      <Trash2 size={13} />
                      <span>Delete Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('projects')}
                      title="Delete the Projects tab from your portfolio"
                    >
                      <Trash2 size={13} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Projects Header & Intro" section is currently deleted/hidden.</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="restore-placeholder-btn"
                      onClick={() => toggleSectionVisibility('projectsHeader', 'Projects Header & Intro')}
                    >
                      <RotateCcw size={12} />
                      <span>Restore Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('projects')}
                      title="Delete the entire Projects tab"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={12} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              )}

              {!data.hiddenSections?.projectsCards ? (
                <div style={{ position: 'relative' }}>
                  <div className="admin-section-subheader" style={{ marginTop: '16px' }}>
                    <span className="subheader-title">Project Cards ({(data.projects || []).length})</span>
                    <div className="subheader-actions-row">
                      <button className="admin-add-item-btn" onClick={openAddProject} onMouseEnter={playHoverTick}>
                        <Plus size={14} />
                        <span>Add New Project</span>
                      </button>
                      <button
                        type="button"
                        className="admin-add-item-btn delete-sec"
                        onClick={() => toggleSectionVisibility('projectsCards', 'Projects Grid')}
                        title="Delete Projects Grid Section"
                      >
                        <Trash2 size={13} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>

                  <div className="projects-grid-compact" style={{ marginTop: '14px' }}>
                    {(data.projects || []).map((proj) => (
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

                        {/* Banner Image Preview in Admin if available */}
                        {proj.image && (
                          <div className="project-banner-wrap" onClick={() => openEditProject(proj)} title="Click to edit project image">
                            <img src={proj.image} alt={proj.title} className="project-banner-img" />
                          </div>
                        )}

                        {/* Description of the project */}
                        <div
                          className="project-desc-cute rich-inline-editable"
                          contentEditable
                          suppressContentEditableWarning
                          data-rich-editable="true"
                          data-rich-field={`project.${proj.id}`}
                          title="Highlight words with mouse to style color, font, and size!"
                          onBlur={(e) => handleInlineSave(`project.${proj.id}`, e.currentTarget.innerHTML)}
                          dangerouslySetInnerHTML={{ __html: proj.desc || '' }}
                        />

                        {/* Below: Live link (if present) or add trigger */}
                        {proj.liveLink ? (
                          <div className="project-live-container" onClick={() => openEditProject(proj, true)}>
                            <div className="project-live-btn" style={{ pointerEvents: 'none' }}>
                              <ExternalLink size={13} />
                              <span className="live-link-label">Live Link:</span>
                              <span className="live-link-url">{proj.liveLink}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="project-live-container">
                            <button
                              className="no-live-link-trigger"
                              onClick={() => openEditProject(proj, true)}
                              title="Add a live demo website link to this project"
                            >
                              <Plus size={12} />
                              <span>Add Live Demo Link</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Projects Grid" section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('projectsCards', 'Projects Grid')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 4: CONTACT (EDITABLE)
              ========================================== */}
          {effectiveActiveTab === 'contact' && (
            <div className="mac-pane fade-in">
              {!data.hiddenSections?.contactHeader ? (
                <div className="admin-section-subheader">
                  <div className="section-title-wrap">
                    <h1 className="pane-heading">
                      {data.sectionTitles?.contactHeading || 'Get in Touch'}
                      <button
                        className="inline-header-edit-btn"
                        onClick={() => openEditSectionTitles('contact')}
                        title="Edit Section Title & Subtitle"
                      >
                        <Edit3 size={13} />
                      </button>
                    </h1>
                    <p className="pane-subtitle">
                      {data.sectionTitles?.contactSubtitle || 'Looking for an ML engineer or want to discuss a project? I would love to hear from you.'}
                    </p>
                  </div>
                  <div className="subheader-actions-row">
                    <button
                      type="button"
                      className="admin-add-item-btn delete-sec"
                      onClick={() => toggleSectionVisibility('contactHeader', 'Contact Header & Intro')}
                      title="Delete Contact Header & Intro section"
                    >
                      <Trash2 size={13} />
                      <span>Delete Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('contact')}
                      title="Delete the Contact tab from your portfolio"
                    >
                      <Trash2 size={13} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Contact Header & Intro" section is currently deleted/hidden.</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="restore-placeholder-btn"
                      onClick={() => toggleSectionVisibility('contactHeader', 'Contact Header & Intro')}
                    >
                      <RotateCcw size={12} />
                      <span>Restore Header</span>
                    </button>
                    <button
                      className="admin-add-item-btn delete-sec"
                      onClick={() => deleteAnyTab('contact')}
                      title="Delete the entire Contact tab"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={12} />
                      <span>Delete Tab</span>
                    </button>
                  </div>
                </div>
              )}

              {!data.hiddenSections?.contactCards ? (
                <div style={{ position: 'relative' }}>
                  <div className="admin-section-subheader" style={{ marginTop: '16px' }}>
                    <span className="subheader-title">Contact Channels & Info</span>
                    <div className="subheader-actions-row">
                      <button className="admin-add-item-btn" onClick={openEditContact} onMouseEnter={playHoverTick}>
                        <Edit3 size={14} />
                        <span>Edit Details</span>
                      </button>
                      <button
                        type="button"
                        className="admin-add-item-btn delete-sec"
                        onClick={() => toggleSectionVisibility('contactCards', 'Contact Channels')}
                        title="Delete Contact Channels Section"
                      >
                        <Trash2 size={13} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>

                  <div className="contact-grid-compact" style={{ marginTop: '14px' }}>
                    <div className="mac-card contact-card-clean admin-editable-card" onClick={openEditContact}>
                      <div className="cute-icon-box">
                        <Mail size={18} />
                      </div>
                      <div className="contact-details">
                        <span className="contact-type-label">Email Address</span>
                        <span className="contact-main-text">{data.contact?.email || 'shreyasnaik81@gmail.com'}</span>
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
                          {data.contact?.linkedin ? data.contact.linkedin.replace('https://', '') : 'Not configured'}
                        </span>
                      </div>
                      <Edit3 size={15} className="contact-hover-arrow" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Contact Channels" section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('contactCards', 'Contact Channels')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}

              {!data.hiddenSections?.contactNote ? (
                <div className="admin-editable-block" style={{ marginTop: '16px', position: 'relative' }}>
                  <button
                    type="button"
                    className="card-mini-btn delete section-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility('contactNote', 'Availability Note');
                    }}
                    title="Delete Availability Note section"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="contact-footer-note admin-editable-card" onClick={openEditContact} style={{ cursor: 'pointer' }}>
                    <span className="status-label-cute">Availability Note: </span>
                    <span>{data.contact?.note || 'Always open to discuss machine learning systems, edge optimization, and interesting engineering projects.'}</span>
                    <span className="mini-edit-hint" style={{ marginLeft: '10px' }}>(Click to edit)</span>
                  </div>
                </div>
              ) : (
                <div className="section-deleted-placeholder">
                  <span>"Availability Note" section is currently deleted/hidden.</span>
                  <button
                    type="button"
                    className="restore-placeholder-btn"
                    onClick={() => toggleSectionVisibility('contactNote', 'Availability Note')}
                  >
                    <RotateCcw size={12} />
                    <span>Restore Section</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CUSTOM USER-CREATED SECTIONS
              ========================================== */}
          {data.customSections && data.customSections.find((s) => s.id === effectiveActiveTab) && (
            (() => {
              const sec = data.customSections.find((s) => s.id === effectiveActiveTab);
              return (
                <div className="mac-pane fade-in">
                  <div className="admin-section-subheader">
                    <div className="section-title-wrap">
                      <h1
                        className="pane-heading rich-inline-editable"
                        contentEditable
                        suppressContentEditableWarning
                        data-rich-editable="true"
                        data-rich-field={`customSectionHeading.${sec.id}`}
                        onBlur={(e) => handleInlineSave(`customSectionHeading.${sec.id}`, e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: sec.heading || sec.label }}
                      />
                      <p className="pane-subtitle">Custom Tab Section</p>
                    </div>
                    <div className="subheader-actions-row">
                      <button
                        className="admin-add-item-btn"
                        onClick={() => openEditCustomSection(sec)}
                        onMouseEnter={playHoverTick}
                        title="Edit Section Heading & Label"
                      >
                        <Edit3 size={13} />
                        <span>Edit Heading</span>
                      </button>
                      <button
                        className="admin-add-item-btn delete-sec"
                        onClick={() => deleteAnyTab(sec.id)}
                        onMouseEnter={playHoverTick}
                      >
                        <Trash2 size={13} />
                        <span>Delete Tab</span>
                      </button>
                    </div>
                  </div>

                  {/* Intro Overview Box */}
                  {!data.hiddenSections?.[`customOverview_${sec.id}`] ? (
                    <div className="mac-card admin-editable-card" style={{ marginTop: '14px', padding: '16px 20px', position: 'relative' }}>
                      <button
                        type="button"
                        className="card-mini-btn delete section-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(`customOverview_${sec.id}`, `"${sec.label}" Overview Box`);
                        }}
                        title="Delete Overview Box section"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div style={{ fontSize: '0.74rem', color: 'var(--honey-yellow)', fontFamily: 'var(--font-mono)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Tab Overview (Select text with mouse to style):
                      </div>
                      <div
                        className="rich-inline-editable"
                        style={{ fontSize: '0.98rem', lineHeight: '1.6', color: '#cbd5e1' }}
                        contentEditable
                        suppressContentEditableWarning
                        data-rich-editable="true"
                        data-rich-field={`customSection.${sec.id}`}
                        title="Highlight words with mouse to style color, font, and size!"
                        onBlur={(e) => handleInlineSave(`customSection.${sec.id}`, e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: sec.desc || '' }}
                      />
                    </div>
                  ) : (
                    <div className="section-deleted-placeholder">
                      <span>"Tab Overview" section is currently deleted/hidden.</span>
                      <button
                        type="button"
                        className="restore-placeholder-btn"
                        onClick={() => toggleSectionVisibility(`customOverview_${sec.id}`, `"${sec.label}" Overview Box`)}
                      >
                        <RotateCcw size={12} />
                        <span>Restore Overview</span>
                      </button>
                    </div>
                  )}

                  {/* Builder Bar: Cards, Images, PDFs, Notes */}
                  {!data.hiddenSections?.[`customItems_${sec.id}`] ? (
                    <div style={{ position: 'relative' }}>
                      <div className="custom-tab-builder-bar">
                        <span className="builder-bar-label">Add Content to "{sec.label}":</span>
                        <div className="builder-btns-group">
                          <button
                            className="builder-add-btn"
                            onClick={() => openAddCustomItem(sec.id, 'card')}
                            onMouseEnter={playHoverTick}
                            title="Add a domain card with title, icon, tags"
                          >
                            <Plus size={13} />
                            <span>Add Focus Card</span>
                          </button>

                          <button
                            className="builder-add-btn"
                            onClick={() => openAddCustomItem(sec.id, 'image')}
                            onMouseEnter={playHoverTick}
                            title="Upload an image or paste image link"
                          >
                            <ImageIcon size={13} />
                            <span>Upload Image</span>
                          </button>

                          <button
                            className="builder-add-btn"
                            onClick={() => openAddCustomItem(sec.id, 'pdf')}
                            onMouseEnter={playHoverTick}
                            title="Upload a PDF file or document link"
                          >
                            <FileText size={13} />
                            <span>Upload / Link PDF</span>
                          </button>

                          <button
                            className="builder-add-btn"
                            onClick={() => openAddCustomItem(sec.id, 'text')}
                            onMouseEnter={playHoverTick}
                            title="Add formatted rich text note block"
                          >
                            <Edit3 size={13} />
                            <span>Add Rich Note</span>
                          </button>

                          <button
                            type="button"
                            className="admin-add-item-btn delete-sec"
                            onClick={() => toggleSectionVisibility(`customItems_${sec.id}`, `"${sec.label}" Content Items`)}
                            title="Delete Content Items Section"
                            style={{ marginLeft: '6px' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete Section</span>
                          </button>
                        </div>
                      </div>

                      {/* Grid of Custom Items */}
                      {sec.items && sec.items.length > 0 ? (
                        <div className="custom-items-grid-admin">
                          {sec.items.map((item, idx) => {
                            const Icon = ICON_MAP[item.iconName] || Sparkles;
                            return (
                              <div key={item.id || idx} className="mac-card custom-admin-item-card">
                                <div className="card-admin-action-row">
                                  <button
                                    className="card-mini-btn"
                                    disabled={idx === 0}
                                    onClick={() => moveCustomItem(sec.id, item.id, -1)}
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    className="card-mini-btn"
                                    disabled={idx === sec.items.length - 1}
                                    onClick={() => moveCustomItem(sec.id, item.id, 1)}
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                  <button
                                    className="card-mini-btn edit"
                                    onClick={() => openEditCustomItem(sec.id, item)}
                                    title="Edit Item"
                                  >
                                    <Edit3 size={12} />
                                  </button>
                                  <button
                                    className="card-mini-btn delete"
                                    onClick={() => deleteCustomItem(sec.id, item.id)}
                                    title="Delete Item"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>

                                {item.type === 'card' && (
                                  <>
                                    <div className="card-header-cute" onClick={() => openEditCustomItem(sec.id, item)}>
                                      <div className="cute-icon-box">
                                        <Icon size={17} />
                                      </div>
                                      <h2 className="cute-card-title">{item.title}</h2>
                                    </div>
                                    <div
                                      className="cute-card-desc rich-inline-editable"
                                      dangerouslySetInnerHTML={{ __html: item.desc || '' }}
                                    />
                                    {item.tags && item.tags.length > 0 && (
                                      <div className="cute-tags-row">
                                        {item.tags.map((t, i) => (
                                          <span key={i} className="tag-pill">
                                            <span>{t}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}

                                {item.type === 'image' && (
                                  <div className="custom-image-preview-block">
                                    <img src={item.url} alt={item.title || 'Preview'} className="custom-admin-thumb" />
                                    {item.caption && <p className="custom-img-caption-text">{item.caption}</p>}
                                  </div>
                                )}

                                {item.type === 'pdf' && (
                                  <div className="custom-pdf-preview-block">
                                    <div className="pdf-block-header">
                                      <div className="pdf-icon-badge">
                                        <FileText size={20} />
                                      </div>
                                      <div className="pdf-info-wrap">
                                        <span className="pdf-title">{item.title}</span>
                                        <span className="pdf-filename">{item.fileName || 'document.pdf'}</span>
                                      </div>
                                      {item.fileSize && <span className="pdf-size-badge">{item.fileSize}</span>}
                                    </div>
                                    {item.desc && (
                                      <p className="pdf-desc" dangerouslySetInnerHTML={{ __html: item.desc }} />
                                    )}
                                  </div>
                                )}

                                {item.type === 'text' && (
                                  <div className="custom-text-preview-block">
                                    {item.title && <h3 className="custom-block-title">{item.title}</h3>}
                                    <div
                                      className="custom-text-content"
                                      dangerouslySetInnerHTML={{ __html: item.content || '' }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="custom-empty-notice">
                          <Sparkles size={20} />
                          <p>No content widgets added to this tab yet. Click any button above to add Focus Cards, upload Images, or attach PDFs!</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="section-deleted-placeholder">
                      <span>"Tab Content Items" section is currently deleted/hidden.</span>
                      <button
                        type="button"
                        className="restore-placeholder-btn"
                        onClick={() => toggleSectionVisibility(`customItems_${sec.id}`, `"${sec.label}" Content Items`)}
                      >
                        <RotateCcw size={12} />
                        <span>Restore Content Items</span>
                      </button>
                    </div>
                  )}
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
      {modalType === 'profile' && (
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
                value={formFields.name || ''}
                onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
              />

              <label className="modal-field-label">Window Title Display Name (Top Header)</label>
              <input
                className="modal-input"
                value={formFields.displayName || ''}
                onChange={(e) => setFormFields({ ...formFields, displayName: e.target.value })}
              />

              <label className="modal-field-label">Role Badge Tag</label>
              <input
                className="modal-input"
                value={formFields.roleTag || ''}
                onChange={(e) => setFormFields({ ...formFields, roleTag: e.target.value })}
              />

              <label className="modal-field-label">Bio Description (Highlight text with mouse to style)</label>
              <RichTextEditorBox
                initialHtml={formFields.bio || ''}
                onChange={(html) => setFormFields((prev) => ({ ...prev, bio: html }))}
                placeholder="Write your bio... Highlight words with mouse to change color, size, and font!"
              />

              <div className="modal-grid-2">
                <div>
                  <label className="modal-field-label">Location</label>
                  <input
                    className="modal-input"
                    value={formFields.location || ''}
                    onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="modal-field-label">Focus Area</label>
                  <input
                    className="modal-input"
                    value={formFields.focus || ''}
                    onChange={(e) => setFormFields({ ...formFields, focus: e.target.value })}
                  />
                </div>
              </div>

              <label className="modal-field-label">Availability Status</label>
              <input
                className="modal-input"
                value={formFields.availability || ''}
                onChange={(e) => setFormFields({ ...formFields, availability: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ABOUT FOCUS CARD EDITOR
          ========================================== */}
      {modalType === 'aboutCard' && (
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
                value={formFields.title || ''}
                onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              />

              <label className="modal-field-label">Icon</label>
              <select
                className="modal-select"
                value={formFields.iconName || 'Eye'}
                onChange={(e) => setFormFields({ ...formFields, iconName: e.target.value })}
              >
                <option value="Eye">Eye (Computer Vision / AI)</option>
                <option value="Cpu">Cpu (Edge / Hardware / Embedded)</option>
                <option value="Layers">Layers (Backend / Systems)</option>
                <option value="Wrench">Wrench (Tools / Workflow)</option>
                <option value="Globe">Globe (Web / Network)</option>
                <option value="Sparkles">Sparkles (Special / Innovation)</option>
              </select>

              <label className="modal-field-label">Custom Logo / Image (Optional, replaces default icon)</label>
              <input
                type="file"
                accept="image/*"
                className="modal-input file-input"
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <div className="url-or-divider"><span>OR PASTE IMAGE URL</span></div>
              <input
                className="modal-input"
                placeholder="https://... or image link"
                value={formFields.image || ''}
                onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
              />
              {formFields.image && (
                <div className="modal-image-preview-box" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={formFields.image} alt="Card Icon Preview" className="cute-card-custom-img" style={{ width: '40px', height: '40px' }} />
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                    onClick={() => setFormFields((prev) => ({ ...prev, image: '' }))}
                  >
                    Remove Custom Image
                  </button>
                </div>
              )}

              <label className="modal-field-label">Description (Highlight text with mouse to style)</label>
              <RichTextEditorBox
                initialHtml={formFields.desc || ''}
                onChange={(html) => setFormFields((prev) => ({ ...prev, desc: html }))}
                placeholder="Describe focus area... Highlight text to change color, size, and font!"
              />

              <label className="modal-field-label">Tags (Type freely separated by commas)</label>
              <input
                className="modal-input"
                placeholder="e.g. YOLOv8, OpenCV, CUDA"
                value={formFields.tagsInput || ''}
                onChange={(e) => setFormFields({ ...formFields, tagsInput: e.target.value })}
              />

              {/* Live Preview of Tag Pills */}
              <div className="modal-pills-preview">
                <span className="pills-preview-label">Live Tags Preview:</span>
                <div className="pills-preview-list">
                  {(formFields.tagsInput || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((pill, idx) => (
                      <span key={idx} className="tag-pill">
                        {pill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveAboutCard}>Save Card</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SKILL GROUP EDITOR (FLAWLESS COMMA TYPING)
          ========================================== */}
      {modalType === 'skillGroup' && (
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
                value={formFields.title || ''}
                onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              />

              <label className="modal-field-label">Icon</label>
              <select
                className="modal-select"
                value={formFields.iconName || 'Wrench'}
                onChange={(e) => setFormFields({ ...formFields, iconName: e.target.value })}
              >
                <option value="Eye">Eye (Vision / Deep Learning)</option>
                <option value="Cpu">Cpu (Edge AI / Hardware)</option>
                <option value="Layers">Layers (Backend / Infrastructure)</option>
                <option value="Wrench">Wrench (Tools / DevOps)</option>
                <option value="Globe">Globe (Cloud / APIs)</option>
              </select>

              <label className="modal-field-label">Custom Logo / Image (Optional, replaces default icon)</label>
              <input
                type="file"
                accept="image/*"
                className="modal-input file-input"
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <div className="url-or-divider"><span>OR PASTE IMAGE URL</span></div>
              <input
                className="modal-input"
                placeholder="https://... or logo link"
                value={formFields.image || ''}
                onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
              />
              {formFields.image && (
                <div className="modal-image-preview-box" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={formFields.image} alt="Skill Logo Preview" className="skill-card-custom-img" style={{ width: '40px', height: '40px' }} />
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                    onClick={() => setFormFields((prev) => ({ ...prev, image: '' }))}
                  >
                    Remove Custom Image
                  </button>
                </div>
              )}

              <label className="modal-field-label">
                Skills / Technologies (Type freely separated by commas)
              </label>
              <textarea
                className="modal-textarea"
                rows={4}
                placeholder="e.g. Python, PyTorch, YOLOv8, OpenCV, SAM, CUDA Acceleration"
                value={formFields.itemsInput || ''}
                onChange={(e) => setFormFields({ ...formFields, itemsInput: e.target.value })}
              />
              <span className="modal-field-hint">
                Type commas naturally to separate skills (e.g. Python, PyTorch, YOLOv8). They will parse automatically into pills!
              </span>

              {/* Live Preview of Skill Pills */}
              <div className="modal-pills-preview">
                <span className="pills-preview-label">Live Skill Pills Preview:</span>
                <div className="pills-preview-list">
                  {(formFields.itemsInput || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((pill, idx) => (
                      <span key={idx} className="skill-tag-cute">
                        {pill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveSkillGroup}>Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PROJECT EDITOR (FLAWLESS COMMA TYPING)
          ========================================== */}
      {modalType === 'project' && (
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
                placeholder="e.g. Digital Ad Replacement"
                value={formFields.title || ''}
                onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              />

              <label className="modal-field-label">Tech Stack (Type freely separated by commas)</label>
              <input
                className="modal-input"
                placeholder="e.g. Python, YOLOv8, OpenCV, CUDA"
                value={formFields.techInput || ''}
                onChange={(e) => setFormFields({ ...formFields, techInput: e.target.value })}
              />

              {/* Live Preview of Tech Pills */}
              <div className="modal-pills-preview">
                <span className="pills-preview-label">Live Tech Stack Preview:</span>
                <div className="pills-preview-list">
                  {(formFields.techInput || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((tech, idx) => (
                      <span key={idx} className="project-tech-text" style={{ fontSize: '0.78rem' }}>
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <label className="modal-field-label">Repository URL (GitHub)</label>
              <input
                className="modal-input"
                placeholder="https://github.com/ShreyasN707/..."
                value={formFields.repoLink || ''}
                onChange={(e) => setFormFields({ ...formFields, repoLink: e.target.value })}
              />

              <label className="modal-field-label">Live Demo URL (Optional)</label>
              <input
                className="modal-input"
                autoFocus={formFields.focusLive}
                placeholder="https://your-demo-site.com (leave blank if not available)"
                value={formFields.liveLink || ''}
                onChange={(e) => setFormFields({ ...formFields, liveLink: e.target.value })}
              />

              <label className="modal-field-label">Project Image / Banner (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="modal-input file-input"
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <div className="url-or-divider"><span>OR PASTE IMAGE URL</span></div>
              <input
                className="modal-input"
                placeholder="https://images.unsplash.com/... or image link"
                value={formFields.image || ''}
                onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
              />
              {formFields.image && (
                <div className="modal-image-preview-box" style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="preview-label" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Project Image Preview:
                    </span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer', padding: '2px 4px' }}
                      onClick={() => setFormFields((prev) => ({ ...prev, image: '' }))}
                    >
                      Remove Image
                    </button>
                  </div>
                  <img src={formFields.image} alt="Project Preview" className="modal-preview-img" style={{ maxHeight: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
              )}

              <label className="modal-field-label">Project Description (Highlight text with mouse to style)</label>
              <RichTextEditorBox
                initialHtml={formFields.desc || ''}
                onChange={(html) => setFormFields((prev) => ({ ...prev, desc: html }))}
                placeholder="Describe what the project achieves... Highlight words to format color, size, and font!"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveProject}>Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CONTACT DETAILS EDITOR
          ========================================== */}
      {modalType === 'contact' && (
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
                value={formFields.email || ''}
                onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
              />

              <label className="modal-field-label">LinkedIn Profile URL</label>
              <input
                className="modal-input"
                value={formFields.linkedin || ''}
                onChange={(e) => setFormFields({ ...formFields, linkedin: e.target.value })}
              />

              <label className="modal-field-label">GitHub Profile URL</label>
              <input
                className="modal-input"
                value={formFields.github || ''}
                onChange={(e) => setFormFields({ ...formFields, github: e.target.value })}
              />

              <label className="modal-field-label">Availability / Working Note</label>
              <textarea
                className="modal-textarea"
                rows={3}
                value={formFields.note || ''}
                onChange={(e) => setFormFields({ ...formFields, note: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveContact}>Save Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SECTION TITLES / HEADINGS EDITOR
          ========================================== */}
      {modalType === 'sectionTitles' && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Edit Section Heading & Subtitle</h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <label className="modal-field-label">Section Heading</label>
              <input
                className="modal-input"
                value={formFields.heading || ''}
                onChange={(e) => setFormFields({ ...formFields, heading: e.target.value })}
              />

              <label className="modal-field-label">Section Subtitle</label>
              <textarea
                className="modal-textarea"
                rows={3}
                value={formFields.subtitle || ''}
                onChange={(e) => setFormFields({ ...formFields, subtitle: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveSectionTitles}>Save Headings</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CUSTOM SECTION EDITOR
          ========================================== */}
      {modalType === 'customSection' && (
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
                value={formFields.label || ''}
                onChange={(e) => setFormFields({ ...formFields, label: e.target.value })}
              />

              <label className="modal-field-label">Section Heading</label>
              <input
                className="modal-input"
                placeholder="e.g. Work & Engineering Experience"
                value={formFields.heading || ''}
                onChange={(e) => setFormFields({ ...formFields, heading: e.target.value })}
              />

              <label className="modal-field-label">Content (Highlight text with mouse to style)</label>
              <RichTextEditorBox
                initialHtml={formFields.desc || ''}
                onChange={(html) => setFormFields((prev) => ({ ...prev, desc: html }))}
                placeholder="Write section content... Highlight words to format color, size, and font!"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveCustomSection}>
                {isNewItem ? 'Create Section' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REORDER TABS MODAL
          ========================================== */}
      {showReorderModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card reorder-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Reorder Navigation Tabs</h2>
              <button className="modal-close-btn" onClick={() => setShowReorderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-field-hint" style={{ marginBottom: '14px', color: '#94a3b8' }}>
                Change the sequence of tabs. Changes immediately apply to both this edit screen and your live portfolio.
              </p>
              <div className="reorder-tab-list">
                {allTabs.map((tab, idx) => (
                  <div key={tab.id} className="reorder-tab-row">
                    <span className="reorder-tab-index">{idx + 1}</span>
                    <span className="reorder-tab-name">{tab.label}</span>
                    <span className="reorder-tab-type-tag">
                      {['about', 'skills', 'projects', 'contact'].includes(tab.id) ? 'Core' : 'Custom'}
                    </span>
                    <div className="reorder-tab-actions">
                      <button
                        type="button"
                        className="reorder-action-btn"
                        disabled={idx === 0}
                        onClick={() => handleMoveTab(tab.id, -1)}
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                        <span>Up</span>
                      </button>
                      <button
                        type="button"
                        className="reorder-action-btn"
                        disabled={idx === allTabs.length - 1}
                        onClick={() => handleMoveTab(tab.id, 1)}
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                        <span>Down</span>
                      </button>
                      <button
                        type="button"
                        className="reorder-action-btn delete-btn"
                        onClick={() => deleteAnyTab(tab.id)}
                        title={`Delete ${tab.label} Tab`}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deleted / Inactive Tabs Recovery Box */}
              {(data.deletedTabs || []).length > 0 && (
                <div className="deleted-tabs-recovery-box">
                  <h3 className="deleted-tabs-heading">Deleted / Inactive Tabs</h3>
                  <div className="deleted-tabs-list">
                    {(data.deletedTabs || []).map((id) => {
                      const label = ['about', 'skills', 'projects', 'contact'].includes(id)
                        ? id.charAt(0).toUpperCase() + id.slice(1)
                        : (data.customSections?.find((s) => s.id === id)?.label || id);
                      return (
                        <div key={id} className="deleted-tab-restore-row">
                          <span className="deleted-tab-name">{label} Tab</span>
                          <button
                            type="button"
                            className="restore-tab-btn"
                            onClick={() => restoreTab(id)}
                            title="Restore this tab to your portfolio"
                          >
                            <Plus size={12} />
                            <span>Restore Tab</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn primary" onClick={() => setShowReorderModal(false)}>
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CUSTOM ITEM BUILDER (Card, Image, PDF, Note)
          ========================================== */}
      {modalType === 'customItem' && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h2 className="modal-title">
                {isNewItem ? 'Add' : 'Edit'}{' '}
                {formFields.itemType === 'card' && 'Focus Card'}
                {formFields.itemType === 'image' && 'Image Widget'}
                {formFields.itemType === 'pdf' && 'PDF Document'}
                {formFields.itemType === 'text' && 'Rich Text Note'}
              </h2>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>×</button>
            </div>

            <div className="modal-body">
              {/* Common Title */}
              <label className="modal-field-label">
                {formFields.itemType === 'image' ? 'Image Title / Caption' : 'Title'}
              </label>
              <input
                className="modal-input"
                placeholder="e.g. System Architecture, Research Paper..."
                value={formFields.title || ''}
                onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              />

              {/* Card Type Fields */}
              {formFields.itemType === 'card' && (
                <>
                  <label className="modal-field-label">Icon</label>
                  <select
                    className="modal-select"
                    value={formFields.iconName || 'Sparkles'}
                    onChange={(e) => setFormFields({ ...formFields, iconName: e.target.value })}
                  >
                    <option value="Sparkles">Sparkles (Innovation)</option>
                    <option value="Eye">Eye (Vision / AI)</option>
                    <option value="Cpu">Cpu (Edge / Hardware)</option>
                    <option value="Layers">Layers (Backend / Systems)</option>
                    <option value="Wrench">Wrench (Tools / Workflow)</option>
                    <option value="Globe">Globe (Web / Network)</option>
                  </select>

                  <label className="modal-field-label">Card Description (Highlight text with mouse to style)</label>
                  <RichTextEditorBox
                    initialHtml={formFields.desc || ''}
                    onChange={(html) => setFormFields((prev) => ({ ...prev, desc: html }))}
                    placeholder="Describe this domain card... Highlight text with mouse to change color, size, and font!"
                  />

                  <label className="modal-field-label">Tags (Type freely separated by commas)</label>
                  <input
                    className="modal-input"
                    placeholder="e.g. YOLOv8, PyTorch, CUDA"
                    value={formFields.tagsInput || ''}
                    onChange={(e) => setFormFields({ ...formFields, tagsInput: e.target.value })}
                  />
                </>
              )}

              {/* Image Type Fields */}
              {formFields.itemType === 'image' && (
                <>
                  <label className="modal-field-label">Upload Image File (Direct Browser Storage)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="modal-input file-input"
                    onChange={(e) => handleFileUpload(e, 'url')}
                  />

                  <div className="url-or-divider"><span>OR PASTE IMAGE URL</span></div>

                  <label className="modal-field-label">Image Web URL</label>
                  <input
                    className="modal-input"
                    placeholder="https://images.unsplash.com/... or your image link"
                    value={formFields.url || ''}
                    onChange={(e) => setFormFields({ ...formFields, url: e.target.value })}
                  />

                  {formFields.url && (
                    <div className="modal-image-preview-box">
                      <span className="preview-label" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Image Preview:
                      </span>
                      <img src={formFields.url} alt="Preview" className="modal-preview-img" />
                    </div>
                  )}
                </>
              )}

              {/* PDF Type Fields */}
              {formFields.itemType === 'pdf' && (
                <>
                  <label className="modal-field-label">Upload PDF File (Direct Browser Storage)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="modal-input file-input"
                    onChange={(e) => handleFileUpload(e, 'url')}
                  />

                  <div className="url-or-divider"><span>OR PASTE PDF LINK</span></div>

                  <label className="modal-field-label">PDF Web URL or Drive Link</label>
                  <input
                    className="modal-input"
                    placeholder="https://example.com/resume.pdf or Google Drive / GitHub link"
                    value={formFields.url || ''}
                    onChange={(e) => setFormFields({ ...formFields, url: e.target.value })}
                  />

                  <div className="modal-grid-2">
                    <div>
                      <label className="modal-field-label">File Name</label>
                      <input
                        className="modal-input"
                        placeholder="e.g. Shreyas_Naik_Resume.pdf"
                        value={formFields.fileName || ''}
                        onChange={(e) => setFormFields({ ...formFields, fileName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="modal-field-label">File Size Badge</label>
                      <input
                        className="modal-input"
                        placeholder="e.g. 240 KB"
                        value={formFields.fileSize || ''}
                        onChange={(e) => setFormFields({ ...formFields, fileSize: e.target.value })}
                      />
                    </div>
                  </div>

                  <label className="modal-field-label">Document Description (Optional)</label>
                  <RichTextEditorBox
                    initialHtml={formFields.desc || ''}
                    onChange={(html) => setFormFields((prev) => ({ ...prev, desc: html }))}
                    placeholder="Briefly describe what this document contains..."
                  />
                </>
              )}

              {/* Text Note Type Fields */}
              {formFields.itemType === 'text' && (
                <>
                  <label className="modal-field-label">Rich Note Content (Highlight text with mouse to style)</label>
                  <RichTextEditorBox
                    initialHtml={formFields.content || ''}
                    onChange={(html) => setFormFields((prev) => ({ ...prev, content: html }))}
                    placeholder="Write detailed notes, announcements, or documentation... Highlight text to change color, size, and font!"
                  />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setModalType(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={saveCustomItem}>
                {isNewItem ? 'Add to Tab' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
