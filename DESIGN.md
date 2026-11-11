---
name: מסעדות
description: A private record of restaurant visits where every dish is a glazed plate and the glaze colour of its rim carries the verdict, always written beside it.
colors:
  glaze-ground: "#fbfaf6"
  tile-white: "#fffefa"
  bisque: "#ebe3d2"
  bisque-line: "#c6b89f"
  ink: "#4e2a1d"
  ink-soft: "#7d6156"
  cobalt: "#1f3f8f"
  cobalt-wash: "rgba(251, 250, 246, 0.16)"
  on-cobalt-soft: "rgba(251, 250, 246, 0.8)"
  turquoise: "#2a9d9a"
  turquoise-deep: "#1d7a77"
  ochre: "#d39b2a"
  ochre-deep: "#8a5f0d"
  clay: "#a07a68"
  clay-deep: "#8a6555"
  manganese: "#6b3b2a"
  danger: "#a8321f"
typography:
  display:
    fontFamily: "'Suez One', Rubik, serif"
    fontSize: "2.375rem"
    fontWeight: 400
    lineHeight: 1.1
  headline:
    fontFamily: "'Suez One', Rubik, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  item-title:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
  body:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  control:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  label:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  group-heading:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  secondary:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  verdict:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.1
  tab-label:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
rounded:
  field: "34px"
  tab-bar: "30px"
  tile: "24px"
  inner: "20px"
  scale: "18px"
  verdict: "10px"
  pill: "999px"
  plate: "50%"
spacing:
  label-gap: "6px"
  choice-gap: "8px"
  page-stack: "10px"
  gutter: "12px"
  sheet: "16px"
  tab-clearance: "110px"
  dock-clearance: "190px"
components:
  plate-hero:
    backgroundColor: "{colors.glaze-ground}"
    rounded: "{rounded.plate}"
    size: "148px"
  plate-large:
    backgroundColor: "{colors.glaze-ground}"
    rounded: "{rounded.plate}"
    size: "58px"
  plate-medium:
    backgroundColor: "{colors.glaze-ground}"
    rounded: "{rounded.plate}"
    size: "44px"
  plate-small:
    backgroundColor: "{colors.glaze-ground}"
    rounded: "{rounded.plate}"
    size: "26px"
  verdict-pill-must:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze-ground}"
    typography: "{typography.verdict}"
    rounded: "{rounded.verdict}"
    padding: "4px 9px"
  verdict-pill-good:
    backgroundColor: "{colors.turquoise-deep}"
    textColor: "{colors.glaze-ground}"
    typography: "{typography.verdict}"
    rounded: "{rounded.verdict}"
    padding: "4px 9px"
  verdict-pill-fine:
    backgroundColor: "{colors.ochre-deep}"
    textColor: "{colors.glaze-ground}"
    typography: "{typography.verdict}"
    rounded: "{rounded.verdict}"
    padding: "4px 9px"
  verdict-pill-weak:
    backgroundColor: "{colors.clay-deep}"
    textColor: "{colors.glaze-ground}"
    typography: "{typography.verdict}"
    rounded: "{rounded.verdict}"
    padding: "4px 9px"
  verdict-pill-avoid:
    backgroundColor: "{colors.manganese}"
    textColor: "{colors.glaze-ground}"
    rounded: "{rounded.verdict}"
    padding: "4px 9px"
  verdict-pill-unrated:
    textColor: "{colors.cobalt}"
    typography: "{typography.verdict}"
    rounded: "{rounded.verdict}"
    padding: "3px 8px"
  camera-plate:
    backgroundColor: "{colors.glaze-ground}"
    textColor: "{colors.cobalt}"
    rounded: "{rounded.plate}"
    size: "78px"
  glaze-header:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze-ground}"
    typography: "{typography.display}"
    rounded: "{rounded.field}"
  header-search:
    backgroundColor: "{colors.cobalt-wash}"
    textColor: "{colors.glaze-ground}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "44px"
  tile:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "12px 14px"
  field:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "46px"
  text-area:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "12px 16px"
  choice:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "44px"
  choice-selected:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze-ground}"
  verdict-scale-choice:
    backgroundColor: "{colors.tile-white}"
    rounded: "{rounded.scale}"
    padding: "4px 8px"
    height: "48px"
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze-ground}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-camera:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.glaze-ground}"
    rounded: "{rounded.pill}"
    height: "56px"
  button-secondary:
    textColor: "{colors.cobalt}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-danger:
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  floating-tab-bar:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.tab-bar}"
    height: "60px"
