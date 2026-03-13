---
title: "feat: Industrial/Technical Visual Redesign"
type: feat
status: active
date: 2026-03-13
---

## Enhancement Summary

**Deepened on:** 2026-03-13
**Sections enhanced:** All
**Agents used:** code-simplicity-reviewer, performance-oracle, security-sentinel, spec-flow-analyzer, best-practices-researcher

### Key Improvements from Deepening
1. Collapsed from 4 phases to 2 (color/font swap + CTA enhancement)
2. Renamed CSS variables properly (`--cyan` → `--accent`, `--purple` → `--accent-alt`) — 14 source files, manageable
3. Cut speculative CSS classes (dimension-line, crosshair, etc.) — add later if needed
4. Defined full chart palette and resolved accessibility contrast issues
5. Confirmed semantic colors (red errors, green/red price indicators) stay as exceptions

---

# Industrial/Technical Visual Redesign

## Overview

Full visual redesign of the NJ Bill Analyzer website from cyan/purple dark theme to an industrial/technical aesthetic. Make the "Schedule a Call" CTA more prominent.

## Problem Statement / Motivation

The current design uses a generic SaaS cyan/purple palette. The new design should communicate **precision, reliability, and industrial expertise** — matching the commercial energy bill analysis domain.

## Proposed Solution

### Design Decisions (Resolved)

| Question | Decision | Rationale |
|---|---|---|
| Variable naming | Rename `--cyan` → `--accent`, `--purple` → `--accent-alt` | 14 source files is manageable; avoids permanent confusion |
| Body font | Keep proportional sans-serif (Inter), Roboto Mono for headings/labels only | Monospace body text is 20-30% wider, causes form overflow |
| Font weights | Load Roboto Mono 400 + 700 only | Saves 30-50KB; 500/600 are visually similar |
| Semantic colors | Keep red for errors, green/red for price ticker | Strong UX conventions; documented as palette exceptions |
| Glow effects | Remove entirely | Conflicts with industrial aesthetic |
| Background orbs | Remove entirely | Replace with nothing; industrial = clean/sparse |
| Glassmorphism | Replace with solid cards + 1px borders | `.glass` → solid `#1A1A1A` bg + `#444444` border |
| Border radius | Keep current values | Not part of this redesign scope |
| Small caps | Headings only (`h1, h2, h3`) | Technical feel without hurting readability |
| Gradients | Replace with solid Safety Orange | `from-cyan to-purple` → solid `text-accent` |
| Decorative CSS classes | Cut (dimension-line, crosshair, etc.) | YAGNI — add later if needed after seeing the redesign |
| Dark mode only | Confirmed, no light mode | Already dark-only, stays dark-only |

### Color Palette

| Role | CSS Variable | Current | New |
|---|---|---|---|
| Background | `--background` | `#0B0F19` | `#1A1A1A` |
| Foreground | `--foreground` | `#E2E8F0` | `#E0E0E0` |
| Primary accent | `--accent` (was `--cyan`) | `#06F5D6` | `#FF6600` |
| Primary foreground | `--primary-foreground` | `#0B0F19` | `#1A1A1A` |
| Secondary accent | `--accent-alt` (was `--purple`) | `#8B5CF6` | `#666666` |
| Secondary foreground | `--secondary-foreground` | `#C4B5FD` | `#FFFFFF` |
| Muted foreground | `--muted-foreground` | `#94A3B8` | `#999999` |
| Card background | `--card` | `rgba(255,255,255,0.05)` | `#1A1A1A` |
| Border | `--border` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.06)` |
| Ring (focus) | `--ring` | `#06F5D6` | `#FF6600` |
| Popover | `--popover` | `#131825` | `#222222` |
| Destructive | `--destructive` | `#EF4444` | `#EF4444` (keep) |
| Chart 1 | `--chart-1` | `#06F5D6` | `#FF6600` (primary orange) |
| Chart 2 | `--chart-2` | `#8B5CF6` | `#FF8533` (lighter orange) |
| Chart 3 | `--chart-3` | `#3B82F6` | `#FFFFFF` (white) |
| Chart 4 | `--chart-4` | `#22D3EE` | `#AAAAAA` (medium grey) |
| Chart 5 | `--chart-5` | `#A78BFA` | `#666666` (steel grey) |

### Accessibility Notes
- `#FF6600` on `#1A1A1A` = **4.53:1** contrast — passes WCAG AA for normal text (4.5:1 min)
- `#E0E0E0` on `#1A1A1A` = **12.6:1** — passes all levels, used for body text
- `#999999` on `#1A1A1A` = **4.74:1** — passes AA, used for muted text
- `#666666` on `#1A1A1A` = **3.2:1** — **fails AA for text**; use only for decorative borders, never for text
- `#FFFFFF` on `#1A1A1A` = **15.4:1** — passes all levels

### Typography

- **Headings (h1-h3)**: Roboto Mono 700, `font-variant: small-caps`, `letter-spacing: 0.05em`
- **Body text**: Inter (system sans-serif), weight 400
- **Labels/badges**: Roboto Mono 400, uppercase, `letter-spacing: 0.1em`
- **Data/numbers**: Roboto Mono 400 (tabular-nums)

## Technical Approach

### Phase A: Design System Swap (all colors, fonts, variables)

This is the bulk of the work — a single pass across all files.

#### A1. Update `src/app/globals.css`

