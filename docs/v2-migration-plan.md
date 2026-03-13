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

## Module ownership rules

### Legacy-only modules
- `src/pages/Index.tsx`
- `src/pages/Collection.tsx`
- `src/pages/DeckBuilder.tsx`
- `src/pages/BattleScreen.tsx`

These modules remain the source of truth for legacy routes and can be reused by `/v2/*` routes only when no v2-specific view logic exists yet.

### Shared modules
- `src/app/router.tsx` (route wiring and feature-flag gates)
- Game/domain infrastructure used by both route trees (for example `src/components/game/*`, `src/components/GameRouteGuard.tsx`, and shared config under `src/config/*`)

Shared code must stay presentation-agnostic and avoid embedding legacy- or v2-specific visual decisions.

### v2-only modules
- `src/app/v2/*` shell/layout and v2 navigation
- `src/pages/v2/BattleV2Container.tsx` and any future `src/pages/v2/*` modules that contain v2-specific UX behavior

When a non-battle v2 page starts to diverge, create a real module in `src/pages/v2/*` and extract shared non-visual logic into `src/pages/shared/*` (hooks/utilities) to prevent copy/paste drift between legacy and v2 page implementations.
