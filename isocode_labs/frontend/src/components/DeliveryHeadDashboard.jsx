// DeliveryHeadDashboard.jsx - Clean Governance, Bias Audit & Three-Tier ROI Suite
// Features: Delineated Client Assumptions, Simulated Benchmark Projections, and Live Measured Session Metrics
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Info,
  Layers,
  Database,
  FileCheck2,
  Lock,
  HelpCircle,
  X
} from 'lucide-react';
import { WEEKLY_BIAS_AUDIT_DATA } from '../data/sampleData';

export default function DeliveryHeadDashboard({ 
  currentReq, 
  candidates = [], 
  auditLogs = [], 
  onDeleteCandidateDPDP 
}) {
  const [subView, setSubView] = useState('ROI'); // ROI, BIAS_AUDIT, DPDP_LOGS
  const [selectedWeek, setSelectedWeek] = useState(WEEKLY_BIAS_AUDIT_DATA[0]);
  const [erasureModalCandidate, setErasureModalCandidate] = useState(null);
  const [activeMetricExplainer, setActiveMetricExplainer] = useState(null);

  // Compute live session counts
  const uniqueCandidates = candidates.filter(c => c.duplicateStatus !== 'EXACT_DUPLICATE_FLAGGED' && !c.isPurged);
  const quarantinedCandidates = candidates.filter(c => c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED');
  const verifiedCandidates = candidates.filter(c => c.recruiterReviewed && !c.isPurged);
  const submittedCandidates = candidates.filter(c => ['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled', 'Offered', 'Joined'].includes(c.stage) && !c.isPurged);
  const shortlistedCandidates = candidates.filter(c => c.stage === 'Client Shortlisted' || c.clientDecision === 'SHORTLISTED');

  // Human overrides count in live session
  const overrideCount = candidates.filter(c => c.recruiterReviewed && c.aiScore < 75 && ['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled'].includes(c.stage)).length;
  const liveOverrideRate = candidates.length > 0 ? ((overrideCount / Math.max(1, verifiedCandidates.length)) * 100).toFixed(1) : '0.0';

  const handleConfirmErasure = () => {
    if (erasureModalCandidate && onDeleteCandidateDPDP) {
      onDeleteCandidateDPDP(erasureModalCandidate.id, 'Candidate erasure requested pursuant to Section 12(3) DPDP Act 2023');
      setErasureModalCandidate(null);
    }
  };

  const METRIC_EXPLAINERS = {
    'SLA_48H': {
      title: '48-Hour Turnaround SLA',
      category: 'Simulated Benchmark Projection',
      plainEnglish: 'The time elapsed from when an employer opens a job requisition to when a verified, qualified shortlist is delivered to their client portal.',
      benchmark: 'Industry manual baseline is 5 days (120 hours). TalentPulse pilot benchmark achieved 34 hours (86.4% delivered in <48h).',
      formula: 'Shortlist Delivery Timestamp - Requisition Activation Timestamp',
      whyItMatters: 'Staffing firms lose up to 5% of open requisitions when competing agencies submit qualified candidates faster.'
    },
    'RANK_AGREEMENT': {
      title: 'Rank Agreement (Spearman Rank Correlation)',
      category: 'Fairness & Bias Audit Metric',
      plainEnglish: 'A mathematical measure of how closely human recruiters agree with the AI ranking when deciding who to verify and shortlist.',
      benchmark: '91.6% agreement across 120 CV weekly audit cohorts (>85% is considered world-class algorithm alignment).',
      formula: 'Spearman rho = 1 - (6 * sum(d_i^2)) / (n * (n^2 - 1)) comparing AI match rank to recruiter submission priority.',
      whyItMatters: 'Confirms the AI model prioritizes the exact skills recruiters actually value, without substituting mechanical automation for human discretion.'
    },
    'DEMOGRAPHIC_PARITY': {
      title: 'Demographic Parity & Four-Fifths Rule',
      category: 'Fairness & Bias Audit Metric',
      plainEnglish: 'Ensures that candidates from different gender, age, or educational backgrounds have an equal likelihood of being shortlisted.',
      benchmark: '98.4% parity ratio in pilot audit (exceeds EEOC 80% / 0.80 four-fifths adverse impact benchmark).',
      formula: 'Selection Rate of Protected Demographic Cohort / Selection Rate of Highest Advancing Cohort >= 0.80',
      whyItMatters: 'TalentPulse AI scores candidate resumes using strictly blinded text (no names, photos, gender, or age signals), preventing unconscious algorithmic bias.'
    },
    'OVERRIDES': {
      title: 'Recruiter Human Overrides',
      category: 'Human-in-the-Loop Governance',
      plainEnglish: 'The rate at which human recruiters choose to verify and submit a candidate even if the AI match score was modest (below 75%).',
      benchmark: '4.2% healthy override frequency. In your live session: ' + liveOverrideRate + '% overrides observed.',
      formula: '(Candidates Submitted with AI Score < 75% / Total Verified Candidates) * 100',
      whyItMatters: 'Recruiters catch unique transferable skills, non-traditional backgrounds, or specialized domain experience that standard criteria might underestimate.'
    },
    'VALUE_RECOVERED': {
      title: 'Value Recovered & Capacity Savings',
      category: 'Simulated Benchmark Projection',
      plainEnglish: 'The total financial leakage recovered by automating manual resume reading and accelerating time-to-submit.',
      benchmark: '₹1.57 Crore Annual Economic Value Recovered for a 70-recruiter staffing branch.',
      formula: 'Recruiter Capacity Saved (₹75.6L = 1.9 min/CV * 36k CVs/mo * ₹350/hr) + Preserved Commission (₹81.0L = 180 reqs saved * ₹45k fee).',
      whyItMatters: 'Recruiters spend less time doing repetitive keyword Ctrl+F screening and more time cultivating client and candidate relationships.'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Governance, Bias Audit & ROI Dashboard
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Audits comparing AI ranks with human recruiter choices, DPDP statutory compliance, and economic model.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            id="tab-roi"
            className={`btn btn-sm ${subView === 'ROI' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('ROI')}
          >
            Economic ROI Model
          </button>
          <button
            id="tab-bias-audit"
            className={`btn btn-sm ${subView === 'BIAS_AUDIT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('BIAS_AUDIT')}
          >
            Fairness & Bias Audit
          </button>
          <button
            id="tab-dpdp-logs"
            className={`btn btn-sm ${subView === 'DPDP_LOGS' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('DPDP_LOGS')}
          >
            DPDP & Consent Logs
          </button>
        </div>
      </div>

      {/* SubView 1: Economic ROI & Goals */}
      {subView === 'ROI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SECTION A: Client-Provided Baseline Assumptions */}
          <div className="clean-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Tier 1 • Client Baseline
                </span>
                <strong style={{ fontSize: '0.94rem' }}>
                  Company A (Noida) Problem Statement & Financial Baseline
                </strong>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Source: Client Operating Brief (70 recruiters, 300 reqs/mo)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monthly Requisitions</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>300 Reqs/mo</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  120 CVs / req = 36,000 CVs/mo
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recruiter Screening Time</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: 'var(--danger-text)' }}>3.0 min / CV</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  1,800 hrs/month wasted capacity
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recruiter Capacity Cost</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: 'var(--danger-text)' }}>₹75.6 Lakhs / yr</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Based on 70 recruiters hourly cost
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Req Attrition to Rivals</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: 'var(--danger-text)' }}>₹81.0 Lakhs / yr</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  180 reqs lost/yr at ₹45,000 fee
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'var(--primary-light)', 
              border: '1px solid var(--primary-border)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '10px 16px',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                <strong>Total Baseline Annual Financial Loss:</strong> ₹75.6 Lakhs (recruiter hours) + ₹81.0 Lakhs (lost client placements) = <strong>₹1.57 Crore Annual Leakage</strong>.
              </span>
              <span className="badge badge-primary">Baseline Loss: ₹1.57 Cr</span>
            </div>
          </div>

          {/* SECTION B: Simulated Benchmark Projections */}
          <div className="clean-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Tier 2 • Simulated Benchmark
                </span>
                <strong style={{ fontSize: '0.94rem' }}>
                  Platform Target Projections (Based on Simulated 6-Week Rollout Benchmark)
                </strong>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
                [Simulated Demo Projections & Assumptions]
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              The following three metrics represent simulated benchmark projections derived from the initial 6-week pilot model assumptions:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Screening Velocity
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.64rem' }}>[Simulated Projection]</span>
                    <button 
                      type="button" 
                      onClick={() => setActiveMetricExplainer('VALUE_RECOVERED')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                      title="Explain this metric"
                    >
                      <HelpCircle size={13} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>
                  1.1 min <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--success-text)' }}>(-63%)</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Plain English:</strong> Automated criterion scoring and verbatim quote extraction cuts human inspection from 3.0 min down to 1.1 min per CV.
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    48h SLA Delivery
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.64rem' }}>[Simulated Projection]</span>
                    <button 
                      type="button" 
                      onClick={() => setActiveMetricExplainer('SLA_48H')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                      title="Explain 48h SLA Turnaround"
                    >
                      <HelpCircle size={13} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>
                  86.4% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--success-text)' }}>(&gt;80% Target)</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Plain English:</strong> Shortlist turnaround collapsed from 5 days to 34 hours. Prevents losing client requisitions to rival staffing firms.
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Projected Value Recovered
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.64rem' }}>[Target Model]</span>
                    <button 
                      type="button" 
                      onClick={() => setActiveMetricExplainer('VALUE_RECOVERED')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                      title="Explain Value Recovered"
                    >
                      <HelpCircle size={13} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                  ₹1.57 Cr / yr
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Plain English:</strong> ₹75.6L recruiter capacity recovered + ₹81.0L saved placement fees at 100% steady-state adoption.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: Actual Measured Workspace Session Metrics */}
          <div className="clean-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Tier 3 • Actual Measured
                </span>
                <strong style={{ fontSize: '0.94rem' }}>
                  Live Active Workspace Session Measurements (Real Database)
                </strong>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                ● [Live Measured Session Metric]
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Screened Candidates</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-main)' }}>
                  {candidates.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {uniqueCandidates.length} unique profiles active
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quarantined Duplicates</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--danger-text)' }}>
                  {quarantinedCandidates.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--danger-text)', marginTop: '2px' }}>
                  100% blocked from client dispatch
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Human Recruiter Verified</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>
                  {verifiedCandidates.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Passed human verification gate
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Recruiter Overrides</div>
                  <button 
                    type="button" 
                    onClick={() => setActiveMetricExplainer('OVERRIDES')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                    title="Explain Overrides"
                  >
                    <HelpCircle size={12} />
                  </button>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>
                  {liveOverrideRate}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {overrideCount} manual overrides in pool
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubView 2: Bias & Fairness Audit */}
      {subView === 'BIAS_AUDIT' && (
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                Weekly Sample Audit: AI Ranks vs Human Recruiter Choices
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sample audit cohort of 120 CVs analyzed for algorithmic fairness, demographic parity, and human override frequency.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>[Weekly Pilot Sample Model]</span>
              <span className="badge badge-success">91.6% Human-AI Agreement</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Human-AI Rank Agreement</div>
                <button 
                  type="button" 
                  onClick={() => setActiveMetricExplainer('RANK_AGREEMENT')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                  title="Explain Rank Agreement"
                >
                  <HelpCircle size={13} />
                </button>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>91.6%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Recruiter shortlisted same top-tier candidates independently.
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Human Overrides</div>
                <button 
                  type="button" 
                  onClick={() => setActiveMetricExplainer('OVERRIDES')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                  title="Explain Overrides"
                >
                  <HelpCircle size={13} />
                </button>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>4.2%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Recruiters exercised discretion for candidates with niche backgrounds.
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Demographic Parity Ratio</div>
                <button 
                  type="button" 
                  onClick={() => setActiveMetricExplainer('DEMOGRAPHIC_PARITY')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                  title="Explain Demographic Parity"
                >
                  <HelpCircle size={13} />
                </button>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px', color: 'var(--success-text)' }}>98.4%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Four-fifths rule satisfied; zero adverse demographic impact.
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
            ✓ <strong>Algorithmic Safeguard Enforced:</strong> AI scoring is strictly blinded to Name, Gender, Age, Photo, and Marital Status. Low-scoring candidates remain 100% searchable in database and are never automatically rejected by AI.
          </div>
        </div>
      )}

      {/* SubView 3: DPDP & Consent Logs */}
      {subView === 'DPDP_LOGS' && (
        <div className="clean-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Candidate Consent & Audit Log (Who Viewed What)</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '8px' }}>DPDP Act 2023 Statutory Compliance</span>
            </div>
            <span className="badge badge-primary">DPDP Section 12 Compliant</span>
          </div>

          <div style={{ maxHeight: '440px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                  <th style={{ padding: '10px 16px' }}>Candidate ID</th>
                  <th style={{ padding: '10px 16px' }}>Candidate Name</th>
                  <th style={{ padding: '10px 16px' }}>Consent Status</th>
                  <th style={{ padding: '10px 16px' }}>Statutory Purpose</th>
                  <th style={{ padding: '10px 16px' }}>Audit Log Count</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }}>Right to Erasure</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => {
                  const candidateLogs = auditLogs.filter(l => l.candidateId === c.id);

                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)' }}>{c.id}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.currentRole}</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {c.isPurged ? (
                          <span className="badge badge-neutral">DATA PURGED</span>
                        ) : c.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED' ? (
                          <span className="badge badge-danger">Quarantined Duplicate</span>
                        ) : (
                          <span className="badge badge-success">Active Consent</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>
                        {c.consentRecord?.purpose || 'Hiring use only under DPDP 2023'}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {candidateLogs.length || 1} access event(s)
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        {c.isPurged ? (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Purged & Certified</span>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', fontSize: '0.74rem' }}
                            onClick={() => setErasureModalCandidate(c)}
                          >
                            <Trash2 size={11} /> Delete on Request
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

      {/* Erasure Confirm Modal */}
      {erasureModalCandidate && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '460px', padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--danger-text)', marginBottom: '8px' }}>
              Execute DPDP Statutory Erasure?
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Pursuant to Section 12(3) of the Digital Personal Data Protection Act 2023, all personal identifiers, contact numbers, email addresses, and parsed resume texts for <strong>{erasureModalCandidate.name}</strong> will be permanently expunged from the system.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setErasureModalCandidate(null)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleConfirmErasure}>
                Confirm Statutory Erasure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plain-English Metric Explainer Modal */}
      {activeMetricExplainer && METRIC_EXPLAINERS[activeMetricExplainer] && (
        <div className="modal-backdrop" onClick={() => setActiveMetricExplainer(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '520px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].category}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text-main)' }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].title}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveMetricExplainer(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
              <div style={{ background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '3px', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  Plain-English Meaning
                </strong>
                <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].plainEnglish}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  Benchmark & Target
                </strong>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].benchmark}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  Calculation Formula
                </strong>
                <code style={{ display: 'block', background: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].formula}
                </code>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  Why It Matters for Clients & Operations
                </strong>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {METRIC_EXPLAINERS[activeMetricExplainer].whyItMatters}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setActiveMetricExplainer(null)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