---

# Design System: מסעדות

## Overview

**Creative North Star: "Glazed Plates"**

The owner chose Armenian ceramics of Jerusalem as the world. Every dish is a round plate: its photo sits in a thick glaze rim, and the rim's colour is the verdict, from cobalt for a must-order down to a struck manganese brown for an avoid. The verdict word is always lettered beside the plate, so colour confirms and the word informs. Everything else is tin-white glaze and warm brown ink, with cobalt as the shell.

This is an iPhone Home Screen app first: Ionic in iOS mode, Hebrew right to left, one phone column, light appearance only. It is used one-handed at a restaurant table, so controls are large and round, and the camera plate always sits within thumb reach. Density is moderate: a restaurant tile holds its best and worst dish, a restaurant page stacks its dishes as plates in verdict order.

The top-level screens open on a plain cobalt header field with a large Suez One title and no ornament. Below it, white tiles float on the glaze ground with soft cobalt-tinted shadows.

**Key Characteristics:**
- Tin-white glaze ground, off-white tiles, warm brown ink, cobalt shell.
- Round photo plates whose rim colour carries the verdict, always with the word beside it.
- Five glaze colours, one per verdict, in a fixed order.
- No ornament: the plates carry the ceramic world on their own.
- Suez One for large titles, Rubik for everything else.
- Pills, circles and generously rounded tiles; nothing square.
- Light only.

## Colors

A warm ceramic palette: a glaze-white ground, brown ink, cobalt for the shell and five glazes that only ever speak about verdicts.

### Primary
- **Jerusalem Cobalt** (cobalt): The shell and the must-order glaze. Fills the header field, the primary and camera buttons, selected choices, the "ביקור חדש" label, the return word אחזור, and the rim and pill of חובה להזמין. Colours the restaurant name on its page, the selected tab, best-dish text and the unrated pill's outline and text.
- **Cobalt Wash** (cobalt-wash): The header search field, a translucent glaze over cobalt. Its text and placeholder use **On-Cobalt Soft** (on-cobalt-soft).

### Verdict glazes
Each verdict has a rim colour (bright, decorative) and a pill colour (deepened so the glaze-white word on it stays legible). Rims and pills differ on purpose.
- **Turquoise** (turquoise): The טעים rim. Also the focus ring, the text selection tint (25%), and the camera plate's inner ring.
- **Deep Turquoise** (turquoise-deep): The טעים pill and chosen scale fill; best-dish text when the best is טעים.
- **Ochre** (ochre): The בסדר rim.
- **Deep Ochre** (ochre-deep): The בסדר pill, and both the outline and fill of בסדר on the glaze scale, where bright ochre would be too faint as a 2px text-bearing outline.
- **Faded Clay** (clay): The לא משהו rim.
- **Deep Clay** (clay-deep): The לא משהו pill.
- **Manganese Brown** (manganese): The לא להזמין rim and pill, always struck through, and the outlined "won't return" word.

