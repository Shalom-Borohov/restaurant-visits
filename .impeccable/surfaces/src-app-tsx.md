---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages"]
---

## Scope

The whole app shell and its screens: מסעדות (restaurants list), restaurant page, visit and add-dish sheet, ביקורים, הגדרות. Mode: Operate. Platform: iOS Home Screen web app, Ionic iOS mode, Hebrew RTL. This is a redesign (issues #12 and #13): the owner found the "Glazed plates" look annoying, starting with the big cobalt header, and asked for a new design that ignores the old one.

## Audience and job

The owner, one-handed at a restaurant table: log a dish camera-first; later rate it; on a revisit read what to order and what to skip at a glance.

## Direction contract

THESIS: A calm list where the dish photos are the only strong colour and fading is the verdict: what to order keeps its full colour and size, what to skip fades out and is struck. Refuses a coloured header block, round plates in coloured rims, and tiles that carry more than one line of facts.

OWN-WORLD: "Evening table, light". Pale aubergine-tinted ground #f4f1f5; white panels at 22px radius with hairline dividers rgba(29,22,32,.08); raised surface #ebe6ee; aubergine ink #1d1620, soft #655b6a, faint #7d7382. One accent, amber #f6b443 with dark words #20160a on it, used only for the camera button, the חובה להזמין chip and the dot on the waiting line. Photos are rounded squares (14px in rows, 22px as tiles), never circles and never ringed. Assistant for everything: 800 for titles, 700 for names, 400 to 600 for the rest. No ornament.

STORY: The owner sees a plain title, a search field, one line saying how many dishes wait for a verdict, then their restaurants one line each. On a restaurant's page the must-orders are two large photos, the rest are quiet rows, and the dishes to skip sit faded and struck under לדלג.

FIRST VIEWPORT: Status bar; "מסעדות" 34px/800 as plain text on the ground; a 44px white search field; one row of quiet filter chips; the 58px waiting line with an amber dot and two small photos; one white panel of 76px rows (56px rounded photo, name 17px/700, city and cuisine in soft text, last visit date at the far end). A floating white tab capsule (62px) sits 26px above the bottom, with a separate 62px round amber camera button to its left.

FORM: Evening table, light: position 1 on the ordered list in its light rendition, picked by the owner on 2026-11-15 over the dark original and three other looks. seed:c3e81b48849a455d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

On a restaurant page, two large photos of the dishes to order, and below them the dishes to skip fading into the page.

## Unresolved

- Text that carries a verdict must reach 4.5:1: the picked sketch's struck "לא להזמין" in faint text does not, so the build uses the soft text colour for it and fades only the photo.
- A dark appearance ("Evening table", the dark original) was sketched and not chosen; the app stays light only.

## Reference sketches

- Picked: `.impeccable/mocks/decision/look-evening-light.html` (home, and the restaurant page behind `#restaurant`).
- Dark original, not chosen: `.impeccable/mocks/decision/look-evening.html`.
- Per-screen sketches in the picked look, shown to the owner on 2026-11-15 with the build plan and approved with it: `.impeccable/mocks/screens/restaurants-and-restaurant.html` (a copy of the picked sketch), `visit.html`, `dish-sheet.html`, `visits.html`, `settings.html`. They carry spec 68–76, including the owner's answers on the camera button (72), בסדר under להזמין (71) and the waiting line (70).
- App icon, picked by the owner on 2026-11-15 from four: `.impeccable/mocks/screens/app-icon.svg` (deep aubergine fork and knife on amber, the recommended option, after first picking the white-and-amber one on aubergine; spec 76).
