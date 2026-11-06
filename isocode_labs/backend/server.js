// server/server.js - TalentPulse AI Express Backend Server
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractScorecardFromJD } from '../frontend/src/utils/aiEngine.js';
import { processClientAssistantQuery } from './clientAiAssistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initial Seed Data
const DB_FILE = path.join(__dirname, 'db.json');

// Predefined Demo Accounts for RBAC
const DEMO_USERS = {
  admin: {
    id: 'USR-ADM-001',
    role: 'admin',
    name: 'Dr. Vikram Malhotra',
    title: 'Head of Compliance & System Administrator',
    email: 'admin@talentpulse.ai',
    username: 'admin',
    password: 'admin123',
    organization: 'TalentPulse Staffing Solutions (Noida HQ)',
    portalName: 'Admin & Compliance Governance Portal',
    portalTag: 'DPDP Statutory Registry, Erasure & Audit Logs',
    avatar: 'VM',
    badgeText: 'Admin / Compliance Officer',
    themeColor: '#6366F1',
    defaultTab: 'dpdp-compliance',
    ip: '192.168.1.10 (Noida HQ Admin)'
  },
  delivery_head: {
    id: 'USR-DH-004',
    role: 'delivery-head',
    name: 'Arun Joshi',
    title: 'Head of Recruitment Delivery',
    email: 'delivery@talentpulse.ai',
    username: 'delivery',
    password: 'delivery123',
    organization: 'TalentPulse Staffing Solutions (Noida HQ)',
    portalName: 'Delivery Head Operations Portal',
    portalTag: 'SLA Tracking, Recruiter Performance & ROI Metrics',
    avatar: 'AJ',
    badgeText: 'Delivery Head',
    themeColor: '#8B5CF6',
    defaultTab: 'delivery-dashboard',
    ip: '192.168.1.12 (Delivery Ops)'
  },
  recruiter: {
    id: 'USR-REC-102',
    role: 'recruiter',
    name: 'Sneha Verma',
    title: 'Senior Technical Recruiter',
    email: 'recruiter@talentpulse.ai',
    username: 'recruiter',
    password: 'recruiter123',
    organization: 'TalentPulse IT Staffing Division',
    portalName: 'Recruiter Screening & Sourcing Portal',
    portalTag: 'AI Matchmaking & Human Verification Gate',
    avatar: 'SV',
    badgeText: 'Senior Recruiter',
    themeColor: '#0284C7',
    defaultTab: 'ranked-list',
    ip: '192.168.1.45 (Recruiter Workstation)'
  },
  client: {
    id: 'USR-CLI-205',
    role: 'client',
    name: 'Rajesh Mehra',
    title: 'VP Engineering & Hiring Manager',
    email: 'client@clientcorp.in',
    username: 'client',
    password: 'client123',
    organization: 'Tata Consultancy Services / Global Banking Client',
    portalName: 'Client Hiring Partner Shortlist Portal',
    portalTag: 'Masked Dossiers, Interview Slots & Direct Feedback',
    avatar: 'RM',
    badgeText: 'Client Hiring Partner',
    themeColor: '#059669',
    defaultTab: 'client-portal',
    ip: '14.141.112.5 (Client Corporate Gateway)'
  }
};

