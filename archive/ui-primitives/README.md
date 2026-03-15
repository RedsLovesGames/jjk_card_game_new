# Archived UI primitives

These files are historical shadcn-style primitives that were removed from active production usage.

They are kept here only as implementation references for future migrations or component recovery work. Keeping them outside `src/` ensures TypeScript, Next.js, and repository tooling do not compile or lint them by default.

If a primitive is revived for production use, move it back into `src/components/ui/` and wire it through the design-system wrappers as needed.
