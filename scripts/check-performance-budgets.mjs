import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const budgets = JSON.parse(readFileSync('performance-budgets.json', 'utf8'));
const assetsDir = 'dist/assets';
const jsAssets = readdirSync(assetsDir).filter(file => file.endsWith('.js'));

if (!jsAssets.length) {
  throw new Error('No JS assets found in dist/assets. Run a production build first.');
}

const initialJsBytes = jsAssets
  .map(file => statSync(join(assetsDir, file)).size)
  .reduce((sum, size) => sum + size, 0);
const initialJsKb = initialJsBytes / 1024;

if (initialJsKb > budgets.maxInitialJsKb) {
  throw new Error(`Initial JS budget exceeded: ${initialJsKb.toFixed(1)}KB > ${budgets.maxInitialJsKb}KB`);
}

const filesToAudit = [
  'src/pages/Index.tsx',
  'src/pages/Collection.tsx',
  'src/components/game/GameBoard.tsx',
];

for (const filePath of filesToAudit) {
  const source = readFileSync(filePath, 'utf8');
  if (source.includes('Math.random')) {
    throw new Error(`Render-time randomness found in ${filePath}. Use deterministic memoized data or CSS effects.`);
  }

  const animationClassMatches = source.match(/animate-[a-z-]+/g) ?? [];
  if (animationClassMatches.length > budgets.maxAnimatedUtilityClassesPerView) {
    throw new Error(
      `${filePath} uses ${animationClassMatches.length} animation utility classes (max ${budgets.maxAnimatedUtilityClassesPerView}).`,
    );
  }
}

console.log(`✅ Initial JS: ${initialJsKb.toFixed(1)}KB (budget ${budgets.maxInitialJsKb}KB)`);
console.log('✅ Visual effects audit passed for Index, Collection, and GameBoard');
