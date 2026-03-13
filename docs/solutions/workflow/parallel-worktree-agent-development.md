---
title: "Parallel Feature Development with Git Worktrees and Claude Code Agents"
category: workflow
date: "2026-03-13"
tags:
  - git-worktrees
  - parallel-development
  - claude-code-agents
  - next-js
  - agent-permissions
problem_type: workflow/process
components_affected:
  - src/components/price-ticker.tsx
  - src/components/schedule-call-modal.tsx
  - src/app/api/schedule-call/route.ts
  - src/db/schema.ts
  - src/app/page.tsx
  - src/app/globals.css
severity: medium
---

## Problem

Building two independent features simultaneously — a real-time energy price ticker and a schedule-a-call CTA with form — required parallel development. Background agents launched in separate git worktrees were denied file write permissions, blocking autonomous feature implementation.

## Root Cause

Claude Code's permission model is **directory-scoped** to the parent conversation's working directory. When background agents target worktree directories (sibling directories like `../project--feature`), they operate outside the approved path and all write operations (Write, Edit, Bash file creation) are denied.

## Solution

### 1. Create worktrees from the main repo

```bash
git worktree add ../every-app-bill-upload--realtime-prices -b feature/realtime-prices main
git worktree add ../every-app-bill-upload--schedule-call-cta -b feature/schedule-call-cta main
```

### 2. Launch background agents for research/planning

Background agents can still read, search, and analyze code. They return structured plans and code snippets as text output — they just can't write files.

### 3. Orchestrator applies changes

The main conversation (which has write permissions) applies the changes that agents planned:

**Worktree 1 — Real-time Prices Ticker:**
- Created `src/components/price-ticker.tsx` (CSS-animated infinite scroll marquee with trend indicators)
- Added `@keyframes ticker-scroll` animation to `globals.css`
- Imported and placed `<PriceTicker />` in landing page

**Worktree 2 — Schedule a Call CTA:**
- Added `callRequests` table to `src/db/schema.ts`
- Created `src/app/api/schedule-call/route.ts` (POST with validation)
- Created `src/components/schedule-call-modal.tsx` (glassmorphism modal with form)
- Added CTA button and modal to landing page

## The Orchestrator-Researcher Pattern

This is the recommended workflow for parallel feature development:

```
Main Conversation (Orchestrator)
  |
  |-- Background Agent A (worktree: project--feature-a)
  |     Role: Read, analyze, produce plan with exact code
  |     Permissions: Read, Grep, Glob only
  |
  |-- Background Agent B (worktree: project--feature-b)
  |     Role: Same — read and plan
  |
  Orchestrator: Receives plans, applies edits, commits
```

| Scenario | Background Agent | Main Conversation |
|---|---|---|
| Research / code analysis | Yes | No |
| Generate plan or code snippets | Yes | No |
| Write files / apply edits | No | **Yes** |
| Git operations (commit, push) | No | **Yes** |
| Independent analysis in parallel | Yes | No |

## Prevention & Best Practices

### Permission handling
- Do not fight the permission model — design around it
- Accept "read-only agent" as a deliberate architectural choice
- Alternatively, start separate Claude Code sessions rooted in each worktree directory

### Worktree naming convention
Use double-dash (`--`) to separate project name from feature:
```
~/projects/my-app              # main working tree
~/projects/my-app--feature-a   # worktree for feature-a
~/projects/my-app--feature-b   # worktree for feature-b
```
Double-dash avoids ambiguity with single dashes in project names and mirrors git's `--` separator convention. Easy to glob: `ls ~/projects/my-app--*`

### Cleanup after merge
```bash
git worktree list                          # see all worktrees
git worktree remove ../my-app--feature-a   # remove worktree
git branch -d feature/feature-a            # delete branch
git worktree prune                         # clean stale refs
```

### Anti-patterns to avoid
- Don't launch a background agent expecting it to build a full feature end-to-end (write, test, fix, commit) — it will stall on the first write
- Don't launch multiple agents against the **same** worktree — they would conflict
- Don't assume `Bash` commands that create files will work in a background agent outside the approved directory

## Key Takeaway

**Parallel research is the sweet spot.** Background agents excel at reading, analyzing, and planning across multiple worktrees simultaneously. Reserve all writes for the orchestrator. Even with the permission constraint, having agents produce plans in parallel and then applying changes from the main conversation is significantly faster than sequential development.

## Related

- Git worktree skill: `~/.claude/plugins/cache/EveryInc-compound-engineering-plugin/.../skills/git-worktree/SKILL.md`
- First documented solution in this project (`docs/solutions/` created with this entry)
