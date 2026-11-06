// JDScorecardView.jsx - Minimalist Job Description & Scorecard View
// Features: Dynamic AI Extraction, Strict 100% Weight Validation, Live Progress Indicator, One-Click Auto-Balance
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  ArrowRight,
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle,
  Scale,
  RefreshCw,
  FileText
} from 'lucide-react';
import { extractScorecardFromJD } from '../utils/aiEngine';

export default function JDScorecardView({ 
  currentReq, 
  onUpdateScorecard, 
  onNavigateToUpload, 
  onRecalculateScores 
}) {
  // Read current JD directly from state; synchronize when active requisition changes
  const [rawJDText, setRawJDText] = useState(currentReq?.rawJD || '');
  const [scorecard, setScorecard] = useState(currentReq?.scorecard || {
    mustHaveSkills: [],
    experience: { min: 2, max: 5, weight: 10 },
    noticePeriodMaxDays: 30,
    noticeWeight: 5,
    targetCTCMaxLPA: 20
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [extractSuccess, setExtractSuccess] = useState(null);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Keep state synchronized if requisition changes
  useEffect(() => {
    if (currentReq) {
      setRawJDText(currentReq.rawJD || '');
      setScorecard(currentReq.scorecard);
      setExtractError(null);
      setExtractSuccess(null);
    }
  }, [currentReq?.id]);

  // Calculate Total Weight across Skills + Experience + Notice
  const skillsWeightSum = (scorecard?.mustHaveSkills || []).reduce((acc, s) => acc + (Number(s.weight) || 0), 0);
  const expWeight = Number(scorecard?.experience?.weight) || 10;
  const noticeWeight = Number(scorecard?.noticeWeight) || 5;
  const totalWeight = skillsWeightSum + expWeight + noticeWeight;
  const isWeightValid = totalWeight === 100;

  // Auto-Extract Scorecard from the latest raw JD
  const handleExtract = async () => {
    if (isExtracting) return; // Prevent simultaneous extraction requests
    setExtractError(null);
    setExtractSuccess(null);

    const latestText = (rawJDText || '').trim();
    if (!latestText) {
      setExtractError('Please paste or type a valid Job Description in the textarea before extracting.');
      return;
    }

    setIsExtracting(true);

    try {
      // 1. Send latest JD to AI Extraction backend API
      const res = await fetch('/api/scorecard/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText: latestText,
          reqId: currentReq?.id
        })
      });

      const data = await res.json();

      if (data.success && data.scorecard) {
        // Completely replace old criteria with the new extracted criteria
        setScorecard(data.scorecard);
        setExtractSuccess(
          `Extracted ${data.scorecard.mustHaveSkills.length} criteria successfully! ` +
          `Experience: ${data.scorecard.experience.min}–${data.scorecard.experience.max} yrs, ` +
          `Notice: ${data.scorecard.noticePeriodMaxDays} days. Weights balanced to 100%.`
        );
        setTimeout(() => setExtractSuccess(null), 5000);
      } else {
        throw new Error(data.message || 'API did not return valid extracted criteria.');
      }
    } catch (err) {
      console.warn('Backend extract offline or failed, falling back to client AI extractor:', err.message);
      // Fallback: Client-side AI extraction engine
      try {
        const extracted = extractScorecardFromJD(latestText, scorecard);
        setScorecard(extracted);
        setExtractSuccess(
          `Extracted ${extracted.mustHaveSkills.length} criteria successfully! ` +
          `Experience: ${extracted.experience.min}–${extracted.experience.max} yrs, ` +
          `Notice: ${extracted.noticePeriodMaxDays} days. Weights balanced to 100%.`
        );
        setTimeout(() => setExtractSuccess(null), 5000);
      } catch (fallbackErr) {
        setExtractError(fallbackErr.message || 'Failed to extract criteria from the provided text.');
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setScorecard(prev => ({
      ...prev,
      mustHaveSkills: [
        ...prev.mustHaveSkills,
        { name: newSkill.trim(), weight: 15, required: true }
      ]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (idx) => {
    setScorecard(prev => ({
      ...prev,
      mustHaveSkills: prev.mustHaveSkills.filter((_, i) => i !== idx)
    }));
  };

  const handleSkillWeightChange = (idx, newWeight) => {
    const val = Math.max(0, parseInt(newWeight, 10) || 0);
    setScorecard(prev => {
      const updated = [...prev.mustHaveSkills];
      updated[idx].weight = val;
      return { ...prev, mustHaveSkills: updated };
    });
  };

  // One-click Auto-Balance to normalize all weights to exactly 100%
  const handleAutoBalanceWeights = () => {
    if (!scorecard.mustHaveSkills || scorecard.mustHaveSkills.length === 0) return;
    const targetSkillTotal = 100 - expWeight - noticeWeight; // Usually 85%
    const currentSkillsSum = scorecard.mustHaveSkills.reduce((acc, s) => acc + (s.weight || 0), 0);

    if (currentSkillsSum === 0) {
      const equalShare = Math.floor(targetSkillTotal / scorecard.mustHaveSkills.length);
      const remainder = targetSkillTotal % scorecard.mustHaveSkills.length;
      const updated = scorecard.mustHaveSkills.map((s, i) => ({
        ...s,
        weight: equalShare + (i === 0 ? remainder : 0)
      }));
      setScorecard(prev => ({ ...prev, mustHaveSkills: updated }));
      return;
    }

    // Proportionally scale
    let allocated = 0;
    const updated = scorecard.mustHaveSkills.map((s, i) => {
      if (i === scorecard.mustHaveSkills.length - 1) {
        return { ...s, weight: targetSkillTotal - allocated };
      }
      const scaled = Math.round((s.weight / currentSkillsSum) * targetSkillTotal);
      allocated += scaled;
      return { ...s, weight: scaled };
    });

    setScorecard(prev => ({ ...prev, mustHaveSkills: updated }));
  };

  // Save updated scorecard and recalculate candidate scores
  const handleSave = () => {
    if (!isWeightValid) {
      alert(`Weights must total exactly 100% before saving. Currently at ${totalWeight}%. Click "Auto-Balance" to adjust automatically.`);
      return;
    }
    // Pass latest scorecard and rawJD to parent
    onUpdateScorecard(scorecard, rawJDText);
    // Explicitly pass scorecard to avoid any stale closure
    onRecalculateScores(scorecard);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Job Description & Scorecard ({currentReq?.id})
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Paste any JD on the left and click Auto-Extract. AI parses requirements, notice, and experience into balanced criteria.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="btn-ai-extract"
            className="btn btn-secondary btn-sm"
            onClick={handleExtract}
            disabled={isExtracting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isExtracting ? (
              <>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Auto-Extracting with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} color="var(--primary)" />
                <span>Auto-Extract with AI</span>
              </>
            )}
          </button>

          <button
            id="btn-save-scorecard"
            className={`btn btn-sm ${isWeightValid ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleSave}
            disabled={!isWeightValid || isExtracting}
            title={isWeightValid ? 'Save scorecard and re-score candidates' : `Weights must total 100% (currently ${totalWeight}%)`}
          >
            <CheckCircle2 size={13} />
            {saved ? 'Saved & Pool Scored!' : 'Save & Re-Score'}
          </button>
        </div>
      </div>

      {/* Extraction Notification Banners */}
      {extractError && (
        <div style={{
          background: 'var(--danger-light)',
          border: '1px solid var(--danger-border)',
          color: 'var(--danger-text)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{extractError}</span>
        </div>
      )}

      {extractSuccess && (
        <div style={{
          background: 'var(--success-light)',
          border: '1px solid var(--success-border)',
          color: 'var(--success-text)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{extractSuccess}</span>
        </div>
      )}

      {/* Weight 100% Validation Banner */}
      <div style={{ 
        background: isWeightValid ? 'var(--success-light)' : 'var(--warning-light)',
        border: `1px solid ${isWeightValid ? 'var(--success-border)' : 'var(--warning-border)'}`,
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isWeightValid ? (
            <CheckCircle2 size={16} color="var(--success)" />
          ) : (
            <AlertTriangle size={16} color="var(--warning)" />
          )}
          <span>
            {isWeightValid ? (
              <strong style={{ color: 'var(--success-text)' }}>
                ✓ Weights Balanced: Exactly 100% (Technical Skills: {skillsWeightSum}%, Experience: {expWeight}%, Notice: {noticeWeight}%)
              </strong>
            ) : (
              <span style={{ color: 'var(--warning-text)' }}>
                <strong>Weight Validation Alert:</strong> Total is <strong>{totalWeight}%</strong> ({totalWeight < 100 ? `Need +${100 - totalWeight}% to reach 100%` : `Exceeds 100% by +${totalWeight - 100}%`}). All criterion weights must total exactly 100% to save.
              </span>
            )}
          </span>
        </div>

        {!isWeightValid && (
          <button
            id="btn-auto-balance-weights"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.74rem' }}
            onClick={handleAutoBalanceWeights}
          >
            <Scale size={12} />
            Auto-Balance to 100%
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '20px' }}>
        {/* Left: Raw JD Textarea */}
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Raw Job Description (Email, Document, or Text)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Editable input
            </span>
          </div>
          <textarea
            id="raw-jd-textarea"
            rows={16}
            value={rawJDText}
            onChange={(e) => setRawJDText(e.target.value)}
            placeholder="Paste your job description here, including title, must-have skills, experience, and notice period..."
            style={{
              width: '100%',
              flex: 1,
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: 1.5,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-app)',
              color: 'var(--text-main)',
              resize: 'vertical',
              minHeight: '340px'
            }}
          />
        </div>

        {/* Right: Editable Extracted Criteria & Weights */}
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                1. Technical Criteria & Weights
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Subtotal: {skillsWeightSum}% (Target: {100 - expWeight - noticeWeight}%)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scorecard.mustHaveSkills.map((s, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span style={{ fontWeight: 500, flex: 1 }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.weight}
                        onChange={(e) => handleSkillWeightChange(idx, e.target.value)}
                        style={{
                          width: '48px',
                          padding: '2px 4px',
                          textAlign: 'center',
                          borderRadius: '4px',
                          border: '1px solid var(--border-default)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>%</span>
                    </div>

                    <button
                      className="btn btn-secondary btn-icon-only btn-sm"
                      onClick={() => handleRemoveSkill(idx)}
                      title="Remove criterion"
                    >
                      <Trash2 size={12} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add skill row */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="+ Add requirement (e.g. AWS EKS, Redis)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                style={{
                  flex: 1,
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border-strong)',
                  background: 'transparent',
                  fontSize: '0.8rem'
                }}
              />
              <button className="btn btn-secondary btn-sm" onClick={handleAddSkill}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          {/* 2. Experience & Notice Ceiling Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Experience Range
                </label>
                <span className="badge badge-primary">{expWeight}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  id="input-exp-min"
                  type="number"
                  min="0"
                  max="30"
                  value={scorecard.experience?.min ?? 2}
                  onChange={(e) => {
                    const min = parseInt(e.target.value, 10) || 0;
                    setScorecard(prev => ({
                      ...prev,
                      experience: { ...prev.experience, min }
                    }));
                  }}
                  style={{
                    width: '52px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
                <input
                  id="input-exp-max"
                  type="number"
                  min="0"
                  max="30"
                  value={scorecard.experience?.max ?? 5}
                  onChange={(e) => {
                    const max = parseInt(e.target.value, 10) || 0;
                    setScorecard(prev => ({
                      ...prev,
                      experience: { ...prev.experience, max }
                    }));
                  }}
                  style={{
                    width: '52px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Years</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Notice Ceiling
                </label>
                <span className="badge badge-primary">{noticeWeight}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Up to</span>
                <input
                  id="input-notice-max"
                  type="number"
                  min="0"
                  max="180"
                  value={scorecard.noticePeriodMaxDays ?? 30}
                  onChange={(e) => {
                    const days = parseInt(e.target.value, 10) || 0;
                    setScorecard(prev => ({
                      ...prev,
                      noticePeriodMaxDays: days
                    }));
                  }}
                  style={{
                    width: '60px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Days</span>
              </div>
            </div>
          </div>

          {/* Zero-Bias Blinding Summary */}
          <div style={{ 
            background: 'var(--bg-subtle)', 
            padding: '10px 12px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-default)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '4px' }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>DPDP Zero-Bias Safeguards Active</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Personal data (name, gender, age, photo, college tier) are shielded from scoring algorithms under Section 8 DPDP Act.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
