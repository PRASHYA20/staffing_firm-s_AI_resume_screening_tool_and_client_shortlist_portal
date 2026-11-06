// App.jsx - Main Application Controller for TalentPulse AI (Company A Noida)
// Features: Separate Authenticated Portals for Admin (Delivery Head), Recruiter, and Client
import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import RecruiterWorkflowStepper from './components/RecruiterWorkflowStepper';
import JDScorecardView from './components/JDScorecardView';
import BulkUploadView from './components/BulkUploadView';
import RankedCandidatesView from './components/RankedCandidatesView';
import RecruiterVerifyModal from './components/RecruiterVerifyModal';
import ClientPortalView from './components/ClientPortalView';
import PipelineKanbanView from './components/PipelineKanbanView';
import DPDPComplianceView from './components/DPDPComplianceView';
import DeliveryHeadDashboard from './components/DeliveryHeadDashboard';
import SignInPortal from './components/SignInPortal';

import { 
  INITIAL_REQUISITIONS, 
  INITIAL_CANDIDATES, 
  INITIAL_AUDIT_LOGS 
} from './data/sampleData';
import { 
  getStoredSession, 
  setStoredSession, 
  clearStoredSession, 
  DEMO_ACCOUNTS 
} from './data/authUsers';
import { scoreCandidateAgainstScorecard, generateBulkSimulatedCVs } from './utils/aiEngine';