### Neutral
- **Tin Glaze** (glaze-ground): Every page and sheet, the plate's well behind its photo, and the text colour on every cobalt or glaze fill.
- **Tile White** (tile-white): Tiles, fields, choices, the tab bar.
- **Bisque** (bisque): The unrated and plain plate rim, the 1px inset ring on fields, choices and secondary buttons, the blank-plate inner circle, and dividers between visits.
- **Bisque Line** (bisque-line): The dashed outline around an unrated plate, the divider between filter groups and the dashed rule above a visit's total.
- **Fired Brown Ink** (ink): All primary text.
- **Soft Brown Ink** (ink-soft): Secondary facts, field labels, placeholders, group headings, dates, inactive tabs.

### Functional
- **Brick Red** (danger): Delete actions and form errors as text, and the 1.5px ring of an invalid price. Never a fill.

### Named Rules
**The Glaze Speaks Verdicts Rule.** Turquoise, ochre, clay and manganese appear only as a verdict's rim, pill or text (turquoise also marks focus and the camera plate's inner ring). Cobalt is the one glaze that also works as the shell. No tile, ground or ordinary button is ever tinted with a verdict glaze.

**The Word Beside the Rim Rule.** A verdict colour never appears without its word nearby. Where there is no room for the word, as in the four small plates of a visit row, the plate takes the plain bisque rim instead of a verdict colour.

**The Deep Pill Rule.** A pill or a text-bearing outline uses the deep variant of its glaze, never the bright rim colour, so the lettering on it stays legible. The bright glaze is for rims only.

## Typography

**Display Font:** Suez One (with Rubik, serif), regular only
**Body Font:** Rubik (with -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif)

**Character:** Suez One is a heavy, slab-like Hebrew display face that reads as lettering painted on a tile; Rubik's soft rounded terminals carry everything else. Both are self-hosted in Hebrew and Latin subsets. Numerals are tabular everywhere.

### Hierarchy
- **Display** (Suez One 400, 2.375rem, 1.1): The title in the cobalt header of a top-level screen, in glaze white.
- **Headline** (Suez One 400, 1.875rem, 1.15): The restaurant's name at the top of its page, in cobalt.
- **Title** (600, 1.125rem): Restaurant names on tiles. Visit rows use the same weight at 1.0625rem.
- **Item title** (600, 1rem): Dish names in stacks, tile headings, picker names.
- **Body** (400, 1rem): Field text and button labels; primary, secondary and camera buttons go to 600.
- **Control** (400, 0.9375rem): Choices and filters; the chosen one goes to 500.
- **Label** (500, 0.875rem): Field labels above inputs, in soft ink.
- **Group heading** (600, 0.875rem): Month headings and search group headings, in soft ink.
- **Secondary** (400, 0.8125rem): Place, cuisine, dates and other secondary facts, in soft ink.
- **Verdict** (600, 0.75rem, 1.1): The verdict word in a pill. לא להזמין is set a step larger (0.8125rem) and struck through.
- **Tab label** (400, 0.6875rem): Tab bar labels, 600 when selected.

### Named Rules
**The Lettered Title Rule.** Suez One is for the large page titles only: the header title and the restaurant name on its page. Nothing at or below 1.25rem uses it.

**The Struck Avoid Rule.** לא להזמין is always struck through with a 1px line, on pills and on the glaze scale, so the avoid is legible without its colour.

## Layout

A single phone column with 12px gutters and no width breakpoints. Pages are stacks of tiles 10px apart. Every tabbed page keeps 110px plus the safe area clear at the bottom for the floating tab bar; a page with a docked action keeps 190px.

The top-level screens (מסעדות, ביקורים, הגדרות) open on a cobalt header field that bleeds 4px past the gutters, under the safe area, with 34px rounded bottom corners. The restaurants screen adds the search field inside it, then a horizontally scrolling row of place filters that fades out at the far edge over 40px.

Reading order is right to left. On a restaurant tile the 58px plate leads on the right with its verdict pill overlapping the rim's bottom by 9px; text follows. Unrated dishes wait in a two-up, snap-scrolling row. Sheets are 16px-padded stacks with 16px between groups and 6px between a label and its field.

