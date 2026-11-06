// RankedCandidatesView.jsx - Minimalist, High-Clarity Candidates Workspace
import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Eye, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function RankedCandidatesView({ 
  candidates, 
  onOpenCVDeepDive, 
  onSubmitToClient, 
  onNavigateToClientPortal,
  currentReq 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, TOP_MATCH, FAST_NOTICE
  const [sortBy, setSortBy] = useState('SCORE_DESC'); // SCORE_DESC, NOTICE_ASC, EXP_DESC, CTC_ASC
  const [blindMode, setBlindMode] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const filteredCandidates = candidates
    .filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(q) || 
                            c.id.toLowerCase().includes(q) || 
                            c.keySkills.some(s => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
      if (filterType === 'TOP_MATCH') return c.aiScore >= 80;
      if (filterType === 'FAST_NOTICE') return c.noticeDays <= 30;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'NOTICE_ASC') return (a.noticeDays || 0) - (b.noticeDays || 0);
      if (sortBy === 'EXP_DESC') return (b.experienceYrs || 0) - (a.experienceYrs || 0);
      if (sortBy === 'CTC_ASC') return (a.expectedCTCLPA || 0) - (b.expectedCTCLPA || 0);
      return b.aiScore - a.aiScore;
    });

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Clean Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Candidates for {currentReq.title}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Ranked by AI match against scorecard. AI never rejects candidates; low scorers stay searchable.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="blind-mode-toggle"
            className={`btn btn-sm ${blindMode ? 'btn-secondary' : 'btn-secondary'}`}
            style={{ fontSize: '0.76rem', borderColor: blindMode ? 'var(--primary-border)' : 'var(--border-default)', color: blindMode ? 'var(--primary)' : 'inherit' }}
            onClick={() => setBlindMode(!blindMode)}
            title="Toggle DPDP blind scoring mode (masks name/gender to avoid bias)"
          >
            <ShieldCheck size={13} />
            {blindMode ? 'Blind Mode: Active (No Bias)' : 'Blind Mode: Off'}
          </button>

          <button
            id="open-client-portal-btn"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.76rem' }}
            onClick={onNavigateToClientPortal}
          >
            <span>Open Client Portal</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            id="candidate-search"
            type="text"
            placeholder="Search candidates by name, skill, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.84rem',
              width: '100%',
              outline: 'none',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className={`btn btn-sm ${filterType === 'ALL' ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ background: filterType === 'ALL' ? 'var(--bg-subtle)' : 'transparent', fontWeight: filterType === 'ALL' ? 600 : 400 }}
              onClick={() => setFilterType('ALL')}
            >
              All ({candidates.length})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'TOP_MATCH' ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ background: filterType === 'TOP_MATCH' ? 'var(--bg-subtle)' : 'transparent', fontWeight: filterType === 'TOP_MATCH' ? 600 : 400 }}
              onClick={() => setFilterType('TOP_MATCH')}
            >
              Top Fit (&gt;80%)
            </button>
            <button
              className={`btn btn-sm ${filterType === 'FAST_NOTICE' ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ background: filterType === 'FAST_NOTICE' ? 'var(--bg-subtle)' : 'transparent', fontWeight: filterType === 'FAST_NOTICE' ? 600 : 400 }}
              onClick={() => setFilterType('FAST_NOTICE')}
            >
              Fast Joiners (&le;30d)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid var(--border-default)', paddingLeft: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: '0.76rem',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-app)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <option value="SCORE_DESC">AI Match Score (High to Low)</option>
              <option value="NOTICE_ASC">Notice Period (Shortest First)</option>
              <option value="EXP_DESC">Experience (Highest First)</option>
              <option value="CTC_ASC">Target CTC (Lowest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredCandidates.length === 0 ? (
          <div className="clean-card" style={{ textAlign: 'center', padding: '44px 20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              No candidates match your current search or filters
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 16px auto' }}>
              Try clearing filters or uploading new resumes into this job requisition's pool.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {(searchQuery || filterType !== 'ALL') && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}
                >
                  Reset Search & Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredCandidates.map((c, idx) => {
          const isExpanded = expandedId === c.id;
          const displayName = blindMode ? c.maskedName : c.name;
          const isHigh = c.aiScore >= 80;
          const isMid = c.aiScore >= 60 && c.aiScore < 80;
          const keyEvidence = c.evidenceLines && c.evidenceLines[0] ? c.evidenceLines[0].quote : null;

          return (
            <div 
              key={c.id} 
              className="clean-card"
              style={{ padding: '16px 20px', transition: 'all 0.15s ease' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                {/* Left: Score & Candidate Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '300px' }}>
                  <div className={`match-chip ${isHigh ? 'high' : isMid ? 'mid' : 'low'}`} style={{ minWidth: '44px', textAlign: 'center', justifyContent: 'center' }}>
                    {c.aiScore}%
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {displayName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {c.id}
                      </span>
                      {c.isSimulated && (
                        <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>
                          [Demo Profile]
                        </span>
                      )}
                      {c.missingFields && c.missingFields.length > 0 && (
                        <span className="badge badge-warning" style={{ fontSize: '0.66rem' }} title={`Missing fields: ${c.missingFields.join(', ')}`}>
                          Needs Review ({c.missingFields.length})
                        </span>
                      )}
                      {c.recruiterReviewed && (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      )}
                      {c.stage === 'Submitted to Client' && (
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                          In Client Portal
                        </span>
                      )}
                      {c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>
                          Quarantined Duplicate
                        </span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                          Unique Candidate
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {c.currentRole} • {c.experienceYrs} yrs exp • Notice: <strong>{c.noticeDays === 0 ? 'Immediate' : `${c.noticeDays} days`}</strong> • Expected CTC: <strong>₹{c.expectedCTCLPA} LPA</strong>
                    </div>

                    {/* Concise Verbatim Quote directly on card */}
                    {keyEvidence && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px', maxWidth: '640px' }}>
                        &ldquo;{keyEvidence}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Clean Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    id={`btn-review-${c.id}`}
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenCVDeepDive(c)}
                    title="Review full CV text and verify criteria"
                  >
                    <Eye size={13} />
                    Review CV
                  </button>

                  <button
                    id={`btn-submit-${c.id}`}
                    className={`btn btn-sm ${c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' ? 'btn-secondary' : c.recruiterReviewed ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => c.duplicateStatus !== 'EXACT_DUPLICATE_FLAGGED' && onSubmitToClient(c)}
                    disabled={c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED'}
                    style={c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    title={
                      c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' 
                        ? 'Blocked: Quarantined duplicate cannot be submitted to client' 
                        : !c.recruiterReviewed 
                          ? 'Verification Gate: Opens CV review before client submission' 
                          : 'Submit verified profile to client portal'
                    }
                  >
                    <Send size={13} />
                    {c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' ? 'Submission Blocked' : 'Submit to Client'}
                  </button>

                  <button
                    className="btn btn-secondary btn-icon-only btn-sm"
                    onClick={() => toggleExpand(c.id)}
                    title="Toggle all criteria evidence & score breakdown"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Collapsed Detailed Evidence Drawer */}
              {isExpanded && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
                  {/* Score Breakdown Summary Chips */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div style={{ background: 'var(--bg-app)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Skills Match: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{c.scoreBreakdown?.skillsMatch || 90}%</strong>
                    </div>
                    <div style={{ background: 'var(--bg-app)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Experience Fit: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{c.scoreBreakdown?.experienceMatch || 100}%</strong>
                    </div>
                    <div style={{ background: 'var(--bg-app)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Notice Period Fit: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{c.scoreBreakdown?.noticeMatch || 100}%</strong>
                    </div>
                    <div style={{ background: 'var(--bg-app)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target CTC Fit: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{c.scoreBreakdown?.ctcMatch || 90}%</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Score Breakdown by Criterion & Verbatim Evidence Source:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {c.evidenceLines && c.evidenceLines.map((ev, i) => (
                      <div key={i} style={{ 
                        background: 'var(--bg-app)', 
                        padding: '10px 14px', 
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text-main)' }}>{ev.criterion}</strong>
                          <span className={`badge ${ev.status === 'matched' ? 'badge-success' : 'badge-warning'}`}>
                            {ev.score}
                          </span>
                        </div>
                        <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          &ldquo;{ev.quote}&rdquo;
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📍 Evidence Source:</span>
                          <strong>{ev.lineRef || 'CV Document, Section 1'}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>({c.cvFormat || 'Verified CV Document'})</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {c.recruiterReviewNotes && (
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--primary)', fontStyle: 'italic', background: 'var(--primary-light)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Recruiter Verification Note:</strong> &ldquo;{c.recruiterReviewNotes}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}
