// sampleData.js - TalentPulse AI Enterprise Recruitment & Fair Screening Engine
// Pre-seeded with Company A Noida client requisitions and sample candidates

export const INITIAL_REQUISITIONS = [
  {
    id: 'REQ-2026-891',
    title: 'Senior Java Developer',
    department: 'IT Services - Enterprise Banking Unit',
    clientName: 'Tata Consultancy Services / Global Banking Client',
    clientContact: 'Rajesh Mehra (VP Engineering)',
    clientEmail: 'rajesh.m@clientcorp.in',
    status: 'ACTIVE',
    openings: 4,
    createdDate: '2026-10-18',
    slaDeadline: '48 Hours (Turnaround SLA)',
    location: 'Noida (Sector 62) / Hybrid',
    budgetMinLPA: 18,
    budgetMaxLPA: 24,
    rawJD: `Job Title: Senior Java Developer
Client: Enterprise Banking Systems, Noida (Hybrid - 3 days in office)
Experience Required: 5 to 8 years
Notice Period: Up to 60 days (strictly enforced)
Location: Noida

Role Overview:
We are seeking an experienced Senior Java Developer to architect, build, and optimize high-throughput, mission-critical banking microservices.

Must-Have Technical Skills:
- Core Java 11/17 with deep knowledge of collections, multithreading, and memory profiling
- Spring Boot 2.7 / 3.x with Spring Cloud and Spring Security
- Production RESTful APIs and distributed Microservices architecture
- Relational databases (PostgreSQL/Oracle) with complex SQL optimization and JPA/Hibernate
- Hands-on experience with Apache Kafka or RabbitMQ event streaming

Good to Have:
- Docker, Kubernetes, AWS/Azure cloud deployments
- CI/CD pipelines (Jenkins / GitLab CI)
- TDD with JUnit 5 and Mockito

Key Responsibilities:
- Design and scale distributed microservices handling >10M daily transactions
- Conduct code reviews and enforce clean architecture patterns
- Optimize latency down to sub-100ms for core payment authorization flows`,
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
      targetCTCMaxLPA: 24,
      blindingRules: {
        maskName: true,
        maskGender: true,
        maskAge: true,
        maskPhoto: true,
        maskMaritalStatus: true,
        maskCollegeTier: false
      }
    }
  },
  {
    id: 'REQ-2026-742',
    title: 'KYC / AML Compliance Analyst',
    department: 'Banking Back-Office Operations',
    clientName: 'Standard Chartered Global Business Services, Noida',
    clientContact: 'Sunita Rao (Associate Director)',
    clientEmail: 'sunita.rao@scgbs.in',
    status: 'ACTIVE',
    openings: 6,
    createdDate: '2026-10-22',
    slaDeadline: '48 Hours',
    location: 'Noida (Sector 135) / On-site',
    budgetMinLPA: 6.5,
    budgetMaxLPA: 9.0,
    rawJD: `Role: KYC / AML Compliance Analyst
Location: Noida
Experience: 2 to 4 years in BFSI / Banking KYC operations
Notice Period: Immediate to 30 days
Key Skills: KYC remediation, PEP screening, Sanctions check, AML alerts monitoring, Advanced Excel (VLOOKUP, Pivot tables), World-Check, LexisNexis.`,
    scorecard: {
      mustHaveSkills: [
        { name: 'KYC & Customer Due Diligence (CDD)', weight: 30, required: true },
        { name: 'AML Alerts & Sanctions Screening', weight: 30, required: true },
        { name: 'Advanced MS Excel & Data Auditing', weight: 20, required: true },
        { name: 'Regulatory Reporting & Case Notes', weight: 10, required: false }
      ],
      experience: { min: 2, max: 4, weight: 5 },
      noticePeriodMaxDays: 30,
      noticeWeight: 5,
      targetCTCMaxLPA: 9.0,
      blindingRules: {
        maskName: true,
        maskGender: true,
        maskAge: true,
        maskPhoto: true,
        maskMaritalStatus: true,
        maskCollegeTier: false
      }
    }
  },
  {
    id: 'REQ-2026-615',
    title: 'Store Operations Area Manager',
    department: 'Retail & Quick Commerce',
    clientName: 'Reliance Retail / Smart Bazaar Northern Hub',
    clientContact: 'Manish Kapoor (Regional HR)',
    clientEmail: 'm.kapoor@relretail.in',
    status: 'ACTIVE',
    openings: 2,
    createdDate: '2026-10-25',
    slaDeadline: '48 Hours',
    location: 'Noida & Greater Noida NCR',
    budgetMinLPA: 12,
    budgetMaxLPA: 16,
    rawJD: `Role: Store Operations Area Manager
Location: Noida NCR
Experience: 4 to 7 years in Supermarket / FMCG Retail Operations
Notice Period: Up to 45 days
Key Skills: Store P&L Management, Shrinkage Control, Inventory Auditing, Workforce Rostering, Customer Escalations, ERP/SAP POS.`,
    scorecard: {
      mustHaveSkills: [
        { name: 'Store P&L & Revenue Target Achievement', weight: 30, required: true },
        { name: 'Shrinkage & Inventory Management', weight: 25, required: true },
        { name: 'Team Rostering & Store Staff Training', weight: 20, required: true },
        { name: 'SAP / POS Systems & Auditing', weight: 15, required: false }
      ],
      experience: { min: 4, max: 7, weight: 5 },
      noticePeriodMaxDays: 45,
      noticeWeight: 5,
      targetCTCMaxLPA: 16,
      blindingRules: {
        maskName: true,
        maskGender: true,
        maskAge: true,
        maskPhoto: true,
        maskMaritalStatus: true,
        maskCollegeTier: false
      }
    }
  }
];

