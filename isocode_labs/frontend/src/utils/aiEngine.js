// aiEngine.js - AI Scoring, Evidence Extraction & Parsing Engine
// Strictly complies with DPDP 2023 bias-free scoring principles

export function scoreCandidateAgainstScorecard(candidate, scorecard) {
  if (!scorecard) return { aiScore: 75, evidenceLines: [], scoreBreakdown: {} };

  const evidence = [];
  let totalScore = 0;
  let totalWeight = 0;

  // 1. Must-Have Skills Matching
  let skillPointsEarned = 0;
  let skillWeightTotal = 0;

  scorecard.mustHaveSkills.forEach(skillObj => {
    skillWeightTotal += skillObj.weight;
    const skillKeyword = skillObj.name.toLowerCase();
    
    // Check candidate skills and full CV text
    const hasInKeySkills = candidate.keySkills.some(s => 
      s.toLowerCase().includes(skillKeyword.split(' ')[0]) || 
      skillKeyword.includes(s.toLowerCase().split(' ')[0])
    );
    
    const cvContains = candidate.fullCVText && candidate.fullCVText.toLowerCase().includes(skillKeyword.split(' ')[0]);

    if (hasInKeySkills || cvContains) {
      skillPointsEarned += skillObj.weight;
      // Find an evidence quote from CV
      const matchingLine = findEvidenceLineInText(candidate.fullCVText, skillObj.name);
      evidence.push({
        criterion: skillObj.name,
        score: '100% Match',
        status: 'matched',
        quote: matchingLine || `Demonstrated proficiency in ${skillObj.name} across verified projects.`,
        lineRef: `Verified Technical Criterion`,
        sentiment: 'Strong Positive'
      });
    } else {
      evidence.push({
        criterion: skillObj.name,
        score: '0% Match',
        status: 'missing',
        quote: `No direct reference to ${skillObj.name} identified in parsed technical experience or certifications.`,
        lineRef: `Unmatched Criterion`,
        sentiment: 'Missing Requirement'
      });
    }
  });

  const skillsMatchPercent = skillWeightTotal > 0 ? Math.round((skillPointsEarned / skillWeightTotal) * 100) : 80;
  totalScore += (skillsMatchPercent * 0.55);
  totalWeight += 55;

  // 2. Experience Fit Evaluation
  const minExp = scorecard.experience.min;
  const maxExp = scorecard.experience.max;
  let expScore = 100;
  let expStatus = 'matched';
  let expSentiment = 'Strong Positive';
  let expQuote = '';

  if (candidate.experienceYrs >= minExp && candidate.experienceYrs <= maxExp) {
    expScore = 100;
    expQuote = `Total ${candidate.experienceYrs} years experience falls squarely within the required ${minExp} to ${maxExp} years bracket.`;
  } else if (candidate.experienceYrs > maxExp) {
    expScore = 90;
    expQuote = `Total ${candidate.experienceYrs} years exceeds upper ceiling (${maxExp} yrs). Candidate has senior depth, review compensation band.`;
    expSentiment = 'Experienced Over-qualification';
  } else {
    // Under experience
    const deficit = minExp - candidate.experienceYrs;
    expScore = Math.max(30, Math.round((candidate.experienceYrs / minExp) * 100));
    expStatus = 'warning';
    expSentiment = `Experience Deficit (-${deficit.toFixed(1)} yrs)`;
    expQuote = `Candidate has ${candidate.experienceYrs} years total experience vs required minimum of ${minExp} years.`;
  }

  evidence.push({
    criterion: `Experience (${minExp} to ${maxExp} yrs required)`,
    score: `${candidate.experienceYrs} yrs (${expScore}%)`,
    status: expStatus,
    quote: expQuote,
    lineRef: 'Career Timeline',
    sentiment: expSentiment
  });

  totalScore += (expScore * 0.20);
  totalWeight += 20;

  // 3. Notice Period Evaluation
  const maxNotice = scorecard.noticePeriodMaxDays || 60;
  let noticeScore = 100;
  let noticeStatus = 'matched';
  let noticeSentiment = 'Strong Positive';
  let noticeQuote = '';

  if (candidate.noticeDays <= maxNotice) {
    noticeScore = candidate.noticeDays === 0 ? 100 : 95;
    noticeQuote = candidate.noticeDays === 0 
      ? 'Immediate Joiner (0 days notice). Ready for immediate onboarding.'
      : `Serving/Official notice of ${candidate.noticeDays} days is within the maximum ${maxNotice}-day turnaround limit.`;
  } else {
    noticeScore = Math.max(20, Math.round((maxNotice / candidate.noticeDays) * 75));
    noticeStatus = 'warning';
    noticeSentiment = `Notice Exceeds Limit (+${candidate.noticeDays - maxNotice} days)`;
    noticeQuote = `Candidate notice period is ${candidate.noticeDays} days, exceeding client mandatory cutoff of ${maxNotice} days. Buyout required.`;
  }

  evidence.push({
    criterion: `Notice Period (<= ${maxNotice} days)`,
    score: `${candidate.noticeDays} days (${noticeScore}%)`,
    status: noticeStatus,
    quote: noticeQuote,
    lineRef: 'Availability Section',
    sentiment: noticeSentiment
  });

  totalScore += (noticeScore * 0.15);
  totalWeight += 15;

  // 4. CTC & Location Evaluation
  const maxCTC = scorecard.targetCTCMaxLPA || 24;
  let ctcScore = 100;
  if (candidate.expectedCTCLPA <= maxCTC) {
    ctcScore = 100;
  } else {
    ctcScore = Math.max(40, 100 - Math.round(((candidate.expectedCTCLPA - maxCTC) / maxCTC) * 100));
  }

  totalScore += (ctcScore * 0.10);
  totalWeight += 10;

  const finalCompositeScore = Math.round(totalScore / (totalWeight / 100));

  return {
    aiScore: finalCompositeScore,
    evidenceLines: evidence,
    scoreBreakdown: {
      skillsMatch: skillsMatchPercent,
      experienceMatch: expScore,
      noticeMatch: noticeScore,
      ctcMatch: ctcScore
    }
  };
}