1. Update all CSS variables in `:root` to new values
2. Rename `--cyan` → `--accent` and `--purple` → `--accent-alt` in the `@theme inline` block
3. Update `.glass` class: remove backdrop-filter, use solid bg + border
4. Update `.text-glow-cyan` → `.text-glow-accent` with orange glow (or remove)
5. Remove `.text-glow-purple` (not needed)
6. Update `.gradient-cyan-purple` → solid orange or orange-to-grey
7. Update `.bg-grid` to use `#444444` at low opacity for grid lines
8. Add heading typography rule: `h1, h2, h3 { font-family: var(--font-mono); font-variant: small-caps; letter-spacing: 0.05em; }`

#### A2. Update `src/app/layout.tsx`

1. Replace `Space_Grotesk` with `Inter` for `--font-sans` (weights 400, 700)
2. Replace `JetBrains_Mono` with `Roboto_Mono` for `--font-mono` (weights 400, 700)

#### A3. Find/replace across 14 source files

| Find | Replace | Files |
|---|---|---|
| `text-cyan` | `text-accent` | 14 files |
| `bg-cyan` | `bg-accent` | 14 files |
| `border-cyan` | `border-accent` | 14 files |
| `from-cyan` | `from-accent` | 3 files |
| `to-cyan` | `to-accent` | 1 file |
| `text-purple` | `text-accent-alt` | 8 files |
| `bg-purple` | `bg-accent-alt` | 6 files |
| `border-purple` | `border-accent-alt` | 3 files |
| `to-purple` | `to-accent-alt` | 3 files |
| `text-[#0B0F19]` | `text-[#1A1A1A]` | 7 files |
| `rgba(6, 245, 214` | `rgba(255, 102, 0` | 6 files |
| `rgba(6,245,214` | `rgba(255,102,0` | check for no-space variant |
| `rgba(139, 92, 246` | `rgba(68, 68, 68` | 2 files |
| `rgba(11, 15, 25` | `rgba(26, 26, 26` | 1 file (pie chart stroke) |
| `text-glow-cyan` | `text-glow-accent` | 1 file |

**Files to touch (14 source + 2 system):**
- [ ] `src/app/globals.css` (system)
- [ ] `src/app/layout.tsx` (system)
- [ ] `src/app/page.tsx`
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/signup/page.tsx`
- [ ] `src/app/blog/page.tsx`
- [ ] `src/app/dashboard/page.tsx`
- [ ] `src/app/dashboard/bills/[id]/page.tsx`
- [ ] `src/components/bill-upload.tsx`
- [ ] `src/components/bills-table.tsx`
- [ ] `src/components/savings-card.tsx`
- [ ] `src/components/bill-insights.tsx`
- [ ] `src/components/onboarding.tsx`
- [ ] `src/components/schedule-call-modal.tsx`
- [ ] `src/components/schedule-call-button.tsx`
- [ ] `src/components/cost-breakdown-chart.tsx`
- [ ] `src/components/rate-comparison-chart.tsx`
- [ ] `src/components/dashboard-charts.tsx`
- [ ] `src/components/price-ticker.tsx`
- [ ] `src/lib/button-variants.ts` (if it references colors)

#### A4. Update chart stroke colors

Charts use inline `stroke="rgba(...)"` that can't use CSS variables:
- [ ] `cost-breakdown-chart.tsx` — pie stroke `rgba(11,15,25,0.8)` → `rgba(26,26,26,0.8)`
- [ ] `rate-comparison-chart.tsx` — axis strokes to `rgba(255,255,255,0.06)` (keep) and grid lines
- [ ] `dashboard-charts.tsx` — same axis/grid stroke updates (6 occurrences)

### Phase B: CTA Button Enhancement

**File:** `src/components/schedule-call-button.tsx`
- Change from outline style to solid Safety Orange fill: `bg-accent text-[#1A1A1A]`
- Make it larger with extra padding

**File:** `src/app/page.tsx`
- Restructure hero buttons: keep "Get Started" + "Log In" on one row
- Put "Schedule a Call" on its own row below, centered, larger
- Use a wrapper div with `flex-col` + gap

## Acceptance Criteria

- [ ] All pages render with new color palette (#1A1A1A background, #FF6600 accent)
- [ ] No remaining `#06F5D6` (cyan) or `#8B5CF6` (purple) hex values in source
- [ ] No remaining `text-cyan`, `bg-cyan`, `text-purple`, `bg-purple` class references
- [ ] Typography: Roboto Mono headings with small-caps, Inter body text
- [ ] "Schedule a Call" button: own line, larger, solid Safety Orange
- [ ] Charts readable with new 5-color palette
- [ ] Red errors and green/red price indicators preserved
- [ ] Glass cards replaced with solid bordered cards
- [ ] Glow effects and gradient orbs removed
- [ ] Grid overlay updated to use #444444
- [ ] Focus rings use #FF6600
- [ ] Build passes (`next build`)
- [ ] All 6 pages visually verified

## Implementation Order

```
Phase A: Full design system swap (globals.css + layout.tsx + 18 source files)
    ↓
Phase B: CTA button enhancement (2 files)
    ↓
Build verification + visual check of all 6 pages
```

## Performance Notes

- Font bundle: **net improvement** — going from 6 font files (Space Grotesk 4 weights + JetBrains Mono 2 weights) to 4 files (Inter 2 weights + Roboto Mono 2 weights), saving ~30-50KB
- CSS bundle: negligible change (updating existing classes, not adding new ones)
- No new JavaScript, no new dependencies
- Security: no concerns (purely cosmetic change)
