-- TalentPulse AI — Production PostgreSQL Database Schema
-- Compliance: Digital Personal Data Protection (DPDP) Act 2023 & Enterprise Staffing Governance
-- Architecture: Requisition-Isolated Multi-Client ATS & Fair Screening Engine

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CLIENTS & ORGANIZATIONAL UNITS
-- ============================================================================
CREATE TABLE clients (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    account_tier VARCHAR(50) DEFAULT 'ENTERPRISE',
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    portal_access_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_name ON clients(name);

-- ============================================================================
-- 2. REQUISITIONS (JOB OPENINGS)
-- ============================================================================
CREATE TABLE requisitions (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_HOLD', 'FILLED', 'CANCELLED')),
    openings INTEGER NOT NULL DEFAULT 1,
    budget_min_lpa NUMERIC(6,2),
    budget_max_lpa NUMERIC(6,2),
    target_experience_min NUMERIC(4,1) DEFAULT 0,
    target_experience_max NUMERIC(4,1) DEFAULT 20,
    target_notice_max_days INTEGER DEFAULT 60,
    sla_hours INTEGER DEFAULT 48,
    raw_jd_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requisitions_client_id ON requisitions(client_id);
CREATE INDEX idx_requisitions_status ON requisitions(status);

-- ============================================================================
-- 3. SCORECARD CRITERIA & WEIGHT BALANCING
-- ============================================================================
CREATE TABLE scorecard_criteria (
    id SERIAL PRIMARY KEY,
    requisition_id VARCHAR(64) NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    criterion_type VARCHAR(50) NOT NULL CHECK (criterion_type IN ('MUST_HAVE_SKILL', 'EXPERIENCE', 'NOTICE_PERIOD', 'CTC_FIT', 'GOOD_TO_HAVE')),
    criterion_name VARCHAR(255) NOT NULL,
    weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 100),
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_criteria_requisition_id ON scorecard_criteria(requisition_id);

-- View to validate total weights equal 100% per requisition
CREATE OR REPLACE VIEW v_requisition_scorecard_validation AS
SELECT 
    requisition_id,
    SUM(weight) AS total_weight,
    CASE WHEN SUM(weight) = 100 THEN TRUE ELSE FALSE END AS is_valid_100_percent
FROM scorecard_criteria
GROUP BY requisition_id;

-- ============================================================================
-- 4. CANDIDATES & DPDP IDENTIFIERS
-- ============================================================================
CREATE TABLE candidates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    masked_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),             -- Strictly blinded during automated AI scoring
    age INTEGER,                    -- Strictly blinded during automated AI scoring
    marital_status VARCHAR(50),     -- Strictly blinded during automated AI scoring
    current_role VARCHAR(255),
    current_company VARCHAR(255),
    experience_yrs NUMERIC(4,1) NOT NULL DEFAULT 0,
    notice_days INTEGER NOT NULL DEFAULT 30,
    current_ctc_lpa NUMERIC(6,2),
    expected_ctc_lpa NUMERIC(6,2),
    location VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    masked_phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    masked_email VARCHAR(255) NOT NULL,
    phone_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for duplicate interception
    email_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for duplicate interception
    applied_req_id VARCHAR(64) NOT NULL REFERENCES requisitions(id) ON DELETE RESTRICT,
    stage VARCHAR(50) NOT NULL DEFAULT 'Sourced' CHECK (
        stage IN (
            'Sourced', 
            'AI Screened', 
            'Recruiter Verified', 
            'Submitted to Client', 
            'Client Shortlisted', 
            'Interview Scheduled', 
            'Offered', 
            'Joined',
            'Rejected'
        )
    ),
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    recruiter_reviewed BOOLEAN DEFAULT FALSE,
    recruiter_review_notes TEXT,
    recruiter_reviewer VARCHAR(150),
    reviewed_timestamp TIMESTAMP WITH TIME ZONE,
    client_decision VARCHAR(50) DEFAULT 'NONE' CHECK (client_decision IN ('NONE', 'SHORTLISTED', 'REJECTED', 'INTERVIEW_PROPOSED')),
    client_decision_notes TEXT,
    duplicate_status VARCHAR(50) DEFAULT 'UNIQUE' CHECK (duplicate_status IN ('UNIQUE', 'EXACT_DUPLICATE_FLAGGED')),
    duplicate_details TEXT,
    cv_format VARCHAR(50) DEFAULT 'PDF',
    full_cv_text TEXT,
    is_purged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_applied_req ON candidates(applied_req_id);
CREATE INDEX idx_candidates_stage ON candidates(stage);
CREATE INDEX idx_candidates_phone_hash ON candidates(phone_hash);
CREATE INDEX idx_candidates_email_hash ON candidates(email_hash);
CREATE INDEX idx_candidates_duplicate_status ON candidates(duplicate_status);

-- ============================================================================
-- 5. CANDIDATE EVIDENCE LINES (VERIFIABLE CV QUOTES)
-- ============================================================================
CREATE TABLE candidate_evidence (
    id SERIAL PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    requisition_id VARCHAR(64) NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    criterion_name VARCHAR(255) NOT NULL,
    score_label VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('matched', 'warning', 'gap')),
    verbatim_quote TEXT NOT NULL,
    line_ref VARCHAR(150) NOT NULL,
    sentiment VARCHAR(50) DEFAULT 'Positive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_evidence_candidate_id ON candidate_evidence(candidate_id);

-- ============================================================================
-- 6. CLIENT INTERVIEW PROPOSALS
-- ============================================================================
CREATE TABLE interview_proposals (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    requisition_id VARCHAR(64) NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    proposed_date DATE NOT NULL,
    proposed_time VARCHAR(50) NOT NULL,
    duration VARCHAR(50) DEFAULT '45 mins',
    round_name VARCHAR(150) NOT NULL,
    meeting_mode VARCHAR(150) DEFAULT 'Microsoft Teams Video Link',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'CONFIRMED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED')),
    client_actor_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interview_proposals_candidate ON interview_proposals(candidate_id);

