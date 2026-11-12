# מסעדות: design

A personal iPhone PWA that records what its owner ordered at each restaurant, how it was, what it cost and what it looked like, so that on a revisit they know what to order and what to skip. This file is the source of truth for product behaviour. New behaviour is added as a new numbered decision: "(added YYYY-MM-DD, extends/clarifies N)".

## Decisions

### What gets recorded

1. **One entry is a visit with its dishes.** The restaurant is picked once per visit, and each dish has its own photo, price and verdict. Why: the revisit question is about specific dishes, and a visit groups them by date. Decided by the owner on 2026-11-10.
2. **A dish verdict is one of five words:** חובה להזמין, טעים, בסדר, לא משהו, לא להזמין. Why: words answer "should I order this again?" directly; the owner found three levels too coarse and chose five. Decided by the owner on 2026-11-10.
3. **A dish can be saved without a verdict and rated later.** Why: dishes are added when ordered and judged after eating. Unrated dishes are listed on the restaurants screen until rated.
4. **A dish has a name (required), and an optional price in ₪, verdict, note and one photo.** Why: only the name is needed to recognise the dish again; everything else must never block logging.
5. **One photo per dish.** Decided by the owner on 2026-11-10.
6. **A visit has a date and a kind: במקום, משלוח or איסוף.** The date defaults to today and can be changed to an earlier day; future dates are not allowed. The kind defaults to במקום. Why: delivery and takeaway orders are part of the history too (owner, 2026-11-10), and past visits can be entered later.
7. **The visit total is the sum of its dish prices.** There is no separate amount-paid field. Why: spending totals are out of the first version (decision 30), so tips and split bills don't need recording yet.
8. **A restaurant has a name (required) and an optional city, cuisine, would-return verdict (אחזור / לא אחזור) and note.** Why: the owner wants a restaurant-level verdict and note ("book ahead", "slow service") apart from the dishes, and city and cuisine to filter by (owner, 2026-11-10).
9. **City and cuisine are free text that suggests earlier values.** There is no outside places lookup. Why: no account, key or network needed, and the owner's own words are enough to filter by.
10. **Two branches of a chain are two restaurants if entered that way.** Why: dishes and service differ between branches; the owner decides by how they name them.

### Dishes across visits

11. **The same dish ordered again is recognised by its name within the restaurant,** ignoring case and surrounding spaces. Why: there is no menu table to keep up to date; the owner's own name for the dish is the key.
12. **Typing a dish name suggests the restaurant's earlier dishes.** Picking one fills in the name exactly, so it groups with the earlier orders.
13. **A restaurant's page shows each dish once,** with its latest verdict, latest price, latest photo and how many times it was ordered. "Latest" means the most recent visit date, then the most recently added on a tie. A latest dish with no verdict shows the most recent verdict it had.
51. **Likewise, a latest order with no price or photo shows the most recent price and photo the dish had.** The order count shows only when a dish was ordered more than once, and tapping a dish opens its latest visit. Why: a revisit should still show what the dish costs and looks like (added 2026-11-10 from spec review, clarifies 13).
14. **Dishes are sorted best verdict first:** חובה להזמין, טעים, בסדר, לא משהו, לא להזמין, then unrated. Ties go to the most recently ordered. Why: the top of the page answers "what to order", the bottom "what to skip".
15. **Verdicts are always written as words, never shown by colour alone.** Why: accessibility (WCAG 1.4.1), and the words are the owner's own scale.

### Screens

