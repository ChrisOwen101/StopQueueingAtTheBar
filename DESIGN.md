---
name: Don't Queue At The Bar
description: A loud, flat-colour campaign poster that scrolls: one huge lowercase idea per screen, with tiny animated pub diagrams.
colors:
  pub-cream: "#fff4dc"
  last-orders-ink: "#16161d"
  snug-green: "#0f5b43"
  amber-pint: "#ffb627"
  pint-glass-red: "#d62839"
  pint-glass-red-soft: "#ff6b76"
  pink-gin: "#ff9ec1"
  quiz-night-blue: "#2447f5"
  scene-night: "#0e0e13"
  bar-wood: "#c98a3e"
  bar-wood-edge: "#8a5a22"
typography:
  mega:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(3rem, 12vw, 11rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  stat:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(6rem, 30vw, 26rem)"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.06em"
  big:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  mid:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(1.3rem, 3.2vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.2
  small:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(1rem, 2vw, 1.6rem)"
    fontWeight: 500
    letterSpacing: "0.04em"
  label:
    fontFamily: "Avenir Next, Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    fontSize: "clamp(0.9rem, 1.8vw, 1.3rem)"
    fontWeight: 900
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "14px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  screen-y: "12vh"
  screen-x: "6vw"
  gap-chart: "8px"
  gap-pair: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.amber-pint}"
    textColor: "{colors.last-orders-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.8em 1em"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.pub-cream}"
    rounded: "{rounded.md}"
    padding: "0.9em 1em"
  tag-stamp:
    textColor: "currentColor"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.45em 1.1em"
  chart-cell:
    backgroundColor: "{colors.last-orders-ink}"
    textColor: "{colors.pub-cream}"
    rounded: "{rounded.md}"
    padding: "0.9em 0.7em"
  chart-cell-centre:
    backgroundColor: "{colors.quiz-night-blue}"
    textColor: "{colors.pub-cream}"
  chart-cell-chaotic:
    backgroundColor: "{colors.pint-glass-red}"
    textColor: "{colors.pub-cream}"
  scene:
    backgroundColor: "{colors.scene-night}"
    textColor: "{colors.pub-cream}"
    rounded: "{rounded.xl}"
  marquee:
    backgroundColor: "{colors.last-orders-ink}"
    textColor: "{colors.amber-pint}"
    typography: "{typography.label}"
---

# Design System: Don't Queue At The Bar

## Overview

**Creative North Star: "The Last Orders Noticeboard"**

A pub noticeboard that has been given a bell and a lab coat. Each screen is one flat sheet of colour carrying one huge lowercase statement, like a poster pinned up and shouted across the room. Underneath the shouting is a deadpan, mock-scientific voice (the Bar Rule, rulings, an alignment chart) so the design plays the joke straight: loud wrapper, dry contents.

Density is low and the volume is high. There is one idea per full-screen block, a lot of colour and very little chrome. Diagrams are tiny, simple and animated (dots in a pub). There are no photos, no gradients and no decorative shadows. Motion is bouncy and short, and exists to make a point (a queue forming, a count rising), not to decorate.

**Key Characteristics:**
- Full-viewport flat colour blocks, one idea each, centred.
- Enormous lowercase Avenir-style type at weight 900 with tight tracking.
- Chunky, cheerful forms: pills, thick outlines, generous radii, tilted stamps.
- Pub-night palette used as a rotation of whole screens, not as accents.
- Animated dot diagrams on a near-black stage are the only illustration.
- Page works without JS and respects `prefers-reduced-motion`.

## Colors

A rotation of saturated, flat pub-sign colours, one per screen, with cream and ink as the neutral pair.

