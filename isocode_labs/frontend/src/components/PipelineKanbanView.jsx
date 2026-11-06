// PipelineKanbanView.jsx - Minimalist Requisition Pipeline (Sourced to Joined)
// With Duplicate Quarantine Shield & Human-in-the-Loop Transition Guardrails
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PIPELINE_STAGES = [
  { id: 'Sourced', label: 'Sourced', color: '#64748B' },
  { id: 'AI Screened', label: 'Screened', color: '#38BDF8' },
  { id: 'Recruiter Verified', label: 'Verified', color: '#818CF8' },
  { id: 'Submitted to Client', label: 'In Client Review', color: '#A855F7' },
  { id: 'Client Shortlisted', label: 'Shortlisted', color: '#10B981' },
  { id: 'Interview Scheduled', label: 'Interviewing', color: '#F59E0B' },
  { id: 'Offered', label: 'Offered', color: '#059669' },
  { id: 'Joined', label: 'Joined', color: '#4F46E5' }
];

export default function PipelineKanbanView({ 
  candidates, 
  onMoveCandidateStage, 
  onOpenCVDeepDive,
  currentReq 
}) {
  const [showQuarantineModal, setShowQuarantineModal] = useState(false);
  const [transitionWarning, setTransitionWarning] = useState(null);

  // STRICT SEPARATION: Only unique non-quarantined candidates in active pipeline
  const reqCandidates = candidates.filter(c => 
    c.appliedReqId === currentReq.id && 
    c.duplicateStatus !== 'EXACT_DUPLICATE_FLAGGED' && 
    !c.isPurged
  );

  const quarantinedCandidates = candidates.filter(c => 
    c.appliedReqId === currentReq.id && 
    c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED'
  );

  // Validation Guardrail Helper
  const validateTransition = (cand, targetStage) => {
    if (cand.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED') {
      return { 
        valid: false, 
        message: 'Security Guardrail: Quarantined duplicate profiles are permanently locked from pipeline progression.' 
      };
    }

    const clientFacingStages = ['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled', 'Offered', 'Joined'];
    if (clientFacingStages.includes(targetStage) && !cand.recruiterReviewed) {
      return { 
        valid: false, 
        message: `Human-in-the-Loop Violation: Candidate "${cand.name}" must be reviewed and verified by a recruiter before moving to "${targetStage}".` 
      };
    }

    // Check forward jump distance (allow moving back to any earlier stage, but prevent forward skipping > 1 stage)
    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === cand.stage);
    const targetIdx = PIPELINE_STAGES.findIndex(s => s.id === targetStage);

    if (targetIdx > currentIdx + 1 && (cand.stage === 'Sourced' || cand.stage === 'AI Screened')) {
      return {
        valid: false,
        message: `Invalid Transition: Candidate cannot skip from "${cand.stage}" directly to "${targetStage}". Must complete recruiter verification first.`
      };
    }

    return { valid: true };
  };

  const handleDragStart = (e, candId) => {
    e.dataTransfer.setData('text/plain', candId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const candId = e.dataTransfer.getData('text/plain');
    if (!candId) return;

    const cand = candidates.find(c => c.id === candId);
    if (!cand) return;

    if (cand.stage === targetStage) return;

    const validation = validateTransition(cand, targetStage);
    if (!validation.valid) {
      setTransitionWarning(validation.message);
      setTimeout(() => setTransitionWarning(null), 5000);
      return;
    }

    onMoveCandidateStage(candId, targetStage);
    if (targetStage === 'Joined') {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleAdvance = (cand) => {
    const idx = PIPELINE_STAGES.findIndex(s => s.id === cand.stage);
    if (idx < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[idx + 1].id;
      const validation = validateTransition(cand, nextStage);
      if (!validation.valid) {
        setTransitionWarning(validation.message);
        setTimeout(() => setTransitionWarning(null), 5000);
        return;
      }

      onMoveCandidateStage(cand.id, nextStage);
      if (nextStage === 'Joined') {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with Unique vs Quarantined Counts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Hiring Pipeline — {currentReq.title}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Drag & drop candidates or click advance. Validated transitions with recruiter review gate.
          </p>
        </div>

        {/* Counter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--bg-surface)', 
            padding: '6px 12px', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Pipeline:</span>
            <strong style={{ color: 'var(--text-main)' }}>{reqCandidates.length} Unique</strong>
            <span style={{ color: 'var(--border-default)' }}>|</span>
            <button
              onClick={() => setShowQuarantineModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--danger-text)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
              title="Click to view quarantined duplicate profiles"
            >
              <ShieldAlert size={13} color="var(--danger)" />
              {quarantinedCandidates.length} Quarantined
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            48h SLA: <strong style={{ color: 'var(--success-text)' }}>86.4% on schedule</strong>
          </div>
        </div>
      </div>

      {/* Transition Guardrail Warning Toast */}
      {transitionWarning && (
        <div style={{
          background: 'var(--danger-light)',
          border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          color: 'var(--danger-text)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <AlertTriangle size={16} />
          <span>{transitionWarning}</span>
        </div>
      )}

      {/* Duplicate Shield Notice Bar */}
      {quarantinedCandidates.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={14} color="var(--danger)" />
            <span>
              <strong>Duplicate Shield Active:</strong> {quarantinedCandidates.length} candidate profile (CND-91210 Ritika Bansal via Agency 2) is quarantined. Quarantined profiles cannot be submitted to clients or counted as unique candidates.
            </span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            onClick={() => setShowQuarantineModal(true)}
          >
            Inspect Quarantined Vault
          </button>
        </div>
      )}

      {/* Kanban Board */}
      <div className="kanban-board">
        {PIPELINE_STAGES.map(stage => {
          const stageCandidates = reqCandidates.filter(c => c.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="kanban-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: stage.color }}></span>
                  <span>{stage.label}</span>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {stageCandidates.length}
                </span>
              </div>

              <div className="kanban-cards-list">
                {stageCandidates.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-faint)', fontSize: '0.74rem' }}>
                    Empty
                  </div>
                ) : (
                  stageCandidates.map(c => (
                    <div
                      key={c.id}
                      className="kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      onClick={() => onOpenCVDeepDive(c)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{c.name}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{c.aiScore}%</span>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {c.currentRole} • {c.experienceYrs}y exp
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {c.noticeDays === 0 ? 'Immediate' : `${c.noticeDays}d notice`}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {c.recruiterReviewed && (
                            <span title="Recruiter Verified" style={{ display: 'flex', color: 'var(--success-text)' }}>
                              <ShieldCheck size={13} />
                            </span>
                          )}

                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvance(c);
                            }}
                            title="Advance to next stage"
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quarantined Vault Modal */}
      {showQuarantineModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--danger)" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Quarantined Duplicate Profiles ({quarantinedCandidates.length})
                </h2>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowQuarantineModal(false)}
              >
                Close Vault
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Profiles in this vault were automatically intercepted and quarantined by the duplicate hashing engine. They are <strong>strictly excluded</strong> from the active candidate pipeline, cannot be submitted to clients, and do not inflate candidate counts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quarantinedCandidates.map(c => (
                <div 
                  key={c.id} 
                  style={{ 
                    border: '1px solid var(--danger-border)', 
                    background: 'var(--danger-light)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '14px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--danger-text)' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                        {c.id}
                      </span>
                    </div>
                    <span className="badge badge-danger">Quarantined</span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Role: {c.currentRole} • Experience: {c.experienceYrs} yrs • Match Score: {c.aiScore}%
                  </div>

                  <div style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '8px 10px', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-default)'
                  }}>
                    <strong>Detection Reason:</strong> {c.duplicateDetails || 'Duplicate candidate detected across phone and email hash with original candidate CND-91022.'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--danger-text)', fontWeight: 500 }}>
                      🚫 Blocked from pipeline advancement & client submission
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      onClick={() => {
                        setShowQuarantineModal(false);
                        onOpenCVDeepDive(c);
                      }}
                    >
                      <Eye size={12} /> Inspect CV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
