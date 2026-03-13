# v2 UX Migration Plan

## Rollout mode
- Keep current UX under legacy routes (`/`, `/battle`, `/collection`, `/deck-builder`, `/game`).
- Build v2 UX in parallel under `/v2/...`.
- Gate route availability and default entrypoint with feature flags:
  - `VITE_ENABLE_V2_ROUTES` (default: enabled)
  - `VITE_V2_DEFAULT` (default: disabled)

## Phase 0 — UX goals and wireframes
- Define parity goals for:
  - Home
  - Collection
  - Deck Builder
  - Battle HUD
- Lock wireframes and interaction maps before behavior refactors.
- Exit criteria:
  - Annotated wireframes approved.
  - Component inventory mapped to design-system primitives.

## Phase 1 — Routing + shell + design tokens foundation
- Introduce v2 shell and navigation under `/v2/...`.
- Keep legacy shell untouched for safe rollback.
- Extend and enforce token usage in all v2 surfaces.
- Exit criteria:
  - v2 routes exist and are reachable.
  - App can switch default root to v2 using flag only.

## Phase 2 — Rebuild non-battle pages on new system
- Rebuild Home, Collection, and Deck Builder in v2 flow.
- Reuse design-system components (`HeroSection`, `PageHeader`, `FilterBar`, `GlassPanel`, `CardFrame`, `StatBadge`).
- Validate functional parity with legacy routes.
- Exit criteria:
  - All non-battle v2 pages pass parity checklist and smoke tests.

## Phase 3 — Rebuild battle screen with container/view split
- Preserve game engine API and context contract.
- Use a container for orchestration/state selection and a view for rendering.
- Maintain battle startup + in-game continuity across `/v2/battle` and `/v2/game`.
- Exit criteria:
  - Existing engine/game context usage unchanged.
  - Battle HUD parity and interaction QA complete.

## Phase 4 — A11y/performance hardening and test expansion
- Add accessibility checks:
  - keyboard navigation
  - focus visibility
  - semantic labeling and landmarks
- Add performance checks:
  - route-level code split opportunities
  - unnecessary rerender analysis
- Expand automated test matrix for v2 routes.
- Exit criteria:
  - A11y checks pass agreed thresholds.
  - Performance budget and regression tests are green.

## Cutover and deprecation
- Flip `VITE_V2_DEFAULT=true` only after parity + QA signoff.
- Maintain fallback window for legacy routes until production confidence.
- Remove legacy routes/components once deprecation criteria is met.
