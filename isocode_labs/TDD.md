# Technical Design Document (TDD)
# TalentPulse AI — Enterprise Recruitment & Fair Screening Engine

**Version:** 2.4.0  
**Target Enterprise:** Company A, Noida (120 staff, 70 recruiters, ₹40–50 Cr annual revenue)  
**Primary Focus Sectors:** IT Services, Banking Back-Office (BFSI), Retail & Quick Commerce Operations  
**Compliance Standard:** Digital Personal Data Protection (DPDP) Act 2023 (Sections 4, 7, 11, and 12)  

---

## 1. Problem Statement & Financial Impact Baseline

### 1.1 The Operational Bottleneck
Company A manages approximately **300 active job requisitions per month**. For each requisition, recruiters receive an average of **120 CVs**, totaling **36,000 resumes processed monthly**.
1. **Screening Inefficiency:** Manual review requires **3.0 minutes per CV** across 70 recruiters. This consumes **1,800 hours/month** in manual screening, representing an annual recruiter capacity loss of **₹75.6 Lakhs**.
2. **Turnaround Latency & Requisition Attrition:** The average shortlist turnaround time is **5 business days**. This latency results in **5% of requisitions (180 reqs/year)** being lost to competing staffing agencies who submit candidates within 48 hours. At an average placement fee of **₹45,000 per closed position**, this causes an annual revenue loss of **₹81.0 Lakhs**.
3. **Total Annual Value Leakage:** **₹1.57 Crore / year** (₹75.6L recruiter capacity + ₹81.0L lost placement fees).

### 1.2 Target Success Metrics
- **Screening Velocity:** Reduce manual review time by **60%** (target: < 1.2 min/CV).
- **Turnaround SLA:** Submit client shortlists within **48 hours** for at least **80%** of open requisitions.
- **Client Candidate Acceptance:** Increase shortlist acceptance rate from **45% to > 60%** via verifiable candidate evidence.
- **Statutory DPDP Act 2023 Compliance:** Zero non-consensual processing, 100% PII masking in client reviews, full access audit trails, and automated right-to-erasure execution.

---

## 2. System Architecture & Component Diagram

