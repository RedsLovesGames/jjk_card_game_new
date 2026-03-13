import { spawnSync } from 'node:child_process';

const trackedPathPattern = /^src\/(pages|app|components|context)\//;
const trackedCodes = new Set(['TS6133', 'TS6138', 'TS7006', 'TS7031', 'TS7029']);

const result = spawnSync('npx', ['tsc', '--noEmit', '-p', 'tsconfig.app.json'], {
  encoding: 'utf8',
  stdio: 'pipe',
});

const combinedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const diagnostics = combinedOutput
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean);

const violations = diagnostics.filter(line => {
  const fileMatch = line.match(/^(src\/[^(:]+\.(?:ts|tsx))\(/);
  const codeMatch = line.match(/error\s+(TS\d+):/);

  if (!fileMatch || !codeMatch) {
    return false;
  }

  return trackedPathPattern.test(fileMatch[1]) && trackedCodes.has(codeMatch[1]);
});

if (violations.length > 0) {
  console.error('TypeScript hygiene violations found (unused symbols, implicit any, or switch fallthrough):');
  violations.forEach(line => console.error(line));
  process.exit(1);
}

console.log('TypeScript hygiene check passed for src/pages, src/app, src/components, and src/context.');
