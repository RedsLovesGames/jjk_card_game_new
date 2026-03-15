import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const uiDir = 'src/components/ui';
const legacyArchivedUiDir = 'src/components/ui/_archived';
const searchRoots = ['src/app', 'src/pages', 'src/components', 'src/hooks'];

if (existsSync(legacyArchivedUiDir)) {
  console.error(
    `Legacy archived UI directory detected at ${legacyArchivedUiDir}. Move archived references to archive/ui-primitives/ so they stay out of the compiled src tree.`,
  );
  process.exit(1);
}

const uiFiles = readdirSync(uiDir)
  .filter((file) => /\.(ts|tsx)$/.test(file))
  .map((file) => file.replace(/\.(ts|tsx)$/, ''));

const sourceFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (next === uiDir) continue;
      walk(next);
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      sourceFiles.push(next);
    }
  }
}

for (const root of searchRoots) {
  walk(root);
}

const usage = new Map(uiFiles.map((name) => [name, []]));
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const primitive of uiFiles) {
    if (content.includes(`@/components/ui/${primitive}`)) {
      usage.get(primitive).push(file);
    }
  }
}

const unused = [...usage.entries()].filter(([, consumers]) => consumers.length === 0);

if (unused.length > 0) {
  console.error('Unused UI primitives detected in src/components/ui:');
  for (const [primitive] of unused) {
    console.error(`- ${primitive}`);
  }
  console.error('\nEither consume these primitives in app/pages/components/hooks or archive/remove them.');
  process.exit(1);
}

console.log(`UI primitive usage check passed (${uiFiles.length} primitives in use).`);