16. **The tabs are מסעדות, ביקורים and הגדרות.**
17. **מסעדות lists restaurants, most recently visited first,** with a search field, city and cuisine filters, the unrated dishes above the list, and a button to log a new visit.
18. **Search covers restaurant names, cities, cuisines, dish names and notes.** Results are restaurants and dishes; tapping a dish opens its restaurant. Why: "where did I have that good shakshuka?" (owner, 2026-11-10).
19. **ביקורים lists visits newest first,** each with the restaurant, date, kind, dish count and total.
20. **Logging a visit starts by picking a restaurant or adding a new one,** then adding dishes one at a time. A dish is added from a sheet with the camera button first.
33. **Each dish is saved the moment it is added, and a new visit is saved together with its first dish.** Leaving a new visit before adding a dish leaves nothing behind. Why: nothing is lost if the phone goes back in a pocket mid-meal, and no empty visits pile up (added 2026-11-10, clarifies 20).
21. **Everything can be edited and deleted.** Deleting asks for confirmation. Deleting a visit deletes its dishes and their photos; deleting a restaurant deletes its visits too.
39. **On the visit screen, the main "צילום מנה" button opens the camera in one tap,** and the dish sheet opens with the photo in place; cancelling the camera opens nothing. A smaller "מנה בלי תמונה" opens the sheet empty, where the camera and library stay available. Why: PRODUCT principle "Camera first at the table" (added 2026-11-10, clarifies 20 and 22).
40. **The unrated list on מסעדות shows up to 8 dishes in a sideways row,** with "ועוד N" for the rest, and is hidden while searching. Tapping one opens its visit (added 2026-11-10, clarifies 3).
49. **The unrated list names the restaurant and date once in its heading when every waiting dish is from one visit; otherwise each dish shows its own restaurant.** Why: a heading naming one restaurant over dishes from several would mislabel them (added 2026-11-10, clarifies 40).
41. **A restaurant tile shows its best dish and, only when one exists, its worst:** a dish rated לא משהו or לא להזמין that isn't the best. A best dish not yet rated shows "לדרג" (added 2026-11-10, clarifies 17).
42. **The city and cuisine filters also narrow search results,** with one city and one cuisine at a time; tapping a pill again clears it (added 2026-11-10, clarifies 17 and 18).
43. **Dish name suggestions are up to six pills matching any part of the typed name;** a price is a non-negative number with up to two decimals, comma or point. Save stays off while the name is blank or the price invalid. The data layer enforces the same price rule and refuses future visit dates, so no screen can store them (added 2026-11-10, clarifies 4, 6 and 12).
50. **A dish price is at most ₪100,000.** Why: without a cap, a long run of digits looked valid in the form but failed to save (added 2026-11-10, clarifies 43).
44. **City and cuisine suggestions come from the other restaurants' values.** A restaurant's page keeps "ביקור חדש כאן" docked above the tab bar, in thumb reach on long pages, as the compact camera plate in the trailing corner so it never covers a dish's verdict (added 2026-11-10, clarifies 9 and 20; plate form from the finish review).
60. **A visit opens inside the tab it was opened from.** From מסעדות (a restaurant, a dish, an unrated dish, "ביקור חדש") the visit stays in the מסעדות stack with that tab selected; from ביקורים it stays in ביקורים. Deleting a visit returns to its restaurant from מסעדות and to the visits list from ביקורים. Why: on iPhone, drilling into an item never switches tabs (added 2026-11-10 from the finish review, clarifies 19 and 20).
61. **The dish sheet's verdict chooser is a glaze scale:** the five words in order, each in its own verdict colour (outlined at rest, filled when chosen, לא להזמין struck), laid out without a lone pill. Why: 37, the colour of a chosen verdict must match its rim (added 2026-11-10 from the finish review, clarifies 37).
47. **Restaurants visited on the same day are ordered by which visit was logged last.** Why: lunch and dinner on one day should still put dinner first, not a random order (added 2026-11-10 from review, clarifies 17).
52. **The unrated list ignores the city and cuisine filters, lists newest visit first, and "ועוד N" is a count only;** the rest appear as earlier ones are rated. Restaurants never visited come after visited ones, newest added first. Why: unrated dishes are a to-do, not a place query (added 2026-11-10 from spec review, clarifies 17, 40 and 42).
53. **ביקורים groups visits under month headings; each row shows up to four plates of its dishes, then "+N". These plates carry a plain rim, not a verdict colour,** since there's no room for the words beside them. Why: spec 15, never colour alone (added 2026-11-10 from spec review, clarifies 19).
54. **A visit total sums the dishes that have a price and is hidden when none do** (added 2026-11-10 from spec review, clarifies 7).
55. **Deleting a visit's last dish deletes the visit too, and the confirmation says so.** Why: 33, no empty visits (added 2026-11-10 from spec review, clarifies 21).
56. **A new restaurant chosen while logging is saved together with the visit's first dish.** Leaving before the first dish leaves no restaurant behind (added 2026-11-10 from spec review, clarifies 33).
57. **A saved visit can be moved to another restaurant** from the visit screen, through the same restaurant picker. Why: 21, everything can be edited; deleting and relogging would lose the photos (added 2026-11-10 from spec review, clarifies 1 and 21).
58. **If a camera photo can't be read, the dish sheet opens without it and says so.** Why: PRODUCT principle "Never blocked" (added 2026-11-10 from spec review, clarifies 39).
59. **Restoring a photo that has no thumbnail uses the photo itself as the thumbnail** (added 2026-11-10 from spec review, clarifies 29 and 46).
48. **A city or cuisine filter whose value no restaurant has any more is dropped.** Why: after deleting or renaming the only restaurant with that value, its pill disappears and the list would stay filtered with no way to clear it (added 2026-11-10 from review, clarifies 42).
64. **הגדרות has a "משוב" tile with "דיווח על באג / הצעה", between the backup and the version line. It opens a sheet that turns a bug report or an idea into a GitHub issue on this repo.**
    - The sheet opens on באג. The open button stays off until there is text.
    - "פתיחה ב-GitHub" opens a prefilled new issue outside the app, labelled `bug` or `feature`. The title is the first line, up to 80 characters, cut at a whole character with "…".
    - The body adds a "מכשיר" section: the browser, the version with its build time in ISO UTC (exact whatever the phone's time zone, and it matches the deploy log), persistent storage ("אחסון קבוע: כן/לא"), space used ("נפח בשימוש: 1.2 MB") and whether it was sent from the installed app ("אפליקציה מותקנת: כן/לא"). A value the phone doesn't report reads "לא ידוע". The values are read when the sheet opens, so the tap opens the link at once.
    - The link is at most 4,300 characters, the limit prayer-log measured for GitHub to keep a signed-out user's way back to the report. A longer report is cut at a whole character and marked "… (הדיווח נחתך כאן)", with the device section kept after the mark. The sheet then notes that the rest can be copied from it.
    - Once GitHub opens, ביטול becomes סגירה and the sheet says to tap again if GitHub didn't open. Like the restaurant edit sheet, it closes only with its button. Closing discards the text, and the sheet opens empty again on באג. Why: by the time סגירה shows, the text is in GitHub, and asking before every close would get in the way.
    - No restaurants, visits or photos are sent: the issue is public (25). The space used includes the app's own files, so it says nothing about how much is logged.
    - Why: the same feedback path as the owner's other apps. It needs no token or server. Photos make storage the likeliest cause of lost data, so the storage lines answer the first follow-up question. Decided by the owner on 2026-11-12 (added 2026-11-12, issue #4).
65. **The bottom of הגדרות shows "גרסה <version> · עודכנה <build date and time>".** The version is the semver in `package.json`. Every PR that ships raises it: the minor number for features, the patch number for fixes. PRs that change only CI, docs or dev dependencies keep it. The build time is stamped in at build time. Why: it's easy to tell whether the phone has the latest deploy, as in the owner's other apps. Decided by the owner on 2026-11-12 (added 2026-11-12, with 64).

### Photos

22. **The dish sheet opens the camera directly, with a smaller "from the library" option.** Why: one tap to the camera matters most at the table; the library covers delivery and after-the-fact logging. Superseded by 39: the one-tap camera is the visit screen's main button, and the sheet keeps both camera and library buttons.
23. **Photos are shrunk when picked** to at most 1600 px on the long edge, as JPEG. Why: full-size iPhone photos (3–5 MB each) would fill the phone's storage for the app and make the backup too large to share.
24. **Photo bytes are kept in their own table, apart from dishes.** Lists only load the photos they show.
34. **The camera button uses a file input with `capture="environment"`; the library option uses one without `capture`.** Both accept `image/*` only, never `image/heic`. Why: WebKit opens the rear camera directly with `capture` and delivers JPEG; listing HEIC makes Safari transcode other formats to it (WebKit bug 303803). Library photos may still arrive as HEIC, which Safari 17+ decodes (added 2026-11-10, clarifies 22).
35. **A photo is shrunk while it is decoded,** with `createImageBitmap` resize options, then drawn to a canvas and saved as JPEG; the bitmap and canvas are released right after. EXIF orientation is applied by the browser. Why: decoding a 48 MP photo at full size takes about 195 MB on the phone (added 2026-11-10, clarifies 23).
46. **Each photo is kept twice: the shrunk photo and a thumbnail of at most 240 px, made from the same decode.** Plates in lists show the thumbnail; only the dish sheet loads the full photo. Why: a list of a few hundred restaurants would otherwise read and decode over 100 MB to fill 58 px circles (added 2026-11-10, clarifies 23 and 24).
36. **Export builds the zip, then opens the share sheet; if iOS refuses because the tap is too old, a "שיתוף" button appears to share the ready file with a second tap.** Photos are stored in the zip uncompressed. Why: iOS allows a share only within 5 seconds of a tap, and JPEGs don't compress further, so zipping is quick in the usual case (added 2026-11-10, clarifies 27).

### Data and backup

25. **Everything lives on the device in IndexedDB.** There is no account and no cloud. Why: matches the owner's other apps and keeps the data private. Decided by the owner on 2026-11-10, knowing a lost phone without a recent backup loses the photos.
26. **The app asks the browser to keep its storage persistent.**
27. **The backup is one `.zip` file** named `restaurants-backup-YYYY-MM-DD.zip`, holding `data.json`, `photos/<dish id>.jpg` and `thumbnails/<dish id>.jpg` (thumbnails added 2026-11-10 with 46). It is built as a stream, so the phone never holds several copies of every photo at once. It is handed to the iOS share sheet, with a download link where sharing files isn't supported. Why: a zip keeps photos as plain JPEGs, about a third smaller than embedding them in JSON.
28. **A backup is restored whole or not at all,** after a confirmation. An invalid file leaves the data untouched and says so.
45. **A backup that reads but fails while restoring rolls back and reports the same "not a valid backup" message.** A dish's photo flag is set from the photo files actually in the zip, not from `data.json` (added 2026-11-10, clarifies 28).
29. **New fields must be optional,** so older backups still import.

### Later, not in the first version

30. **Not yet: a "try next time" list, spending totals, who I ate with, suggesting the restaurant by location.** Decided by the owner on 2026-11-10.

### Look and feel

31. **Hebrew, right to left, Ionic in iOS mode,** like the owner's other apps.
32. **The visual direction is chosen through impeccable** from options that differ at a glance, with rounded shapes. Recorded in `DESIGN.md`.
37. **The look is "Glazed plates":** Armenian ceramics of Jerusalem. Each dish photo is a round plate whose rim colour carries the verdict (cobalt חובה להזמין, turquoise טעים, ochre בסדר, clay לא משהו, manganese brown לא להזמין, struck), always with the word beside it. Cobalt is the shell. Chosen by the owner on 2026-11-10 from four options (clarifies 32).
63. **The app icon is a place setting:** a white plate with a fork on one side and a knife on the other, on cobalt, drawn as solid shapes with soft depth. Chosen by the owner on 2026-11-11 after two rounds; thin outline drawings and the first plate-with-dots icon were rejected (added 2026-11-11).
67. **The app icon has no plate: just the fork and knife, side by side in the centre, larger, with a clear gap between them,** in the same solid shapes with soft depth on cobalt. They stay inside the maskable safe zone. Why: with the plate the icon felt cramped (added 2026-11-12, issue #9, changes 63).
62. **Top-level headers are plain cobalt with no ornament.** The painted band of turquoise scallops and ochre dots was removed. Why: the owner found it read as polka dots, unclear, too busy, and clashing with the cobalt; the plates carry the ceramic world on their own. Chosen by the owner on 2026-11-11 from three options (plain, glaze ring, scalloped edge) (changes 37).
66. **An empty field shows its Hebrew placeholder right to left. Typed text takes the direction of its first letter, so English names read left to right.** Why: with no text, a `dir="auto"` field falls back to left-to-right and lays out a Hebrew placeholder backwards, with its punctuation on the wrong side (added 2026-11-12, issue #6, clarifies 31).
38. **Light appearance only, like the owner's other apps.** Why: the glaze-white world is a light one; a dark appearance can follow if evening use at the table proves glaring (added 2026-11-10).