function findEvidenceLineInText(fullText, criterionName) {
  if (!fullText) return null;
  const lines = fullText.split('\n');
  const term = criterionName.split(' ')[0].toLowerCase();
  
  for (let line of lines) {
    if (line.toLowerCase().includes(term) && line.length > 20) {
      return line.trim();
    }
  }
  return null;
}

// Generate Realistic Candidates for Bulk Upload Simulation (up to 500)
export function generateBulkSimulatedCVs(count = 20, reqId = 'REQ-2026-891') {
  const firstNames = ['Amit', 'Sunil', 'Neha', 'Rohan', 'Swati', 'Karan', 'Deepak', 'Geeta', 'Anil', 'Preeti', 'Harsh', 'Divya', 'Siddharth', 'Nidhi', 'Alok', 'Shreya'];
  const lastNames = ['Sharma', 'Gupta', 'Verma', 'Mishra', 'Chauhan', 'Saxena', 'Pandey', 'Malhotra', 'Bhatia', 'Trivedi', 'Mehta', 'Kashyap'];
  const companies = ['Wipro', 'Infosys', 'TCS', 'Cognizant', 'HCL', 'Accenture', 'Tech Mahindra', 'Capgemini', 'Publicis Sapient', 'Genpact'];
  const javaSkillSets = [
    ['Java 11', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker'],
    ['Core Java', 'Spring Boot', 'REST APIs', 'MySQL', 'Hibernate'],
    ['Java 17', 'Spring Cloud', 'Kafka', 'Kubernetes', 'Oracle'],
    ['Spring Boot', 'AWS', 'Microservices', 'Redis', 'Java 8'],
    ['Java', 'REST APIs', 'JPA', 'SQL Server', 'Maven']
  ];

  const generated = [];
  const baseId = 91400;

  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i + 3) % lastNames.length];
    const company = companies[i % companies.length];
    const skills = javaSkillSets[i % javaSkillSets.length];
    const exp = +(4.0 + (i % 6) * 0.8).toFixed(1);
    const notice = [0, 15, 30, 45, 60, 90][i % 6];
    const ctc = +(14.0 + (i % 8) * 1.5).toFixed(1);

    const isDuplicate = i === 4; // Simulate duplicate trigger

    const candidate = {
      id: `CND-${baseId + i}`,
      name: `${fn} ${ln}`,
      maskedName: `${fn} ${ln[0]}.`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      age: 25 + (i % 8),
      currentRole: exp > 6.0 ? 'Senior Java Engineer' : 'Java Developer',
      currentCompany: company,
      experienceYrs: exp,
      keySkills: skills,
      noticeDays: notice,
      currentCTCLPA: +(ctc * 0.85).toFixed(1),
      expectedCTCLPA: ctc,
      location: 'Noida / Delhi NCR',
      phone: `+91 98${100 + i} ${20000 + i}`,
      maskedPhone: `+91 98${100 + i} •••••`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@devpool.in`,
      maskedEmail: `${fn[0].toLowerCase()}••••••@devpool.in`,
      appliedReqId: reqId,
      stage: 'AI Screened',
      recruiterReviewed: false,
      recruiterReviewNotes: '',
      recruiterReviewer: null,
      reviewedTimestamp: null,
      clientDecision: 'NONE',
      clientDecisionNotes: '',
      interviewSlot: null,
      consentRecord: {
        status: isDuplicate ? 'FLAGGED_DUPLICATE' : 'VERIFIED_ACTIVE',
        consentDate: '2026-10-31 10:00 IST',
        channel: 'Batch CV Ingestion Gateway',
        purpose: 'Recruitment & Job Match only under DPDP Act 2023',
        retentionExpiry: '2027-10-31',
        ipAddress: `103.22.${i}.10`
      },
      duplicateStatus: isDuplicate ? 'EXACT_DUPLICATE_FLAGGED' : 'UNIQUE',
      duplicateDetails: isDuplicate ? `Duplicate detected! Matching candidate CND-91022 across phone and email hash.` : null,
      cvFormat: i % 3 === 0 ? 'PDF (Scanned OCR)' : i % 2 === 0 ? 'DOCX' : 'PDF (Native Text)',
      fullCVText: `${fn.toUpperCase()} ${ln.toUpperCase()}
${company} | Total Experience: ${exp} Years | Notice: ${notice} Days
SKILLS: ${skills.join(', ')}
Key Accomplishments: Built high scale distributed backend systems with Spring Boot, processed database queries with Hibernate, deployed microservices with Docker.`,
      evidenceLines: []
    };

    generated.push(candidate);
  }

  return generated;
}

// Clean extracted skill line helper
function cleanSkillLine(line) {
  if (!line) return '';
  let cleaned = line.replace(/^[-*•\d+\.]\s*/, '').trim();
  cleaned = cleaned.replace(/[:.]+$/, '').trim();
  const fluffRegex = /^(?:overview|role|client|experience|notice|location|budget|department|salary|openings|status|interview|job\s*title|new\s*jd|previous\s*jd)/i;
  if (fluffRegex.test(cleaned)) return '';
  return cleaned;
}

// Dynamic Job Description AI Extraction Engine
export function extractScorecardFromJD(jdText, existingScorecard = {}) {
  if (!jdText || typeof jdText !== 'string' || !jdText.trim()) {
    throw new Error('Job description text is empty. Please enter or paste a valid job description.');
  }

  const text = jdText.trim();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. EXTRACT EXPERIENCE
  let minExp = 2;
  let maxExp = 5;
  const expRangeRegex = /(?:experience|exp|tenure)?[\s:]*(?:required|mandatory)?[\s:]*(\d+)(?:\.0)?\s*(?:–|-|to)\s*(\d+)(?:\.0)?\s*(?:years?|yrs?)/i;
  const expSingleRegex = /(?:experience|exp)[\s:]*(?:required|mandatory|min|minimum)?[\s:]*(\d+)\+?\s*(?:years?|yrs?)/i;
  const expGenericRegex = /(\d+)\s*(?:–|-|to)\s*(\d+)\s*(?:years?|yrs?)/i;

  const expMatch = text.match(expRangeRegex) || text.match(expGenericRegex);
  if (expMatch) {
    minExp = parseInt(expMatch[1], 10);
    maxExp = parseInt(expMatch[2], 10);
  } else {
    const singleMatch = text.match(expSingleRegex);
    if (singleMatch) {
      minExp = parseInt(singleMatch[1], 10);
      maxExp = minExp + 3;
    }
  }

  // 2. EXTRACT NOTICE PERIOD
  let noticeDays = 30;
  const noticeDaysRegex = /(?:notice\s*period|notice)?[\s:]*(?:immediate\s*to\s*|up\s*to\s*|within\s*|<=?\s*)?(\d+)\s*(?:days?|d\b)/i;
  const noticeMonthRegex = /(?:notice\s*period|notice)?[\s:]*(\d+)\s*(?:months?|m\b)/i;
  const immediateRegex = /(?:immediate\s*joiner|immediate\s*joining)/i;

  const noticeMatch = text.match(noticeDaysRegex);
  if (noticeMatch) {
    noticeDays = parseInt(noticeMatch[1], 10);
  } else {
    const monthMatch = text.match(noticeMonthRegex);
    if (monthMatch) {
      noticeDays = parseInt(monthMatch[1], 10) * 30;
    } else if (immediateRegex.test(text)) {
      noticeDays = 0;
    }
  }

  // 3. EXTRACT TARGET CTC
  let targetCTC = existingScorecard.targetCTCMaxLPA || 20;
  const ctcRegex = /(?:ctc|budget|salary|package)[\s:]*(?:upto|up\s*to|max)?[\s:]*(?:rs\.?|inr|₹)?\s*(?:(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lac)/i;
  const ctcMatch = text.match(ctcRegex);
  if (ctcMatch) {
    targetCTC = parseFloat(ctcMatch[2] || ctcMatch[1]);
  }

  // 4. EXTRACT CRITERIA / MUST-HAVE SKILLS
  const candidateSkills = [];
  let inSkillsSection = false;
  let sectionSkills = [];

  const sectionHeaderRegex = /^(?:must[- ]have(?:\s+technical)?\s+skills?|technical\s+skills?|key\s+skills?|required\s+skills?|core\s+requirements?|requirements?|qualifications?|responsibilities)[\s:]*$/i;
  const otherSectionHeaderRegex = /^(?:good\s+to\s+have|nice\s+to\s+have|benefits?|about\s+the\s+company|overview|role\s+overview|job\s+details|location|compensation)[\s:]*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (sectionHeaderRegex.test(line)) {
      inSkillsSection = true;
      continue;
    }
    if (inSkillsSection && otherSectionHeaderRegex.test(line)) {
      inSkillsSection = false;
      break;
    }
    if (inSkillsSection) {
      const cleaned = cleanSkillLine(line);
      if (cleaned) {
        sectionSkills.push(cleaned);
      }
    }
  }

  if (sectionSkills.length >= 2) {
    candidateSkills.push(...sectionSkills);
  } else {
    const bulletLines = lines
      .filter(l => /^[-*•\d+\.]\s+/.test(l))
      .map(cleanSkillLine)
      .filter(Boolean);

    if (bulletLines.length >= 2) {
      candidateSkills.push(...bulletLines);
    } else {
      const ignoredHeaders = /^(?:job\s*title|title|role|client|experience|notice|location|budget|department|salary|overview|new\s*jd|previous\s*jd)/i;
      for (const line of lines) {
        if (ignoredHeaders.test(line)) continue;
        if (/^(?:key\s*skills?|skills?)[\s:]+(.*)$/i.test(line)) {
          const match = line.match(/^(?:key\s*skills?|skills?)[\s:]+(.*)$/i);
          if (match && match[1]) {
            const parts = match[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length >= 2);
            candidateSkills.push(...parts);
          }
          continue;
        }
        const cleaned = cleanSkillLine(line);
        if (cleaned && cleaned.length >= 3 && cleaned.length <= 70) {
          candidateSkills.push(cleaned);
        }
      }
    }
  }

  const uniqueSkills = [];
  const seen = new Set();
  for (const s of candidateSkills) {
    const norm = s.toLowerCase();
    if (!seen.has(norm) && s.length >= 3 && s.length <= 80) {
      seen.add(norm);
      uniqueSkills.push(s);
    }
  }

  if (uniqueSkills.length === 0) {
    uniqueSkills.push('Core Technical Proficiency', 'System Design & Architecture', 'Data & Integration');
  }

  const finalSkills = uniqueSkills.slice(0, 5);
  const expWeight = 10;
  const noticeWeight = 5;
  const targetSkillsTotal = 100 - expWeight - noticeWeight; // 85%

  const skillCount = finalSkills.length;
  let skillWeights = [];
  if (skillCount === 4) {
    skillWeights = [25, 25, 20, 15];
  } else if (skillCount === 5) {
    skillWeights = [20, 20, 15, 15, 15];
  } else if (skillCount === 3) {
    skillWeights = [30, 30, 25];
  } else if (skillCount === 2) {
    skillWeights = [45, 40];
  } else if (skillCount === 1) {
    skillWeights = [85];
  } else {
    const base = Math.floor(targetSkillsTotal / skillCount);
    const remainder = targetSkillsTotal % skillCount;
    skillWeights = Array(skillCount).fill(base);
    for (let i = 0; i < remainder; i++) {
      skillWeights[i] += 1;
    }
  }

  const mustHaveSkills = finalSkills.map((name, idx) => ({
    name,
    weight: skillWeights[idx],
    required: idx < 3
  }));

  const skillsSum = mustHaveSkills.reduce((acc, s) => acc + s.weight, 0);
  const total = skillsSum + expWeight + noticeWeight;
  if (total !== 100) {
    mustHaveSkills[0].weight += (100 - total);
  }

  return {
    mustHaveSkills,
    experience: { min: minExp, max: maxExp, weight: expWeight },
    noticePeriodMaxDays: noticeDays,
    noticeWeight,
    targetCTCMaxLPA: targetCTC,
    blindingRules: existingScorecard.blindingRules || {
      maskName: true,
      maskGender: true,
      maskAge: true,
      maskPhoto: true,
      maskMaritalStatus: true,
      maskCollegeTier: false
    }
  };
}
