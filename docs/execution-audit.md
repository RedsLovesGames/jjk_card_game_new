# Project Execution Audit (Logic + GitHub Pages + Ability Consistency)

Date: 2026-03-13

## Current status

- Unit tests are passing for `GameEngine` core flows (`11/11` tests).
- Production build succeeds with Vite.
- ESLint reports a high number of errors, mainly in legacy/experimental engine files.

## What still needs to be done

### 1) Ability-system completeness and consistency

The card catalog contains many natural-language abilities/ultimates, but current parsing and execution support is only partially implemented.

- `DataImporter.parseEffectText` performs lightweight keyword extraction and limited numeric parsing (damage/heal/cost), not full rules parsing.
- Advanced ability semantics (multi-step triggers, conditional branches, persistent timers, targeting exceptions) are not fully normalized into structured effects yet.

**Recommendation:**
1. Add a canonical ability schema (typed effect DSL) and migrate all cards to structured fields.
2. Add a validation script that fails CI when any card uses unsupported effect constructs.
3. Expand tests from core engine flows to per-ability golden tests for each implemented keyword/mechanic.

### 2) Deployment consistency for GitHub Pages

GitHub Pages workflow should publish the build output directly from `dist/`.

- The workflow previously copied `dist/*` into `docs/`, mixing generated artifacts with repository documentation and risking accidental stale files.

**Recommendation:**
1. Keep docs in `docs/` untouched.
2. Upload `dist/` directly as the Pages artifact.

### 3) Asset URL portability across environments

Some asset URL generation had a hardcoded repository URL, which can break previews/forks/custom domains.

**Recommendation:**
1. Resolve asset paths from `import.meta.env.BASE_URL` (+ runtime origin) so dev, preview, and Pages deploys use the same logic.
2. Keep internal references as root-relative paths and centralize URL resolution in one helper.

### 4) Lint debt (blocks stronger confidence)

There are numerous lint errors (`no-explicit-any`, switch-case declaration issues, etc.) in engine, importer, and UI utility files.

**Recommendation:**
1. Triage lint into critical runtime paths vs. legacy scaffolding.
2. Fix runtime-path issues first and turn lint into a required CI gate after cleanup.

## Validation commands used

- `npm run lint`
- `npm test`
- `npm run build`