Floating actions sit on the trailing (left) side: the camera plate with its "ביקור חדש" label pill on the restaurants screen, the compact camera plate alone on a restaurant page, docked above the tab bar.

## Elevation & Depth

Layered, with soft shadows tinted cobalt and a hint of brown, never grey. Off-white tiles on the glaze ground carry most of the separation; shadows mark what is fired and set down (tiles, plates) and what floats (the tab bar and the cobalt actions). Fields, choices and secondary buttons are flat with a 1px bisque inset ring. Sheets are Ionic's iOS card sheets.

### Shadow Vocabulary
- **Tile** (`box-shadow: 0 1px 2px rgba(107, 59, 42, 0.08), 0 6px 16px rgba(31, 63, 143, 0.08)`): Every tile, and the plain add-dish button in the dock.
- **Plate** (`box-shadow: inset 0 0 0 2px #fbfaf6, 0 2px 6px rgba(31, 63, 143, 0.18)`): Every plate; the inset glaze line separates photo from rim.
- **Float** (`box-shadow: 0 8px 20px rgba(31, 63, 143, 0.3)`): The primary button, the camera button and plate, and the "ביקור חדש" label.
- **Tab bar** (`box-shadow: 0 6px 24px rgba(31, 63, 143, 0.16), 0 0 0 1px rgba(107, 59, 42, 0.07)`): The floating tab bar only.

### Named Rules
**The Cobalt Floats Rule.** Only cobalt actions take the float shadow. A white control sits flat inside its bisque ring.

## Shapes

Everything is round. Plates and the camera plate are circles. Controls are full pills, 44px or taller. Tiles take a 24px radius, text areas 20px, glaze-scale choices 18px, verdict pills a tighter 10px so they read as lettered labels rather than buttons. The header field's bottom corners are 34px; its top runs off the screen under the status bar. The tab bar is a 60px-tall capsule (30px radius) inset 10px from each side.

The plate has a fixed anatomy: a glaze-white well, a thick rim (8px on the hero, 5px on large, 4px on medium, 3px on small), a 2px glaze line inside the rim, and the photo cropped to the circle. A plate without a photo shows a small bisque ring at 46% of its width. An unrated plate keeps a bisque rim and adds a dashed bisque-line outline 2px outside.

There is no ornament. A painted band of turquoise scallops and ochre dots was tried under the headers and removed (spec 62): it read as polka dots and clashed with the cobalt.

### Named Rules
**The Round Plate Rule.** A dish photo is always a circle in a rim. No square thumbnails, no edge-to-edge photos.

## Components

### Plate (signature)
The whole system in one object: a round dish photo whose rim glaze is the verdict.
- **Sizes:** Hero 148px in the dish sheet, large 58px leading a restaurant tile and in the dish stack, medium 44px in waiting rows and lists, small 26px for the worst dish on a tile and the plates of a visit row.
- **Rim:** One of the five verdict glazes, bisque for unrated (with the dashed outline) or bisque for a plain rim where no word fits.
- **Busy:** While a photo is being processed, the plate dims to 50% over 120ms.

### Verdict Pill
- **Style:** The verdict word in glaze white on the deep glaze, 10px radius, 600 weight. לא להזמין is struck with a 55% glaze-white line.
- **Unrated:** "לדרג" as a cobalt outline pill (1.5px) with cobalt text.
- **On a lead plate:** The pill overlaps the plate's bottom by 9px with a 2px tile-white border, so the plate wears its verdict.

### Camera Plate
The capture action as a plate: a 78px glaze-white circle in a 7px cobalt rim, with a turquoise inner ring and a cobalt line camera icon, on the float shadow. On the restaurants screen it overlaps a cobalt "ביקור חדש" pill (46px tall, 600); on a restaurant page it stands alone.

### Glaze Scale (verdict chooser)
The dish sheet's five verdicts in order, three over two on a six-column grid (the last two take half the width each). Each is an 18px-radius, 48px-tall pill with a 2px inset outline and text in its deep glaze at rest; chosen, it fills with that glaze and the text turns glaze white. לא להזמין stays struck in both states.

