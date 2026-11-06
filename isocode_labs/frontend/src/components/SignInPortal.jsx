// SignInPortal.jsx - Dedicated Multi-Role Sign In for Admin, Recruiter, and Client
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
  Info
} from 'lucide-react';
import { DEMO_ACCOUNTS, authenticateUserLocally } from '../data/authUsers';

export default function SignInPortal({ onSignIn, theme, setTheme }) {
  const [selectedRole, setSelectedRole] = useState('recruiter'); // 'admin', 'recruiter', 'client'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeAccount = DEMO_ACCOUNTS[selectedRole];

  // When switching portal tab, clear error and optionally keep or reset inputs
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  // 1-Click Quick Demo Sign In
  const handleQuickDemoSignIn = (roleToLogin = selectedRole) => {
    const acc = DEMO_ACCOUNTS[roleToLogin];
    if (!acc) return;
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Try backend first; fallback to local
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: acc.role,
          identifier: acc.email,
          password: acc.password
        })
      })
        .then(res => res.json())
        .then(data => {
          setIsLoading(false);
          if (data.success && data.user) {
            onSignIn(data.user);
          } else {
            // Local fallback
            const localRes = authenticateUserLocally(acc.role, acc.email, acc.password);
            if (localRes.success) {
              onSignIn(localRes.user);
            } else {
              setErrorMessage(localRes.message);
            }
          }
        })
        .catch(() => {
          // Fallback for offline backend
          setIsLoading(false);
          const localRes = authenticateUserLocally(acc.role, acc.email, acc.password);
          if (localRes.success) {
            onSignIn(localRes.user);
          } else {
            setErrorMessage(localRes.message);
          }
        });
    }, 250);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or username.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: selectedRole,
        identifier: identifier.trim(),
        password: password.trim()
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
        const localRes = authenticateUserLocally(selectedRole, identifier, password);
        if (localRes.success) {
          onSignIn(localRes.user);
        } else {
          setErrorMessage(localRes.message);
        }
      });
  };

  // Quick fill helper
  const handleAutofill = () => {
    setIdentifier(activeAccount.email);
    setPassword(activeAccount.password);
    setErrorMessage('');
  };

  return (
    <div className="signin-page-wrapper">
      {/* Top Bar with Brand & Appearance toggle */}
      <header className="signin-header">
        <div className="minimal-brand">
          <div className="brand-dot" />
          <span className="brand-name">TalentPulse AI</span>
          <span className="brand-badge-pill">Enterprise Staffing & Screening</span>
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
          <h1 className="signin-title">Select Your Sign-In Portal</h1>
          <p className="signin-subtitle">
            Secure, separate authentication gateways tailored for Admins, Recruiters, and Client Hiring Partners.
          </p>
        </div>

        {/* 4 Dedicated Role Selector Tabs */}
        <div className="signin-role-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
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
              <span className="role-chip chip-recruiter">Staffing</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Recruiter Portal</h3>
              <p className="role-card-desc">Scorecards, CV Ingestion, AI Scoring & Submissions</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Sneha Verma (Recruiter)</span>
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
              <span className="role-user-hint">Rajesh Mehra (VP Eng)</span>
            </div>
          </button>

          {/* Delivery Head Door */}
          <button
            type="button"
            className={`role-selector-card ${selectedRole === 'delivery_head' || selectedRole === 'delivery-head' ? 'active role-delivery' : ''}`}
            onClick={() => handleRoleChange('delivery_head')}
          >
            <div className="role-card-header">
              <div className="role-icon-box" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
                <Sparkles size={20} />
              </div>
              <span className="role-chip" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>Operations</span>
            </div>
            <div className="role-card-body">
              <h3 className="role-card-title">Delivery Head</h3>
              <p className="role-card-desc">48h SLA Tracking, ROI Model & Recruiter Health</p>
            </div>
            <div className="role-card-footer">
              <span className="role-user-hint">Arun Joshi (Delivery Head)</span>
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
              <span className="role-user-hint">Dr. Vikram Malhotra</span>
            </div>
          </button>
        </div>

        {/* Selected Portal Sign-in Box */}
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

            {/* Quick Demo Button */}
            <button
              type="button"
              className="quick-demo-pill-btn"
              onClick={() => handleQuickDemoSignIn(selectedRole)}
              disabled={isLoading}
              title="Instantly sign in with pre-configured demo account"
            >
              <Sparkles size={14} />
              <span>⚡ 1-Click Demo Sign In</span>
            </button>
          </div>

          <div className="portal-box-grid">
            {/* Left: Interactive Sign-in Form */}
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
                  Email or Username
                </label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="auth-identifier"
                    type="text"
                    className="form-control"
                    placeholder={`e.g. ${activeAccount.email} or ${activeAccount.username}`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="auth-password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="link-helper-btn"
                    onClick={handleAutofill}
                  >
                    Autofill Credentials
                  </button>
                </div>
                <div className="input-with-icon">
                  <KeyRound size={16} className="input-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Demo Hint Banner */}
              <div className="demo-hint-box">
                <Info size={14} />
                <span>
                  Default Credentials: <strong>{activeAccount.email}</strong> • Password: <strong>{activeAccount.password}</strong>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-signin-primary"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Authenticating...' : `Sign In as ${activeAccount.badgeText}`}</span>
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
                  Session activity is cryptographically timestamped and audited under Section 8 of the Indian DPDP Act 2023.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Switch Switcher for Instant Testing */}
        <div className="signin-footer-links">
          <span className="footer-links-label">Quick Switch Demo:</span>
          <button
            type="button"
            className="quick-switch-link"
            onClick={() => handleQuickDemoSignIn('admin')}
          >
            🛡️ Sign in as Admin
          </button>
          <span className="footer-bullet">•</span>
          <button
            type="button"
            className="quick-switch-link"
            onClick={() => handleQuickDemoSignIn('recruiter')}
          >
            💼 Sign in as Recruiter
          </button>
          <span className="footer-bullet">•</span>
          <button
            type="button"
            className="quick-switch-link"
            onClick={() => handleQuickDemoSignIn('client')}
          >
            🏢 Sign in as Client
          </button>
        </div>
      </main>
    </div>
  );
}