export const INITIAL_CANDIDATES = [
  // --- Exact Sample Candidates from Prompt ---
  {
    id: 'CND-91022',
    name: 'Ritika Bansal',
    maskedName: 'Ritika B.',
    gender: 'Female', // BLINDED during scoring
    age: 29,          // BLINDED during scoring
    currentRole: 'Senior Java Developer',
    currentCompany: 'HCL Technologies',
    experienceYrs: 6.5,
    keySkills: ['Java 17', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Kafka', 'REST APIs'],
    noticeDays: 60,
    currentCTCLPA: 17.5,
    expectedCTCLPA: 21.0,
    location: 'Noida (Sector 128)',
    phone: '+91 98101 44521',
    maskedPhone: '+91 98101 •••••',
    email: 'ritika.bansal@devmail.com',
    maskedEmail: 'r•••••••@devmail.com',
    appliedReqId: 'REQ-2026-891',
    stage: 'Recruiter Verified', // Sourced, AI Screened, Recruiter Verified, Submitted to Client, Client Shortlisted, Interview Scheduled, Offered, Joined
    aiScore: 94,
    scoreBreakdown: {
      skillsMatch: 95,
      experienceMatch: 100,
      noticeMatch: 100,
      ctcMatch: 90
    },
    recruiterReviewed: true,
    recruiterReviewNotes: 'Exceptional hands-on Spring Boot 3 & Kafka experience in enterprise banking. Verified 60-day notice with resigning proof. Highly recommended for client submission.',
    recruiterReviewer: 'Sneha Verma (Senior Recruiter)',
    reviewedTimestamp: '2026-10-29 14:20 IST',
    clientDecision: 'SHORTLISTED', // NONE, SHORTLISTED, REJECTED, INTERVIEW_PROPOSED
    clientDecisionNotes: 'Impressive Kafka throughput experience. Candidate meets our transaction tier criteria.',
    interviewSlot: {
      date: '2026-11-06',
      time: '14:30 IST',
      round: 'Round 1 - Technical Architecture',
      mode: 'Microsoft Teams Video Link'
    },
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-28 09:15 IST',
      channel: 'OTP-verified Digital Candidate Form',
      purpose: 'Recruitment & Job Match only under DPDP Act 2023',
      retentionExpiry: '2027-10-28',
      ipAddress: '103.21.144.12'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Native Text)',
    evidenceLines: [
      {
        criterion: 'Core Java & Multi-threading',
        score: '100% Match',
        status: 'matched',
        quote: 'Designed concurrent execution pipelines using Java 17 CompletableFuture and custom thread pool executors, reducing queue latency by 42%.',
        lineRef: 'CV Page 1, Experience Line 28',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Spring Boot & Microservices',
        score: '98% Match',
        status: 'matched',
        quote: 'Architected and deployed 9 core banking microservices using Spring Boot 3.1 with OAuth2 JWT security and central API gateway.',
        lineRef: 'CV Page 1, Summary Line 14',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'REST APIs & Distributed Architecture',
        score: '92% Match',
        status: 'matched',
        quote: 'Maintained resilient REST APIs handling peak traffic of 18,000 req/sec with circuit-breaker patterns via Resilience4j.',
        lineRef: 'CV Page 2, Line 41',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'PostgreSQL / Oracle / Hibernate',
        score: '90% Match',
        status: 'matched',
        quote: 'Authored complex PostgreSQL stored procedures and tuned Hibernate 2nd-level Ehcache, slashing DB CPU consumption by 35%.',
        lineRef: 'CV Page 2, Line 53',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Kafka / Event Streaming',
        score: '95% Match',
        status: 'matched',
        quote: 'Built real-time event-driven ledger streaming topics with Apache Kafka consumer groups processing 12M events daily.',
        lineRef: 'CV Page 2, Line 62',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Experience (5 to 8 yrs required)',
        score: 'Full Fit (6.5 yrs)',
        status: 'matched',
        quote: 'Total 6.5 years continuous experience in IT Services backend development (Aug 2019 – Present) with HCL and Tech Mahindra.',
        lineRef: 'CV Page 1, Timeline Line 9',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Full Fit (60 days)',
        status: 'matched',
        quote: 'Notice period: 60 days official. Resignation tendered on Oct 15; final release date confirmed for Dec 14.',
        lineRef: 'CV Page 1, Header Line 6',
        sentiment: 'Strong Positive'
      }
    ],
    fullCVText: `RITIKA BANSAL
Noida, Uttar Pradesh, India | ritika.bansal@devmail.com | +91 98101 44521 | LinkedIn: in/ritika-bansal-java
Total Experience: 6.5 Years | Official Notice Period: 60 Days (Serving notice, LWD: 14-Dec-2026)
Current Location: Noida Sector 128 | Preferred: Noida / Delhi NCR

PROFESSIONAL SUMMARY
Senior Java Backend Developer with 6.5 years of expertise in architecting, developing, and deploying resilient microservices in the fintech and enterprise banking sectors. Proficient in Java 11/17, Spring Boot 3.x, Spring Cloud, PostgreSQL, and Apache Kafka. Proven track record of optimizing high-throughput distributed systems handling 18K+ req/sec.

CORE TECHNICAL SKILLS
- Languages: Java 8/11/17, SQL
- Frameworks: Spring Boot, Spring Cloud, Spring Data JPA, Spring Security, Hibernate
- Architecture: Microservices, RESTful APIs, Event-Driven Architecture, CQRS
- Databases: PostgreSQL, Oracle 19c, Redis Cache
- Messaging: Apache Kafka, RabbitMQ
- DevOps & Tools: Docker, Kubernetes, Git, Jenkins, Maven, Postman, SonarQube

WORK EXPERIENCE

HCL Technologies, Noida — Senior Java Developer
October 2021 – Present (3.1 Years)
- Architected and deployed 9 core banking microservices using Spring Boot 3.1 with OAuth2 JWT security and central API gateway.
- Designed concurrent execution pipelines using Java 17 CompletableFuture and custom thread pool executors, reducing queue latency by 42%.
- Maintained resilient REST APIs handling peak traffic of 18,000 req/sec with circuit-breaker patterns via Resilience4j.
- Authored complex PostgreSQL stored procedures and tuned Hibernate 2nd-level Ehcache, slashing DB CPU consumption by 35%.
- Built real-time event-driven ledger streaming topics with Apache Kafka consumer groups processing 12M events daily.
- Led weekly sprint planning and mentored 4 junior developers on clean code and SOLID principles.

Tech Mahindra, Noida — Software Engineer
August 2019 – September 2021 (2.2 Years)
- Developed RESTful web services for payment gateway reconciliation module using Spring Boot and Oracle database.
- Implemented unit testing using JUnit 5 and Mockito, raising code coverage from 62% to 88%.
- Integrated Redis cache for frequently queried account balances, improving read throughput by 3x.

Wipro Technologies, Greater Noida — Associate Software Engineer
February 2018 – July 2019 (1.2 Years)
- Assisted in bug fixing, legacy Java 8 code refactoring, and SOAP-to-REST endpoint migration.

EDUCATION
- B.Tech in Computer Science & Engineering, APJ Abdul Kalam Technical University (2014 – 2018) — First Class with Distinction (78%)

CERTIFICATIONS
- Oracle Certified Professional: Java SE 11 Developer (OCP)
- AWS Certified Developer – Associate (2025)`
  },

  {
    id: 'CND-91047',
    name: 'Arjun Rawat',
    maskedName: 'Arjun R.',
    gender: 'Male',   // BLINDED
    age: 26,          // BLINDED
    currentRole: 'KYC Analyst',
    currentCompany: 'Genpact India, Noida',
    experienceYrs: 3.0,
    keySkills: ['KYC', 'AML checks', 'Sanctions Screening', 'Excel Modeling', 'Customer Due Diligence'],
    noticeDays: 30,
    currentCTCLPA: 6.2,
    expectedCTCLPA: 7.5,
    location: 'Noida (Sector 63)',
    phone: '+91 97118 39201',
    maskedPhone: '+91 97118 •••••',
    email: 'arjun.rawat@finops.org',
    maskedEmail: 'a•••••••@finops.org',
    appliedReqId: 'REQ-2026-891', // Also matched against KYC REQ-2026-742
    stage: 'AI Screened',
    aiScore: 32, // For Java role. Note: AI will not auto-reject, keeps visible with clear explanation
    scoreBreakdown: {
      skillsMatch: 15,
      experienceMatch: 40,
      noticeMatch: 100,
      ctcMatch: 100
    },
    recruiterReviewed: false,
    recruiterReviewNotes: '',
    recruiterReviewer: null,
    reviewedTimestamp: null,
    clientDecision: 'NONE',
    clientDecisionNotes: '',
    interviewSlot: null,
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-27 11:40 IST',
      channel: 'Recruiter SMS Link Consent',
      purpose: 'Hiring use only under DPDP Act 2023',
      retentionExpiry: '2027-10-27',
      ipAddress: '49.36.12.88'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'DOCX (Parsed)',
    evidenceLines: [
      {
        criterion: 'Core Java & Multi-threading',
        score: '0% Match',
        status: 'missing',
        quote: 'No programming or Java development found in profile. Role is focused on financial crime compliance.',
        lineRef: 'Skills Section',
        sentiment: 'Missing Requirement'
      },
      {
        criterion: 'Spring Boot & Microservices',
        score: '0% Match',
        status: 'missing',
        quote: 'No framework or API engineering mentioned. Candidate specializes in AML screening tools (World-Check, LexisNexis).',
        lineRef: 'Tooling Section',
        sentiment: 'Missing Requirement'
      },
      {
        criterion: 'Experience (5 to 8 yrs required)',
        score: 'Under Limit (3.0 yrs)',
        status: 'warning',
        quote: 'Total 3.0 years in Genpact Banking Operations (June 2023 – Present). Requirement asks for minimum 5.0 years.',
        lineRef: 'CV Page 1, Header',
        sentiment: 'Experience Shortfall'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Full Fit (30 days)',
        status: 'matched',
        quote: 'Notice period: 30 days negotiable based on client onboarding schedule.',
        lineRef: 'CV Page 1, Line 8',
        sentiment: 'Positive'
      }
    ],
    fullCVText: `ARJUN RAWAT
Noida, UP | arjun.rawat@finops.org | +91 97118 39201
Experience: 3.0 Years | Notice Period: 30 Days | Expected CTC: 7.5 LPA

PROFILE SUMMARY
Results-driven KYC & AML Compliance Analyst with 3 years of hands-on experience in Tier-1 banking back-office operations. Expertise in Customer Due Diligence (CDD), Enhanced Due Diligence (EDD), Politically Exposed Persons (PEP) screening, and adverse media reviews.

SKILLS
- KYC Remediation, CDD/EDD Verification, AML Transaction Monitoring
- World-Check, LexisNexis, Dow Jones Risk & Compliance
- Advanced Excel: Pivot Tables, VLOOKUP, INDEX/MATCH, Macro automation
- Case management documentation & Regulatory audit trails

EXPERIENCE
Genpact India, Noida — KYC Analyst (June 2023 – Present)
- Conducted end-to-end KYC reviews for 450+ corporate and institutional banking clients.
- Investigated PEP and sanctions alerts generated via automated screening tools.
- Maintained 99.4% quality compliance rating across quarterly internal audits.

EDUCATION
B.Com (Honours), Delhi University (2019 – 2022)`
  },

  {
    id: 'CND-91088',
    name: 'Pooja Nair',
    maskedName: 'Pooja N.',
    gender: 'Female', // BLINDED
    age: 27,          // BLINDED
    currentRole: 'Java Developer',
    currentCompany: 'Infosys Limited, Pune / Delhi NCR',
    experienceYrs: 4.0,
    keySkills: ['Java 8/11', 'Hibernate', 'REST APIs', 'Spring Core', 'MySQL'],
    noticeDays: 90,
    currentCTCLPA: 9.8,
    expectedCTCLPA: 13.0,
    location: 'Delhi NCR (Gurgaon / Noida)',
    phone: '+91 99203 11849',
    maskedPhone: '+91 99203 •••••',
    email: 'pooja.nair@javanet.in',
    maskedEmail: 'p••••••@javanet.in',
    appliedReqId: 'REQ-2026-891',
    stage: 'AI Screened',
    aiScore: 68,
    scoreBreakdown: {
      skillsMatch: 75,
      experienceMatch: 80,
      noticeMatch: 40, // 90 days exceeds 60d limit!
      ctcMatch: 100
    },
    recruiterReviewed: false,
    recruiterReviewNotes: '',
    recruiterReviewer: null,
    reviewedTimestamp: null,
    clientDecision: 'NONE',
    clientDecisionNotes: '',
    interviewSlot: null,
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-29 16:05 IST',
      channel: 'Web Candidate Portal Checkbox',
      purpose: 'Recruitment & Job Match only under DPDP Act 2023',
      retentionExpiry: '2027-10-29',
      ipAddress: '182.73.19.45'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Native Text)',
    evidenceLines: [
      {
        criterion: 'Core Java & Multi-threading',
        score: '85% Match',
        status: 'matched',
        quote: 'Strong knowledge of Java 8/11 features including Streams, Lambdas, and ExecutorService implementations for async processing.',
        lineRef: 'CV Page 1, Technical Summary',
        sentiment: 'Positive'
      },
      {
        criterion: 'Spring Boot & Microservices',
        score: '70% Match',
        status: 'matched',
        quote: 'Maintained monolithic backend transitions into modular Spring Boot services with REST endpoints.',
        lineRef: 'CV Page 2, Experience Line 19',
        sentiment: 'Partial Fit'
      },
      {
        criterion: 'Experience (5 to 8 yrs required)',
        score: 'Near Limit (4.0 yrs)',
        status: 'warning',
        quote: '4.0 years of total software engineering experience (Nov 2022 – Present). Requirement is 5+ years.',
        lineRef: 'CV Page 1, Header',
        sentiment: 'Experience Gap (-1 yr)'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Exceeds Limit (90 days)',
        status: 'warning',
        quote: 'Notice period: 90 days as per standard Infosys policy. Buy-out subject to management approval.',
        lineRef: 'CV Page 1, Notice Line',
        sentiment: 'Notice Risk'
      }
    ],
    fullCVText: `POOJA NAIR
Delhi NCR | pooja.nair@javanet.in | +91 99203 11849
Total Experience: 4.0 Years | Notice Period: 90 Days (Infosys Standard)

SUMMARY
Java Software Engineer with 4 years experience in building enterprise REST web services, Spring Core applications, and Hibernate data models.

TECHNICAL SKILLS
Java 8/11, Spring Core, Spring Boot, Hibernate, REST APIs, MySQL, Git, Maven, JUnit.

EXPERIENCE
Infosys Limited — Systems Engineer / Java Developer (Nov 2022 – Present)
- Developed and maintained 14 REST endpoints for retail banking client customer portal.
- Implemented ORM mappings using Hibernate and Spring Data JPA.
- Wrote automated unit tests with JUnit 4 and Mockito.

EDUCATION
B.E. in Information Technology, Pune University (2018 – 2022) — 74%`
  },

  // --- Additional High-Caliber Sourced Candidates to complete the full 120-candidate pool context ---
  {
    id: 'CND-91104',
    name: 'Vikram Singhania',
    maskedName: 'Vikram S.',
    gender: 'Male', // BLINDED
    age: 31,        // BLINDED
    currentRole: 'Lead Backend Architect',
    currentCompany: 'Coforge Technologies, Greater Noida',
    experienceYrs: 7.8,
    keySkills: ['Java 17', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes'],
    noticeDays: 45,
    currentCTCLPA: 21.0,
    expectedCTCLPA: 23.5,
    location: 'Noida (Sector 144)',
    phone: '+91 98711 00293',
    maskedPhone: '+91 98711 •••••',
    email: 'vikram.singhania@cloudarch.io',
    maskedEmail: 'v••••••••@cloudarch.io',
    appliedReqId: 'REQ-2026-891',
    stage: 'Submitted to Client',
    aiScore: 96,
    scoreBreakdown: {
      skillsMatch: 98,
      experienceMatch: 95,
      noticeMatch: 100,
      ctcMatch: 92
    },
    recruiterReviewed: true,
    recruiterReviewNotes: 'Top tier architecture candidate. 7.8 yrs exp, 45d notice, currently leading a team of 6 engineers on core transaction systems.',
    recruiterReviewer: 'Sneha Verma (Senior Recruiter)',
    reviewedTimestamp: '2026-10-30 11:15 IST',
    clientDecision: 'INTERVIEW_PROPOSED',
    clientDecisionNotes: 'Strong leadership and Kafka architecture experience. Would like to meet him this Thursday.',
    interviewSlot: {
      date: '2026-11-05',
      time: '11:00 IST',
      round: 'Technical Architecture Round',
      mode: 'Microsoft Teams Link'
    },
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-25 10:00 IST',
      channel: 'OTP-verified Candidate Form',
      purpose: 'Recruitment & Job Match only under DPDP Act 2023',
      retentionExpiry: '2027-10-25',
      ipAddress: '103.25.10.4'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Native Text)',
    evidenceLines: [
      {
        criterion: 'Core Java & Multi-threading',
        score: '100% Match',
        status: 'matched',
        quote: 'Deep expertise in Java memory tuning (ZGC / G1GC), lock-free data structures, and high-performance multithreading.',
        lineRef: 'CV Page 1, Architecture Skills',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Spring Boot & Microservices',
        score: '96% Match',
        status: 'matched',
        quote: 'Designed event-driven microservices architecture using Spring Boot 3.x, Eureka, and resilient fallback configurations.',
        lineRef: 'CV Page 2, Coforge Project Experience',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Full Fit (45 days)',
        status: 'matched',
        quote: 'Official notice period 45 days, buyout ready if needed for immediate transition.',
        lineRef: 'CV Page 1, Header',
        sentiment: 'Positive'
      }
    ],
    fullCVText: `VIKRAM SINGHANIA
Noida, UP | vikram.singhania@cloudarch.io | +91 98711 00293
Experience: 7.8 Years | Notice: 45 Days | CTC: 23.5 LPA Expected

SUMMARY
Lead Backend Engineer with nearly 8 years architecting enterprise distributed microservices in Java 17 and Spring Boot.

EXPERIENCE
Coforge Technologies — Technical Lead (2022 – Present)
- Spearheaded migration of legacy banking application to Kafka-driven Spring Boot microservices on AWS EKS.
- Mentored junior engineers and instituted SonarQube automated quality gates.`
  },

  {
    id: 'CND-91119',
    name: 'Sneha Kulkarni',
    maskedName: 'Sneha K.',
    gender: 'Female', // BLINDED
    age: 28,          // BLINDED
    currentRole: 'Microservices Engineer',
    currentCompany: 'Nagarro Software, Gurgaon',
    experienceYrs: 5.2,
    keySkills: ['Spring Boot', 'Java 17', 'PostgreSQL', 'AWS', 'Microservices', 'REST APIs'],
    noticeDays: 30,
    currentCTCLPA: 16.0,
    expectedCTCLPA: 19.5,
    location: 'Noida / Greater Noida',
    phone: '+91 98112 88910',
    maskedPhone: '+91 98112 •••••',
    email: 'sneha.k@devconnect.co',
    maskedEmail: 's•••••@devconnect.co',
    appliedReqId: 'REQ-2026-891',
    stage: 'Recruiter Verified',
    aiScore: 91,
    scoreBreakdown: {
      skillsMatch: 92,
      experienceMatch: 90,
      noticeMatch: 100,
      ctcMatch: 95
    },
    recruiterReviewed: true,
    recruiterReviewNotes: 'Strong hands-on developer, 30 days notice is a major advantage for our client.',
    recruiterReviewer: 'Rahul Sharma (Technical Recruiter)',
    reviewedTimestamp: '2026-10-30 16:40 IST',
    clientDecision: 'SHORTLISTED',
    clientDecisionNotes: 'Great profile, 30 days notice fits our immediate project start date.',
    interviewSlot: null,
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-26 14:10 IST',
      channel: 'OTP-verified Candidate Form',
      purpose: 'Recruitment & Job Match only under DPDP Act 2023',
      retentionExpiry: '2027-10-26',
      ipAddress: '115.111.44.18'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Native Text)',
    evidenceLines: [
      {
        criterion: 'Core Java & Multi-threading',
        score: '90% Match',
        status: 'matched',
        quote: 'Engineered high-volume REST services using Java 17 and reactive Spring WebFlux pipelines.',
        lineRef: 'CV Page 1, Summary',
        sentiment: 'Positive'
      },
      {
        criterion: 'Spring Boot & Microservices',
        score: '94% Match',
        status: 'matched',
        quote: 'Extensive production experience building Spring Boot microservices with Spring Cloud Config and Consul service discovery.',
        lineRef: 'CV Page 1, Experience Line 14',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Full Fit (30 days)',
        status: 'matched',
        quote: 'Serving notice period with 30 days remaining until Last Working Day.',
        lineRef: 'CV Header',
        sentiment: 'Strong Positive'
      }
    ],
    fullCVText: `SNEHA KULKARNI
Noida NCR | sneha.k@devconnect.co | +91 98112 88910
Experience: 5.2 Years | Notice: 30 Days | Expected CTC: 19.5 LPA

TECHNICAL PROFILE
Proficient in Java 17, Spring Boot, Spring Cloud, PostgreSQL, and Docker containerization. 5.2 years of progressive engineering experience in high-growth IT services environments.`
  },

  {
    id: 'CND-91155',
    name: 'Devendra Choudhary',
    maskedName: 'Devendra C.',
    gender: 'Male', // BLINDED
    age: 28,        // BLINDED
    currentRole: 'Java Backend Developer',
    currentCompany: 'Birlasoft, Noida',
    experienceYrs: 5.0,
    keySkills: ['Core Java', 'Spring Boot', 'Oracle 19c', 'Jenkins', 'REST APIs'],
    noticeDays: 0, // Immediate Joiner!
    currentCTCLPA: 15.0,
    expectedCTCLPA: 18.5,
    location: 'Noida (Sector 59)',
    phone: '+91 98109 23114',
    maskedPhone: '+91 98109 •••••',
    email: 'devendra.c@techmail.in',
    maskedEmail: 'd•••••••@techmail.in',
    appliedReqId: 'REQ-2026-891',
    stage: 'Client Shortlisted',
    aiScore: 92,
    scoreBreakdown: {
      skillsMatch: 88,
      experienceMatch: 90,
      noticeMatch: 100, // Immediate joiner
      ctcMatch: 98
    },
    recruiterReviewed: true,
    recruiterReviewNotes: 'Immediate joiner with exact 5 years experience and within client budget ceiling.',
    recruiterReviewer: 'Sneha Verma (Senior Recruiter)',
    reviewedTimestamp: '2026-10-29 18:00 IST',
    clientDecision: 'SHORTLISTED',
    clientDecisionNotes: 'Immediate joiner status is urgent for our phase 2 delivery. Shortlisted.',
    interviewSlot: {
      date: '2026-11-04',
      time: '16:00 IST',
      round: 'Hiring Manager Discussion',
      mode: 'Microsoft Teams Link'
    },
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-24 15:30 IST',
      channel: 'OTP-verified Candidate Form',
      purpose: 'Hiring use only under DPDP Act 2023',
      retentionExpiry: '2027-10-24',
      ipAddress: '122.160.10.99'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Native Text)',
    evidenceLines: [
      {
        criterion: 'Spring Boot & Microservices',
        score: '88% Match',
        status: 'matched',
        quote: 'Developed scalable microservices in Spring Boot with Oracle DB backend and Hibernate caching.',
        lineRef: 'CV Page 1, Birlasoft Project',
        sentiment: 'Positive'
      },
      {
        criterion: 'Notice Period (<= 60 days)',
        score: 'Immediate Joiner (0 days)',
        status: 'matched',
        quote: 'Immediate Joiner; relieved from prior company on 20-Oct-2026 with clean relieving letter.',
        lineRef: 'CV Header Line 4',
        sentiment: 'Strong Positive'
      }
    ],
    fullCVText: `DEVENDRA CHOUDHARY
Noida Sector 59 | devendra.c@techmail.in | +91 98109 23114
Total Experience: 5.0 Years | Notice Period: Immediate Joiner (Relieved) | Expected CTC: 18.5 LPA

SUMMARY
Java Software Engineer with 5.0 years experience delivering financial transaction systems. Immediate joining readiness.`
  },

  // --- Duplicate Detection Demonstration Profile ---
  {
    id: 'CND-91210',
    name: 'Ritika Bansal (Duplicate Upload via Agency 2)',
    maskedName: 'Ritika B. (Duplicate Match)',
    gender: 'Female', // BLINDED
    age: 29,          // BLINDED
    currentRole: 'Senior Java Developer',
    currentCompany: 'HCL Technologies',
    experienceYrs: 6.5,
    keySkills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
    noticeDays: 60,
    currentCTCLPA: 17.5,
    expectedCTCLPA: 21.0,
    location: 'Noida',
    phone: '+91 98101 44521',
    maskedPhone: '+91 98101 •••••',
    email: 'ritika.bansal@devmail.com',
    maskedEmail: 'r•••••••@devmail.com',
    appliedReqId: 'REQ-2026-891',
    stage: 'Sourced',
    aiScore: 94,
    scoreBreakdown: {
      skillsMatch: 95,
      experienceMatch: 100,
      noticeMatch: 100,
      ctcMatch: 90
    },
    recruiterReviewed: false,
    recruiterReviewNotes: '',
    recruiterReviewer: null,
    reviewedTimestamp: null,
    clientDecision: 'NONE',
    clientDecisionNotes: '',
    interviewSlot: null,
    consentRecord: {
      status: 'FLAGGED_DUPLICATE',
      consentDate: '2026-10-31 09:00 IST',
      channel: 'Third-party vendor submission',
      purpose: 'Flagged: Duplicate Profile of CND-91022',
      retentionExpiry: '2027-10-31',
      ipAddress: '103.44.20.1'
    },
    duplicateStatus: 'EXACT_DUPLICATE_FLAGGED',
    duplicateDetails: 'Duplicate of CND-91022 detected! Matching Phone (+91 98101 44521) and Email (ritika.bansal@devmail.com). Originally uploaded 3 days ago by Sneha Verma.',
    cvFormat: 'DOCX (Vendor Format)',
    evidenceLines: [
      {
        criterion: 'Duplicate Detection',
        score: '100% Identity Match',
        status: 'warning',
        quote: 'Exact identity match with existing candidate CND-91022 in internal database. System blocked redundant recruiter outreach.',
        lineRef: 'Identity Verification Engine',
        sentiment: 'Duplicate Alert'
      }
    ],
    fullCVText: `RITIKA BANSAL
Vendor Resubmission CV — Identical profile details to CND-91022.`
  },

  // --- Banking KYC Candidates for REQ-2026-742 ---
  {
    id: 'CND-91301',
    name: 'Priyanka Sen',
    maskedName: 'Priyanka S.',
    gender: 'Female', // BLINDED
    age: 26,          // BLINDED
    currentRole: 'Senior KYC Compliance Analyst',
    currentCompany: 'HSBC Operations, Noida',
    experienceYrs: 3.5,
    keySkills: ['KYC', 'AML checks', 'Sanctions Screening', 'Excel Modeling', 'World-Check'],
    noticeDays: 15,
    currentCTCLPA: 7.2,
    expectedCTCLPA: 8.5,
    location: 'Noida (Sector 135)',
    phone: '+91 98188 90112',
    maskedPhone: '+91 98188 •••••',
    email: 'priyanka.sen@fincompliance.org',
    maskedEmail: 'p••••••••@fincompliance.org',
    appliedReqId: 'REQ-2026-742',
    stage: 'Recruiter Verified',
    aiScore: 95,
    scoreBreakdown: {
      skillsMatch: 96,
      experienceMatch: 95,
      noticeMatch: 100,
      ctcMatch: 95
    },
    recruiterReviewed: true,
    recruiterReviewNotes: 'Superb fit for Standard Chartered team. 3.5 yrs AML experience at HSBC.',
    recruiterReviewer: 'Priya Sharma (Senior Recruiter)',
    reviewedTimestamp: '2026-10-30 14:00 IST',
    clientDecision: 'SHORTLISTED',
    clientDecisionNotes: 'Strong CDD and Sanctions background.',
    interviewSlot: null,
    consentRecord: {
      status: 'VERIFIED_ACTIVE',
      consentDate: '2026-10-24 10:15 IST',
      channel: 'OTP-verified Candidate Form',
      purpose: 'Hiring use only under DPDP Act 2023',
      retentionExpiry: '2027-10-24',
      ipAddress: '103.11.89.2'
    },
    duplicateStatus: 'UNIQUE',
    cvFormat: 'PDF (Scanned OCR Processed)',
    evidenceLines: [
      {
        criterion: 'KYC & Customer Due Diligence (CDD)',
        score: '98% Match',
        status: 'matched',
        quote: 'Conducted Enhanced Due Diligence (EDD) for high-risk corporate accounts and foreign trusts at HSBC.',
        lineRef: 'CV Page 1, Experience',
        sentiment: 'Strong Positive'
      },
      {
        criterion: 'AML Alerts & Sanctions Screening',
        score: '95% Match',
        status: 'matched',
        quote: 'Processed daily OFAC and UN sanctions screening alerts using World-Check with zero regulatory misses.',
        lineRef: 'CV Page 1, Line 33',
        sentiment: 'Strong Positive'
      }
    ],
    fullCVText: `PRIYANKA SEN
Noida Sector 135 | priyanka.sen@fincompliance.org
Experience: 3.5 Years | Notice: 15 Days | CTC Expected: 8.5 LPA
Senior KYC Analyst with deep expertise in AML and CDD for multinational investment banking operations.`
  }
];

