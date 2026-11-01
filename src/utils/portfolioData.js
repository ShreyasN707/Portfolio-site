export const DEFAULT_TAB_ORDER = ['about', 'skills', 'projects', 'contact'];

export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: 'Shreyas Naik',
    displayName: 'Shreyas N',
    roleTag: 'Machine Learning & Computer Vision',
    bio: 'I build real-time computer vision models and optimize deep learning pipelines to run fast on edge hardware like NVIDIA Jetson and Raspberry Pi.',
    location: 'Bengaluru, India',
    focus: 'Computer Vision & Edge ML',
    availability: 'Available for Engineering Roles'
  },
  tabOrder: ['about', 'skills', 'projects', 'contact'],
  sectionTitles: {
    skillsHeading: 'Technical Skills',
    skillsSubtitle: 'Technologies and tools I use to build intelligent applications.',
    projectsHeading: 'Featured Projects',
    projectsSubtitle: 'Practical systems built with computer vision, edge machine learning, and web services.',
    contactHeading: 'Get in Touch',
    contactSubtitle: 'Looking for an ML engineer or want to discuss a project? I would love to hear from you.'
  },
  aboutCards: [
    {
      id: 'about-1',
      title: 'Computer Vision',
      desc: 'Real-time object detection and segmentation with YOLOv8, SAM, and OpenCV.',
      tags: ['YOLOv8', 'OpenCV', 'CUDA'],
      iconName: 'Eye'
    },
    {
      id: 'about-2',
      title: 'Edge AI & Embedded',
      desc: 'Deploying lightweight models with ONNX Runtime and TensorRT on Jetson and Raspberry Pi.',
      tags: ['ONNX', 'Jetson', 'C++'],
      iconName: 'Cpu'
    },
    {
      id: 'about-3',
      title: 'Backend Systems',
      desc: 'Writing fast Python FastAPI and Node.js microservices with Redis caching and Docker.',
      tags: ['FastAPI', 'Docker', 'Redis'],
      iconName: 'Layers'
    }
  ],
  skillGroups: [
    {
      id: 'skill-1',
      title: 'Computer Vision & AI',
      iconName: 'Eye',
      items: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'SAM', 'CUDA Acceleration']
    },
    {
      id: 'skill-2',
      title: 'Edge AI & Embedded',
      iconName: 'Cpu',
      items: ['ONNX Runtime', 'NVIDIA Jetson', 'Raspberry Pi', 'TensorRT', 'C++']
    },
    {
      id: 'skill-3',
      title: 'Backend & APIs',
      iconName: 'Layers',
      items: ['FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker']
    },
    {
      id: 'skill-4',
      title: 'Tools & Workflow',
      iconName: 'Wrench',
      items: ['Git', 'GitHub', 'Linux', 'Weights & Biases', 'Jupyter', 'CI/CD']
    }
  ],
  projects: [
    {
      id: 'dar',
      title: 'Digital Ad Replacement',
      tag: 'Computer Vision',
      desc: 'Detects billboards in video streams and replaces them with target advertisements in real time using YOLOv8.',
      tech: ['Python', 'YOLOv8', 'OpenCV', 'CUDA'],
      repoLink: 'https://github.com/ShreyasN707',
      liveLink: ''
    },
    {
      id: 'naakshatra',
      title: 'Naakshatra Edge Intelligence',
      tag: 'Edge AI & IoT',
      desc: 'A standalone smart device that monitors air quality and predicts toxic gas levels at the edge without needing cloud internet.',
      tech: ['ONNX Runtime', 'C++', 'Node.js', 'Sensors'],
      repoLink: 'https://github.com/ShreyasN707',
      liveLink: ''
    },
    {
      id: 'github_analyzer',
      title: 'GitHub Developer Analytics',
      tag: 'Web Analytics',
      desc: 'Audits developer profiles, tracks commit streaks, and analyzes programming language distribution via GitHub API.',
      tech: ['Node.js', 'Express', 'GraphQL', 'Redis'],
      repoLink: 'https://github.com/ShreyasN707',
      liveLink: 'https://github.com/ShreyasN707'
    }
  ],
  contact: {
    email: 'shreyasnaik81@gmail.com',
    linkedin: 'https://linkedin.com/in/shreyasnaik',
    github: 'https://github.com/ShreyasN707',
    note: 'Always open to discuss machine learning systems, edge optimization, and interesting engineering projects.'
  },
  customSections: []
};

const STORAGE_KEY = 'shreyas_portfolio_data_published_v1';

export function getPortfolioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_DATA;
    const parsed = JSON.parse(raw);

    const customSections = Array.isArray(parsed.customSections)
      ? parsed.customSections.map((sec) => ({
          ...sec,
          items: Array.isArray(sec.items) ? sec.items : []
        }))
      : [];

    // Ensure tabOrder contains base tabs and all customSections
    let tabOrder = Array.isArray(parsed.tabOrder) && parsed.tabOrder.length > 0
      ? parsed.tabOrder
      : [...DEFAULT_TAB_ORDER];

    // Make sure all default tabs are present
    DEFAULT_TAB_ORDER.forEach((id) => {
      if (!tabOrder.includes(id)) {
        tabOrder.push(id);
      }
    });

    // Make sure all custom section IDs are present
    customSections.forEach((sec) => {
      if (!tabOrder.includes(sec.id)) {
        tabOrder.push(sec.id);
      }
    });

    return {
      ...DEFAULT_PORTFOLIO_DATA,
      ...parsed,
      tabOrder,
      profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
      sectionTitles: { ...DEFAULT_PORTFOLIO_DATA.sectionTitles, ...(parsed.sectionTitles || {}) },
      contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
      aboutCards: Array.isArray(parsed.aboutCards) ? parsed.aboutCards : DEFAULT_PORTFOLIO_DATA.aboutCards,
      skillGroups: Array.isArray(parsed.skillGroups) ? parsed.skillGroups : DEFAULT_PORTFOLIO_DATA.skillGroups,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
      customSections
    };
  } catch (err) {
    console.error('Failed to load portfolio data from localStorage:', err);
    return DEFAULT_PORTFOLIO_DATA;
  }
}

export function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save portfolio data to localStorage:', err);
    return false;
  }
}

export function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PORTFOLIO_DATA;
  } catch (err) {
    console.error('Failed to reset portfolio data:', err);
    return DEFAULT_PORTFOLIO_DATA;
  }
}