### Buttons
- **Shape:** Full pills, 48px tall.
- **Primary:** Cobalt with glaze-white 600 text and the float shadow.
- **Camera:** The sheet's photo button, a 56px cobalt pill with the camera icon, beside a tile-white "from gallery" pill with a bisque ring.
- **Secondary:** No fill, a 1px bisque ring and cobalt 600 text, set on a tile or the ground (backup actions, the empty-state link).
- **Danger:** Brick-red text with no fill, centred at the bottom of a page or sheet.
- **Press / Focus:** Pressed controls dim to 65% over 120ms ease-out. Focus is a 2px turquoise ring with a 2px offset. No hover states; this is a touch app.

### Choices
- **Style:** Tile-white 44px pills with a 1px bisque ring and ink text; they wrap with 8px gaps.
- **Selected:** Solid cobalt with glaze-white 500 text, ring removed.
- **Filters:** On the restaurants screen, place filters scroll in one row; groups are divided by a 1px bisque-line rule.

### Tiles
- **Corner Style:** 24px.
- **Background:** Tile white on the glaze ground.
- **Shadow Strategy:** The tile shadow.
- **Internal Padding:** 12px by 14px. A heading inside is 1rem at 600 with 10px below.

### Inputs / Fields
- **Style:** 46px tile-white pills with a 1px bisque inset ring, ink text, soft-ink placeholder, cobalt caret. Text areas use the 20px radius. Labels sit above in soft ink, inset 6px.
- **Focus:** The 2px turquoise ring.
- **Error:** Brick-red text below the field; the price field also takes a 1.5px brick-red inset ring.
- **Header search:** A cobalt-wash pill inside the cobalt header with glaze-white text; focused, it gains a 2px turquoise inset ring.

### Navigation
- **Floating tab bar:** A tile-white capsule at 96% opacity, 60px tall, 10px from each side and 12px above the safe area, with the tab-bar shadow. Content scrolls beneath it.
- **Tabs:** Line icon over an 11px label, soft ink at rest; selected turns cobalt with a 600 label.
- **Inner pages:** Ionic's standard iOS toolbar with a back button; the restaurant name fades into the toolbar title (160ms) once the page's own headline scrolls away.

### Icons
Inline line SVGs in currentColor on a 24-unit grid, 1.8 stroke, round caps and joins, 18 to 32px, always beside a label or an accessible name.

## Do's and Don'ts

### Do:
- **Do** show every dish photo as a plate, with its rim in the verdict glaze and the verdict word beside it.
- **Do** keep the verdict order fixed: cobalt חובה להזמין, turquoise טעים, ochre בסדר, clay לא משהו, manganese לא להזמין.
- **Do** strike through לא להזמין wherever it is written.
- **Do** use the deep glaze for any pill or outline that carries text, and the bright glaze for rims.
- **Do** give a plate the plain bisque rim when its verdict word cannot sit beside it.
- **Do** keep the camera action in thumb reach, docked above the tab bar on the trailing side.
- **Do** give every control at least a 44pt target: 44px choices, 46px fields, 48px buttons and scale choices.
- **Do** tint shadows cobalt and brown, never grey.

### Don't:
- **Don't** use square thumbnails or grey inset lists; the world exists to refuse them.
- **Don't** show a verdict by colour alone.
- **Don't** tint a tile, ground or ordinary control with turquoise, ochre, clay or manganese.
- **Don't** add ornament to the header or ground (patterns, borders, motifs); the owner removed the painted band for reading as polka dots.
- **Don't** use Suez One below the large titles.
- **Don't** add a dark appearance until the owner decides on one; the app is light only.
- **Don't** use brick red as a fill or for anything but deletion and errors.
- **Don't** put a shadow on a field, choice or secondary button.
