---
name: "Gym Track"
description: "A focused Anatomy Training Atlas for planning, recording, and trusting one workout session."
colors:
  mineral-white: "oklch(0.965 0.012 96)"
  atlas-paper: "oklch(0.992 0.006 96)"
  deep-ink: "oklch(0.2 0.035 248)"
  oxygen-teal: "oklch(0.56 0.12 185)"
  oxygen-wash: "oklch(0.91 0.034 185)"
  slate-copy: "oklch(0.43 0.03 245)"
  coral-effort: "oklch(0.61 0.19 32)"
  contour-line: "oklch(0.81 0.025 205)"
  field-line: "oklch(0.78 0.025 205)"
  stage-navy: "#132a3e"
  stage-panel: "#1b3850"
  stage-oxygen: "#7ce2d5"
  stage-paper: "#f4f3ec"
  stage-copy: "#c6d6df"
  shell-navy: "oklch(0.19 0.04 248)"
  night-ink: "oklch(0.17 0.035 248)"
  night-panel: "oklch(0.205 0.038 244)"
  night-oxygen: "oklch(0.69 0.13 185)"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.16em"
rounded:
  plate-sm: "calc(0.35rem * 0.6)"
  control: "calc(0.35rem * 0.8)"
  standard: "0.35rem"
  card: "calc(0.35rem * 1.4)"
  stage: "calc(0.35rem * 2)"
  pill: "9999px"
spacing:
  compact: "0.5rem"
  field: "0.75rem"
  control: "0.875rem"
  cluster: "1rem"
  section: "1.25rem"
  panel: "1.5rem"
  spacious: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.oxygen-teal}"
    textColor: "{colors.stage-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.atlas-paper}"
    textColor: "{colors.deep-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.75rem"
  field-input:
    backgroundColor: "{colors.mineral-white}"
    textColor: "{colors.deep-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
  atlas-zone:
    backgroundColor: "{colors.stage-panel}"
    textColor: "{colors.stage-paper}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "0 0.75rem"
    height: "3rem"
  atlas-zone-selected:
    backgroundColor: "{colors.stage-oxygen}"
    textColor: "{colors.deep-ink}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "0 0.75rem"
    height: "3rem"
  surface-card:
    backgroundColor: "{colors.atlas-paper}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.card}"
    padding: "1rem"
  training-log-session:
    backgroundColor: "{colors.atlas-paper}"
    textColor: "{colors.deep-ink}"
    rounded: "0"
    padding: "0"
  navigation-active:
    backgroundColor: "{colors.stage-panel}"
    textColor: "{colors.stage-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 0.75rem"
    height: "2.75rem"
---

# Design System: Gym Track

## Overview

**Creative North Star: "Anatomy Training Atlas"**

Gym Track treats the body as the plan. Its visual world combines deep clinical ink, mineral-white working surfaces, precise anatomy-plate contours, and sparse dry-erase coaching marks. It is an operational training instrument rather than an interchangeable KPI-card dashboard: the interface helps a gym-goer select zones, recognize recent work, record actuals, and preserve one trustworthy session.

The system is dense where the user edits a workout and calm everywhere else. Large neutral fields keep attention on the current task; oxygen teal makes active and recovered states unmistakable; coral appears only when effort, error, or attention requires it. The finished surface sits over a registered history layer, so recent routines feel recalled rather than generated.

**Key Characteristics:**
- Deep ink and navy establish a focused, clinical training field.
- Mineral-white surfaces keep forms legible under gym-floor conditions.
- Oxygen teal identifies selection, completion, recovery, and primary action.
- Laminated plates, clipped zone contours, fine rules, and registration labels carry the atlas metaphor.
- Mobile composition keeps selection compact, the plan immediate, and the save action thumb-reachable.

## Colors

The palette is a disciplined contrast between mineral neutrals and deep navy, with oxygen teal as the primary active signal and coral reserved for effort or attention.

### Primary
- **Oxygen Teal** (`oxygen-teal`): Primary actions, selected controls, completion marks, focus rings, and progress signals.
- **Stage Oxygen** (`stage-oxygen`): The brighter teal used inside navy training plates for selected zones, registration marks, and high-contrast active detail.

### Secondary
- **Oxygen Wash** (`oxygen-wash`): Quiet selected backgrounds and supporting active surfaces that should not compete with the primary action.