// Seed Audit Logs for DPDP Act 2023 Compliance
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-99101',
    timestamp: '2026-11-02 09:12:44 IST',
    actorName: 'Sneha Verma',
    actorRole: 'Recruiter',
    actorIP: '192.168.1.45 (Noida Office LAN)',
    candidateId: 'CND-91022',
    candidateName: 'Ritika Bansal',
    action: 'VIEWED_FULL_CV',
    details: 'Recruiter opened full unmasked CV text for pre-submission verification',
    complianceFlag: 'COMPLIANT_RECRUITER_PURPOSE'
  },
  {
    id: 'LOG-99102',
    timestamp: '2026-11-02 09:15:10 IST',
    actorName: 'Sneha Verma',
    actorRole: 'Recruiter',
    actorIP: '192.168.1.45',
    candidateId: 'CND-91022',
    candidateName: 'Ritika Bansal',
    action: 'MARKED_VERIFIED',
    details: 'Recruiter confirmed CV criteria match and added pitch notes',
    complianceFlag: 'COMPLIANT_RECRUITER_PURPOSE'
  },
  {
    id: 'LOG-99103',
    timestamp: '2026-11-02 09:44:20 IST',
    actorName: 'Sneha Verma',
    actorRole: 'Recruiter',
    actorIP: '192.168.1.45',
    candidateId: 'CND-91022',
    candidateName: 'Ritika Bansal',
    action: 'SUBMITTED_TO_CLIENT',
    details: 'Transferred candidate dossier to Client Portal with PII masking active',
    complianceFlag: 'COMPLIANT_PORTAL_TRANSFER'
  },
  {
    id: 'LOG-99104',
    timestamp: '2026-11-02 10:05:12 IST',
    actorName: 'Rajesh Mehra',
    actorRole: 'Client Hiring Manager',
    actorIP: '14.141.112.5 (Client VPN)',
    candidateId: 'CND-91022',
    candidateName: 'Ritika B. (Masked)',
    action: 'VIEWED_MASKED_PORTAL',
    details: 'Client viewed masked candidate profile and evidence quotes via secure client link',
    complianceFlag: 'COMPLIANT_CLIENT_MASKED'
  },
  {
    id: 'LOG-99105',
    timestamp: '2026-11-02 10:18:33 IST',
    actorName: 'Rajesh Mehra',
    actorRole: 'Client Hiring Manager',
    actorIP: '14.141.112.5',
    candidateId: 'CND-91022',
    candidateName: 'Ritika B. (Masked)',
    action: 'SHORTLISTED_CANDIDATE',
    details: 'Client marked candidate as Shortlisted and proposed interview slot',
    complianceFlag: 'COMPLIANT_CLIENT_ACTION'
  },
  {
    id: 'LOG-99106',
    timestamp: '2026-11-02 10:30:00 IST',
    actorName: 'System Security Engine',
    actorRole: 'Automated DPDP Daemon',
    actorIP: '10.0.0.1 (Localhost Engine)',
    candidateId: 'CND-91210',
    candidateName: 'Ritika Bansal (Duplicate)',
    action: 'DUPLICATE_QUARANTINED',
    details: 'Quarantined redundant vendor CV to prevent duplicate data propagation and candidate harassment',
    complianceFlag: 'COMPLIANT_DUPLICATE_SHIELD'
  }
];

