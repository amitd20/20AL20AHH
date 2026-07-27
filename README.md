# Friends Trip Planner

A static, data-driven trip planning website designed for GitHub Pages.

## Architecture

The site separates content from presentation:

- HTML pages define layout.
- JavaScript renders destination data.
- JSON files contain destination-specific content.
- Shared CSS controls the visual language.

## Structure

```text
friends-trip-v2/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── icons/
│   └── images/
│       ├── destinations/
│       ├── activities/
│       └── restaurants/
├── components/
├── templates/
├── data/
│   ├── destinations/
│   │   ├── index.json
│   │   ├── prague.json
│   │   ├── krakow.json
│   │   └── budapest.json
│   ├── hotels/
│   ├── restaurants/
│   ├── flights/
│   └── weather/
└── pages/
    ├── compare.html
    ├── activities.html
    ├── budget.html
    └── destinations/
```

## Add a destination

1. Copy an existing file from `data/destinations/`.
2. Change its `id`, name, content and pricing.
3. Add the ID to `data/destinations/index.json`.
4. Copy an existing destination HTML page and update its `data-destination` value.

## Local preview

Because JSON is loaded using `fetch`, serve the directory with HTTP:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

Upload all files to the repository root and enable GitHub Pages from:

- Branch: `main`
- Folder: `/ (root)`


## Design constraint

The project intentionally avoids all yellow tones. The visual system uses blue, cyan, violet, green and neutral dark shades only.

## Current milestone

Stage 1 completed: visual redesign of the homepage and destination pages.


## v1.0.9
- Added flight comparison module for Prague, Krakow and Budapest.
- Added four fixed date/time scenarios with direct Skyscanner search links.
- Integrated the version number into the site header.
- Flight-specific live details are intentionally not fabricated when unavailable publicly.


## Version 1.0.3

- Added the Flights link consistently to every page navigation.
- Added a prominent flights call-to-action to Prague, Kraków and Budapest pages.
- Added destination anchors inside the Flights page.
- Kept the no-yellow design constraint.

## Version 1.0.9

- Removed the standalone flight comparison page.
- Added a destination-specific flight card above the pros and cons on every destination page.
- Displayed each of the four flight scenarios on its own row with all available parameters.
- Added a direct Skyscanner search link to every flight row.
- Removed Flights navigation links and retained the no-yellow design constraint.


## Version 1.0.13

- Fixed empty destination weather cards.
- Added destination-specific temperature, rain, daylight, sunrise, sunset and comfort data.
- Removed the duplicate three-city weather table from destination pages.

## Version 1.0.14

- Added a Lodging ("לינה") card to every destination page, listing Airbnb options.
- Lodging data lives in `data/lodging/index.json` (one entry per destination), following the same data-driven pattern as flights.
- Added an on-site "הוסף לינה" button that opens a form to add a listing manually; locally-added rows are saved in the browser (`localStorage`, key `lodging:<id>`) and tagged "מקומי".
- Airbnb prices are intentionally not fabricated when unavailable — shown as "בדיקה חיה ב-Airbnb", consistent with the flights module.

### Add lodging

Two ways to add a listing:

1. **Shared / permanent** — paste the Airbnb link to Claude. The details are extracted and written into `data/lodging/index.json`, so everyone visiting the site sees the row. (A browser on GitHub Pages cannot scrape Airbnb directly — CORS blocks it — so this step is done via Claude, not in the page.)
2. **Local / personal** — click **הוסף לינה** on the destination page, paste the link and fill the fields. The row is saved in your browser only and survives refreshes on that device.

## Version 1.0.15

- Lodging card now supports full CRUD in the browser (local overlay model).
- On first visit per destination, the committed `data/lodging/index.json` rows are seeded into `localStorage` (`lodging:<id>`, with a `lodging:<id>:seeded` flag). After that, `data/lodging/index.json` is only the initial seed.
- Every row — JSON-origin or user-added — can be edited (**עריכה**) and removed (**הסרה**); the same form is reused for add and edit.
- Added **איפוס לרשימה המשותפת** to discard local changes and re-seed from the shared JSON.
- All changes are per-device (localStorage) and are not shared. To update the list everyone sees, paste the link/change to Claude to update `data/lodging/index.json`.

## Version 1.0.16

- Centralized the site version: it now lives in a single `SITE_VERSION` constant in `assets/js/app.js`, which renders into every `.header-version` badge on load.
- To bump the version, edit **one line** (`SITE_VERSION` in `assets/js/app.js`) — no need to touch each HTML page. The `v1.0.x` text in each page's header is only a pre-JS fallback.

