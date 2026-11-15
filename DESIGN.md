---
name: מסעדות
description: A calm Hebrew list of restaurant visits where the dish photos are the only strong colour and fading is the verdict.
colors:
  aubergine-ground: "#f4f1f5"
  panel-white: "#ffffff"
  raised-lilac: "#ebe6ee"
  aubergine-ink: "#1d1620"
  ink-soft: "#655b6a"
  ink-faint: "#7d7382"
  hairline: "rgba(29, 22, 32, 0.08)"
  outline: "rgba(29, 22, 32, 0.24)"
  table-amber: "#f6b443"
  on-amber: "#20160a"
  danger-red: "#b3261e"
typography:
  display:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
  name:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  secondary:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
  tab-label:
    fontFamily: "Assistant, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
rounded:
  photo-mini: "8px"
  photo-small: "12px"
  field: "14px"
  waiting-line: "18px"
  panel: "22px"
  pill: "999px"
spacing:
  divider-inset: "14px"
  gutter: "16px"
  stack: "12px"
  bar-gap: "10px"
  bar-height: "62px"
components:
  button-primary:
    backgroundColor: "{colors.aubergine-ink}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-quiet:
    backgroundColor: "{colors.raised-lilac}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-danger:
    textColor: "{colors.danger-red}"
    padding: "0 22px"
    height: "44px"
  bar-action:
    backgroundColor: "{colors.table-amber}"
    textColor: "{colors.on-amber}"
    rounded: "{rounded.pill}"
    size: "62px"
  bar-action-pill:
    backgroundColor: "{colors.table-amber}"
    textColor: "{colors.on-amber}"
    rounded: "{rounded.pill}"
    width: "150px"
    height: "62px"
  choice:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  choice-selected:
    backgroundColor: "{colors.aubergine-ink}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.pill}"
  verdict-must:
    backgroundColor: "{colors.table-amber}"
    textColor: "{colors.on-amber}"
    typography: "{typography.label}"
    padding: "2px 8px"
  field:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "48px"
  field-in-tile:
    backgroundColor: "{colors.raised-lilac}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.field}"
  list-panel:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.panel}"
  tile:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  tab-bar:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    height: "62px"
---

# Design System: מסעדות

## Overview

**Creative North Star: "Evening table, light"**

A pale, aubergine-tinted table with white rounded panels laid on it, aubergine ink for every word, and one amber accent. The dish photos are the only strong colour on screen, so a screen reads by its pictures first and its words second. Everything else stays quiet: plain titles on the ground, one line per row, hairline dividers inside white panels, and a floating tab capsule with a round amber camera button beside it.

Fading is the verdict. What is worth ordering keeps its full colour and size (a חובה להזמין dish is a large photo tile); what to skip loses colour step by step: a לא משהו photo is dimmed, a לא להזמין photo is dimmed further and greyed, their names turn soft and a לא להזמין name is struck through. The verdict word is always written beside the dish, and the word itself never fades.