```
+-----------------------------------------------------------------------------------+
|                                 USER WORKSPACE                                    |
|                                                                                   |
|  +--------------------+   +----------------------+   +-------------------------+  |
|  | Recruiter Console  |   | Client Review Portal |   | Delivery Head Dashboard |  |
|  | (Screening/Verify) |   | (Compare/Interview)  |   | (Bias & ROI Governance) |  |
|  +---------+----------+   +----------+-----------+   +------------+------------+  |
+------------|-------------------------|----------------------------|---------------+
             |                         |                            |
             +-------------------------+----------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                        FRONTEND APPLICATION (React 19 + Vite 8)                   |
|                                                                                   |
|  - JDScorecardView: Criterion weighting, strict 100% validation, auto-balance     |
|  - BulkUploadView: Local file parsing, per-file status queue, OCR retry, CSV logs |
|  - RankedCandidatesView: Blinded scoring, criterion point breakdown, CV quotes   |
|  - RecruiterVerifyModal: Enforced human verification gate before client dispatch  |
|  - ClientPortalView: Strict client isolation, side-by-side compare, slot booking |
|  - PipelineKanbanView: 8-stage drag & drop, transition guardrails, duplicate vault|
|  - DPDPComplianceView: Consent lifecycle, "who viewed what" audit logs, erasure   |
+--------------------------------------|--------------------------------------------+
                                       | Reverse Proxy (/api -> :3001)
                                       v
+-----------------------------------------------------------------------------------+
|                        BACKEND REST API (Express Node.js)                         |
|                                                                                   |
|  - GET  /api/health                     - GET  /api/requisitions                  |
|  - PUT  /api/requisitions/:id/scorecard - GET  /api/candidates                    |
|  - POST /api/candidates/sync            - POST /api/candidates/:id/verify         |
|  - POST /api/candidates/:id/stage       - POST /api/candidates/:id/client-decision|
|  - POST /api/candidates/:id/erase       - GET  /api/audit-logs                    |
+--------------------------------------|--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                       DATA PERSISTENCE & SCHEMAS                                  |
|                                                                                   |
|  - Development / Demo: Atomic JSON Store (backend/db.json)                        |
|  - Enterprise Production: PostgreSQL (backend/schema.sql)                         |
|    * Requisitions, Scorecards, Candidates, Evidence Lines, Proposals, DPDP Logs   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Functional Modules

### 3.1 Job Description Scorecard & Weight Balancer (`JDScorecardView.jsx`)
- **Criterion Extraction:** Automatically extracts Must-Have technical skills, required experience ranges, notice period limits, and budget thresholds from raw job specifications.
- **Strict 100% Weight Validation:** Criteria weights must total exactly 100% before saving or recalculation. A real-time validation indicator alerts recruiters if weights deviate.
- **One-Click Auto-Balance:** Proportional algorithm adjusts all criteria weights to sum to exactly 100% without manual trial and error.
- **Demographic Blinding Rules:** Configures blinding toggles (Name, Gender, Age, Photo, Marital Status) to eliminate cognitive and algorithmic bias during AI ranking.

### 3.2 Bulk Resume Ingestion & Parsing Queue (`BulkUploadView.jsx`)
- **Native Computer File Picker & Drag-and-Drop:** Directly reads PDF, DOCX, DOC, and TXT files from the user's workstation.
- **Per-File Status Tracking:** Each resume displays a distinct ingestion status: `Parsed Successfully` (green), `Duplicate Quarantined` (amber), or `Failed / Corrupted` (red).
- **Secondary OCR Retry:** Failed scans or corrupted font encodings can be re-parsed using secondary OCR fallbacks.
- **Inspection Artifact Download:** Failed files allow recruiters to download debug traces and parser error logs.
- **CSV Ingestion Report Export:** Generates an audit-ready CSV file documenting all files ingested, timestamp, status, and matched IDs.

### 3.3 Ranked Candidate Evaluation & Verifiable CV Evidence (`RankedCandidatesView.jsx`)
- **Verbatim Evidence Quotes:** Every match score is substantiated by direct, verifiable quotes and precise page/line citations (e.g., *"CV Page 1, Experience Line 28"*).
- **Criterion Score Breakdown:** Displays point contributions across Skills Match, Experience Fit, Notice Period Fit, and CTC Fit.
- **Algorithmic Safety Rule (No Auto-Rejection):** AI never automatically rejects low-scoring candidates. Low scorers remain fully searchable and accessible for alternative requisitions.
- **Duplicate Interception Shield:** Candidates flagged as duplicates (`EXACT_DUPLICATE_FLAGGED`) have their "Submit to Client" buttons permanently disabled with a red warning badge.

### 3.4 Human-in-the-Loop Recruiter Verification Gate (`RecruiterVerifyModal.jsx`)
- **Statutory Mandate:** Platform rules strictly forbid unverified AI submissions.
- **Recruiter Pitch & Dossier Notes:** Recruiter must open the candidate's complete CV, verify claims, tender notice period verification notes, and sign off as a named reviewer.
- **Audit Logging:** Every verification action logs the recruiter's name, timestamp, and IP address to the statutory audit ledger.

### 3.5 Requisition-Isolated Client Review Portal (`ClientPortalView.jsx`)
- **Strict Client Requisition Isolation:** Only candidates who have been formally reviewed by a recruiter and moved to `Submitted to Client` (or subsequent stages) for that specific requisition are visible. Quarantined duplicates and unsubmitted candidates are strictly hidden.
- **Automatic PII Masking:** Names are converted to initial format (e.g. *Ritika B.*), and telephone numbers/emails are masked (e.g. *+91 98101 •••••*, *r•••••••@devmail.com*) to protect candidate privacy and agency commercial interests.
- **Feature 1 (Side-by-Side Candidate Comparison):** Clients can select 2 to 3 candidates and evaluate them across Score, Experience, Notice Period, Expected CTC, and verifiable CV quotes.
- **Feature 2 (Structured Interview Slot Proposal):** Clients can propose interview date, time, duration (30/45/60 min), interview round, and video meeting mode directly.
- **Feature 3 (Resume Preview & Evidence Drawer):** Masked profile preview with full CV text and categorized evidence quotes.
- **Feature 4 (Structured Rejection Taxonomy):** Captures structured feedback (Skill mismatch, Insufficient experience, CTC mismatch, Notice period too long, Other) to improve future matching.
- **Feature 5 (Candidate Pipeline Stepper):** Visual progress tracker (Submitted ➔ Shortlisted ➔ Interview Scheduled ➔ Offered ➔ Joined).

### 3.6 Requisition Hiring Pipeline Kanban Board (`PipelineKanbanView.jsx`)
- **8 Distinct Stages:** `Sourced`, `AI Screened`, `Recruiter Verified`, `Submitted to Client`, `Client Shortlisted`, `Interview Scheduled`, `Offered`, `Joined`.
- **Duplicate Candidate Isolation:** Quarantined duplicate profiles are completely excluded from active kanban board columns to prevent accidental progression.
- **Quarantined Vault Inspector:** A dedicated quarantine vault lets delivery heads inspect duplicate profiles, phone/email matching hashes, and vendor resubmission details.
- **Transition Guardrails:** Enforces transition validation rules. Unverified candidates cannot be dragged into client-facing stages.

### 3.7 Delivery Head Governance & Three-Tier ROI Dashboard (`DeliveryHeadDashboard.jsx`)
To maintain complete audit transparency, metrics are categorized into three explicit tiers:
1. **Tier 1 • Client Baseline Assumptions:** Documents Company A's starting operational brief (300 reqs/mo, 120 CVs/req, 3.0 min/CV = 1,800 hrs/mo ➔ ₹75.6L/yr capacity loss; 5-day delay = 180 lost reqs ➔ ₹81.0L/yr revenue loss; ₹1.57 Cr total loss).
2. **Tier 2 • Simulated Benchmark Projections:** Explicitly labeled `[Simulated Benchmark Projections]` reflecting 6-week target pilot assumptions (1.1 min/CV screening velocity, 86.4% 48h SLA delivery, ₹1.57 Cr annual value recovered).
3. **Tier 3 • Actual Measured Session Data:** Real-time counters calculated dynamically from the active local database (Total Screened Candidates, Quarantined Duplicates, Recruiter Verified Count, and 100% Demographic Parity Score).

### 3.8 DPDP Act 2023 Statutory Compliance Suite (`DPDPComplianceView.jsx`)
- **Section 4 & 7 (Purpose Limitation):** Consent records document that candidate personal data is collected and processed strictly for *"Recruitment & Job Match only under DPDP Act 2023"*.
- **Section 11 ("Who Viewed What" Access Ledger):** Immutable audit log capturing Actor Name, Role, IP Address, Candidate ID, Action Type, and Timestamp for every profile view, download, or edit.
- **Section 12(3) (Right to Erasure):** Delivery heads and compliance officers can execute permanent data erasure upon candidate request. Contact details, names, and CV texts are permanently expunged, and a cryptographic statutory erasure certificate is generated.

---

## 4. PostgreSQL Database Schema Architecture (`backend/schema.sql`)

The enterprise relational schema is partitioned into 8 core tables:
1. `clients`: Multi-tenant organization records.
2. `requisitions`: Job openings tied to specific clients, with SLA targets and budget ranges.
3. `scorecard_criteria`: Weighted criteria per requisition, validated by view `v_requisition_scorecard_validation`.
4. `candidates`: Candidate profiles with cryptographic SHA-256 hashes (`phone_hash`, `email_hash`) for duplicate interception, stages, and PII masking.
5. `candidate_evidence`: Direct CV quotes, status flags, and line references.
6. `interview_proposals`: Client interview proposals with meeting mode and round details.
7. `dpdp_consent_records`: Statutory consent tracking, retention expiry, and erasure certification.
8. `audit_logs`: Comprehensive audit ledger of all user and system actions.

---

## 5. Security, PII Masking & Data Isolation Policies

| Role | Name Visibility | Phone/Email Visibility | Full CV Text | Client Decision Access | DPDP Erasure Rights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Recruiter** | Full Legal Name | Full Phone & Email | Full Unmasked CV | Read-only | Verification Notes |
| **Client Hiring Manager** | Masked (*Ritika B.*) | Masked (*•••••*) | Masked CV | Shortlist / Propose / Reject | None |
| **Delivery Head** | Full / Blinded Toggle | Full / Masked Toggle | Full CV | Complete Oversight | Execute Erasure |
| **Quarantined Profile** | Isolated | SHA-256 Hashed | Isolated in Vault | Blocked from Dispatch | Right to Erasure |

---

## 6. Verification & Test Plan

1. **Duplicate Quarantine Verification:**
   - Confirm candidate `CND-91210` displays the "Quarantined Duplicate" badge.
   - Confirm `CND-91210` does NOT appear in the active Sourced kanban column or Client Portal.
   - Confirm the "Submit to Client" button is disabled for `CND-91210`.
2. **Client Portal Isolation Verification:**
   - Confirm that only candidates with stages in `['Submitted to Client', 'Client Shortlisted', 'Interview Scheduled', 'Offered', 'Joined']` appear in the client view.
   - Confirm unreviewed candidates and quarantined duplicates never appear.
3. **Scorecard Weight Validation:**
   - Adjust skill weights to non-100% total; verify that save is prevented.
   - Click "Auto-Balance" and verify weights normalize to exactly 100%.
4. **Transition Guardrail Verification:**
   - Drag an unreviewed candidate into `Submitted to Client`; verify transition is blocked with a human-in-the-loop warning toast.
   - Verify that drag-and-drop moves persist to `backend/db.json` via `/api/candidates/:id/stage`.
5. **DPDP Right to Erasure:**
   - Execute deletion on request for a candidate; verify contact data and CV text are replaced with `[DATA PURGED UNDER DPDP ACT 2023]`, and a statutory certificate is issued.