### Tertiary
- **Coral Effort** (`coral-effort`): Destructive feedback and attention states only; it is not a decorative accent.

### Neutral
- **Mineral White** (`mineral-white`): The application canvas.
- **Atlas Paper** (`atlas-paper`): Cards, form planes, and trusted recorded surfaces.
- **Deep Ink** (`deep-ink`): Primary text and dark-on-teal content.
- **Slate Copy** (`slate-copy`): Explanatory copy, metadata, and secondary labels.
- **Contour Line** (`contour-line`): Structural borders and dividers.
- **Field Line** (`field-line`): Form-control boundaries.
- **Stage Navy** (`stage-navy`): Anatomy selector, dashboard lead, and log-session headers.
- **Stage Panel** (`stage-panel`): Nested controls and repeated-history panels inside navy fields.
- **Stage Paper** (`stage-paper`): Primary text on navy fields.
- **Stage Copy** (`stage-copy`): Supporting copy on navy fields.
- **Shell Navy** (`shell-navy`): Persistent desktop navigation.
- **Night Ink**, **Night Panel**, and **Night Oxygen** (`night-ink`, `night-panel`, `night-oxygen`): Dark-theme canvas, raised surface, and active-state counterparts.

### Named Rules

**The Oxygen and Effort Rule.** Use oxygen teal for active, recovered, complete, and primary states; reserve coral for errors, destructive actions, or genuine attention.

**The Mineral Field Rule.** Let mineral-white and navy fields dominate the screen. Accent color is a precise signal, never ambient decoration.

## Typography

**Display Font:** Geist (with Arial and sans-serif fallback)

**Body Font:** Geist (with Arial and sans-serif fallback)

**Label Font:** Geist (with Arial and sans-serif fallback)

**Character:** One neutral grotesk keeps the system direct and legible while shifts in scale, tracking, case, and density create the clinical-atlas voice. Large headings are compressed and decisive; labels behave like instrument annotations.

### Hierarchy
- **Display** (600, fluid 2.25rem–3.75rem, 0.98 line-height): Dashboard and primary workflow statements; keep the measure compact and balanced.
- **Headline** (600, fluid 2.25rem–3rem, 1 line-height): Training-log and major page titles.
- **Title** (600, 1.5rem, 1.25 line-height): Plan groups, panel titles, and important section identity.
- **Body** (400, 1rem, 1.625 line-height): Instructions and explanatory text, generally limited to about 60–65 characters.
- **Label** (600, 0.65rem, 0.16em tracking): Registration marks, category labels, and compact metadata; uppercase only where the interface behaves like an annotated plate.

### Named Rules

**The Instrument Label Rule.** Use compact uppercase tracking for registration and metadata, never for paragraphs, exercise names, or primary actions.

## Layout

The app shell uses a fixed 15rem desktop rail and a bottom mobile navigation with safe-area padding. Content is constrained to an 88rem shell, while atlas workflows narrow to 82rem. Page sections follow a compact 1–1.5rem rhythm so the interface remains usable between sets without losing hierarchy.

The workout builder is mobile first: the zone selector occupies the top, the selected plan follows immediately, and the save dock stays above the bottom navigation. At 1024px and above, selector and plan become a purposeful `0.78fr / 1.22fr` split; the selector becomes sticky and the plan receives more width for editable actuals. Exercise metrics progress from one column to two at 390px and three at 640px. Dashboard lead content becomes an asymmetric `1.15fr / 0.85fr` split rather than a grid of interchangeable KPIs.

## Elevation & Depth

Depth is structural and restrained. Borders, tonal nesting, inset completion marks, and dark/light field contrast do most of the work. Shadows appear only on major registered surfaces: a low lift under the plan, a deeper but tightly cropped dashboard lead shadow, and an upward shadow on the sticky save dock.

### Shadow Vocabulary
- **Registered plan lift** (`0 12px 30px -22px color-mix(in oklab, var(--foreground) 45%, transparent)`): Separates the editable plan from the canvas without making it float.
- **Lead plate lift** (`0 18px 42px -30px rgb(7 24 39 / 0.8)`): Anchors the dashboard's navy lead plate.
- **Save-dock separation** (`0 -8px 24px -18px color-mix(in oklab, var(--foreground) 55%, transparent)`): Keeps the thumb-reachable action legible over scrolling content.

### Named Rules

