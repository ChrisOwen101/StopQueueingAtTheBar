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
- Animated dot diagrams on a near-black stage are the only illustration on the home page; the hazard tests use the flat cut-out cartoon described under "Hazard test illustration".
- Page works without JS and respects `prefers-reduced-motion`.

## Colors

A rotation of saturated, flat pub-sign colours, one per screen, with cream and ink as the neutral pair.

### Primary
- **Amber Pint** (#ffb627): The action and highlight colour. Petition button, "serving" dot, stat accents, timeline progress, focus outlines, footer links. The one colour that means "do this" or "this is the point".

### Secondary
- **Pint Glass Red** (#d62839): The Single File (the wrong behaviour) and the chaotic row of the alignment chart. Deep enough for cream text at 4.5:1.
- **Pint Glass Red Soft** (#ff6b76): Red text on ink, such as form errors.
- **Snug Green** (#0f5b43): The Cluster (the right behaviour), and calm, positive screens.

### Tertiary
- **Quiz Night Blue** (#2447f5): Full-screen blue blocks and the centre cell of the alignment chart.
- **Pink Gin** (#ff9ec1): Full-screen pink blocks, and the default customer dot in the sim.

### Neutral
- **Pub Cream** (#fff4dc): Page background, light screens, and text on ink, green, red and blue.
- **Last Orders Ink** (#16161d): Text on cream, amber and pink; the dark screen, footer, timeline rail and chart cells.
- **Scene Night** (#0e0e13): The stage behind every pub simulation.
- **Bar Wood** (#c98a3e) with **Bar Wood Edge** (#8a5a22): The bar counter in the sim only.

Sim customer dots also use four light tints (#7f95ff, #4ad295, #ff6b76, #ffd36a) to tell people apart; they exist only inside `.scene` and the history strip's tiny `.mini` stages.

### Named Rules
**The Whole-Screen Rule.** Colour is applied to entire screens (`.c-cream`, `.c-ink`, `.c-green`, `.c-amber`, `.c-red`, `.c-pink`, `.c-blue`), never sprinkled as tints on a neutral page. Text on each block is always cream or ink, whichever is the higher contrast.

**The Red-Is-Wrong, Green-Is-Right Rule.** Red always belongs to The Single File and green to The Cluster. Do not reuse them as decoration.

**The One Amber Rule.** Amber is reserved for the thing to look at or press on that screen. If two amber things compete, one is wrong.

## Typography

**Display / Body Font:** Avenir Next (with Helvetica Neue, Segoe UI, system-ui, -apple-system, Arial, sans-serif). A single system sans, no web fonts are loaded.

**Character:** A friendly, geometric sans pushed to its heaviest weights and tightest tracking. It reads as shouting but not angry. The deadpan comes from the copy, not the font.

### Hierarchy
- **Mega** (900, `clamp(3rem, 12vw, 11rem)`, 0.95, -0.04em, lowercase): One statement per screen. `.mega.upper` is the uppercase variant at `clamp(2.6rem, 10.5vw, 9.5rem)`.
- **Stat** (900, `clamp(6rem, 30vw, 26rem)`, 0.85, -0.06em, tabular numerals): The giant counted-up number. Not on the page at present (the maths screen's "25 minutes. Or six." is a Mega); the class was removed with the old +25% screen.
- **Big** (800, `clamp(2.2rem, 7vw, 6rem)`, 1, -0.03em): Secondary statements and rule titles.
- **Mid** (600, `clamp(1.3rem, 3.2vw, 2.6rem)`, 1.2): The supporting line under a headline.
- **Small** (500, `clamp(1rem, 2vw, 1.6rem)`, 0.04em, lowercase, 80% opacity): Captions and asides. Full opacity on red and blue blocks, where 80% cream falls under 4.5:1.
- **Label** (900, `clamp(0.9rem, 1.8vw, 1.3rem)`, 0.08em, uppercase): Tags, chart headings, sim scores.
- **Rule title** (900, `clamp(2.2rem, 9vw, 8rem)`, 1, -0.04em, lowercase): the chapter and step headings (`.rule-title`), one step below Mega.

Running text: `.mid` and `.small` use `text-wrap: balance`, other paragraphs `pretty`. On dark blocks `.mid` gets line-height 1.38 and +0.006em tracking. Nothing the visitor reads is below 1rem except the sim legends, rail labels and the hero sticker's small line (0.75rem floor). Apostrophes in visible copy are typographic (’). Mobile display sizes keep a rem floor so browser text size still applies. On the hazard pages, labels (the header's test name and the clip count) use the Label scale, and the header label is hidden at 600px and below, where the line above the clip names the test.

### Named Rules
**The Lowercase Shout Rule.** Headlines are lowercase and enormous. Uppercase is only for labels and the occasional `.mega.upper` quote.

**The Tabular Count Rule.** Any number that counts up uses `font-variant-numeric: tabular-nums` so it doesn't jitter.

## Layout

Every section is a `.screen`: at least one full viewport tall, a centred grid with generous padding (`12vh` top and bottom, `6vw` sides), content centred and capped at 1200px in `.inner`. Text is centred throughout, except forms, bars and sim captions, which are left-aligned inside their own containers. Vertical rhythm comes from the screens, not from spacing inside them: whitespace is one idea of padding, not many small gaps.

Scrolling is free: no scroll snap and no script moves the page on its own. Only anchor links the visitor clicks scroll smoothly (`scroll-behavior: smooth`, off with reduced motion). Side-by-side comparisons use an auto-fit grid (`minmax(min(100%, 420px), 1fr)`, 1.5rem gap) and stack on narrow screens. The alignment chart is a fixed 3x3 grid with an 8px gap.

A fixed **timeline rail** sits on the left edge and tracks the nine chapters (`#problem`, `#solution`, `#maths`, `#history`, `#howto`, `#test`, `#mats`, `#poll`, `#petition-section`). Below 900px, screens gain 52px side padding (the `--sx` custom property on `.screen`) to make room for it, and chapter labels appear only on tap or hover.

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

### How-to stage (`#howto`)
- **Shape:** one sticky full-viewport screen inside a 4.5-viewport section. Copy left (or top on portrait phones), the dot-diagram pub right (or below), the same dark 24px stage as the sims.
- **States:** intro (cream), steps 1 to 3 (blue), step 4 (green: The Cluster, done). Never amber as a block here, because amber is the ring, the sightline and the pint inside the diagram.
- **Pills:** four outlined pills (3px `currentColor`, pill radius) joined by a 4px track at 30%; done pills fill with the text colour, the current one fills and scales to 1.18, the track fills as far as the scroll has got.
- **Motion:** scroll-linked (walk, sightline, pint), with 0.2 to 1s transitions between states so it reverses cleanly. Copy crossfades (0.4s, 28px rise). Only the gap ring pulses on its own.

### Tags (stamps)
- **Style:** transparent, 3px `currentColor` border, pill, uppercase 900 label, `0.45em 1.1em` padding, rotated -3deg.

### Inputs / Fields
- **Style:** transparent background, 3px cream border, 14px radius, `0.9em 1em` padding, 1.2rem text in cream, placeholder at 40% cream. Used on dark or coloured screens only.
- **Focus:** 3px amber outline, 2px offset.
- **Invalid:** border turns Pint Glass Red (`:user-invalid`).
- **Consent checkbox:** 1.3rem, amber `accent-color`, quieter 0.95rem text at 80% opacity.
- **Messages:** centred 700 weight; amber for success, red for error.

### Navigation (timeline rail)
- **Style:** a fixed vertical ink pill (90% opacity, 2px cream border at 30%), nine 14px dots joined by a grey track with an amber progress fill.
- **States:** done dots fill amber; the active dot scales 1.5x, gets a cream border and an amber halo. Labels (ink pill with an amber uppercase kicker) appear on the active, hovered or focused dot.
- **Behaviour:** hidden on the hero, fades in after it. On narrow screens only dots show until tap or hover. On `#maths` and `#history` the active label is hidden at every width unless the rail is hovered or focused, because the bars and the history strip run from the content gutter and the label would sit on them.

### Pub scene (signature component)
A 16:11 near-black stage with a cream 4px border and 24px radius. A wooden bar runs across the top; staff are cream dots (dim when idle, amber ring when busy), customers are pink or tinted dots, and the person being served turns amber and scales 1.25x. A score block at bottom right shows pints served in a large amber tabular number. Movement eases over 700ms. In "single" mode customers form a line; in "cluster" mode they spread along the bar.

### Alignment chart
A 3x3 grid of ink cells with cream text and amber uppercase headings; the centre cell is Quiz Night Blue and the bottom row is Pint Glass Red.

### Bars (stat bars)
A tall 16px-radius track with a flat fill that grows from 0 (a `clip-path` wipe) when its screen is revealed; full width with reduced motion or no JS. On the ink maths screen the track is 12% cream, the Single File fill is Pint Glass Red and the Cluster fill is Amber Pint, because Snug Green on ink is only 2.2:1 and the better number is the thing to look at. Figures sit above each bar in 900 lowercase with tabular numerals.

### Source lines
`.src`: 1rem, 500 weight, 75% opacity, underlined links in the text colour. Every real figure, date or quote carries one (publisher and date, linked); worked examples say what they are instead ("Simple arithmetic, not a survey … Illustrative, like the sims"). Paired with a `worked example` stamp where the figure is illustrative.

### History strip (signature component)
A horizontal timeline inside the pink `#history` screen, built to look nothing like the rail: in the page flow, horizontal, big dated stickers, cards, no dots, no amber progress.
- **Floor tape:** one 4px dashed ink line (45% opacity) across the whole strip, drawn once on `.stops::before`.
- **Stickers:** the 2020 floor sticker reused as each stop's date. 6.75rem cream disc, 3px dashed ink border, tilted -4deg, the year at 1.6rem 900 and the day and month above at 1rem. The current stop's sticker turns solid and scales to 1.08. On reveal they are slapped down one after another (scale 1.6 to 1 with a fade, 0.45s each, 70ms apart, about a second in all).
- **Cards:** cream, 24px radius, ink text: a tiny Scene Night stage (`.mini`, inline SVG in the sims' vocabulary: wood bar, cream staff, dim idle staff, pink and tinted customers), a lowercase 900 heading, one dry line and a source line pinned to the bottom. All cards are the same height. The last card ("today") is inverted (ink, cream text) and carries the screen's one amber: the live days-since number.
- **Scroll:** native horizontal scroll with mandatory centre snap. The strip starts at the content gutter and bleeds to the right edge only, so the rail never covers it; on a phone the current card fills the content column and the next one peeks in from the right gutter.
- **Controls:** 56px outlined ink circle buttons with SVG chevrons either side of an uppercase "n of 8" count; at the ends a button fades to 30% and is `aria-disabled`. The controls appear only with JS. Under the strip, a `.src` line says the rules shown are England's.

### Poll
A cream screen. Before a vote: two equal ink pill buttons ("For", "Against", each with a small line under it) and no amber, so the question stays fair; a 4px ink focus ring. After a vote the kicker goes and the question steps down to Big, so the results fit a laptop screen. The results are a horizontal bar chart: a 900-weight label column, a plot on a shared 0-100% scale (a 2px 45%-ink baseline, a 2px 30%-ink line at 50% because a majority is the point, a 1px line at 100%, all solid), bars 22-34px tall, square on the baseline with a 6px rounded value end, growing from 0 once, and a right-aligned tabular column of figures (the percentage at up to 3rem/900, the vote count at 1rem+ in 75% ink). Fills keep the colour meanings (red for, green against); every label and figure stays ink, and each bar sits in its own labelled row, so nobody needs to tell red from green to read it. Under 560px the label and figures share a line with the bar full width underneath. The voter's side gets a "your vote" stamp (3px outlined pill, uppercase, tilted -3deg). Above the chart, a lead line (800 weight); below it, one quiet 1rem line with the total and caveat, a 700-weight quip, one ink CTA (ink is the CTA on light blocks; amber on cream would fail 3:1) and a "Changed your mind?" text button. On the change screen the question stays small and the side on record wears the stamp on its button. In forced colours the fills switch to `CanvasText`.

### Beer mats
Real print artwork loaded from `/mats/*.svg` (generated from the logo by `scripts/build-mats.mjs`), shown at `clamp(220px, 30vw, 380px)`, tilted and wobbling, with a flat offset drop shadow.

## Hazard test illustration

The one approved exception to the dot-diagram rule, and only on the hazard test pages (`hazard-*.html`). The home page sims stay as dots.

**Style: "Public Information Cartoon".** Flat, geometric, cut-out characters in the spirit of 1970s COI public information cartoons and modern cut-out animation. Big heads (about 40% of standing height), capsule bodies, stubby legs, mitten hands, no outlines, shapes meeting edge to edge. The pub is lit like a poster, not dark. No photos, gradients, shadows, blur or textures.

**One world.** One pub, one cast ("the Regulars", 12 customers and 4 staff defined once in `public/hazard-kit.js`, the same look in every clip), one set, two cameras: the staff-side camera (behind the bar, customers face us; the barperson test's view) and the customer-side camera (in the room, staff face us, customers seen from behind). Both sit slightly above head height, so people further away stand higher and smaller, and a queue reads as a column of heads.

**Palette roles.** Back wall: one flat colour per test (customer test Pink Gin, barperson test Quiz Night Blue), never red or green. Floor: Last Orders Ink. Counter: Bar Wood top, Bar Wood Edge lip and front. Staff: ink top, cream apron with bar-wood ties, never colour. Customers' tops: pink, light blue (#7f95ff), blue, cream or pale yellow (#ffd36a, sparingly), never ink (lost on the floor) or bar wood (lost on the counter). Six flat skin tones, six hair colours, cream eyeballs with ink pupils on every face so gaze reads at any size. Bubbles: ink on cream; your own first-person lines in the barperson test are cream on ink with a cream outline. The YOU marker is a cream pill, not amber.

**The One Amber Rule, applied.** At the cue, amber is only the pundit freeze (circle, sightline, stamp), the hazard prop at its moment (the tenner) and a served pint. Red and green never appear in the clips.

**The pundit freeze.** 600 to 900 ms before the cue the camera pushes in on the hazard (scale 1.2 to 1.5), an ink scrim at 45% dims everything outside a round hole, an amber circle draws on round the hazard, a dashed amber sightline joins eyes to eyes where gaze is the hazard, and a tilted outlined stamp names the situation, never the answer. All of it is complete on the cue frame. Within about 400 ms after the cue it lifts and the clip plays the right behaviour, ending settled.

**Motion.** Transform and opacity only (plus stroke-dashoffset for draw-ons). Anticipation dip before a walk, spring overshoot on arrival, legs swapping on `steps()`, a breathing bob and staggered blinks on everyone. Nothing faster than 250 ms except cuts; a gesture holds at least 600 ms; a bubble stays 1.2 s plus 60 ms per character.

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
- **Don't** use photos or stock imagery; the only illustration is the animated dot diagram (and its static `.mini` stages on the history strip), the beer mat art and the hazard test cartoons (see "Hazard test illustration").
- **Don't** use gradients, soft shadows, glass cards or hairline borders.
- **Don't** add small accent colours to a neutral page; colour belongs to whole screens.
- **Don't** introduce web fonts or a second typeface.
- **Don't** shame people or pubs in visuals or copy; tease the behaviour.
- **Don't** put red and green together as decoration, or reuse them away from the Single File and Cluster meanings.
- **Don't** add a chapter without updating both the timeline list and the matching section `id`s.