### Primary
- **Amber Pint** (#ffb627): The action and highlight colour. Petition button, "serving" dot, stat accents, timeline progress, focus outlines, marquee text, footer links. The one colour that means "do this" or "this is the point".

### Secondary
- **Pint Glass Red** (#d62839): The Single File (the wrong behaviour) and the chaotic row of the alignment chart. Deep enough for cream text at 4.5:1.
- **Pint Glass Red Soft** (#ff6b76): Red text on ink, such as form errors.
- **Snug Green** (#0f5b43): The Cluster (the right behaviour), and calm, positive screens.

### Tertiary
- **Quiz Night Blue** (#2447f5): Full-screen blue blocks and the centre cell of the alignment chart.
- **Pink Gin** (#ff9ec1): Full-screen pink blocks, and the default customer dot in the sim.

### Neutral
- **Pub Cream** (#fff4dc): Page background, light screens, and text on ink, green, red and blue.
- **Last Orders Ink** (#16161d): Text on cream, amber and pink; the dark screen, marquee, footer, timeline rail and chart cells.
- **Scene Night** (#0e0e13): The stage behind every pub simulation.
- **Bar Wood** (#c98a3e) with **Bar Wood Edge** (#8a5a22): The bar counter in the sim only.

Sim customer dots also use four light tints (#7f95ff, #4ad295, #ff6b76, #ffd36a) to tell people apart; they exist only inside `.scene`.

### Named Rules
**The Whole-Screen Rule.** Colour is applied to entire screens (`.c-cream`, `.c-ink`, `.c-green`, `.c-amber`, `.c-red`, `.c-pink`, `.c-blue`), never sprinkled as tints on a neutral page. Text on each block is always cream or ink, whichever is the higher contrast.

**The Red-Is-Wrong, Green-Is-Right Rule.** Red always belongs to The Single File and green to The Cluster. Do not reuse them as decoration.

**The One Amber Rule.** Amber is reserved for the thing to look at or press on that screen. If two amber things compete, one is wrong.

## Typography

**Display / Body Font:** Avenir Next (with Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif). A single system sans, no web fonts are loaded.

**Character:** A friendly, geometric sans pushed to its heaviest weights and tightest tracking. It reads as shouting but not angry. The deadpan comes from the copy, not the font.

### Hierarchy
- **Mega** (900, `clamp(3rem, 12vw, 11rem)`, 0.95, -0.04em, lowercase): One statement per screen. `.mega.upper` is the uppercase variant at `clamp(2.6rem, 10.5vw, 9.5rem)`.
- **Stat** (900, `clamp(6rem, 30vw, 26rem)`, 0.85, -0.06em, tabular numerals): The giant counted-up number (e.g. +25%).
- **Big** (800, `clamp(2.2rem, 7vw, 6rem)`, 1, -0.03em): Secondary statements and rule titles.
- **Mid** (600, `clamp(1.3rem, 3.2vw, 2.6rem)`, 1.2): The supporting line under a headline.
- **Small** (500, `clamp(1rem, 2vw, 1.6rem)`, 0.04em, lowercase, 80% opacity): Captions and asides.
- **Label** (900, `clamp(0.9rem, 1.8vw, 1.3rem)`, 0.08em, uppercase): Tags, marquee, chart headings, sim scores.

### Named Rules
**The Lowercase Shout Rule.** Headlines are lowercase and enormous. Uppercase is only for labels, the marquee, and the occasional `.mega.upper` quote.

**The Tabular Count Rule.** Any number that counts up uses `font-variant-numeric: tabular-nums` so it doesn't jitter.

## Layout

Every section is a `.screen`: at least one full viewport tall, a centred grid with generous padding (`12vh` top and bottom, `6vw` sides), content centred and capped at 1200px in `.inner`. Text is centred throughout, except forms, bars and sim captions, which are left-aligned inside their own containers. Vertical rhythm comes from the screens, not from spacing inside them: whitespace is one idea of padding, not many small gaps.

`scroll-snap-type: y proximity` lets screens settle without trapping the visitor. Side-by-side comparisons use an auto-fit grid (`minmax(min(100%, 420px), 1fr)`, 1.5rem gap) and stack on narrow screens. The alignment chart is a fixed 3x3 grid with an 8px gap.

A fixed **timeline rail** sits on the left edge and tracks the eight chapters. Below 900px, screens gain 52px side padding to make room for it, and chapter labels appear only on tap or hover.

Mobile type steps down at 600px (`.mega` to 10.5vw). Content must read at a glance on a phone in a pub.

## Elevation & Depth

Flat. Depth is carried by colour blocks and by hard-edged shapes, never by blur. Shadows exist in exactly three places, all hard and offset:

- **Sim bar** (`box-shadow: 0 5px 0 #8a5a22`): a counter lip on the sim stage.
- **Beer mats** (`filter: drop-shadow(0 10px 0 rgba(22, 22, 29, 0.25))`): a flat offset shadow so the mats sit on the page.
- **Active timeline dot** (`box-shadow: 0 0 0 5px rgba(255, 182, 39, 0.35)`): an amber halo ring, not a blur.

The timeline rail and its labels use a small `backdrop-filter: blur(6px)` over a 90% ink fill, the only translucency in the system.

### Named Rules
**The Flat-By-Default Rule.** No soft drop shadows, no gradients, no glass. If something needs to stand out, change its colour or scale it up.

## Shapes

Chunky and round. Pills (999px) for buttons, tags and the timeline rail; 14px for inputs and chart cells; 16px for bar tracks; 24px for the sim stage. Outlines are thick (3 to 4px) and in `currentColor` or cream, never hairline. Tags are tilted `-3deg` like a rubber stamp. Beer mats are circular and tilt and wobble gently. Sim people are plain circles.

### Named Rules
**The Stamp Rule.** Labels that act as stamps (`.tag`) are outlined pills, uppercase, tilted `-3deg`. Never fill them.

## Components

### Buttons
- **Shape:** full pill (999px).
- **Primary (petition submit):** Amber Pint fill, Last Orders Ink text, 900 weight at 1.4rem, `0.8em 1em` padding, no border.
- **Hover:** scale to 1.03 over 150ms. **Disabled:** 60% opacity and `cursor: wait`.
- **Focus:** 3px amber outline with 2px offset (inputs); all interactive elements must keep a visible focus ring.

### Tags (stamps)
- **Style:** transparent, 3px `currentColor` border, pill, uppercase 900 label, `0.45em 1.1em` padding, rotated -3deg.

### Inputs / Fields
- **Style:** transparent background, 3px cream border, 14px radius, `0.9em 1em` padding, 1.2rem text in cream, placeholder at 40% cream. Used on dark or coloured screens only.
- **Focus:** 3px amber outline, 2px offset.
- **Invalid:** border turns Pint Glass Red (`:user-invalid`).
- **Consent checkbox:** 1.3rem, amber `accent-color`, quieter 0.95rem text at 80% opacity.
- **Messages:** centred 700 weight; amber for success, red for error.

### Navigation (timeline rail)
- **Style:** a fixed vertical ink pill (90% opacity, 2px cream border at 30%), eight 14px dots joined by a grey track with an amber progress fill.
- **States:** done dots fill amber; the active dot scales 1.5x, gets a cream border and an amber halo. Labels (ink pill with an amber uppercase kicker) appear on the active, hovered or focused dot.
- **Behaviour:** hidden on the hero, fades in after it. On narrow screens only dots show until tap or hover.

### Pub scene (signature component)
A 16:11 near-black stage with a cream 4px border and 24px radius. A wooden bar runs across the top; staff are cream dots (dim when idle, amber ring when busy), customers are pink or tinted dots, and the person being served turns amber and scales 1.25x. A score block at bottom right shows pints served in a large amber tabular number. Movement eases over 700ms. In "single" mode customers form a line; in "cluster" mode they spread along the bar.

### Alignment chart
A 3x3 grid of ink cells with cream text and amber uppercase headings; the centre cell is Quiz Night Blue and the bottom row is Pint Glass Red.

### Bars (stat bars)
A tall 16px-radius track in 12% ink with an ink fill, or red for the alternative. The fill grows from 0 when its screen is revealed.

### Beer mats
Real print artwork loaded from `/mats/*.svg` (generated from the logo by `scripts/build-mats.mjs`), shown at `clamp(220px, 30vw, 380px)`, tilted and wobbling, with a flat offset drop shadow.

### Marquee
A full-width ink strip with uppercase amber text that loops endlessly at the bottom of the hero.

## Do's and Don'ts

### Do:
- **Do** give every idea its own full-screen flat colour block and one huge lowercase statement.
- **Do** keep cream and ink as the only text colours; choose by contrast with the block.
- **Do** keep red for The Single File and green for The Cluster.
- **Do** use amber once per screen, for the thing to read or press.
- **Do** keep outlines thick (3 to 4px) and corners chunky (14px to pill).
- **Do** make motion meaningful and short, and honour `prefers-reduced-motion` with a static fallback.
- **Do** keep the page working without JavaScript (`.js` class gates reveals).
- **Do** use gender-neutral terms (barperson, bar staff, landlord; they/them) in all visible copy.
- **Do** mark jokes as jokes and keep real, cited figures visually distinct.

### Don't:
- **Don't** use photos or stock imagery; the only illustration is the animated dot diagram and the beer mat art.
- **Don't** use gradients, soft shadows, glass cards or hairline borders.
- **Don't** add small accent colours to a neutral page; colour belongs to whole screens.
- **Don't** introduce web fonts or a second typeface.
- **Don't** shame people or pubs in visuals or copy; tease the behaviour.
- **Don't** put red and green together as decoration, or reuse them away from the Single File and Cluster meanings.
- **Don't** add a chapter without updating both the timeline list and the matching section `id`s.