// Helper to load or initialize DB
function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Read from sampleData
    const sampleDataPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'sampleData.js');
    // If not exists yet, initialize defaults
    const initialDB = {
      requisitions: [
        {
          id: 'REQ-2026-891',
          title: 'Senior Java Developer',
          department: 'IT Services - Enterprise Banking Unit',
          clientName: 'Tata Consultancy Services / Global Banking Client',
          location: 'Noida (Sector 62)',
          scorecard: {
            mustHaveSkills: [
              { name: 'Core Java & Multi-threading', weight: 25, required: true },
              { name: 'Spring Boot & Microservices', weight: 25, required: true },
              { name: 'REST APIs & Distributed Architecture', weight: 15, required: true },
              { name: 'PostgreSQL / Oracle / Hibernate', weight: 10, required: true },
              { name: 'Kafka / Event Streaming', weight: 10, required: false }
            ],
            experience: { min: 5, max: 8, weight: 10 },
            noticePeriodMaxDays: 60,
            noticeWeight: 5,
            targetCTCMaxLPA: 24
          }
        }
      ],
      candidates: [],
      auditLogs: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'TalentPulse AI Recruitment Backend',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 1b. Auth Endpoints for Admin, Recruiter, Client
app.get('/api/auth/users', (req, res) => {
  const safeProfiles = Object.values(DEMO_USERS).map(({ password, ...u }) => u);
  res.json({ success: true, users: safeProfiles });
});

app.post('/api/auth/login', (req, res) => {
  const { role, identifier, password } = req.body;
  const normKey = (role || '').toLowerCase().replace(/-/g, '_');
  const account = DEMO_USERS[normKey] || Object.values(DEMO_USERS).find(a => a.role === role);

  if (!account) {
    return res.status(400).json({ success: false, message: `Invalid portal target: "${role}"` });
  }

  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Check if identifier matches another role's account
  const otherRoles = Object.values(DEMO_USERS).filter(a => a.role !== account.role);
  const matchedOther = otherRoles.find(a => 
    a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
  );
  if (matchedOther) {
    return res.status(403).json({
      success: false,
      message: `Access Denied: This account is registered for "${matchedOther.badgeText}". Please use the ${matchedOther.portalName}.`
    });
  }

  const isEmailMatch = cleanId === account.email.toLowerCase();
  const isUserMatch = cleanId === account.username.toLowerCase();

  if (!isEmailMatch && !isUserMatch) {
    return res.status(401).json({
      success: false,
      message: `Account not found for ${account.badgeText}. Please verify the entered email or username.`
    });
  }

  if (cleanPass !== account.password) {
    return res.status(401).json({
      success: false,
      message: `Incorrect password for ${account.badgeText}. Please check your credentials.`
    });
  }

  // Record audit log for compliant sign-in
  const db = getDB();
  const { password: _, ...safeUser } = account;
  const loginLog = {
    id: `LOG-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    actorName: account.name,
    actorRole: account.badgeText,
    actorIP: account.ip,
    candidateId: 'AUTH-GATEWAY',
    candidateName: 'System Session',
    action: 'AUTH_LOGIN_SUCCESS',
    details: `Authenticated user ${account.name} logged into ${account.portalName}`,
    complianceFlag: 'COMPLIANT_AUTH_GATE'
  };
  db.auditLogs.unshift(loginLog);
  saveDB(db);

  res.json({
    success: true,
    user: safeUser,
    token: `tpa_sess_${account.id}_${Date.now()}`,
    message: `Authenticated as ${account.name}`
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { user } = req.body;
  if (user) {
    const db = getDB();
    db.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actorName: user.name || 'User',
      actorRole: user.badgeText || user.role,
      actorIP: user.ip || '192.168.1.10',
      candidateId: 'AUTH-GATEWAY',
      candidateName: 'System Session',
      action: 'AUTH_LOGOUT',
      details: `User ${user.name || user.email} signed out of session.`,
      complianceFlag: 'COMPLIANT_AUTH_GATE'
    });
    saveDB(db);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// 2. Get All Requisitions
app.get('/api/requisitions', (req, res) => {
  const db = getDB();
  res.json({ success: true, requisitions: db.requisitions });
});

// 2b. Auto-Extract Scorecard Criteria from Raw JD with AI
app.post(['/api/scorecard/extract', '/api/extract-jd'], (req, res) => {
  const { jdText, rawJD, text, reqId } = req.body;
  const inputJD = jdText || rawJD || text;

  if (!inputJD || typeof inputJD !== 'string' || !inputJD.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid Job Description text to auto-extract criteria.'
    });
  }

  try {
    const db = getDB();
    const existingReq = reqId ? db.requisitions.find(r => r.id === reqId) : null;
    const existingScorecard = existingReq?.scorecard || {};

    const extractedScorecard = extractScorecardFromJD(inputJD, existingScorecard);

    return res.json({
      success: true,
      scorecard: extractedScorecard,
      extractedMeta: {
        skillsCount: extractedScorecard.mustHaveSkills.length,
        experience: extractedScorecard.experience,
        noticeDays: extractedScorecard.noticePeriodMaxDays,
        targetCTC: extractedScorecard.targetCTCMaxLPA
      },
      message: `Successfully extracted ${extractedScorecard.mustHaveSkills.length} criteria with balanced 100% weights.`
    });
  } catch (err) {
    console.error('[AI Extract Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: `Failed to extract criteria: ${err.message}`
    });
  }
});

// 3. Update Requisition Scorecard
app.put('/api/requisitions/:id/scorecard', (req, res) => {
  const db = getDB();
  const reqId = req.params.id;
  const { scorecard, rawJD } = req.body;

  const reqIndex = db.requisitions.findIndex(r => r.id === reqId);
  if (reqIndex !== -1) {
    db.requisitions[reqIndex].scorecard = scorecard;
    if (rawJD) {
      db.requisitions[reqIndex].rawJD = rawJD;
    }
    saveDB(db);
    return res.json({ success: true, message: 'Scorecard updated', scorecard, rawJD });
  }
  res.status(404).json({ success: false, message: 'Requisition not found' });
});

// 4. Get Candidates
app.get('/api/candidates', (req, res) => {
  const db = getDB();
  const { reqId } = req.query;
  let candidates = db.candidates;
  if (reqId) {
    candidates = candidates.filter(c => c.appliedReqId === reqId);
  }
  res.json({ success: true, count: candidates.length, candidates });
});

// 5. Ingest Candidates & Save
app.post('/api/candidates/sync', (req, res) => {
  const db = getDB();
  const { candidates } = req.body;
  if (Array.isArray(candidates)) {
    db.candidates = candidates;
    saveDB(db);
    return res.json({ success: true, count: candidates.length });
  }
  res.status(400).json({ success: false, message: 'Invalid payload' });
});

// 6. Recruiter Verification Gate
app.post('/api/candidates/:id/verify', (req, res) => {
  const db = getDB();
  const candId = req.params.id;
  const { pitchNotes, reviewer } = req.body;

  const cand = db.candidates.find(c => c.id === candId);
  if (cand) {
    cand.recruiterReviewed = true;
    cand.recruiterReviewNotes = pitchNotes;
    cand.recruiterReviewer = reviewer || 'Sneha Verma (Senior Recruiter)';
    cand.reviewedTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    
    // Log to audit trail
    db.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: cand.reviewedTimestamp,
      actorName: cand.recruiterReviewer,
      actorRole: 'Recruiter',
      actorIP: '192.168.1.45 (Noida HQ)',
      candidateId: candId,
      candidateName: cand.name,
      action: 'MARKED_VERIFIED',
      details: 'Recruiter confirmed CV criteria match and added pitch notes',
      complianceFlag: 'COMPLIANT_VERIFICATION'
    });

    saveDB(db);
    return res.json({ success: true, candidate: cand });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// 6b. Move Candidate Stage (with Validation Guardrails)
app.post('/api/candidates/:id/stage', (req, res) => {
  const db = getDB();
  const candId = req.params.id;
  const { stage, actorName } = req.body;

  const cand = db.candidates.find(c => c.id === candId);
  if (!cand) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }

  // Guardrail 1: Quarantined duplicate profiles can NEVER advance
  if (cand.duplicateStatus === 'EXACT_DUPLICATE_FLAGGED') {
    return res.status(400).json({ 
      success: false, 
      message: 'Quarantined candidate cannot be advanced in hiring pipeline.' 
    });
  }

  // Guardrail 2: Human-in-the-loop requirement
  const clientStages = ['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled', 'Offered', 'Joined'];
  if (clientStages.includes(stage) && !cand.recruiterReviewed) {
    return res.status(400).json({ 
      success: false, 
      message: 'Human-in-the-loop violation: Candidate must be verified by a recruiter before client submission.' 
    });
  }

  const prevStage = cand.stage;
  cand.stage = stage;

  db.auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    actorName: actorName || 'Sneha Verma (Senior Recruiter)',
    actorRole: 'Recruiter',
    actorIP: '192.168.1.45 (Noida HQ)',
    candidateId: candId,
    candidateName: cand.name,
    action: 'STAGE_UPDATED',
    details: `Candidate stage moved from ${prevStage} to ${stage}`,
    complianceFlag: 'COMPLIANT_PIPELINE_MOVE'
  });

  saveDB(db);
  return res.json({ success: true, candidate: cand });
});

// 7. Client Decision (Shortlist / Reject / Interview)
app.post('/api/candidates/:id/client-decision', (req, res) => {
  const db = getDB();
  const candId = req.params.id;
  const { decision, reason, interviewSlot } = req.body;

  const cand = db.candidates.find(c => c.id === candId);
  if (cand) {
    cand.clientDecision = decision;
    if (reason) cand.clientDecisionNotes = reason;
    if (interviewSlot) cand.interviewSlot = interviewSlot;

    if (decision === 'SHORTLISTED') cand.stage = 'Client Shortlisted';
    if (decision === 'INTERVIEW_PROPOSED') cand.stage = 'Interview Scheduled';

    db.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actorName: 'Rajesh Mehra (Client VP)',
      actorRole: 'Client Hiring Manager',
      actorIP: '14.141.112.5',
      candidateId: candId,
      candidateName: cand.maskedName,
      action: `CLIENT_${decision}`,
      details: `Client decision: ${decision} ${reason ? `(${reason})` : ''}`,
      complianceFlag: 'COMPLIANT_CLIENT_ACTION'
    });

    saveDB(db);
    return res.json({ success: true, candidate: cand });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// 8. DPDP Right to Erasure
app.post('/api/candidates/:id/erase', (req, res) => {
  const db = getDB();
  const candId = req.params.id;
  const { reason } = req.body;

  const cand = db.candidates.find(c => c.id === candId);
  if (cand) {
    cand.name = '[DATA PURGED UNDER DPDP ACT 2023]';
    cand.maskedName = '[PURGED]';
    cand.phone = '[PURGED]';
    cand.maskedPhone = '[PURGED]';
    cand.email = '[PURGED]';
    cand.maskedEmail = '[PURGED]';
    cand.fullCVText = 'CANDIDATE PERSONAL DATA PURGED PURSUANT TO SECTION 12(3) DPDP ACT 2023.';
    cand.isPurged = true;
    cand.consentRecord = {
      ...cand.consentRecord,
      status: 'PURGED_ERASURE_REQUEST',
      erasureDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      erasureReason: reason || 'Candidate request'
    };

    db.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: cand.consentRecord.erasureDate,
      actorName: 'Sneha Verma (DPDP Officer)',
      actorRole: 'Compliance Officer',
      actorIP: '192.168.1.45',
      candidateId: candId,
      candidateName: '[PURGED]',
      action: 'ERASURE_REQUEST_EXECUTED',
      details: `Data purged under DPDP Act 2023 Section 12(3). Certificate issued.`,
      complianceFlag: 'STATUTORY_ERASURE_COMPLETED'
    });

    saveDB(db);
    return res.json({ 
      success: true, 
      certificateId: `CERT-DEL-${Date.now().toString().slice(-6)}`,
      candidate: cand 
    });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// 9. Get Audit Logs
app.get('/api/audit-logs', (req, res) => {
  const db = getDB();
  res.json({ success: true, logs: db.auditLogs });
});

// 10. TalentPulse Client AI Assistant Endpoints
app.get('/api/client-ai/status', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    engine: process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash (Grounded in db.json)' : 'TalentPulse Hybrid Grounded Engine',
    piiMaskingActive: true,
    dpdpCompliant: true,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/client-ai/chat', async (req, res) => {
  try {
    const { message, query, clientSession, currentReqId, conversationHistory } = req.body;
    const q = message || query;
    const db = getDB();

    const result = await processClientAssistantQuery({
      query: q,
      clientSession,
      currentReqId,
      conversationHistory,
      db
    });

    // Record compliance audit log if user session provided
    if (clientSession && clientSession.name) {
      db.auditLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        actorName: clientSession.name,
        actorRole: clientSession.badgeText || 'Client Hiring Partner',
        actorIP: clientSession.ip || '14.141.112.5 (Client Corporate Gateway)',
        candidateId: 'CLIENT-AI-ASSISTANT',
        candidateName: 'Natural Language Query',
        action: 'AI_ASSISTANT_QUERY',
        details: `Client queried: "${(q || '').slice(0, 60)}..." [Engine: ${result.engine}]`,
        complianceFlag: 'COMPLIANT_QUERY_BOUNDED'
      });
      saveDB(db);
    }

    if (!result.success && result.statusCode) {
      return res.status(result.statusCode).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('[ClientAI] Error handling chat query:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error processing Client AI query.',
      message: err.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[TalentPulse API] Backend server listening on port ${PORT}`);
});
