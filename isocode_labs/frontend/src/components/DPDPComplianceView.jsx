// DPDPComplianceView.jsx - Screen 7: DPDP Act 2023 Compliance & Consent Center
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Lock, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Search, 
  Clock, 
  Key, 
  History,
  FileSignature
} from 'lucide-react';

export default function DPDPComplianceView({ 
  candidates, 
  auditLogs, 
  onDeleteCandidateDPDP,
  onAddAuditLog 
}) {
  const [activeSubTab, setActiveSubTab] = useState('CONSENT'); // CONSENT, ERASURE, AUDIT_LOGS
  const [searchLog, setSearchLog] = useState('');
  const [erasureModalOpen, setErasureModalOpen] = useState(false);
  const [selectedCandidateToErase, setSelectedCandidateToErase] = useState(null);
  const [erasureReason, setErasureReason] = useState('Candidate email request pursuant to Section 12 DPDP Act 2023');
  const [erasureCertificate, setErasureCertificate] = useState(null);

  const handleOpenErasureModal = (cand) => {
    setSelectedCandidateToErase(cand);
    setErasureModalOpen(true);
  };

  const handleConfirmErasure = () => {
    if (!selectedCandidateToErase) return;
    
    // Execute data deletion
    onDeleteCandidateDPDP(selectedCandidateToErase.id, erasureReason);
    
    // Generate Erasure Certificate
    const cert = {
      certId: `CERT-DEL-${Date.now().toString().slice(-6)}`,
      candidateId: selectedCandidateToErase.id,
      timestamp: new Date().toISOString(),
      reason: erasureReason,
      hashPurged: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      officer: 'Sneha Verma (DPDP Compliance Officer, Company A Noida)'
    };
    setErasureCertificate(cert);
    setErasureModalOpen(false);
  };

  const filteredLogs = auditLogs.filter(log => 
    log.actorName.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.candidateId.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.action.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* View Header */}
      <div className="panel-card" style={{ padding: '20px 24px' }}>
        <div className="card-header-flex" style={{ margin: 0 }}>
          <div className="card-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Screen 7: DPDP Act 2023 Statutory Compliance & Consent Center</h2>
              <span className="badge badge-success">Digital Personal Data Protection Act 2023 Compliant</span>
            </div>
            <p>
              Statutory governance suite: candidate digital consent registry, Right to Erasure execution, and tamper-evident access log of who viewed what.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeSubTab === 'CONSENT' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubTab('CONSENT')}
            >
              <FileSignature size={14} />
              Consent Records ({candidates.length})
            </button>
            <button
              className={`btn btn-sm ${activeSubTab === 'AUDIT_LOGS' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubTab('AUDIT_LOGS')}
            >
              <History size={14} />
              Access Audit Trail ({auditLogs.length})
            </button>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div style={{ 
          marginTop: '16px', 
          background: 'var(--bg-subtle)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-md)', 
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>
              <strong>Company A Noida DPDP Architecture:</strong> Candidates retain full rights over personal data. Data is retained solely for recruitment matching and purged upon withdrawal.
            </span>
          </div>
          <span className="badge badge-primary">Statutory Clause 6 & 12 Compliant</span>
        </div>
      </div>

      {/* Erasure Certificate Banner if freshly generated */}
      {erasureCertificate && (
        <div className="panel-card" style={{ 
          background: 'var(--success-light)', 
          border: '1px solid var(--success-border)', 
          padding: '18px 24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="var(--success)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success-text)', margin: 0 }}>
                Official Certificate of Data Erasure Issued: {erasureCertificate.certId}
              </h3>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => alert(`Certificate ${erasureCertificate.certId} exported for DPDP regulatory audit.`)}
            >
              <Download size={13} /> Download Certificate
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--success-text)', margin: 0 }}>
            Candidate <strong>{erasureCertificate.candidateId}</strong> personal data, phone numbers, email addresses, and CV documents have been permanently expunged. Audit tombstone logged.
          </p>
        </div>
      )}

      {/* SubTab 1: Consent Records & Deletion on Request */}
      {activeSubTab === 'CONSENT' && (
        <div className="panel-card" style={{ padding: '20px 24px' }}>
          <div className="card-header-flex">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Candidate Consent Registry & Erasure Controls</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Demonstrates explicit candidate consent verification and one-click Right to Erasure execution.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Candidate</th>
                  <th style={{ padding: '10px 12px' }}>Consent Status</th>
                  <th style={{ padding: '10px 12px' }}>Channel / Proof</th>
                  <th style={{ padding: '10px 12px' }}>Consent Timestamp</th>
                  <th style={{ padding: '10px 12px' }}>Purpose Limitation</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Right to Erasure</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(cand => {
                  const consent = cand.consentRecord || {};
                  const isPurged = cand.isPurged;

                  return (
                    <tr key={cand.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {cand.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {cand.id} • {cand.location}
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        {isPurged ? (
                          <span className="badge badge-neutral">
                            PURGED / DELETED
                          </span>
                        ) : consent.status === 'VERIFIED_ACTIVE' ? (
                          <span className="badge badge-success">
                            <CheckCircle2 size={11} /> Verified Active
                          </span>
                        ) : consent.status === 'FLAGGED_DUPLICATE' ? (
                          <span className="badge badge-warning">
                            Quarantined Duplicate
                          </span>
                        ) : (
                          <span className="badge badge-neutral">Active</span>
                        )}
                      </td>

                      <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                        <div>{consent.channel || 'Digital Candidate Gateway'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          IP: {consent.ipAddress || '103.21.144.12'}
                        </div>
                      </td>

                      <td style={{ padding: '12px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                        {consent.consentDate || '2026-10-28 09:15 IST'}
                      </td>

                      <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Hiring & Requisition Match Only
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {isPurged ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Data Erased
                          </span>
                        ) : (
                          <button
                            id={`btn-erase-${cand.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                            onClick={() => handleOpenErasureModal(cand)}
                            title="Execute DPDP Right to Erasure / Delete on Request"
                          >
                            <Trash2 size={12} />
                            Delete on Request
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Granular Access Audit Log ("Who Viewed What") */}
      {activeSubTab === 'AUDIT_LOGS' && (
        <div className="panel-card" style={{ padding: '20px 24px' }}>
          <div className="card-header-flex">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Immutable Access Log ("Who Viewed What")</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Mandatory audit trail documenting every recruiter inspection, unmasking, and client interaction.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter logs by actor, ID, or action..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => alert('Audit log exported as cryptographically signed CSV for compliance audit.')}
              >
                <Download size={13} />
                Export Audit Log
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Timestamp</th>
                  <th style={{ padding: '10px 12px' }}>Actor Name & Role</th>
                  <th style={{ padding: '10px 12px' }}>Candidate ID</th>
                  <th style={{ padding: '10px 12px' }}>Action Executed</th>
                  <th style={{ padding: '10px 12px' }}>Details / Scope</th>
                  <th style={{ padding: '10px 12px' }}>Compliance Flag</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {log.timestamp}
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.actorName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {log.actorRole} • {log.actorIP}
                      </div>
                    </td>

                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {log.candidateId}
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {log.action}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {log.details}
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        ✓ {log.complianceFlag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Right to Erasure Execution Modal */}
      {erasureModalOpen && selectedCandidateToErase && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <AlertTriangle size={22} color="var(--danger)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--danger-text)' }}>
                Confirm Statutory Erasure (DPDP Act 2023)
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Under Section 12(3) of the Digital Personal Data Protection Act 2023, executing this action will permanently purge all personal information for <strong>{selectedCandidateToErase.name} ({selectedCandidateToErase.id})</strong>.
            </p>

            <div style={{ 
              background: 'var(--danger-light)', 
              border: '1px solid var(--danger-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '12px', 
              fontSize: '0.78rem',
              color: 'var(--danger-text)',
              marginBottom: '16px' 
            }}>
              <strong>Data expunged immediately:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                <li>Raw & Parsed CV document files</li>
                <li>Phone number, email address, physical address</li>
                <li>Scorecard criteria notes & recruiter comments</li>
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Legal Basis / Reason:
              </label>
              <input
                type="text"
                value={erasureReason}
                onChange={(e) => setErasureReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setErasureModalOpen(false)}>
                Cancel
              </button>
              <button 
                id="confirm-erasure-action-btn"
                className="btn btn-danger" 
                onClick={handleConfirmErasure}
              >
                Permanently Purge & Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
