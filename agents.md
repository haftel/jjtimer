# jjTimer — Agent Constitutional Rules

All AI agents working on this project must follow these rules:

## Process Rules
1. **Plan-first**: Every change must be presented as an implementation plan with clarifying questions and documentation update plans before any code is written.
2. **Documentation parity**: `spec.md`, `README.md`, and `agents.md` must be updated in the same commit as any functional change.
3. **Single-source spec**: `spec.md` is the canonical source of truth for all feature behavior.
4. **No undocumented features**: Every user-facing feature must be described in `spec.md` before implementation.
5. **Incremental delivery**: Changes should be scoped to a single feature or fix; no mega-PRs.
6. **Test before merge**: All changes must build successfully (`npm run build`) before being committed to `main`.

## Code Quality Rules
7. **Accessibility**: All interactive elements must be keyboard-accessible.
8. **Performance budget**: Timer rendering must not cause layout shifts or dropped frames.
9. **No external analytics or tracking**: The app collects zero telemetry.
10. **Preserve user data**: No change may silently delete or corrupt stored solve data.
11. **Clean code**: Use clear naming, keep components focused and reusable, document complex logic.
12. **Consistent style**: Follow the established project conventions (Vue 3 Composition API, CSS custom properties).

## Documentation Rules
13. **README always current**: The README must reflect the current state of the project after every change.
14. **Spec before code**: Update `spec.md` with the feature design before writing implementation code.
15. **Changelog awareness**: Implementation plans should note what documentation files will be affected.
