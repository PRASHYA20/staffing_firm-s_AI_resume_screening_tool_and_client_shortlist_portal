// server/seed.js - Seed initial DB with Company A requisitions and candidates
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_REQUISITIONS, INITIAL_CANDIDATES, INITIAL_AUDIT_LOGS } from '../frontend/src/data/sampleData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const db = {
  requisitions: INITIAL_REQUISITIONS,
  candidates: INITIAL_CANDIDATES,
  auditLogs: INITIAL_AUDIT_LOGS
};

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
console.log(`[Seed DB] Seeded ${db.candidates.length} candidates and ${db.requisitions.length} requisitions into db.json`);
