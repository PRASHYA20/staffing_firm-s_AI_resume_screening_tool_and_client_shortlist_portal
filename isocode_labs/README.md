# TalentPulse AI — Enterprise Recruitment & Fair Screening Engine
**Client:** Company A, Noida (120 staff, 70 recruiters, ₹40–50 Cr annual revenue)  
**Compliance Standard:** Digital Personal Data Protection (DPDP) Act 2023  
**Technical Design Document:** [TDD.md](file:///c:/Users/prash/Downloads/isocode_labs/TDD.md)  
**Database Schema:** [backend/schema.sql](file:///c:/Users/prash/Downloads/isocode_labs/backend/schema.sql)  

---

## 📁 Repository Structure

```
isocode_labs/
├── backend/                       # 🖥️ Node.js + Express REST API Server
│   ├── server.js                  # REST API routes (/api/candidates, /api/requisitions, /api/audit-logs)
│   ├── seed.js                    # Database seed utility
│   ├── schema.sql                 # Production PostgreSQL enterprise relational schema
│   └── db.json                    # Persistent JSON store for local operation
│
├── frontend/                      # 🌐 React 19 + Vite 8 User Interface
│   ├── index.html                 # Single Page Application HTML entry
│   └── src/
│       ├── components/            # Clean, modular screen components
│       │   ├── HeaderNav.jsx              # Minimalist single-bar navigation & role toggle
│       │   ├── RankedCandidatesView.jsx   # AI ranked list with score breakdown & verbatim quotes
│       │   ├── BulkUploadView.jsx         # Local computer file picker, per-file status & retry
│       │   ├── JDScorecardView.jsx        # Criteria intake, 100% weight validation & auto-balance
│       │   ├── ClientPortalView.jsx       # Isolated client portal (Compare, Propose, Masked PII)
│       │   ├── PipelineKanbanView.jsx     # 8-stage visual board, guardrails & duplicate vault
│       │   ├── RecruiterVerifyModal.jsx   # Recruiter side-by-side human CV verification gate
│       │   ├── DPDPComplianceView.jsx     # Statutory consent logs, access ledger & right to erasure
│       │   └── DeliveryHeadDashboard.jsx  # Bias audit & 3-tier ROI suite (Baseline, Benchmark, Measured)
│       ├── data/
│       │   └── sampleData.js      # Pre-seeded IT, Banking & Retail candidate profiles
│       ├── utils/
│       │   └── aiEngine.js        # Scoring algorithms & SHA-256 duplicate hashing
│       ├── App.jsx                # Main frontend controller & state
│       ├── index.css              # Minimalist, restrained CSS design system
│       └── main.jsx               # React DOM entry
│
├── TDD.md                         # 📘 Comprehensive Technical Design Document
├── package.json                   # Project scripts and dependencies
└── vite.config.js                 # Configured with root: 'frontend' & API proxy
```

---

## 🚀 Quick Start Guide

### 1. Run the Backend API Server
```bash
npm run backend
# Listens on http://localhost:3001
# Health check: http://localhost:3001/api/health
```

### 2. Run the Frontend Dev Server
```bash
npm run dev
# Serves UI at http://localhost:5175/
# Proxies all /api/* requests to backend port 3001
```

### 3. Build for Production
```bash
npm run build
# Compiles React application into dist/ in ~2.8 seconds
```

---

## 🎯 Key Capabilities & Architectural Highlights

### 1. Candidate Ranking with Verifiable Evidence
- Scores are transparently decomposed across **Skills Match**, **Experience Fit**, **Notice Period Fit**, and **CTC Fit**.
- Match justifications feature direct, verbatim CV quotes with explicit document locations (e.g., *"CV Page 1, Experience Line 28"*).
- Zero algorithmic rejections: low-scoring candidates remain searchable and are never discarded automatically.

### 2. Bulk Resume Ingestion with Real-Time Queue
- Native computer file browser and drag-and-drop ingestion for PDF, DOCX, and TXT formats.
- Per-file parsing status queue showing `Parsed Successfully`, `Duplicate Quarantined`, or `Failed: Parse Error`.
- One-click secondary OCR retry for corrupted scans, debug file artifact downloads, and CSV ingestion audit export.

### 3. Duplicate Candidate Interception Shield
- Intercepts redundant submissions via phone and email hashing.
- Quarantined duplicate profiles (e.g., `CND-91210`) are strictly isolated in a secure vault, blocked from pipeline progression, and prevented from being dispatched to clients.

### 4. Human-in-the-Loop Recruiter Gate
- Recruiters must inspect the complete CV document, review criteria match justifications, and sign off with pitch notes before candidate submission.

### 5. Requisition-Isolated Client Review Portal
- **Strict Client Isolation:** Only candidates formally submitted to that specific client requisition are visible.
- **PII Masking:** Candidate names are shortened (*Ritika B.*) and contact details are masked (*+91 98101 •••••*) to protect candidate privacy and agency placement rights.
- **Side-by-Side Comparison:** Compare 2–3 candidates across score, experience, notice period, CTC, and quoted evidence.
- **Structured Interview Slot Proposal:** Propose interview date, time, duration (30/45/60 min), interview round, and meeting mode.
- **Structured Rejection Taxonomy:** Captures formal rejection reasons (Skill mismatch, Insufficient experience, CTC mismatch, Notice period too long).

### 6. Scorecard 100% Weight Balancer
- Enforces that criterion weights sum to exactly 100% before saving.
- One-click "Auto-Balance" algorithm proportionally scales weights to 100%.

### 7. Three-Tier ROI & Governance Dashboard
- **Tier 1 • Client Baseline Assumptions:** Documents Company A's operational baseline (300 reqs/mo, 120 CVs, 3.0 min/CV = 1,800 hrs/mo ➔ ₹75.6L/yr wasted recruiter capacity; 5-day delay = 180 lost reqs ➔ ₹81.0L/yr lost placement fees; ₹1.57 Cr total baseline loss).
- **Tier 2 • Simulated Benchmark Projections:** Explicitly labeled `[Simulated Benchmark Projections]` reflecting 6-week target pilot model (1.1 min/CV velocity, 86.4% 48h SLA delivery, ₹1.57 Cr annual value recovered).
- **Tier 3 • Actual Measured Session Data:** Real-time counters calculated dynamically from the active database.

### 8. DPDP Act 2023 Statutory Compliance
- **Purpose Limitation:** Digital consent records stating data is processed exclusively for recruitment purposes.
- **Who Viewed What Audit Ledger:** Comprehensive log capturing actor name, role, IP address, and timestamp for all access events.
- **Right to Erasure (Section 12(3)):** Instant permanent expungement of personal data with official Certificate of Erasure.
