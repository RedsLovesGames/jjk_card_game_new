# Accessibility Acceptance Checklist

All UI pull requests must include this checklist in the PR description and mark each item complete before review.

## Route and navigation checks
- [ ] Keyboard-only navigation follows a logical top-to-bottom, left-to-right tab order.
- [ ] Every interactive control is reachable without a mouse.
- [ ] Focus is always visible with a clear indicator.
- [ ] Each route has semantic landmarks (`header`, `nav`, `main`, and supporting `section`/`aside` as needed).
- [ ] A valid heading hierarchy exists (one page-level heading, nested headings in order).

## Controls and card interactions
- [ ] Card interactions are keyboard accessible (Enter/Space where applicable) and not click-only.
- [ ] Interactive cards/buttons have accessible names (`aria-label` or visible label).
- [ ] Icon-only controls include an accessible text label.

## Dialogs and overlays
- [ ] Dialogs have an accessible title and (when relevant) description.
- [ ] Dialog focus is trapped while open and returns to the trigger on close.
- [ ] Dialog can be dismissed with `Esc` and keyboard-only controls.

## Visual accessibility
- [ ] Text and UI colors meet WCAG AA contrast for normal UI content.
- [ ] Color is not the only indicator for state/selection.
- [ ] Animations and transitions respect `prefers-reduced-motion`.

## Validation evidence (required in UI PR)
- [ ] Manual keyboard walkthrough for changed routes.
- [ ] Screen-reader spot check for labels, headings, and dialog announcements.
- [ ] Include screenshots/video for notable UI changes.
