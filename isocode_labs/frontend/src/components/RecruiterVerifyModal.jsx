// RecruiterVerifyModal.jsx - Screen 4: Deep Recruiter Verification & Dossier View
import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  ShieldCheck, 
  User, 
  Clock, 
  DollarSign, 
  Building, 
  Phone, 
  Mail, 
  CheckSquare, 
  Square
} from 'lucide-react';

export default function RecruiterVerifyModal({ 
  candidate, 
  onClose, 
  onSaveVerification, 
  onSubmitToClient,
  currentReq 
}) {
  const [pitchNotes, setPitchNotes] = useState(
    candidate.recruiterReviewNotes || 
    `Candidate is a verified senior match. Demonstrated strong hands-on Spring Boot and Kafka experience with active notice period.`
  );
  const [checks, setChecks] = useState({
    skills: true,
    experience: candidate.experienceYrs >= currentReq.scorecard.experience.min,
    notice: candidate.noticeDays <= currentReq.scorecard.noticePeriodMaxDays,
    consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCheck = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = checks.skills && checks.experience && checks.notice && checks.consent;

  const handleVerifyOnly = () => {
    onSaveVerification(candidate.id, pitchNotes);
    onClose();
  };

  const handleVerifyAndSubmit = () => {
    setIsSubmitting(true);
    onSaveVerification(candidate.id, pitchNotes);
    setTimeout(() => {
      onSubmitToClient(candidate, pitchNotes);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '1050px', width: '95vw', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '88vh' }}>
        {/* Modal Top Bar */}
        <div style={{ 
          padding: '16px 24px', 
          background: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-default)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`score-pill ${candidate.aiScore >= 80 ? 'high' : candidate.aiScore >= 60 ? 'medium' : 'low'}`} style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}>
              {candidate.aiScore}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Recruiter Verification: {candidate.name}
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  ({candidate.id})
                </span>
                <span className="badge badge-primary">
                  {currentReq.id}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Mandatory Guardrail: Recruiter must inspect raw CV text & confirm criteria before client dispatch.
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-icon-only btn-sm"
            onClick={onClose}
            title="Close inspection drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: Two Column Split-Pane */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', flex: 1, overflow: 'hidden' }}>
          {/* Left Pane: Full Raw CV Content */}
          <div style={{ 
            padding: '20px 24px', 
            background: 'var(--bg-app)', 
            borderRight: '1px solid var(--border-default)', 
            overflowY: 'auto' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Extracted Full CV Document</h4>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                {candidate.cvFormat}
              </span>
            </div>

            {/* Candidate PII Header (Visible to recruiter, masked for client) */}
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-default)', 
              borderRadius: 'var(--radius-md)', 
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="var(--text-muted)" />
                  <span>{candidate.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="var(--text-muted)" />
                  <span>{candidate.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={13} color="var(--text-muted)" />
                  <span>{candidate.currentCompany}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="var(--text-muted)" />
                  <span>Notice: {candidate.noticeDays} days</span>
                </div>
              </div>
            </div>

            {/* Raw Text Preformatted */}
            <pre style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.78rem', 
              lineHeight: 1.6, 
              color: 'var(--text-main)', 
              whiteSpace: 'pre-wrap',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}>
              {candidate.fullCVText}
            </pre>
          </div>

          {/* Right Pane: AI Criteria Audit & Recruiter Checklist */}
          <div style={{ 
            padding: '20px 24px', 
            background: 'var(--bg-surface)', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Evidence Lines Quick Review */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                  Verifiable Evidence Checklist
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {candidate.evidenceLines.slice(0, 4).map((ev, i) => (
                    <div key={i} className={`evidence-card ${ev.status}`} style={{ margin: 0, padding: '10px 12px' }}>
                      <div className="evidence-header">
                        <span className="evidence-criterion" style={{ fontSize: '0.8rem' }}>
                          {ev.criterion}
                        </span>
                        <span className={`badge ${ev.status === 'matched' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                          {ev.score}
                        </span>
                      </div>
                      <div className="evidence-quote" style={{ fontSize: '0.78rem' }}>
                        &ldquo;{ev.quote}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Verification Checkboxes */}
              <div style={{ 
                background: 'var(--bg-subtle)', 
                border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-md)', 
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Recruiter Human Verification Gate:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checks.skills} 
                      onChange={() => toggleCheck('skills')} 
                    />
                    <span>Verified Core Java & Spring Boot hands-on capability</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checks.experience} 
                      onChange={() => toggleCheck('experience')} 
                    />
                    <span>Verified {candidate.experienceYrs} yrs experience timeline</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checks.notice} 
                      onChange={() => toggleCheck('notice')} 
                    />
                    <span>Verified notice period ({candidate.noticeDays} days) fits client requirement</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checks.consent} 
                      onChange={() => toggleCheck('consent')} 
                    />
                    <span>DPDP 2023 Digital Candidate Consent Verified (Status: Valid)</span>
                  </label>
                </div>
              </div>

              {/* Recruiter Pitch Notes */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Recruiter Dossier Notes for Client Hiring Manager:
                </label>
                <textarea
                  rows={4}
                  value={pitchNotes}
                  onChange={(e) => setPitchNotes(e.target.value)}
                  placeholder="Add notes explaining why this candidate fits the role..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem',
                    background: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid var(--border-default)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <button
                className="btn btn-secondary"
                onClick={handleVerifyOnly}
              >
                <CheckCircle2 size={15} />
                Save Verification Only
              </button>

              <button
                id="modal-submit-to-client-btn"
                className="btn btn-primary"
                onClick={handleVerifyAndSubmit}
                disabled={!allChecked || isSubmitting}
              >
                <Send size={15} />
                {isSubmitting ? 'Transferring to Client Portal...' : 'Verify & Submit to Client Portal'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
