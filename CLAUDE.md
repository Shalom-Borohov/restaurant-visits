# CLAUDE.md

## What this is

מסעדות: a personal iPhone PWA recording restaurant visits and the dishes ordered, each with an optional photo, price and word verdict, so a revisit starts with "order this, skip that". Hebrew, RTL. Everything lives in IndexedDB on the device, with a zip backup file (`data.json`, `photos/<dish id>.jpg` and `thumbnails/<dish id>.jpg`).

## Commands

- `npm run dev`: Vite at `http://localhost:5173/restaurant-visits/`. The app uses a hash router.
- `npm test`: the Vitest suite. One file: `npx vitest run test/unit/repo.test.ts`.
- `npm run lint`: oxlint.
- `npm run build`: `tsc -b && vite build`. This is the type check.

## Sources of truth

- `docs/specs/2026-11-10-restaurant-visits-design.md`: numbered decisions. Add new behaviour there as a new numbered decision.
- `PRODUCT.md`: product principles.
- `DESIGN.md` and `.impeccable/`: the visual system.

## Architecture

Imports go downward only: `pages` → `components` → `photo` → `data` → `copy` → `domain`. A folder may skip levels downward, never import upward, so `domain` imports nothing and `copy` only imports `domain` (date parsing, types).

- `src/domain/`: pure functions over restaurants, visits and dishes, with no React or Dexie. `types.ts` holds the valibot schemas; `restaurantDishes.ts` groups a restaurant's dishes by name across visits.
- `src/data/`: the Dexie database, the repo and backup. Writes go through `repo.ts`, which parses with the schemas. Photo bytes live in their own `photos` and `thumbnails` tables keyed by dish id; a dish's `hasPhoto` says whether one exists. Deletes cascade restaurant → visits → dishes → photos and thumbnails. New fields must be optional so old backups still import. `RecordsProvider` runs the one live query of all records; screens read it with `useRecords()`.
- `src/photo/`: shrinking photos and turning their bytes into object URLs.
- `src/components/`: UI shared by several screens (plates, photo inputs, choice pills, text fields).
- `src/pages/<feature>/`: one folder per screen, each with its own `copy.ts` and CSS.

## Tests

- `test/unit` covers logic and data. `test/ui` renders screens with `renderAt(path)`.
- Storage isn't mocked: `fake-indexeddb` backs the real Dexie database. Call `resetDb` in `beforeEach`.
- `test/helpers/records.ts` builds restaurants, visits and dishes; `freezeDate` pins "today".
- jsdom has no canvas, so photo shrinking is stubbed in UI tests. Check photo and CSS changes in a browser.
