import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const disallowedLockfile = 'pnpm-lock.yaml';
const disallowedPath = resolve(process.cwd(), disallowedLockfile);

if (existsSync(disallowedPath)) {
  console.error(
    `Disallowed lockfile detected: ${disallowedLockfile}. This repository standardizes on npm and package-lock.json.`,
  );
  process.exit(1);
}

console.log('Lockfile check passed: npm/package-lock.json is the only supported lockfile.');