**The Laminated, Not Floating Rule.** Use borders and tonal layering first; apply a shadow only when a major plate or sticky action must separate from adjacent content.

## Shapes

Corners are taut and technical. Standard controls use the small 0.35rem-derived radius scale, cards use a gently larger radius, and atlas stages use twice the base radius. Training-log sections, dark lead plates, save docks, and measurement strips stay square to read as registered sheets rather than generic cards. Zone controls are clipped into precise six-point anatomy contours, while badges alone use a full pill.

## Components

### Buttons
- **Shape:** Compact technical corners with a 2.75rem default height; large primary actions reach 3rem.
- **Primary:** Oxygen teal with high-contrast text and 0.875rem horizontal padding.
- **Hover / Focus:** Primary fill reduces to 80% intensity on hover; keyboard focus adds a three-pixel, half-opacity oxygen ring and visible border shift; press moves down one pixel.
- **Outline / Ghost / Secondary:** Outline controls stay on the current surface, ghost controls add a muted hover field, and secondary controls use the oxygen wash for quieter actions such as repeating a plan.

### Chips
- **Style:** Compact 1.25rem badges use a full pill, small-medium text, and either oxygen wash or a contour outline.
- **State:** Secondary badges carry muscle zones; outline badges carry workout types and legacy status.

### Cards / Containers
- **Corner Style:** Standard cards use the larger card radius; registered atlas and log containers remain square or use the stage radius.
- **Background:** Atlas Paper for editable and recorded content; Stage Navy for anatomy, history headers, and the dashboard lead.
- **Shadow Strategy:** Flat by default; only major plan, lead, and sticky-action surfaces use the documented shadows.
- **Border:** A one-pixel contour or low-opacity ink ring defines every important surface.
- **Internal Padding:** One rem for cards, increasing to 1.5rem on larger atlas panels.

### Inputs / Fields
- **Style:** Mineral background, one-pixel field line, compact corner, 2.75rem height, and 0.75rem horizontal padding.
- **Focus:** Border changes to oxygen teal and receives a three-pixel translucent ring.
- **Error / Disabled:** Coral border and ring identify invalid fields; disabled fields retain structure but reduce opacity and block interaction.

### Navigation
- **Style:** The desktop rail is deep navy with 2.75rem rows and left-aligned icon-label pairs. The mobile navigation is a four-column, 4rem bottom bar with safe-area padding and stacked icon-label pairs. Active destinations use the nested navy accent and light text; inactive destinations remain muted until hover.

### Anatomy Zone Plate

The signature selector nests compact front and back zone maps inside Stage Navy. Each 3rem target uses a clipped six-point contour, uppercase instrument label, and visible check. Selection reverses the control to Stage Oxygen with Deep Ink text. A dashed center registration line and vertical FRONT/BACK labels make the plate anatomical without pretending to be a literal medical illustration.

### Workout Plan and Save Dock

Selected zones register as vertically stacked plan groups with a ruled heading, editable exercise rows, and a three-pixel inset oxygen mark when complete. The save dock spans the workflow, holds the date and completion count, and remains sticky above mobile navigation. It is the only persistent primary action on the builder.

### Training Log Session

Each saved session is one bordered sheet: a Stage Navy header contains its date, zones, and repeat action; linked exercise rows sit directly below with ruled separation. This preserves the session as the primary historical unit instead of fragmenting it into KPI cards.

## Do's and Don'ts

### Do:
- **Do** make the body-zone choice the entry point to workout planning.
- **Do** use oxygen teal to connect selection, completion, focus, and the primary save action.
- **Do** keep recent-history cues attached to exercises and sessions so recalled values remain recognizable.
- **Do** preserve 44–48px controls, explicit labels, visible focus, linked errors, and reduced-motion behavior.
- **Do** keep the mobile save action above the bottom navigation and within thumb reach.
- **Do** use dry, precise rules, registration labels, and clipped contours to carry the atlas metaphor.

### Don't:
- **Don't** replace the workflow with an interchangeable dashboard of KPI cards.
- **Don't** use coral as a general brand accent or decorative highlight.
- **Don't** invent exercises, anatomy imagery, health outcomes, or performance claims.
- **Don't** let shadows, gradients, or soft floating cards replace the laminated plate structure.
- **Don't** separate checked exercises into unrelated saves; the visible unit is one trustworthy dated session.
- **Don't** turn the compact instrument-label style into dense uppercase body copy.