export default function App() {
  const [theme, setTheme] = useState('light');
  
  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const currentRole = currentUser?.role || null; // 'admin', 'recruiter', 'client', or null if signed out
  const [signInInitialRole, setSignInInitialRole] = useState('recruiter');

  // Active workspace tab
  const [activeTab, setActiveTab] = useState(() => {
    const saved = getStoredSession();
    if (saved?.role === 'admin') return 'dpdp-compliance';
    if (saved?.role === 'delivery-head' || saved?.role === 'delivery_head') return 'delivery-dashboard';
    if (saved?.role === 'client') return 'client-portal';
    return 'ranked-list';
  });
  
  const [requisitions, setRequisitions] = useState(INITIAL_REQUISITIONS);
  const [selectedReqId, setSelectedReqId] = useState('REQ-2026-891');
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  
  const [deepDiveCandidate, setDeepDiveCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const currentReq = requisitions.find(r => r.id === selectedReqId) || requisitions[0];

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync with Backend API
  useEffect(() => {
    fetch('/api/candidates/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidates })
    }).catch(err => console.log('Backend sync offline:', err.message));
  }, [candidates]);

  // Toast Notification Trigger
  const triggerToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to append DPDP audit log with active authenticated user context
  const logAudit = (candidateId, candidateName, action, details, flag = 'COMPLIANT_ACTION') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actorName: currentUser?.name || (currentRole === 'recruiter' ? 'Sneha Verma' : currentRole === 'client' ? 'Rajesh Mehra (Client)' : 'Dr. Vikram Malhotra'),
      actorRole: currentUser?.badgeText || (currentRole === 'recruiter' ? 'Recruiter' : currentRole === 'client' ? 'Client Hiring Manager' : 'Admin / Delivery Head'),
      actorIP: currentUser?.ip || (currentRole === 'client' ? '14.141.112.5 (Client Gateway)' : '192.168.1.45 (Noida HQ)'),
      candidateId,
      candidateName,
      action,
      details,
      complianceFlag: flag
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Sign In Handler
  const handleSignIn = (user) => {
    setCurrentUser(user);
    setStoredSession(user);
    
    // Route to appropriate default landing view for the role
    const initialTab = user.role === 'admin' 
      ? 'dpdp-compliance'
      : (user.role === 'delivery-head' || user.role === 'delivery_head')
        ? 'delivery-dashboard'
        : user.role === 'client' 
          ? 'client-portal' 
          : 'ranked-list';
    
    setActiveTab(initialTab);
    logAudit(
      'AUTH-GATEWAY', 
      user.name, 
      'AUTH_LOGIN_SUCCESS', 
      `Authenticated sign-in into ${user.badgeText} portal`, 
      'COMPLIANT_AUTH_GATE'
    );
    triggerToast(`Welcome back, ${user.name}! Authenticated as ${user.badgeText}.`, 'success');
  };

  // Sign Out Handler
  const handleSignOut = (targetPortalRole = null) => {
    if (currentUser) {
      logAudit(
        'AUTH-GATEWAY', 
        currentUser.name, 
        'AUTH_LOGOUT', 
        `User signed out of ${currentUser.badgeText} session`, 
        'COMPLIANT_AUTH_GATE'
      );
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      }).catch(() => {});
    }
    clearStoredSession();
    setCurrentUser(null);
    if (targetPortalRole) {
      let roleKey = targetPortalRole;
      if (roleKey === 'delivery-head') roleKey = 'delivery_head';
      setSignInInitialRole(roleKey);
      triggerToast(`Signed out. Please enter credentials for the ${targetPortalRole} portal.`, 'info');
    } else {
      triggerToast('Signed out successfully. Choose a portal to continue.', 'info');
    }
  };

  // Switch Portal Handler - Requires authenticating with that portal's credentials
  const handleSwitchRole = (newRole) => {
    handleSignOut(newRole);
  };

  // Screen 1: Update scorecard
  const handleUpdateScorecard = (newScorecard, newRawJD) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === selectedReqId) {
        return { 
          ...r, 
          scorecard: newScorecard,
          rawJD: newRawJD !== undefined ? newRawJD : r.rawJD
        };
      }
      return r;
    }));
    triggerToast('Scorecard updated with custom criteria and weights.', 'success');
  };

  // Recalculate candidate pool against updated scorecard (supports explicit scorecard to avoid stale closure)
  const handleRecalculateScores = (scorecardOverride) => {
    const sc = scorecardOverride || currentReq.scorecard;
    setCandidates(prev => prev.map(cand => {
      if (cand.appliedReqId === selectedReqId) {
        const { aiScore, evidenceLines, scoreBreakdown } = scoreCandidateAgainstScorecard(cand, sc);
        return {
          ...cand,
          aiScore,
          evidenceLines: evidenceLines.length > 0 ? evidenceLines : cand.evidenceLines,
          scoreBreakdown
        };
      }
      return cand;
    }));
    triggerToast('All candidate scores and verifiable quotes recomputed against updated scorecard.', 'success');
  };

  // Screen 2: Real CV upload from recruiter's computer
  const handleUploadRealCandidates = (newCandidates) => {
    const scoredBatch = newCandidates.map(c => {
      const { aiScore, evidenceLines, scoreBreakdown } = scoreCandidateAgainstScorecard(c, currentReq.scorecard);
      return { ...c, aiScore, evidenceLines, scoreBreakdown };
    });

    setCandidates(prev => [...scoredBatch, ...prev]);
    logAudit(
      'LOCAL-UPLOAD', 
      `${scoredBatch.length} Files`, 
      'LOCAL_CV_INGESTED', 
      `Parsed ${scoredBatch.length} local resume file(s) from computer under DPDP Act 2023`,
      'COMPLIANT_INGESTION'
    );
    triggerToast(`Successfully parsed and added ${scoredBatch.length} resume(s) from your computer!`, 'success');
  };

  // Screen 2: Simulate bulk ingestion
  const handleSimulateBulkUpload = (count) => {
    const newBatch = generateBulkSimulatedCVs(count, selectedReqId);
    // Score new batch against active scorecard
    const scoredBatch = newBatch.map(c => {
      const { aiScore, evidenceLines, scoreBreakdown } = scoreCandidateAgainstScorecard(c, currentReq.scorecard);
      return { ...c, aiScore, evidenceLines, scoreBreakdown };
    });

    setCandidates(prev => [...scoredBatch, ...prev]);
    logAudit(
      'BATCH-BULK', 
      `${count} Resumes`, 
      'BULK_INGEST_PROCESSED', 
      `Parsed ${count} multi-format CVs with duplicate hashing under DPDP Act 2023`,
      'COMPLIANT_INGESTION'
    );
    triggerToast(`Successfully parsed and deduplicated ${count} CVs into active pool!`, 'success');
  };

  // Screen 3 & 4: Recruiter opens CV deep dive
  const handleOpenCVDeepDive = (candidate) => {
    setDeepDiveCandidate(candidate);
    logAudit(
      candidate.id, 
      candidate.name, 
      'VIEWED_FULL_CV', 
      `Opened complete CV document for human verification gate by ${currentUser?.name || 'Recruiter'}`,
      'COMPLIANT_RECRUITER_GATE'
    );
  };

  // Screen 4: Recruiter saves verification
  const handleSaveVerification = (candId, notes) => {
    const reviewerName = currentUser?.name || 'Sneha Verma (Senior Recruiter)';
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          recruiterReviewed: true,
          recruiterReviewNotes: notes,
          recruiterReviewer: reviewerName,
          reviewedTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          stage: c.stage === 'Sourced' || c.stage === 'AI Screened' ? 'Recruiter Verified' : c.stage
        };
      }
      return c;
    }));
    logAudit(candId, 'Candidate', 'MARKED_VERIFIED', `Verified criteria and added dossier notes by ${reviewerName}`, 'COMPLIANT_VERIFICATION');
    triggerToast('Candidate verified! Ready for client submission.', 'success');
  };

  // Screen 3 & 4: Submit to client portal
  const handleSubmitToClient = (candidate, notes) => {
    // ENFORCE GUARDRAIL 1: Quarantined duplicate profiles can NEVER be submitted to clients!
    if (candidate.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED') {
      triggerToast('Security Block: Quarantined duplicate candidate cannot be submitted to clients!', 'error');
      return;
    }

    // ENFORCE GUARDRAIL 2: Recruiter must open and verify CV before submitting to client!
    if (!candidate.recruiterReviewed) {
      triggerToast('Guardrail Enforced: You must open and verify the CV before submitting to client!', 'warning');
      handleOpenCVDeepDive(candidate);
      return;
    }

    setCandidates(prev => prev.map(c => {
      if (c.id === candidate.id) {
        return {
          ...c,
          stage: 'Submitted to Client',
          recruiterReviewNotes: notes || c.recruiterReviewNotes
        };
      }
      return c;
    }));

    logAudit(
      candidate.id, 
      candidate.name, 
      'SUBMITTED_TO_CLIENT', 
      `Candidate submitted to ${currentReq.clientName} portal with PII masking active`,
      'COMPLIANT_PORTAL_TRANSFER'
    );
    triggerToast(`Candidate ${candidate.id} submitted to ${currentReq.clientName} portal!`, 'success');
  };

  // Screen 5: Client Shortlist
  const handleClientShortlist = (candId) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          clientDecision: 'SHORTLISTED',
          stage: 'Client Shortlisted'
        };
      }
      return c;
    }));
    logAudit(candId, 'Masked Candidate', 'SHORTLISTED_CANDIDATE', `Client accepted candidate profile`, 'COMPLIANT_CLIENT_ACTION');
    triggerToast('Candidate shortlisted! Recruiter notified to coordinate next steps.', 'success');
  };

  // Screen 5: Client Reject with Reason
  const handleClientReject = (candId, reason, notes) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          clientDecision: 'REJECTED',
          clientDecisionNotes: `${reason}${notes ? ` - ${notes}` : ''}`
        };
      }
      return c;
    }));
    logAudit(candId, 'Masked Candidate', 'REJECTED_CANDIDATE', `Client rejected: ${reason}`, 'COMPLIANT_CLIENT_ACTION');
    triggerToast(`Candidate rejection recorded with structured reason: "${reason}".`, 'info');
  };

  // Screen 5: Client Propose Interview Slot
  const handleProposeInterview = (candId, interviewForm) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          clientDecision: 'INTERVIEW_PROPOSED',
          interviewSlot: interviewForm,
          stage: 'Interview Scheduled'
        };
      }
      return c;
    }));
    logAudit(
      candId, 
      'Masked Candidate', 
      'INTERVIEW_PROPOSED', 
      `Client proposed interview for ${interviewForm.date} at ${interviewForm.time}`,
      'COMPLIANT_CLIENT_ACTION'
    );
    triggerToast(`Interview proposal sent for ${interviewForm.date} at ${interviewForm.time}!`, 'success');
  };

  // Screen 6: Move stage in pipeline (persists to backend with validation guardrails)
  const handleMoveCandidateStage = async (candId, nextStage) => {
    const cand = candidates.find(c => c.id === candId);
    if (!cand) return;

    if (cand.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED') {
      triggerToast('Security Block: Quarantined duplicate profiles are locked from pipeline progression.', 'error');
      return;
    }

    const clientStages = ['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled', 'Offered', 'Joined'];
    if (clientStages.includes(nextStage) && !cand.recruiterReviewed) {
      triggerToast('Human-in-the-Loop Violation: Candidate must be verified by recruiter before client submission.', 'warning');
      return;
    }

    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return { ...c, stage: nextStage };
      }
      return c;
    }));
    logAudit(candId, cand.name, 'STAGE_UPDATED', `Candidate moved to ${nextStage}`, 'COMPLIANT_PIPELINE_MOVE');
    triggerToast(`Candidate advanced to ${nextStage}!`, 'info');

    // Persist to backend REST API
    try {
      await fetch(`/api/candidates/${candId}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: nextStage,
          actorName: currentUser?.name || 'Recruiter'
        })
      });
    } catch (err) {
      console.warn('Backend stage persist offline:', err.message);
    }
  };

  // Screen 7: DPDP Right to Erasure
  const handleDeleteCandidateDPDP = (candId, reason) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          name: '[DATA PURGED UNDER DPDP ACT 2023]',
          maskedName: '[PURGED]',
          phone: '[PURGED]',
          maskedPhone: '[PURGED]',
          email: '[PURGED]',
          maskedEmail: '[PURGED]',
          fullCVText: 'CANDIDATE PERSONAL DATA PURGED PURSUANT TO SECTION 12(3) DPDP ACT 2023.',
          isPurged: true,
          consentRecord: {
            ...c.consentRecord,
            status: 'PURGED_ERASURE_REQUEST',
            erasureDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
            erasureReason: reason
          }
        };
      }
      return c;
    }));

    logAudit(
      candId, 
      '[PURGED]', 
      'ERASURE_REQUEST_EXECUTED', 
      `Purged all personal data and CV records under Section 12(3) DPDP Act 2023. Reason: ${reason}`,
      'STATUTORY_ERASURE_COMPLETED'
    );
    triggerToast(`Candidate ${candId} personal data permanently expunged. Compliance certificate generated.`, 'success');
  };

  // Counts for secondary navigation badges
  const candidateCounts = {
    total: candidates.length,
    screened: candidates.filter(c => c.appliedReqId === selectedReqId).length,
    submitted: candidates.filter(c => c.appliedReqId === selectedReqId && (c.stage === 'Submitted to Client' || c.stage === 'Client Shortlisted' || c.stage === 'Interview Scheduled' || c.recruiterReviewed)).length
  };

  // IF NOT AUTHENTICATED: Present Dedicated Multi-Role Sign In Portal
  if (!currentUser) {
    return (
      <SignInPortal 
        onSignIn={handleSignIn} 
        theme={theme} 
        setTheme={setTheme} 
        initialRole={signInInitialRole}
      />
    );
  }

  // AUTHENTICATED VIEW: Role-Based Workspace
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toastMessage.type === 'success' ? '#065F46' : toastMessage.type === 'warning' ? '#92400E' : '#1E293B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            fontSize: '0.85rem',
            fontWeight: 500,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Global Header & Role-Aware Navigation Bar */}
      <HeaderNav
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSwitchRole={handleSwitchRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        requisitions={requisitions}
        selectedReqId={selectedReqId}
        setSelectedReqId={setSelectedReqId}
        theme={theme}
        setTheme={setTheme}
        candidateCounts={candidateCounts}
      />

      {/* Main Content Workspace with Role-Based Access Control */}
      <main className="main-workspace">
        {/* CLIENT PORTAL VIEW (Exclusively for Client Role, or previewed by Admin) */}
        {activeTab === 'client-portal' && (
          <ClientPortalView
            candidates={candidates}
            onClientShortlist={handleClientShortlist}
            onClientReject={handleClientReject}
            onProposeInterview={handleProposeInterview}
            currentReq={currentReq}
            currentUser={currentUser}
          />
        )}

        {/* RECRUITER, DELIVERY HEAD & ADMIN WORKSPACES */}
        {currentRole !== 'client' && (
          <>
            {/* Guided Stepper only displayed for Recruiter persona */}
            {currentRole === 'recruiter' && (
              <RecruiterWorkflowStepper
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                candidateCounts={candidateCounts}
              />
            )}

            {activeTab === 'jd-scorecard' && (
              <JDScorecardView
                currentReq={currentReq}
                onUpdateScorecard={handleUpdateScorecard}
                onNavigateToUpload={() => setActiveTab('bulk-upload')}
                onRecalculateScores={handleRecalculateScores}
              />
            )}

            {activeTab === 'bulk-upload' && (
              <BulkUploadView
                candidates={candidates}
                onAddRealCandidates={handleUploadRealCandidates}
                onSimulateBulkUpload={handleSimulateBulkUpload}
                onNavigateToRanked={() => setActiveTab('ranked-list')}
                onOpenCVDeepDive={handleOpenCVDeepDive}
                currentReq={currentReq}
              />
            )}

            {activeTab === 'ranked-list' && (
              <RankedCandidatesView
                candidates={candidates.filter(c => c.appliedReqId === selectedReqId)}
                onOpenCVDeepDive={handleOpenCVDeepDive}
                onSubmitToClient={handleSubmitToClient}
                onNavigateToClientPortal={() => {
                  handleSwitchRole('client');
                }}
                currentReq={currentReq}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineKanbanView
                candidates={candidates}
                onMoveCandidateStage={handleMoveCandidateStage}
                onOpenCVDeepDive={handleOpenCVDeepDive}
                currentReq={currentReq}
              />
            )}

            {/* ADMIN-ONLY GOVERNANCE VIEWS */}
            {currentRole === 'admin' && activeTab === 'dpdp-compliance' && (
              <DPDPComplianceView
                candidates={candidates}
                auditLogs={auditLogs}
                onDeleteCandidateDPDP={handleDeleteCandidateDPDP}
                onAddAuditLog={logAudit}
              />
            )}

            {/* DELIVERY HEAD & ADMIN ROI & AUDIT VIEWS */}
            {(currentRole === 'admin' || currentRole === 'delivery-head' || currentRole === 'delivery_head') && activeTab === 'delivery-dashboard' && (
              <DeliveryHeadDashboard
                currentReq={currentReq}
                candidates={candidates}
                auditLogs={auditLogs}
                onDeleteCandidateDPDP={handleDeleteCandidateDPDP}
              />
            )}
          </>
        )}
      </main>

      {/* Screen 4: Recruiter Deep Verification Modal */}
      {deepDiveCandidate && (
        <RecruiterVerifyModal
          candidate={deepDiveCandidate}
          onClose={() => setDeepDiveCandidate(null)}
          onSaveVerification={handleSaveVerification}
          onSubmitToClient={handleSubmitToClient}
          currentReq={currentReq}
        />
      )}
    </div>
  );
}