The app is Hebrew and right to left, runs as an iPhone Home Screen app on Ionic in iOS mode, and has a light appearance only. It replaced the "Glazed plates" look (cobalt shell, Suez One titles, round photos in coloured verdict rims), which the owner retired on 2026-11-15 (issues #12 and #13).

**Key Characteristics:**
- Pale aubergine ground, white 22px panels, aubergine ink, one amber accent.
- Dish photos are rounded squares and the only strong colour.
- Fading is the verdict; the verdict word is always written.
- One typeface, Assistant, from 400 to 800.
- One line per row; long text sits behind a tap.
- Floating, rounded bottom bar; no header blocks.

## Colors

A near-neutral aubergine family carrying the whole interface, with a single warm amber for the few things that must be found at once.

### Primary
- **Table Amber** (table-amber): the one accent. Used only for the camera button beside the tab bar (round on tabs, the "צילום מנה" pill in a visit), the חובה להזמין chip and its selected pill in the dish sheet, and the dot on the waiting line. Text on it is always **On Amber** (on-amber), never white.

### Neutral
- **Aubergine Ground** (aubergine-ground): the page ground, the toolbar, the theme colour and the PWA background colour.
- **Panel White** (panel-white): list panels, tiles, the search field, filter chips, the waiting line and the tab capsule (at 96% opacity).
- **Raised Lilac** (raised-lilac): one step down from white. Quiet buttons, fields and pills inside a white tile, and the empty photo block.
- **Aubergine Ink** (aubergine-ink): every primary word, the filled primary button and the selected pill, and the 2px focus ring.
- **Ink Soft** (ink-soft): secondary lines (city, cuisine, prices, labels), the names of dishes to skip, verdict words other than חובה להזמין and טעים, unselected tab labels.
- **Ink Faint** (ink-faint): the last-visit date at the end of a restaurant row and the placeholder icon in an empty photo. Text in it sits on white only.
- **Hairline** (hairline): row dividers inside panels and the ring around the tab capsule and loose fields.
- **Outline** (outline): the 1px border of the לדרג chip and the would-return chip.
- **Danger Red** (danger-red): delete actions as plain text buttons and the price error. Never a fill.

### Named Rules
**The One Amber Rule.** Amber marks the camera action, the must-order verdict and the waiting dot, nothing else. A new screen that wants a second accent uses ink instead.

**The Photos Carry Colour Rule.** No surface, header, border or verdict gets a hue of its own; colour on screen comes from the dish photos and the one amber.

**The Faint-On-White Rule.** Ink Faint passes 4.5:1 only on Panel White (4.52:1). Text on the ground or on Raised Lilac uses Ink Soft or darker.

## Typography

**Display Font:** Assistant (with -apple-system, BlinkMacSystemFont, Arial Hebrew)
**Body Font:** Assistant
**Label/Mono Font:** Assistant, with tabular figures on the whole body

**Character:** One humanist Hebrew sans at four weights. Hierarchy comes from weight and size, never from a second face: 800 for titles, 700 for names, 600 for values and dish names, 400 for secondary text.

### Hierarchy
- **Display** (800, 34px, 1.2, -0.01em): the title of a top-level tab (מסעדות, ביקורים, הגדרות), plain text on the ground.
- **Headline** (800, 30px, 1.2, -0.01em): a restaurant's name at the top of its page.
- **Title** (800, 20px, 1.2): section headings (להזמין, לדלג, לדרג, ביקורים) and the visit picker heading.
- **Name** (700, 17px, 1.3): restaurant names in rows, tile headings, the visit total amount.
- **Body** (600, 16px, 1.3): dish names, row values, buttons at 17px.
- **Secondary** (400, 14px, 1.3): the one line of facts under a name, prices, verdict words; month headings on ביקורים are 15px/700 in Ink Soft.
- **Label** (600 to 700, 13px): chips (חובה להזמין, לדרג, would-return), counts and dates.
- **Tab label** (600, 11px; 700 when selected).

### Named Rules
**The One Face Rule.** Assistant only, weights 400/600/700/800. No display face, no italics.

**The Verdict Word Rule.** A verdict is always a written word (spec 15). Fading applies to photos and dish names, never to the verdict word, which keeps 4.5:1 on its ground.

## Layout

Single column at phone width with a 16px page gutter. A top-level screen opens on its title at 10px below the safe area, then a 12px stack rhythm between blocks. Content scrolls under a floating bottom bar; the page keeps 110px plus the bottom safe area clear beneath it, and a scrim fades the ground in behind the bar so rows never collide with it.

Rows live in white list panels. Each row is one line of facts: a restaurant row is 76px (56px photo, name, city · cuisine, date at the far end), dish rows and visit rows 64px, picker and fact rows 52px, a ביקורים row 84px with a name line and a photo line. Dividers start after the photo (inset 82px or 70px) or at 14px when a row has none. On a restaurant's page, חובה להזמין dishes are a two-column grid of square photo tiles with 16px gaps; an odd last tile spans both columns at 2:1.

The bottom bar is a white capsule (62px high) inset 16px from the edges and 12px above the safe area; when a page has a camera action, the capsule shortens and the amber button sits 10px from it on the inline end. Filter chips scroll sideways in one line, bleeding to the screen edge and fading in over 40px. Sheets are Ionic iOS modals: the dish sheet opens full height, the waiting sheet at 60%.

## Elevation & Depth

Mostly flat, built from tonal layering: white panels on a tinted ground, lilac controls inside white tiles. Shadows exist only on things that float above the scroll and on the must-order photos.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 6px 20px rgba(29, 22, 32, 0.1)`): the tab capsule (paired with a 1px hairline ring) and the amber bar action.
- **Lift** (`box-shadow: 0 12px 28px rgba(29, 22, 32, 0.16)`): the חובה להזמין photo tiles on a restaurant's page, so the dishes to order stand off the page.

### Named Rules
**The Flat Panel Rule.** Panels, rows, fields and chips carry no shadow. Depth beyond tone is reserved for the floating bar and the must-order tiles.

## Shapes

Everything is rounded. Panels and tiles are 22px; fields and the search field 14px; the waiting line 18px; buttons, chips, pills, the tab capsule and the camera button are full pills or circles. Photos are rounded squares, never circles, never ringed: 22px as hero (200px tall) and tiles, 14px in 56px rows, 12px at 44px, 8px at 28px. Overlapping small photos on the waiting line are separated by a 2px white ring, the only stroke a photo gets.

## Components

### Buttons
Soft, full pills; pressing dims to 65% opacity over 120ms instead of changing colour.
- **Shape:** full pill (999px), 52px high, 22px inline padding, 17px text.
- **Primary:** Aubergine Ink fill, white 700 text (שמירה actions, the camera input in the dish sheet).
- **Quiet:** Raised Lilac fill, ink 600 text (gallery, מנה בלי תמונה, secondary actions).
- **Danger:** plain Danger Red 600 text, no fill, centred under the content.
- **Disabled:** 45% opacity.
- **Focus:** 2px ink outline, 2px offset.

### Bar Action (signature)
The amber camera action beside the tab capsule. A 62px circle with a 26px camera line icon on tabs and restaurant pages; a 150px pill reading "צילום מנה" (16px/700) inside a visit. Float shadow, on-amber icon and text, 65% opacity while pressed or busy.

### Chips
- **Choice pills:** 44px, white (Raised Lilac inside a tile), ink 600 text; selected fills with ink and turns white. The חובה להזמין pill fills amber when selected. The לא להזמין pill's word is struck through.
- **Filter chips:** 34px, white, Ink Soft 400 text; selected is ink with white 600 text.
- **Verdict chip:** חובה להזמין is an amber chip (13px/700, 9px radius); לדרג is a 1px Outline chip in ink 600. Other verdicts are bare words (see Verdict Word).
- **Would-return chip:** 28px outlined pill with a check, under a restaurant's facts.

### Cards / Containers
- **Corner Style:** 22px.
- **Background:** Panel White on the ground.
- **Shadow Strategy:** none (Flat Panel Rule).
- **Border:** none; rows inside are split by Hairline dividers.
- **Internal Padding:** rows 14px inline; tiles 14px by 16px (16px in settings).

### Inputs / Fields
- **Style:** 48px, 14px radius, white with an inset Hairline ring; inside a tile, Raised Lilac with no ring. 17px text. Labels sit above in Ink Soft 15px.
- **Search:** 44px white field with a soft magnifier icon; focus draws a 2px inset ink ring.
- **Focus:** 2px ink outline at 2px offset (fields), inset ring (search).
- **Error:** a 1.5px inset Danger Red ring and a 13px red message.

### Navigation
A floating white capsule tab bar, 62px, rounded to a pill, with three line icons and 11px labels; unselected in Ink Soft, selected in ink at 700. Pushed pages use the iOS toolbar on the ground with a soft back chevron and text actions (17px/600). On a restaurant's page the toolbar title fades in (160ms) once the large name scrolls away.

### Verdict Word (signature)
The verdict as a word on the dish's line: חובה להזמין amber chip; טעים ink 600; בסדר and לא משהו Ink Soft 400; לא להזמין Ink Soft struck through; unrated "לדרג" outlined chip.

### Dish Photo (signature)
Rounded-square photo in five sizes (hero, tile, row, small, mini) on a Raised Lilac block; an empty photo shows a faint plate line icon. Fades: dim (55% opacity) for לא משהו, dark (30% opacity, 90% greyscale) for לא להזמין and for a restaurant marked לא אחזור. ביקורים row photos never fade.

### Waiting Line
A 58px white bar (18px radius) on מסעדות: amber dot, up to two overlapping small photos, "N מנות מחכות לדירוג" in 600, and a soft chevron.

## Do's and Don'ts

### Do:
- **Do** round the corners of every panel, tile, bar, button and photo (22px panels, 14px fields and row photos, pills for controls).
- **Do** keep screens calm: plain bold titles on the ground, one line of facts per row, long text (notes) behind a tap.
- **Do** keep amber to the camera action, the חובה להזמין chip and the waiting dot.
- **Do** show a verdict by its word, and show what to skip by fading the photo and softening the name, striking לא להזמין.
- **Do** let the dish photos be the colour; give surfaces only the aubergine neutrals.
- **Do** draw the app icon as solid shapes with soft depth (a deep aubergine fork and knife on amber, inside the maskable safe zone); in-app icons are 1.8px round line icons.
- **Do** press with opacity (65%, 120ms) and focus with a 2px ink outline.

### Don't:
- **Don't** add a coloured header block or band; top-level titles sit as plain text on the ground.
- **Don't** add ornaments: no patterned strips, motif borders, dotted bands or decorative gradients. The only gradients are the functional bar scrim and the filter-row edge fade.
- **Don't** make photos circles or put coloured rims or verdict rings around them.
- **Don't** give verdicts colours of their own or fade a verdict word below 4.5:1.
- **Don't** add a second accent colour or a second typeface.
- **Don't** put more than one line of facts on a row or tile.
- **Don't** ship a dark appearance; the app is light only.
- **Don't** draw app icons as thin outlines or flat two-colour marks.
