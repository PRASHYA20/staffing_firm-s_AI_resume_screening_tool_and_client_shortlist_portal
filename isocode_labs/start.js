// start.js - Concurrent runner for TalentPulse backend (Express) and frontend (Vite)
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 [TalentPulse AI] Booting recruitment platform...');

const backend = spawn('node', ['backend/server.js'], { 
  cwd: __dirname,
  stdio: 'inherit',
  shell: true 
});

const frontend = spawn('npx', ['vite', '--host'], { 
  cwd: __dirname,
  stdio: 'inherit',
  shell: true 
});

const shutdown = () => {
  console.log('\n🛑 [TalentPulse AI] Terminating services...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

