# UI Primitive Inventory (import-driven)

Source query used:

```bash
rg "@/components/ui/" src --glob '!src/components/ui/**'
```

## Active primitives (still imported outside `src/components/ui/**`)

| Primitive | Consumers |
| --- | --- |
| `badge` | `src/components/design-system/Badge.tsx` |
| `button` | `src/components/design-system/Button.tsx` |
| `card` | `src/components/design-system/Card.tsx` |
| `dialog` | `src/components/design-system/Dialog.tsx` |
| `input` | `src/components/design-system/Input.tsx` |
| `scroll-area` | `src/components/design-system/ScrollArea.tsx` |
| `select` | `src/components/design-system/Select.tsx` |
| `sonner` | `src/components/design-system/Overlay.tsx` |
| `toast` | `src/hooks/use-toast.ts` |
| `toaster` | `src/components/design-system/Overlay.tsx` |
| `tooltip` | `src/components/design-system/Overlay.tsx` |

## Migration status

- App/pages/game components now import shared primitives from `@/components/design-system` instead of directly from `@/components/ui/*`.
- Remaining direct primitive imports are intentionally centralized in design-system wrappers and the toast hook types.

## Archived primitives

Unused primitives were moved to `src/components/ui/_archived/` after reference checks and build validation, so the live `src/components/ui/` directory now only contains actively used primitives.
