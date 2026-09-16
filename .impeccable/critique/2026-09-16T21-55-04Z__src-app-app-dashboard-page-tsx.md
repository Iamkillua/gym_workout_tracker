---
target: dashboard
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-09-16T21-55-04Z
slug: src-app-app-dashboard-page-tsx
---
Method: dual-agent (A: 2fb90c8c-fdb9-460f-acae-9f684ef2b55f · B: 313c08e2-4930-4111-a048-642fc41d4a13)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Save feedback exists, but route loading and failure states are missing. |
| 2 | Match System / Real World | 3 | Training language is natural; “activity calories” and “BMI reference” need context. |
| 3 | User Control and Freedom | 2 | Back navigation exists, but workout entry has no cancel, undo, or draft recovery. |
| 4 | Consistency and Standards | 3 | Shared components are coherent; the dashboard exposes raw lowercase workout types. |
| 5 | Error Prevention | 2 | Native constraints help, but dirty-form loss and server failures remain unguarded. |
| 6 | Recognition Rather Than Recall | 2 | Exact workout-name reuse is required without history, suggestions, or autocomplete. |
| 7 | Flexibility and Efficiency | 1 | No repeat, duplicate, preset, recent-name, or rapid-log path. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean grouping, but static profile facts displace actionable training insight. |
| 9 | Error Recovery | 2 | One global error is shown; invalid fields are not identified, linked, or focused. |
| 10 | Help and Documentation | 1 | There is little contextual guidance for BMI, calories, or unfamiliar metrics. |
| **Total** | | **22/40** | **Acceptable — meaningful workflow improvement needed.** |

## Design Specificity Verdict

**LLM assessment:** Moderately specific, but template-led. Gym language, workout metrics, encouraging copy, a green performance palette, and the graph-paper background establish a credible fitness context. The composition itself is a conventional card dashboard: four equal KPIs, a form card, recent records, and static profile facts. It does not yet express a distinctive training decision such as repeating the last workout, beating a prior result, following a plan, or understanding weekly progress.

**Deterministic scan:** The CLI detector returned `[]` with exit code 0: zero findings for `src\app\(app)\dashboard\page.tsx`. Browser injection reported 10 records: `overused-font` (1), `single-font` (1), and `nested-cards` (8). The eight nested-card records target normal Card internals rather than nested Card components and are false positives. The two font records are overlapping cautions, not defects; a single Geist family is defensible for this utility interface.

**Visual overlays:** Injection succeeded in an automated headless page and produced overlay DOM, but it was not presented in a user-visible **[Human]** browser tab, so no visible overlay is being claimed. The live app was inspected at 1440×900 and a mobile emulation request of 390×844; the browser reported a 390px body width.

## Overall Impression

This is a clean, calm, competent foundation with unusually thoughtful mobile navigation. Its biggest missed opportunity is product logic, not decoration: the interface records workouts but does not help users decide what to do next or make repetitive logging faster.

## What’s Working

1. **Mobile shell fundamentals are strong.** Four labeled bottom-nav destinations, active-page semantics, safe-area padding, and persistent access to Add make the core destinations easy to find.
2. **Entry complexity is progressively disclosed.** Category-specific fields, semantic fieldsets, native constraints, a default date, and computed cardio speed keep irrelevant inputs out of the way.
3. **The visual system is coherent.** Restrained semantic color, dark mode, consistent cards, visible focus styling, and a subtle grid texture create a stable, legible operating environment.

## Priority Issues

### [P1] Mobile controls contradict the mobile-first promise

**Why it matters:** Inputs are 32px high and large buttons are only 36px; strength metrics remain a three-column grid at narrow widths. One-handed logging becomes unnecessarily precise and error-prone.

**Fix:** Raise interactive heights to 44–48px, stack metric fields at the smallest breakpoint, and introduce two/three-column layouts only when space supports them.

**Suggested command:** `/impeccable adapt`

### [P1] Repetitive logging is treated as first-time data entry

**Why it matters:** Regular users must re-enter workout type, exact name, date, and every metric without previous values or comparison context. The product ignores the repetitive nature of training.

**Fix:** Add **Repeat workout** to recent rows, prefill type/name/last metrics, show “last time” beside editable values, and preserve a blank-entry path.

**Suggested command:** `/impeccable shape`

### [P1] Error recovery is global and incomplete

**Why it matters:** Only one validation issue appears at the top of the form. Users are not told which field failed, focus is not moved to it, and database failures have no designed recovery.

**Fix:** Return a field-error map, preserve entered values, apply `aria-invalid` and linked inline messages, focus the first invalid field, and add route-level loading/error states.

**Suggested command:** `/impeccable harden`

### [P2] Dashboard hierarchy favors inventory over action

**Why it matters:** “Measurements logged,” age, and height occupy prime space while weekly goals, recent deltas, and the next training action are absent. The home screen reports data instead of guiding behavior.

**Fix:** Lead with today’s training decision and progress; demote static profile facts to Progress or a compact disclosure.

**Suggested command:** `/impeccable layout`

### [P2] Interrupted logging has no recovery

**Why it matters:** Persistent navigation can discard an in-progress session with no draft, resume path, or explicit cancel behavior.

**Fix:** Autosave a local draft, offer “Resume workout,” provide explicit cancel/back behavior, and warn only when abandoning dirty data.

**Suggested command:** `/impeccable harden`

## Persona Red Flags

**Alex (Power User):** Dashboard → Add → manually select type, retype name/date/metrics → submit. There is no repeat-last action, autocomplete, preset, or accelerator, so the everyday loop never becomes faster.

**Sam (Accessibility-Dependent):** Labels, fieldsets, focus rings, and `aria-current` are solid. Card titles render as `<div>`, weakening heading navigation, while global form errors are not programmatically tied to the invalid fields.

**Casey (Distracted Mobile User):** Bottom Add navigation is well placed, but 32–36px controls and three narrow numeric fields make thumb input difficult. A call, refresh, or accidental navigation can erase the session.

## Cognitive Load

**Moderate: 3/8 checklist failures.** Single focus fails because workout logging, daily activity, measurements, and history compete on one dashboard. Visual hierarchy fails because four equal KPIs imply equal importance despite unequal actionability. Working memory fails because exact workout-name reuse is required without prior values or suggestions. No option set exceeds four, but treadmill entry presents six required inputs on one screen.

## Emotional Journey

Arrival is warm and personal, and Add Workout is prominent. The emotional valley begins when users must reconstruct names and numbers from memory. Completion feedback is clear but merely transactional: “Workout added” misses the motivating payoff of a personal record, progress delta, streak, or next step.

## Minor Observations

- Hard-coded `"en"` date formatting prevents locale adaptation.
- “Activity calories” needs a short definition or device-source explanation.
- BMI classification needs context about its limitations.
- Dashboard badges expose raw enum casing while the workout log uses curated labels.
- Route-level loading and delayed-data states are not designed.
- Repeated Next.js HMR WebSocket errors appeared during automated browser inspection; they were unrelated to design findings.

## Questions to Consider

- Is Home primarily for choosing today’s workout, logging completed work, or reviewing progress?
- What if most workouts could be logged by tapping **Repeat** and changing only one or two values?
- Does daily activity belong in the primary training flow, or is it competing with the core promise?
- Should the emotional peak be “saved,” or “you improved by 5 kg / maintained your streak”?
