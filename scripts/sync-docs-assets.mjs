import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const docsAssetsDir = path.join(rootDir, 'docs', 'assets');

await rm(docsAssetsDir, { recursive: true, force: true });
await mkdir(docsAssetsDir, { recursive: true });
await cp(distAssetsDir, docsAssetsDir, { recursive: true });

console.log('Synced docs/assets from dist/assets');