-- ============================================================================
-- 7. DPDP ACT 2023 CONSENT & RIGHT TO ERASURE RECORDS
-- ============================================================================
CREATE TABLE dpdp_consent_records (
    id SERIAL PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED_ACTIVE' CHECK (status IN ('VERIFIED_ACTIVE', 'FLAGGED_DUPLICATE', 'PURGED_ERASURE_REQUEST')),
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    channel VARCHAR(150) NOT NULL,
    purpose VARCHAR(255) NOT NULL DEFAULT 'Recruitment & Job Match only under DPDP Act 2023',
    retention_expiry_date DATE NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    erasure_date TIMESTAMP WITH TIME ZONE,
    erasure_reason TEXT,
    erasure_certificate_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dpdp_consent_candidate ON dpdp_consent_records(candidate_id);

-- ============================================================================
-- 8. STATUTORY AUDIT LOGS ("WHO VIEWED WHAT")
-- ============================================================================
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(100) NOT NULL CHECK (actor_role IN ('Recruiter', 'Client Hiring Manager', 'Delivery Head', 'Compliance Officer', 'System Engine')),
    actor_ip VARCHAR(45) NOT NULL,
    candidate_id VARCHAR(64),
    candidate_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    compliance_flag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_candidate ON audit_logs(candidate_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_name);

-- ============================================================================
-- 9. SEED DATA FOR DEMONSTRATION & VERIFICATION
-- ============================================================================
INSERT INTO clients (id, name, industry, contact_name, contact_email) VALUES
('CLT-TCS-01', 'Tata Consultancy Services / Global Banking Client', 'IT Services & BFSI', 'Rajesh Mehra', 'rajesh.m@clientcorp.in'),
('CLT-SCB-02', 'Standard Chartered Global Business Services', 'Banking & Financial Operations', 'Sunita Rao', 'sunita.rao@scgbs.in'),
('CLT-REL-03', 'Reliance Retail / Smart Bazaar Northern Hub', 'Retail & Quick Commerce', 'Manish Kapoor', 'm.kapoor@relretail.in');

INSERT INTO requisitions (id, client_id, title, department, location, status, openings, budget_min_lpa, budget_max_lpa, target_experience_min, target_experience_max, target_notice_max_days) VALUES
('REQ-2026-891', 'CLT-TCS-01', 'Senior Java Developer', 'IT Services - Enterprise Banking Unit', 'Noida (Sector 62)', 'ACTIVE', 4, 18.0, 24.0, 5.0, 8.0, 60),
('REQ-2026-742', 'CLT-SCB-02', 'KYC / AML Compliance Analyst', 'Banking Back-Office Operations', 'Noida (Sector 135)', 'ACTIVE', 6, 6.5, 9.0, 2.0, 4.0, 30),
('REQ-2026-615', 'CLT-REL-03', 'Store Operations Area Manager', 'Retail & Quick Commerce', 'Noida & Greater Noida NCR', 'ACTIVE', 2, 12.0, 16.0, 4.0, 7.0, 45);

INSERT INTO scorecard_criteria (requisition_id, criterion_type, criterion_name, weight, is_required) VALUES
('REQ-2026-891', 'MUST_HAVE_SKILL', 'Core Java & Multi-threading', 25, TRUE),
('REQ-2026-891', 'MUST_HAVE_SKILL', 'Spring Boot & Microservices', 25, TRUE),
('REQ-2026-891', 'MUST_HAVE_SKILL', 'REST APIs & Distributed Architecture', 15, TRUE),
('REQ-2026-891', 'MUST_HAVE_SKILL', 'PostgreSQL / Oracle / Hibernate', 10, TRUE),
('REQ-2026-891', 'GOOD_TO_HAVE', 'Kafka / Event Streaming', 10, FALSE),
('REQ-2026-891', 'EXPERIENCE', 'Experience (5 to 8 yrs)', 10, TRUE),
('REQ-2026-891', 'NOTICE_PERIOD', 'Notice Period (<= 60 days)', 5, TRUE);
