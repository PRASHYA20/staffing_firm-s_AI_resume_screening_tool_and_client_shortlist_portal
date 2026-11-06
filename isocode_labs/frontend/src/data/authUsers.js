// authUsers.js - Role-Based Authentication & Session Profiles for TalentPulse AI
// Supports separate sign-in for: Admin (Delivery Head), Recruiter, and Client Partner

export const DEMO_ACCOUNTS = {
  admin: {
    id: 'USR-ADM-001',
    role: 'admin',
    name: 'Dr. Vikram Malhotra',
    title: 'Head of Compliance & System Administrator',
    email: 'admin@talentpulse.ai',
    username: 'admin',
    password: 'admin123',
    organization: 'TalentPulse Staffing Solutions (Noida HQ)',
    portalName: 'Admin & Compliance Governance Portal',
    portalTag: 'DPDP Statutory Registry, Erasure & Audit Logs',
    avatar: 'VM',
    badgeText: 'Admin / Compliance Officer',
    themeColor: '#6366F1', // Indigo
    defaultTab: 'dpdp-compliance',
    ip: '192.168.1.10 (Noida HQ Admin)',
    features: [
      'Statutory DPDP Right-to-Erasure & Consent Registry',
      'Tamper-evident Compliance Audit Trail Inspection',
      'Candidate Data Purge Execution & Certificate Generation',
      'System-wide Candidate Pipeline & SLA Oversight',
      'Governance & Algorithmic Fairness Audit Controls'
    ]
  },
  delivery_head: {
    id: 'USR-DH-004',
    role: 'delivery-head',
    name: 'Arun Joshi',
    title: 'Head of Recruitment Delivery',
    email: 'delivery@talentpulse.ai',
    username: 'delivery',
    password: 'delivery123',
    organization: 'TalentPulse Staffing Solutions (Noida HQ)',
    portalName: 'Delivery Head Operations Portal',
    portalTag: 'SLA Tracking, Recruiter Performance & ROI Metrics',
    avatar: 'AJ',
    badgeText: 'Delivery Head',
    themeColor: '#8B5CF6', // Purple
    defaultTab: 'delivery-dashboard',
    ip: '192.168.1.12 (Delivery Ops)',
    features: [
      'Real-Time 48h Requisition Turnaround SLA Dashboard',
      'Economic ROI & Recruiter Capacity Savings Model',
      'Algorithmic Fairness, Rank Agreement & Recruiter Override Audits',
      'Recruiter Productivity, Sourcing Velocity & Placement Ratios',
      'Overall Candidate Pipeline Flow & Client Submission Health'
    ]
  },
  recruiter: {
    id: 'USR-REC-102',
    role: 'recruiter',
    name: 'Sneha Verma',
    title: 'Senior Technical Recruiter',
    email: 'recruiter@talentpulse.ai',
    username: 'recruiter',
    password: 'recruiter123',
    organization: 'TalentPulse IT Staffing Division',
    portalName: 'Recruiter Screening & Sourcing Portal',
    portalTag: 'AI Matchmaking & Human Verification Gate',
    avatar: 'SV',
    badgeText: 'Senior Recruiter',
    themeColor: '#0284C7', // Sky Blue
    defaultTab: 'ranked-list',
    ip: '192.168.1.45 (Recruiter Workstation)',
    features: [
      'Multi-Format CV Ingestion with Truthful Parsing Status & Manual Review',
      'Scorecard Weighted Scoring & Verifiable Evidence Extraction',
      'Mandatory Human-in-the-Loop CV Deep Dive & Verification Gate',
      'One-Click Candidate Submission to Confidential Client Shortlist',
      'Kanban Stage Advancement with Guardrail Protection'
    ]
  },
  client: {
    id: 'USR-CLI-205',
    role: 'client',
    name: 'Rajesh Mehra',
    title: 'VP Engineering & Hiring Manager',
    email: 'client@clientcorp.in',
    username: 'client',
    password: 'client123',
    organization: 'Tata Consultancy Services / Global Banking Client',
    portalName: 'Client Hiring Partner Shortlist Portal',
    portalTag: 'Masked Dossiers, Interview Slots & Direct Feedback',
    avatar: 'RM',
    badgeText: 'Client Hiring Partner',
    themeColor: '#059669', // Emerald
    defaultTab: 'client-portal',
    ip: '14.141.112.5 (Client Corporate Gateway)',
    features: [
      'PII-Blinded Candidate Dossiers (Compliant under DPDP Act 2023)',
      'Side-by-Side Candidate Matrix Comparison (Up to 3 Candidates)',
      'One-Click Candidate Shortlist & Structured Rejection with Audit Reasons',
      'Direct Interview Proposal with Teams / Google Meet Integration',
      'Restricted Client View (No access to unmasked CVs or internal recruiter notes)'
    ]
  }
};

export const AUTH_STORAGE_KEY = 'talentpulse_active_user_v1';

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse active user session:', err);
    return null;
  }
}

export function setStoredSession(user) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to persist user session:', err);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear user session:', err);
  }
}

// Client-side authentication logic
export function authenticateUserLocally(portalRole, identifier, password) {
  const normKey = (portalRole || '').toLowerCase().replace(/-/g, '_');
  const account = DEMO_ACCOUNTS[normKey] || Object.values(DEMO_ACCOUNTS).find(a => a.role === portalRole);

  if (!account) {
    return { success: false, message: `Unknown portal role: "${portalRole}"` };
  }

  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Validate identity (supports email or username)
  const isEmailMatch = cleanId === account.email.toLowerCase();
  const isUserMatch = cleanId === account.username.toLowerCase();

  // Check if user is using credentials from another role
  const otherRoles = Object.values(DEMO_ACCOUNTS).filter(a => a.role !== account.role);
  const matchedOther = otherRoles.find(a => 
    a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
  );

  if (matchedOther) {
    return {
      success: false,
      message: `Access Denied: This account belongs to the "${matchedOther.badgeText}" role. Please switch to the ${matchedOther.portalName} to sign in.`
    };
  }

  if (!isEmailMatch && !isUserMatch) {
    return {
      success: false,
      message: `Invalid email or username for ${account.badgeText}. Try "${account.email}" or "${account.username}".`
    };
  }

  if (cleanPass !== account.password) {
    return {
      success: false,
      message: `Incorrect password. (Hint: demo password is "${account.password}")`
    };
  }

  // Safe user profile without plaintext password
  const { password: _, ...safeUser } = account;
  return {
    success: true,
    user: safeUser,
    message: `Welcome back, ${account.name}!`
  };
}

