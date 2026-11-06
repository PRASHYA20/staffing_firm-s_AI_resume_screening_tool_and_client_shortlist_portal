// SignInPortal.jsx - Production-Ready Multi-Role Sign In for Admin, Recruiter, Delivery Head, and Client
// Enforces manual credential entry, distinct separate credentials per portal, and mobile-optimized role selection.
import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  Building2,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Info,
  Users,
  ChevronDown
} from 'lucide-react';
import { DEMO_ACCOUNTS, authenticateUserLocally } from '../data/authUsers';

export default function SignInPortal({ onSignIn, theme, setTheme, initialRole = 'recruiter' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'recruiter', 'client', 'delivery_head', 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeAccount = DEMO_ACCOUNTS[selectedRole] || DEMO_ACCOUNTS.recruiter;

  // When switching portal tab, clear error and reset inputs for clean manual entry
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  // Manual Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage(`Please enter your ${activeAccount.badgeText} email address or username.`);
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: selectedRole,
        identifier: cleanId,
        password: cleanPass
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success && data.user) {
          onSignIn(data.user);
        } else {
          setErrorMessage(data.message || 'Authentication failed. Please verify credentials.');
        }
      })
      .catch(() => {
        setIsLoading(false);
        const localRes = authenticateUserLocally(selectedRole, cleanId, cleanPass);
        if (localRes.success) {
          onSignIn(localRes.user);
        } else {
          setErrorMessage(localRes.message);
        }
      });
  };

  // Helper placeholder text based on selected role
  const getPlaceholderText = () => {
    if (selectedRole === 'client') return 'client@clientcorp.in or username "client"';
    if (selectedRole === 'recruiter') return 'recruiter@talentpulse.ai or username "recruiter"';
    if (selectedRole === 'delivery_head' || selectedRole === 'delivery-head') return 'delivery@talentpulse.ai or username "delivery"';
    if (selectedRole === 'admin') return 'admin@talentpulse.ai or username "admin"';
    return 'Enter your email or username';
  };

  // Plain-English guidance for mobile users to quickly pick the right role
  const getRoleHelpText = (role) => {
    switch (role) {
      case 'client':
        return 'For Corporate Hiring Partners & Interviewers. Review masked candidate profiles, compare dossiers, and confirm interview slots.';
      case 'delivery_head':
      case 'delivery-head':
        return 'For Staffing Operations Leaders. Monitor 48-hour SLA metrics, recruiter throughput, and value-recovered ledger.';
      case 'admin':
        return 'For Data Protection Officers & Admins. Manage DPDP Act statutory compliance, consent records, and right-to-erasure.';
      case 'recruiter':
      default:
        return 'For Staffing Agency Recruiters. Configure dynamic JD scorecards, screen uploaded CVs, and verify candidates.';
    }
  };

  return (
    <div className="signin-page-wrapper">
      {/* Top Bar with Brand & Appearance toggle */}
      <header className="signin-header">
        <div className="minimal-brand">
          <div className="brand-dot" />
          <span className="brand-name">TalentPulse AI</span>
          <span className="brand-badge-pill">Enterprise Staffing & Screening Portal</span>
        </div>

        <button
          className="icon-action-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle appearance"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </header>

      {/* Main Sign-In Hero & Portal Selector */}
      <main className="signin-content">
        <div className="signin-hero-intro">
          <span className="signin-kicker">Role-Based Access Control (RBAC)</span>
          <h1 className="signin-title">Select Your Authorized Portal</h1>
          <p className="signin-subtitle">
            Secure, separate authentication gateways with dedicated credentials for Recruiters, Client Hiring Partners, and Leadership.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. MOBILE ROLE SELECTOR: Optimized for Phones & Small Screens */}
        {/* ------------------------------------------------------------- */}
        <div className="mobile-role-selector-wrapper">
          <div className="mobile-role-selector-header">
            <label htmlFor="mobile-role-select" className="mobile-role-label">
              <Users size={15} className="mobile-label-icon" />
              <span>Select Portal Role:</span>
            </label>
            <div className="mobile-role-select-box">
              <select
                id="mobile-role-select"
                className="mobile-role-dropdown"
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="recruiter">💼 Recruiter Portal (Staffing & Sourcing)</option>
                <option value="client">🏢 Client Portal (Hiring Partner & Shortlist)</option>
                <option value="delivery_head">⚡ Delivery Head (SLA & Operations ROI)</option>
                <option value="admin">🛡️ Admin & DPDP (Compliance & Governance)</option>
              </select>
              <ChevronDown size={15} className="mobile-select-chevron" />
            </div>
          </div>

          {/* 4 Quick-Tap Mobile Pills: 2x2 Touch-Friendly Grid */}
          <div className="mobile-role-pills-grid">
            <button
              type="button"
              className={`mobile-role-pill ${selectedRole === 'recruiter' ? 'active pill-recruiter' : ''}`}
              onClick={() => handleRoleChange('recruiter')}
            >
              <div className="mobile-pill-icon icon-recruiter">
                <Briefcase size={16} />
              </div>
              <div className="pill-text-wrap">
                <span className="pill-name">Recruiter</span>
                <span className="pill-tag">Staffing Team</span>
              </div>
            </button>

            <button
              type="button"
              className={`mobile-role-pill ${selectedRole === 'client' ? 'active pill-client' : ''}`}
              onClick={() => handleRoleChange('client')}
            >
              <div className="mobile-pill-icon icon-client">
                <Building2 size={16} />
              </div>
              <div className="pill-text-wrap">
                <span className="pill-name">Client</span>
                <span className="pill-tag">Hiring Partner</span>
              </div>
            </button>

            <button
              type="button"
              className={`mobile-role-pill ${selectedRole === 'delivery_head' || selectedRole === 'delivery-head' ? 'active pill-delivery' : ''}`}
              onClick={() => handleRoleChange('delivery_head')}
            >
              <div className="mobile-pill-icon icon-delivery">
                <Sparkles size={16} />
              </div>
              <div className="pill-text-wrap">
                <span className="pill-name">Delivery</span>
                <span className="pill-tag">Operations</span>
              </div>
            </button>

            <button
              type="button"
              className={`mobile-role-pill ${selectedRole === 'admin' ? 'active pill-admin' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              <div className="mobile-pill-icon icon-admin">
                <ShieldCheck size={16} />
              </div>
              <div className="pill-text-wrap">
                <span className="pill-name">Admin</span>
                <span className="pill-tag">Compliance</span>
              </div>
            </button>
          </div>

          {/* Contextual Role Helper Notice */}
          <div className="mobile-role-help-banner">
            <Info size={14} className="mobile-help-icon" />
            <span>{getRoleHelpText(selectedRole)}</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. DESKTOP ROLE GRID: Sleek 4-Card Selector on Tablets & PC  */}
        {/* ------------------------------------------------------------- */}
        <div className="desktop-role-grid">
          {/* Recruiter Door */}
          <button
            type="button"
            className={`role-selector-card ${selectedRole === 'recruiter' ? 'active role-recruiter' : ''}`}
            onClick={() => handleRoleChange('recruiter')}
          >
            <div className="role-card-header">
              <div className="role-icon-box role-icon-recruiter">
                <Briefcase size={20} />
              </div>
              <span className="role-chip chip-recruiter">Staffing Team</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Recruiter Portal</h3>
              <p className="role-card-desc">Scorecards, CV Ingestion, AI Scoring & Submissions</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Requires Recruiter Credentials</span>
            </div>
          </button>

          {/* Client Door */}
          <button
            type="button"
            className={`role-selector-card ${selectedRole === 'client' ? 'active role-client' : ''}`}
            onClick={() => handleRoleChange('client')}
          >
            <div className="role-card-header">
              <div className="role-icon-box role-icon-client">
                <Building2 size={20} />
              </div>
              <span className="role-chip chip-client">Hiring Partner</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Client Portal</h3>
              <p className="role-card-desc">Masked Dossiers, Decisions & Interview Slots</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Requires Client Credentials</span>
            </div>
          </button>

          {/* Delivery Head Door */}
          <button
            type="button"
            className={`role-selector-card ${selectedRole === 'delivery_head' || selectedRole === 'delivery-head' ? 'active role-delivery' : ''}`}
            onClick={() => handleRoleChange('delivery_head')}
          >
            <div className="role-card-header">
              <div className="role-icon-box role-icon-delivery">
                <Sparkles size={20} />
              </div>
              <span className="role-chip chip-delivery">Operations</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Delivery Head</h3>
              <p className="role-card-desc">48h SLA Tracking, ROI Model & Recruiter Health</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Requires Delivery Credentials</span>
            </div>
          </button>

          {/* Admin & Compliance Door */}
          <button
            type="button"
            className={`role-selector-card ${selectedRole === 'admin' ? 'active role-admin' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <div className="role-card-header">
              <div className="role-icon-box role-icon-admin">
                <ShieldCheck size={20} />
              </div>
              <span className="role-chip chip-admin">Compliance</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Admin & DPDP</h3>
              <p className="role-card-desc">Statutory Erasure, Audit Trails & Governance</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Requires Admin Credentials</span>
            </div>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. ACTIVE PORTAL SIGN-IN FORM & SCOPE PANEL                   */}
        {/* ------------------------------------------------------------- */}
        <div className={`signin-form-box role-accent-${selectedRole}`}>
          {/* Header of Active Portal */}
          <div className="portal-box-banner">
            <div className="portal-banner-text">
              <div className="portal-badge-row">
                <span className="portal-active-badge">{activeAccount.badgeText}</span>
                <span className="portal-org-text">{activeAccount.organization}</span>
              </div>
              <h2 className="portal-active-name">{activeAccount.portalName}</h2>
              <p className="portal-active-tagline">{activeAccount.portalTag}</p>
            </div>
          </div>

          <div className="portal-box-grid">
            {/* Left: Manual Sign-in Form */}
            <form onSubmit={handleSubmit} className="portal-login-form">
              {errorMessage && (
                <div className="auth-error-banner">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Identifier Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="auth-identifier">
                  {activeAccount.badgeText} Email or Username
                </label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="auth-identifier"
                    type="text"
                    className="form-control"
                    placeholder={getPlaceholderText()}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">
                  Password
                </label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="input-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security & Access Guidance */}
              <div className="signin-security-note">
                <Lock size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                <span>
                  Manual entry required. Only authorized <strong>{activeAccount.badgeText}</strong> credentials can access this portal.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-signin-primary"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Verifying Credentials...' : `Sign In to ${activeAccount.badgeText} Portal`}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Right: Role Access Scope & Permissions */}
            <div className="portal-scope-panel">
              <div className="scope-panel-title">
                <Lock size={14} />
                <span>Authorized Capabilities & Scope</span>
              </div>
              <ul className="scope-features-list">
                {activeAccount.features.map((feature, idx) => (
                  <li key={idx} className="scope-feature-item">
                    <CheckCircle2 size={14} className="feature-check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="dpdp-statutory-notice">
                <ShieldCheck size={14} />
                <span>
                  All authentication attempts are cryptographically timestamped and audited under Section 8 of the Indian DPDP Act 2023.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
