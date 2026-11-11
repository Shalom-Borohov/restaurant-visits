# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Stack

React + TypeScript + Vite, Ionic React forced to iOS mode, Dexie (IndexedDB), `vite-plugin-pwa`, `fflate` for the zip backup. The same stack as the owner's אימונים, תפילות and סיימתי apps. Hosted on GitHub Pages; no server.

## Users

One person, the owner, who eats out and orders delivery. Nobody else looks at the app. They log at the table, usually one-handed, photographing each dish as it arrives, and rate it after eating. They come back to a restaurant's page on a revisit, or before deciding where to go.

## Product Purpose

Remember what was ordered at each restaurant, how it was, what it cost and what it looked like, so a revisit starts with "order this, skip that". Success means that on a revisit the owner knows within seconds what to order again and what to avoid.

## Positioning

A private dish-level memory of the owner's own orders, which review sites and delivery apps can't be: they rate restaurants for strangers, not dishes for one person. No account, no social features, no public ratings.

## Operating Context

- Logging happens at the table, in the restaurant's light, mid-conversation: one hand, a few taps, camera first. A dish is saved the moment it's added, so nothing is lost if the phone goes back in a pocket.
- Rating happens later, after eating, sometimes after leaving.
- Revisiting happens before ordering, often standing at the counter or reading a menu: the restaurant's page must answer at a glance.
- Delivery and takeaway are logged too, often at home from the photo library.
- Installed as an iPhone Home Screen web app; works offline.

## Capabilities and Constraints

- A visit: restaurant, date, kind (במקום, משלוח, איסוף), dishes.
- A dish: name (required), optional price in ₪, one photo, verdict, note.
- Dish verdicts, optional: חובה להזמין, טעים, בסדר, לא משהו, לא להזמין.
- A restaurant: name, optional city, cuisine, would-return verdict (אחזור / לא אחזור) and note.
- Search across restaurants and dishes; filters by city and cuisine.
- Photos and data live on the device only, with a zip backup exported by hand.
- Not yet: "try next time" list, spending totals, who I ate with, location-based suggestions.
- Hebrew UI, full RTL. Restaurant and dish names may be in English, so screens mix RTL and LTR text.

## Brand Commitments

- Name: מסעדות. Folder and repo: `restaurant-visits`.
- Voice: quiet and factual, a private record, not a food critic.
- Must feel at home as an iPhone app.

## Evidence on Hand

- Single-user tool: no testimonials, customers or metrics exist, and none should be invented.
- Dish photos are the owner's own, taken at runtime; design mockups use labelled placeholder photos.

## Product Principles

1. Camera first at the table: logging a dish takes one tap to the camera and nothing else is required.
2. The revisit answers at a glance: a restaurant's page leads with what to order and ends with what to skip.
3. Your words, not a score: verdicts are plain Hebrew words, always written out.
4. Never blocked: price, verdict, photo and note can all wait; only a name is needed.

## Accessibility & Inclusion

Touch targets of at least 44pt, usable one-handed. Follows the system text size where Ionic allows. Verdicts must stay readable without relying on colour. Photos carry the dish name as their text alternative.
