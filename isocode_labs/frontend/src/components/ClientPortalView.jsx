// ClientPortalView.jsx - Minimalist, High-Clarity Client Review Portal
// Features: Candidate Comparison, Interview Scheduling, Masked Profile Drawer, Structured Rejection, Pipeline Stepper
import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Video, 
  Clock, 
  FileText, 
  Layers, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Check, 
  Info,
  DollarSign,
  Briefcase,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ClientAiAssistant from './ClientAiAssistant';

export default function ClientPortalView({ 
  candidates, 
  onClientShortlist, 
  onClientReject, 
  onProposeInterview,
  currentReq,
  currentUser
}) {
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [phoneMode, setPhoneMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [drawerCandidate, setDrawerCandidate] = useState(null);
  const [rejectCandidate, setRejectCandidate] = useState(null);
  const [interviewCandidate, setInterviewCandidate] = useState(null);

  // Rejection Form State
  const [rejectReason, setRejectReason] = useState('Skill mismatch');
  const [rejectNotes, setRejectNotes] = useState('');

  // Interview Proposal Form State
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-11-06',
    time: '14:30 IST',
    duration: '45 mins',
    round: 'Technical Architecture Round 1',
    mode: 'Microsoft Teams Video Link',
    notes: 'Please focus on Kafka and Spring Boot microservices design.'
  });

  // STRICT CLIENT ISOLATION: Only candidates formally submitted to this specific client requisition
  const CLIENT_ELIGIBLE_STAGES = [
    'Submitted to Client', 
    'Client Shortlisted', 
    'Interview Scheduled', 
    'Offered', 
    'Joined'
  ];

  const submittedCandidates = candidates.filter(c => 
    c.appliedReqId === currentReq.id && 
    CLIENT_ELIGIBLE_STAGES.includes(c.stage) &&
    c.duplicateStatus !== 'EXACT_DUPLICATE_FLAGGED' &&
    !c.isPurged
  );

  // Toggle candidate selection for comparison (max 3)
  const toggleCompare = (candidateId) => {
    setSelectedForCompare(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 candidates side by side.');
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const comparedCandidates = submittedCandidates.filter(c => selectedForCompare.includes(c.id));

  const handleShortlist = (cand) => {
    onClientShortlist(cand.id);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  const handleOpenInterviewModal = (cand) => {
    setInterviewCandidate(cand);
    setInterviewForm(prev => ({
      ...prev,
      date: cand.interviewSlot?.date || '2026-11-06',
      time: cand.interviewSlot?.time || '14:30 IST',
      duration: cand.interviewSlot?.duration || '45 mins',
      mode: cand.interviewSlot?.mode || 'Microsoft Teams Video Link'
    }));
  };

  const handleConfirmInterview = () => {
    if (!interviewCandidate) return;
    onProposeInterview(interviewCandidate.id, {
      ...interviewForm,
      status: 'PROPOSED'
    });
    setInterviewCandidate(null);
  };

  const handleOpenRejectModal = (cand) => {
    setRejectCandidate(cand);
    setRejectReason('Skill mismatch');
    setRejectNotes('');
  };

  const handleConfirmReject = () => {
    if (!rejectCandidate) return;
    onClientReject(rejectCandidate.id, rejectReason, rejectNotes);
    setRejectCandidate(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Candidate Shortlist — {currentReq.clientName}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Confidential profiles under DPDP Act 2023. Compare candidates, review quoted evidence, and propose interview slots.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="btn-toggle-ai-assistant"
            className={`btn ${showAiAssistant ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Toggle Aria – Client AI Assistant"
          >
            <Sparkles size={13} className={showAiAssistant ? 'pulse-icon' : ''} />
            <span className="ai-btn-text-full">{showAiAssistant ? 'Close Aria' : '✨ Ask Aria'}</span>
            <span className="ai-btn-text-short">{showAiAssistant ? 'Close' : '✨ Aria'}</span>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          </button>

          {selectedForCompare.length >= 2 && (
            <button
              id="btn-open-compare"
              className="btn btn-primary btn-sm"
              onClick={() => setCompareModalOpen(true)}
            >
              <Layers size={13} />
              Compare {selectedForCompare.length} Candidates Side by Side
            </button>
          )}

          <button
            id="btn-toggle-phone"
            className="btn btn-secondary btn-sm"
            onClick={() => setPhoneMode(!phoneMode)}
            style={{ fontSize: '0.78rem' }}
          >
            {phoneMode ? <Monitor size={13} /> : <Smartphone size={13} />}
            {phoneMode ? 'Desktop View' : '📱 Mobile Phone View'}
          </button>
        </div>
      </div>

      {/* Main Content: Desktop or Mobile Phone */}
      {phoneMode ? (
        /* Mobile Simulator Phone */
        <div style={{ padding: '10px 0' }}>
          <div className="phone-simulator-wrapper" style={{ position: 'relative' }}>
            <div className="phone-top-notch">
              <div className="phone-speaker"></div>
            </div>
            <div style={{ padding: '14px 12px', maxHeight: '740px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '2px' }}>
                    CLIENT SHORTLIST PORTAL
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                    {currentReq.title}
                  </div>
                </div>

                {/* In-Phone Aria Assistant Toggle */}
                <button
                  id="phone-btn-toggle-ai"
                  className={`btn ${showAiAssistant ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                  style={{ fontSize: '0.7rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Toggle Aria Assistant"
                >
                  <Sparkles size={11} className={showAiAssistant ? 'pulse-icon' : ''} />
                  <span>{showAiAssistant ? 'Close' : '✨ Aria'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submittedCandidates.map(c => (
                  <ClientCandidateCard
                    key={c.id}
                    candidate={c}
                    isSelectedForCompare={selectedForCompare.includes(c.id)}
                    onToggleCompare={() => toggleCompare(c.id)}
                    onShortlist={() => handleShortlist(c)}
                    onOpenReject={() => handleOpenRejectModal(c)}
                    onOpenInterview={() => handleOpenInterviewModal(c)}
                    onViewProfile={() => setDrawerCandidate(c)}
                    isMobile={true}
                  />
                ))}
              </div>
            </div>

            {/* In-Phone Aria Floating Launcher & Mobile Overlay */}
            <ClientAiAssistant
              currentReq={currentReq}
              currentUser={currentUser}
              onSelectCandidate={(candId) => {
                const found = candidates.find(c => c.id === candId);
                if (found) setDrawerCandidate(found);
              }}
              isOpen={showAiAssistant}
              onToggle={() => setShowAiAssistant(!showAiAssistant)}
              onClose={() => setShowAiAssistant(false)}
              isPhoneSimulator={true}
            />
          </div>
        </div>
      ) : (
        /* Desktop Cards */
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submittedCandidates.length === 0 ? (
              <div className="clean-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                  <UserCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  No Candidate Dossiers Submitted Yet
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 12px auto', lineHeight: 1.5 }}>
                  Our talent delivery team is currently screening the resume pool against your scorecard criteria. Each candidate undergoes human recruiter verification before submission.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--primary)', background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                  <ShieldCheck size={14} />
                  <span>48h SLA & DPDP Act 2023 PII Masking Active</span>
                </div>
              </div>
            ) : (
              submittedCandidates.map(c => (
                <ClientCandidateCard
                  key={c.id}
                  candidate={c}
                  isSelectedForCompare={selectedForCompare.includes(c.id)}
                  onToggleCompare={() => toggleCompare(c.id)}
                  onShortlist={() => handleShortlist(c)}
                  onOpenReject={() => handleOpenRejectModal(c)}
                  onOpenInterview={() => handleOpenInterviewModal(c)}
                  onViewProfile={() => setDrawerCandidate(c)}
                  isMobile={false}
                />
              ))
            )}
          </div>

          {/* Desktop Floating Aria Assistant: Circular button at bottom-right */}
          <ClientAiAssistant
            currentReq={currentReq}
            currentUser={currentUser}
            onSelectCandidate={(candId) => {
              const found = candidates.find(c => c.id === candId);
              if (found) setDrawerCandidate(found);
            }}
            isOpen={showAiAssistant}
            onToggle={() => setShowAiAssistant(!showAiAssistant)}
            onClose={() => setShowAiAssistant(false)}
            isPhoneSimulator={false}
          />
        </>
      )}

      {/* Floating Compare Toolbar (When 2+ Candidates Selected) */}
      {selectedForCompare.length >= 2 && !compareModalOpen && (
        <div className="compare-floating-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 600 }}>
            <Layers size={16} color="var(--primary)" />
            <span>{selectedForCompare.length} candidates selected</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              id="floating-compare-btn"
              className="btn btn-primary btn-sm"
              onClick={() => setCompareModalOpen(true)}
            >
              Compare Side by Side
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedForCompare([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 1: CANDIDATE COMPARISON MODAL (SIDE BY SIDE) */}
      {compareModalOpen && comparedCandidates.length >= 2 && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '960px', width: '95vw', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Candidate Side-by-Side Comparison
                  </h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Directly comparing {comparedCandidates.length} shortlisted candidates for {currentReq.title}
                </div>
              </div>
              <button 
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={() => setCompareModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Comparison Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${comparedCandidates.length}, 1fr)`, 
              gap: '16px',
              borderTop: '1px solid var(--border-default)',
              paddingTop: '16px'
            }}>
              {comparedCandidates.map(c => (
                <div 
                  key={c.id} 
                  style={{ 
                    background: 'var(--bg-app)', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-default)', 
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    {/* Candidate Identity Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {c.maskedName}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {c.id}
                        </div>
                      </div>
                      <span className={`match-chip ${c.aiScore >= 80 ? 'high' : c.aiScore >= 60 ? 'mid' : 'low'}`}>
                        {c.aiScore}% Match
                      </span>
                    </div>

                    {/* Stepper Status */}
                    <div style={{ marginBottom: '10px' }}>
                      <CandidatePipelineStepper stage={c.stage} />
                    </div>

                    {/* Metric Row Table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Experience:</span>
                        <strong>{c.experienceYrs} Years</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Notice Period:</span>
                        <strong style={{ color: c.noticeDays > 60 ? 'var(--warning-text)' : 'inherit' }}>
                          {c.noticeDays === 0 ? 'Immediate' : `${c.noticeDays} Days`}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Expected CTC:</span>
                        <strong>₹{c.expectedCTCLPA} LPA</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                        <span>{c.location.split('/')[0]}</span>
                      </div>
                    </div>

                    {/* Key Quoted Evidence Lines for Each Requirement */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                        Quoted CV Evidence:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {c.evidenceLines.slice(0, 3).map((ev, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              background: 'var(--bg-surface)', 
                              borderLeft: `2px solid ${ev.status === 'matched' ? 'var(--success)' : 'var(--warning)'}`,
                              padding: '6px 8px', 
                              borderRadius: '0 4px 4px 0', 
                              fontSize: '0.74rem' 
                            }}
                          >
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.72rem' }}>
                              {ev.criterion}
                            </div>
                            <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                              &ldquo;{ev.quote}&rdquo;
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleShortlist(c)}
                    >
                      <CheckCircle2 size={12} /> Shortlist
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setCompareModalOpen(false);
                        handleOpenInterviewModal(c);
                      }}
                    >
                      <Calendar size={12} /> Interview
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCompareModalOpen(false);
                        handleOpenRejectModal(c);
                      }}
                    >
                      <XCircle size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: INTERVIEW SLOT PROPOSAL MODAL */}
      {interviewCandidate && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Propose Interview Slot
                </h3>
              </div>
              <button 
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={() => setInterviewCandidate(null)}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Candidate: <strong>{interviewCandidate.maskedName}</strong> ({interviewCandidate.id}). Propose a date, time, duration, and meeting mode for recruiter confirmation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Date:
                </label>
                <input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Time Slot:
                </label>
                <select
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="10:30 IST">10:30 AM IST</option>
                  <option value="11:45 IST">11:45 AM IST</option>
                  <option value="14:30 IST">02:30 PM IST</option>
                  <option value="16:00 IST">04:00 PM IST</option>
                  <option value="17:30 IST">05:30 PM IST</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Duration:
                </label>
                <select
                  value={interviewForm.duration}
                  onChange={(e) => setInterviewForm({ ...interviewForm, duration: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="30 mins">30 mins</option>
                  <option value="45 mins">45 mins (Standard)</option>
                  <option value="60 mins">60 mins</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Meeting Mode:
                </label>
                <select
                  value={interviewForm.mode}
                  onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="Microsoft Teams Video Link">Microsoft Teams</option>
                  <option value="Google Meet Video Link">Google Meet</option>
                  <option value="Client Noida Office (In-Person)">Noida Office (In-Person)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Interview Round / Focus Topic:
              </label>
              <input
                type="text"
                value={interviewForm.round}
                onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setInterviewCandidate(null)}
              >
                Cancel
              </button>
              <button
                id="btn-confirm-interview-slot"
                className="btn btn-primary btn-sm"
                onClick={handleConfirmInterview}
              >
                <Video size={13} />
                Send Slot Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: RESUME PREVIEW & EVIDENCE SIDE DRAWER */}
      {drawerCandidate && (
        <div className="profile-drawer-backdrop" onClick={() => setDrawerCandidate(null)}>
          <div className="profile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {drawerCandidate.maskedName}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({drawerCandidate.id})
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    Masked Contact (DPDP)
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {drawerCandidate.currentRole} • {drawerCandidate.experienceYrs} yrs exp • Notice: {drawerCandidate.noticeDays} days
                </div>
              </div>

              <button 
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={() => setDrawerCandidate(null)}
              >
                <X size={15} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Feature 5 Stepper inside drawer */}
              <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Candidate Status Pipeline:
                </div>
                <CandidatePipelineStepper stage={drawerCandidate.stage} />
              </div>

              {/* AI Scorecard & Evidentiary Proof */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    AI Score Explanation & Verbatim CV Proof
                  </div>
                  <span className={`match-chip ${drawerCandidate.aiScore >= 80 ? 'high' : drawerCandidate.aiScore >= 60 ? 'mid' : 'low'}`}>
                    {drawerCandidate.aiScore}% Match
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {drawerCandidate.evidenceLines.map((ev, i) => (
                    <div 
                      key={i}
                      style={{ 
                        background: 'var(--bg-app)', 
                        borderLeft: `3px solid ${ev.status === 'matched' ? 'var(--success)' : 'var(--warning)'}`,
                        padding: '8px 12px',
                        borderRadius: '0 6px 6px 0',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600 }}>{ev.criterion}</span>
                        <span className={`badge ${ev.status === 'matched' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                          {ev.score}
                        </span>
                      </div>
                      <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                        &ldquo;{ev.quote}&rdquo;
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Reference: {ev.lineRef}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Requirements or Warnings */}
              {drawerCandidate.noticeDays > 60 && (
                <div style={{ background: 'var(--warning-light)', border: '1px solid var(--warning-border)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={15} color="var(--warning)" />
                  <span>Notice Period Warning: Candidate is at {drawerCandidate.noticeDays} days vs 60-day project limit. Buyout required.</span>
                </div>
              )}

              {/* Full Masked Resume Document */}
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px' }}>
                  Resume Preview (Contacts Masked for DPDP Compliance)
                </div>
                <pre style={{ 
                  background: 'var(--bg-app)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-main)'
                }}>
                  {drawerCandidate.fullCVText}
                </pre>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: 'var(--bg-surface)' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setDrawerCandidate(null);
                  handleOpenRejectModal(drawerCandidate);
                }}
              >
                <XCircle size={13} /> Reject
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setDrawerCandidate(null);
                  handleOpenInterviewModal(drawerCandidate);
                }}
              >
                <Calendar size={13} /> Propose Interview
              </button>

              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  handleShortlist(drawerCandidate);
                  setDrawerCandidate(null);
                }}
              >
                <CheckCircle2 size={13} /> Shortlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: STRUCTURED REJECTION FEEDBACK MODAL */}
      {rejectCandidate && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--danger-text)' }}>
                Reject Candidate: {rejectCandidate.maskedName}
              </h3>
              <button 
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={() => setRejectCandidate(null)}
              >
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Please select a structured reason. This feedback directly refines future candidate matching by Company A recruiters.
            </p>

            {/* Required Reason Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {[
                'Skill mismatch',
                'Insufficient experience',
                'CTC mismatch',
                'Notice period too long',
                'Other'
              ].map((reasonOption) => (
                <label 
                  key={reasonOption}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: rejectReason === reasonOption ? 'var(--primary-light)' : 'var(--bg-app)',
                    border: `1px solid ${rejectReason === reasonOption ? 'var(--primary-border)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reasonOption}
                    checked={rejectReason === reasonOption}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <span>{reasonOption}</span>
                </label>
              ))}
            </div>

            {/* Optional / Required Notes for 'Other' */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {rejectReason === 'Other' ? 'Please specify reason (Required):' : 'Additional Feedback for Recruiter (Optional):'}
              </label>
              <textarea
                rows={2}
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="E.g., Looking for someone with hands-on Kafka cluster administration..."
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.8rem',
                  background: 'var(--bg-surface)'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setRejectCandidate(null)}
              >
                Cancel
              </button>
              <button 
                id="confirm-reject-btn"
                className="btn btn-danger btn-sm"
                onClick={handleConfirmReject}
                disabled={rejectReason === 'Other' && !rejectNotes.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Candidate Card inside Client Portal
function ClientCandidateCard({ 
  candidate, 
  isSelectedForCompare, 
  onToggleCompare, 
  onShortlist, 
  onOpenReject, 
  onOpenInterview, 
  onViewProfile,
  isMobile 
}) {
  const isShortlisted = candidate.clientDecision === 'SHORTLISTED';
  const isRejected = candidate.clientDecision === 'REJECTED';
  const isInterview = candidate.clientDecision === 'INTERVIEW_PROPOSED';

  return (
    <div className="clean-card" style={{ padding: isMobile ? '14px' : '18px 22px' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '14px' }}>
        <div style={{ flex: 1 }}>
          {/* Top Row: Name, Compare Checkbox, Masked Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {candidate.maskedName}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {candidate.id}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                Masked Contact
              </span>
            </div>

            {/* Compare Selector Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', cursor: 'pointer', color: isSelectedForCompare ? 'var(--primary)' : 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                onChange={onToggleCompare}
              />
              <span>Compare</span>
            </label>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {candidate.currentRole} • {candidate.experienceYrs} yrs exp • Expected CTC: <strong>₹{candidate.expectedCTCLPA} LPA</strong> • Notice: <strong>{candidate.noticeDays} days</strong>
          </div>

          {/* FEATURE 5: CANDIDATE PIPELINE TRACKER */}
          <div style={{ margin: '8px 0' }}>
            <CandidatePipelineStepper stage={candidate.stage} />
          </div>

          {/* Quoted Proof from CV */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            {candidate.evidenceLines.slice(0, 2).map((ev, i) => (
              <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <strong>✓ {ev.criterion}: </strong>
                <span style={{ fontStyle: 'italic' }}>&ldquo;{ev.quote}&rdquo;</span>
              </div>
            ))}
          </div>

          {/* Interview Proposed Status Chip (Feature 2) */}
          {candidate.interviewSlot && (
            <div style={{ 
              marginTop: '6px', 
              background: 'var(--primary-light)', 
              border: '1px solid var(--primary-border)', 
              padding: '6px 10px', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Calendar size={13} />
              <span>
                <strong>Interview Proposed:</strong> {candidate.interviewSlot.date} at {candidate.interviewSlot.time} ({candidate.interviewSlot.duration || '45m'}, {candidate.interviewSlot.mode})
              </span>
            </div>
          )}

          {/* Decision Status Badges */}
          {candidate.clientDecision !== 'NONE' && (
            <div style={{ marginTop: '8px' }}>
              {isShortlisted && <span className="badge badge-success">✓ Shortlisted by Client</span>}
              {isRejected && <span className="badge badge-danger">✗ Rejected: {candidate.clientDecisionNotes}</span>}
            </div>
          )}
        </div>

        {/* Action Column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'row' : 'column', 
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'flex-end',
          minWidth: isMobile ? '100%' : '200px',
          borderTop: isMobile ? '1px solid var(--border-default)' : 'none',
          paddingTop: isMobile ? '10px' : 0
        }}>
          {/* Match Score */}
          <div className={`match-chip ${candidate.aiScore >= 80 ? 'high' : candidate.aiScore >= 60 ? 'mid' : 'low'}`}>
            {candidate.aiScore}% Match
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', marginTop: isMobile ? 0 : '12px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onViewProfile}
              title="View full masked resume and evidence"
            >
              <FileText size={12} />
              View Profile
            </button>

            <button
              className={`btn btn-sm ${isShortlisted ? 'btn-success' : 'btn-secondary'}`}
              onClick={onShortlist}
            >
              <CheckCircle2 size={12} />
              Shortlist
            </button>

            <button
              className={`btn btn-sm ${isInterview ? 'btn-primary' : 'btn-secondary'}`}
              onClick={onOpenInterview}
            >
              <Calendar size={12} />
              Interview
            </button>

            <button
              className={`btn btn-sm ${isRejected ? 'btn-danger' : 'btn-secondary'}`}
              onClick={onOpenReject}
            >
              <XCircle size={12} />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// FEATURE 5: CANDIDATE PIPELINE TRACKER STEPPER
function CandidatePipelineStepper({ stage }) {
  const steps = [
    { label: 'Submitted', key: 'Submitted to Client' },
    { label: 'Shortlisted', key: 'Client Shortlisted' },
    { label: 'Interview', key: 'Interview Scheduled' },
    { label: 'Selected', key: 'Offered' },
    { label: 'Joined', key: 'Joined' }
  ];

  // Map candidate stage to step index
  let activeIndex = 0;
  if (stage === 'Client Shortlisted') activeIndex = 1;
  else if (stage === 'Interview Scheduled') activeIndex = 2;
  else if (stage === 'Offered') activeIndex = 3;
  else if (stage === 'Joined') activeIndex = 4;

  return (
    <div className="status-stepper" title={`Current stage: ${stage}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;

        return (
          <React.Fragment key={step.label}>
            <div className={`stepper-step ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
              <div className="stepper-dot"></div>
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