// Delivery Head Weekly Audit Sample (AI Ranks vs Recruiter Choices)
export const WEEKLY_BIAS_AUDIT_DATA = [
  {
    week: 'Week 43 (Current)',
    totalAudited: 120,
    aiRecruiterAlignmentRate: 91.6, // 91.6% agreement
    blindScoringDemographicParity: 98.4,
    falsePositiveRate: 4.2, // AI scored high, recruiter found nuanced soft-skill gap
    falseNegativeRate: 4.2, // AI scored mid, recruiter found adjacent transferable skills
    recruiterOverrides: 5,
    avgTimePerCVScreening: '1.1 minutes (Down from 3.0 mins baseline)',
    slaComplianceRate: 86.4, // Shortlists delivered within 48h
    clientAcceptanceRate: 63.8 // Up from 45%
  },
  {
    week: 'Week 42',
    totalAudited: 120,
    aiRecruiterAlignmentRate: 89.2,
    blindScoringDemographicParity: 97.9,
    falsePositiveRate: 5.8,
    falseNegativeRate: 5.0,
    recruiterOverrides: 7,
    avgTimePerCVScreening: '1.2 minutes',
    slaComplianceRate: 84.1,
    clientAcceptanceRate: 61.5
  },
  {
    week: 'Week 41',
    totalAudited: 120,
    aiRecruiterAlignmentRate: 87.5,
    blindScoringDemographicParity: 98.1,
    falsePositiveRate: 6.7,
    falseNegativeRate: 5.8,
    recruiterOverrides: 9,
    avgTimePerCVScreening: '1.4 minutes',
    slaComplianceRate: 81.0,
    clientAcceptanceRate: 58.2
  }
];
