---
name: project-conventions
description: Core project rules for package management and code formatting.
---

## Rules

### Package Management
- ALWAYS use `bun` instead of `npm`, `yarn`, or `pnpm`.
- ALWAYS use `bunx` instead of `npx`.
- Before running any command, check if it can be done via `bun` or `bunx`.

### Code Formatting
- NO trailing spaces. Ensure all lines end immediately after the last character.
- This applies to all file types (TS, JS, CSS, MD, etc.).

### Rationale
- `bun` is the preferred runtime and package manager for this project due to its speed and compatibility.
- Clean code without trailing spaces improves git diffs and maintains project consistency.
