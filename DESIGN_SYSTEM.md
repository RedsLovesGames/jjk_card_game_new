# Design System

This project now centralizes visual decisions into reusable tokens and primitives.

## Token source
- Global CSS variables live in `src/globals.css`.
- Tailwind mappings live in `tailwind.config.ts`.

## Token groups
- **Color ramps**: `--color-brand-*`, `--color-surface-*` mapped to `bg-brand-500`, `text-surface-200`, etc.
- **Spacing scale**: `--space-*` mapped to `ds` keys (`p-ds4`, `gap-ds6`, `mb-ds8`).
- **Radii**: `--radius-*` mapped to `rounded-ds`, `rounded-panel`, `rounded-frame`.
- **Shadows**: `--shadow-*` mapped to `shadow-glass`, `shadow-elevated`, `shadow-card`.
- **Motion**: `--motion-*` mapped to `duration-fast`, `duration-base`, `duration-slow`.
- **Layering**: `--z-*` mapped to `z-base`, `z-raised`, `z-overlay`, `z-modal`, `z-toast`.

## Reusable components
Located in `src/components/design-system/`:
- `HeroSection`: shared hero/title treatment.
- `PageHeader`: reusable page title + subtitle + action row.
- `FilterBar`: common filter/search container.
- `GlassPanel`: frosted panel container.
- `StatBadge`: compact metric indicator.
- `CardFrame`: shared card shell, with `interactive` state.

## Usage examples
- Landing page uses `HeroSection`, `CardFrame`, `StatBadge`.
- Collection page uses `PageHeader`, `FilterBar`, `CardFrame`, `GlassPanel`.
- Deck builder uses `PageHeader`, `FilterBar`, `GlassPanel`, `CardFrame`, `StatBadge`.
- Game board panels/cards are aligned with `GlassPanel` and `CardFrame` patterns.

When adding new UI, prefer composing these primitives before introducing new one-off Tailwind clusters.
