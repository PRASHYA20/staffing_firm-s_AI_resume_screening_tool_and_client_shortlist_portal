// HeaderNav.jsx - Minimalist, Role-Aware Single-Bar Navigation with User Session
import React, { useState } from 'react';
import { 
  Briefcase, 
  Sun, 
  Moon, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  UploadCloud, 
  Users, 
  Sliders, 
  Kanban,
  FileCheck2,
  LogOut,
  ChevronDown,
  Sparkles,
  User,
  ArrowRightLeft
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../data/authUsers';

export default function HeaderNav({ 
  currentUser,
  onSignOut,
  onSwitchRole,
  activeTab, 
  setActiveTab,
  requisitions, 
  selectedReqId, 
  setSelectedReqId,
  theme,
  setTheme,
  candidateCounts
}) {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const selectedReq = requisitions.find(r => r.id === selectedReqId) || requisitions[0];
  const role = currentUser?.role || 'recruiter';

  // Filter requisitions for client if applicable
  const availableReqs = role === 'client' 
    ? requisitions.filter(r => r.clientName.toLowerCase().includes('tata') || r.id === selectedReqId)
    : requisitions;

  const roleBadgeClass = role === 'admin' 
    ? 'badge-role-admin' 
    : role === 'delivery-head'
      ? 'badge-role-delivery'
      : role === 'client' 
        ? 'badge-role-client' 
        : 'badge-role-recruiter';

  const roleDisplayLabel = role === 'delivery-head' ? 'DELIVERY HEAD' : role.toUpperCase();

  return (
    <header className="minimal-header">
      {/* Left: Brand & Job Context */}
      <div className="header-left">
        <div 
          className="minimal-brand" 
          onClick={() => {
            if (role === 'client') setActiveTab('client-portal');
            else if (role === 'delivery-head') setActiveTab('delivery-dashboard');
            else if (role === 'admin') setActiveTab('dpdp-compliance');
            else setActiveTab('ranked-list');
          }}
        >
          <div className="brand-dot" />
          <span className="brand-name">TalentPulse</span>
          <span className={`header-role-chip ${roleBadgeClass}`}>
            {roleDisplayLabel}
          </span>
        </div>

        {/* Job Context Selector (Requisition) */}
        <div className="job-selector-wrapper">
          <select
            id="job-context-select"
            value={selectedReqId}
            onChange={(e) => setSelectedReqId(e.target.value)}
            className="job-select-input"
          >
            {availableReqs.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} • {r.location.split('/')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Dynamic Primary Navigation Tabs tailored to authenticated role */}
      <nav className="header-nav-center">
        {/* CLIENT ROLE TABS */}
        {role === 'client' && (
          <button 
            id="nav-client-portal"
            className={`nav-pill ${activeTab === 'client-portal' ? 'active' : ''}`}
            onClick={() => setActiveTab('client-portal')}
          >
            <UserCheck size={14} />
            <span>Shortlist Review</span>
            <span className="count-pill">{candidateCounts.submitted}</span>
          </button>
        )}

        {/* RECRUITER ROLE TABS */}
        {role === 'recruiter' && (
          <>
            <button
              id="nav-scorecard"
              className={`nav-pill ${activeTab === 'jd-scorecard' ? 'active' : ''}`}
              onClick={() => setActiveTab('jd-scorecard')}
            >
              <Sliders size={14} />
              <span>Scorecard</span>
            </button>

            <button
              id="nav-upload"
              className={`nav-pill ${activeTab === 'bulk-upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk-upload')}
            >
              <UploadCloud size={14} />
              <span>Upload CVs</span>
            </button>

            <button
              id="nav-candidates"
              className={`nav-pill ${activeTab === 'ranked-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('ranked-list')}
            >
              <Users size={14} />
              <span>Candidates</span>
              <span className="count-pill">{candidateCounts.screened}</span>
            </button>

            <button
              id="nav-pipeline"
              className={`nav-pill ${activeTab === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('pipeline')}
            >
              <Kanban size={14} />
              <span>Pipeline</span>
            </button>
          </>
        )}

        {/* DELIVERY HEAD ROLE TABS */}
        {role === 'delivery-head' && (
          <>
            <button
              id="nav-dh-roi"
              className={`nav-pill ${activeTab === 'delivery-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery-dashboard')}
            >
              <ShieldCheck size={14} />
              <span>SLA & Operations ROI</span>
            </button>

            <button
              id="nav-dh-pipeline"
              className={`nav-pill ${activeTab === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('pipeline')}
            >
              <Kanban size={14} />
              <span>Pipeline Tracking</span>
            </button>

            <button
              id="nav-dh-candidates"
              className={`nav-pill ${activeTab === 'ranked-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('ranked-list')}
            >
              <Users size={14} />
              <span>Candidate Pool</span>
              <span className="count-pill">{candidateCounts.total}</span>
            </button>

            <button
              id="nav-dh-scorecard"
              className={`nav-pill ${activeTab === 'jd-scorecard' ? 'active' : ''}`}
              onClick={() => setActiveTab('jd-scorecard')}
            >
              <Sliders size={14} />
              <span>Scorecards</span>
            </button>
          </>
        )}

        {/* ADMIN / COMPLIANCE ROLE TABS */}
        {role === 'admin' && (
          <>
            <button
              id="nav-compliance"
              className={`nav-pill ${activeTab === 'dpdp-compliance' ? 'active' : ''}`}
              onClick={() => setActiveTab('dpdp-compliance')}
            >
              <FileCheck2 size={14} />
              <span>DPDP & Governance</span>
            </button>

            <button
              id="nav-roi"
              className={`nav-pill ${activeTab === 'delivery-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery-dashboard')}
            >
              <ShieldCheck size={14} />
              <span>Audit & ROI</span>
            </button>

            <button
              id="nav-candidates"
              className={`nav-pill ${activeTab === 'ranked-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('ranked-list')}
            >
              <Users size={14} />
              <span>All Candidates</span>
              <span className="count-pill">{candidateCounts.total}</span>
            </button>

            <button
              id="nav-pipeline"
              className={`nav-pill ${activeTab === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('pipeline')}
            >
              <Kanban size={14} />
              <span>Pipeline</span>
            </button>

            <button
              id="nav-scorecard"
              className={`nav-pill ${activeTab === 'jd-scorecard' ? 'active' : ''}`}
              onClick={() => setActiveTab('jd-scorecard')}
            >
              <Sliders size={14} />
              <span>Scorecard</span>
            </button>
          </>
        )}
      </nav>

      {/* Right: Authenticated User Session, Switch Portal, Theme & Logout */}
      <div className="header-right">
        {/* User Session Pill with Dropdown Menu for fast switching */}
        <div className="session-user-container">
          <button 
            type="button"
            className="session-user-badge-btn"
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            title="Click to switch portal or view account details"
          >
            <div className={`user-avatar-dot avatar-dot-${role}`}>
              {currentUser?.avatar || 'U'}
            </div>
            <div className="user-details-box">
              <span className="user-name-text">{currentUser?.name || 'Authorized User'}</span>
              <span className="user-role-label">{currentUser?.badgeText || role}</span>
            </div>
            <ChevronDown size={13} className={`chevron-icon ${showSwitchMenu ? 'open' : ''}`} />
          </button>

          {/* Account & Role Switch Dropdown */}
          {showSwitchMenu && (
            <div className="user-account-dropdown">
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">{currentUser?.name}</div>
                <div className="dropdown-user-org">{currentUser?.organization}</div>
                <div className="dropdown-user-email">{currentUser?.email}</div>
              </div>

              <div className="dropdown-divider" />
              <div className="dropdown-section-label">Switch Sign-In Portal</div>

              {Object.values(DEMO_ACCOUNTS).map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  className={`dropdown-switch-item ${acc.role === role ? 'current' : ''}`}
                  onClick={() => {
                    setShowSwitchMenu(false);
                    onSwitchRole(acc.role);
                  }}
                >
                  <div className={`dropdown-role-dot dot-${acc.role}`} />
                  <div className="dropdown-role-meta">
                    <span className="dropdown-role-title">{acc.portalName}</span>
                    <span className="dropdown-role-user">{acc.name} ({acc.badgeText})</span>
                  </div>
                  {acc.role === role && <span className="current-badge">Active</span>}
                </button>
              ))}

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-logout-btn"
                onClick={() => {
                  setShowSwitchMenu(false);
                  onSignOut();
                }}
              >
                <LogOut size={14} />
                <span>Sign Out of Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Portal Switcher Icon Button */}
        <button
          type="button"
          className="icon-action-btn"
          onClick={() => onSignOut()}
          title="Sign Out to Portal Selection"
        >
          <LogOut size={15} />
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-btn"
          className="icon-action-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle appearance"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </div>
    </header>
  );
}
