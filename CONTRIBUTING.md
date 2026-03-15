# Contributing

## Generated deployment artifacts in `docs/`

This repository keeps a checked-in deployment snapshot for GitHub Pages under `docs/assets/`.
Those files are **generated output**, not hand-edited source.

When source code that affects the frontend bundle changes, regenerate and commit `docs/assets/*`:

```bash
npm run build:docs-assets
```

Why this is committed:
- prevents drift between the committed Pages snapshot and current source,
- makes deployment artifacts reviewable in pull requests,
- allows CI to enforce that generated assets are current.

CI runs `npm run check:docs-assets` and will fail if `docs/assets/*` is out of date.
