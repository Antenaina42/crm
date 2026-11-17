#!/usr/bin/env node

// Ensure Tokio and Node thread pools are strictly constrained to avoid
// "OS can't spawn worker thread: Resource temporarily unavailable (os error 11)"
// in containerized/shared hosting environments (such as Hostinger Cloud / VPS)
process.env.TOKIO_WORKER_THREADS = process.env.TOKIO_WORKER_THREADS || '1';
process.env.NEXT_CPU_COUNT = process.env.NEXT_CPU_COUNT || '1';
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '1';
process.env.SWC_WORKER_THREADS = process.env.SWC_WORKER_THREADS || '1';

if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('--max-old-space-size')) {
  process.env.NODE_OPTIONS = ((process.env.NODE_OPTIONS || '') + ' --max-old-space-size=2048').trim();
}

const { spawnSync } = require('child_process');
const nextBin = require.resolve('next/dist/bin/next');

console.log('[Build] Starting Next.js build with constrained worker threads (TOKIO_WORKER_THREADS=1, NEXT_CPU_COUNT=1)...');

const result = spawnSync(process.execPath, [nextBin, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error('[Build Error]', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
