# FORM. Personal Fitness HQ

A private, local-first fitness app hosted as static files on GitHub Pages. No runtime build or package installation is needed. Workout records stay in the browser under the existing `form-fitness-v02` storage key.

## Run locally

Serve this directory with any static HTTP server, for example `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/`. Localhost uses separate browser storage from the live site. It does not automatically contain your live workout history.

## Exercise guidance

All 16 original exercises have original two-position SVG diagrams, numbered technique references and links to reviewed demonstration videos. Open a library card or use **Guide** in a workout. The guide never confirms a set or changes a prescription.

- `assets/exercise-guides.js`: instructions, exact demonstrated variations, source links and review dates.
- `assets/exercise-art.js`: original SVG movement sequences.
- `assets/exercise-guides.css`: responsive guide and library styling.
- [Source review and limitations](docs/exercise-sources.md).
- [Development verification](docs/verification-2026-10-17.md).

The guidance is general. Incomplete screenshot details remain unconfirmed, particularly the barbell single-leg squat variation. No new loads, rep targets, warm-ups, supersets or clinical instructions have been inferred.

## Tests

Use Node 24+ and installed Google Chrome:

```sh
npm ci
npx playwright install webkit
npm test
```

Tests run isolated browser profiles with synthetic records. They reproduce the original startup failure, then check desktop Chrome and iPhone-sized WebKit rendering, all six views, all 16 guides, keyboard access, set confirmation/correction, timer, persistence, CSV, JSON backup/restore and existing version-2 data preservation.

`npm run test:videos` is an optional network test for demonstration playback. It runs separately from app tests because publishers, ads, geography and browser restrictions can affect playback. The reviewed video URLs and observation results are in `docs/video-verification.json`.

## Deploy to GitHub Pages

Deploy `index.html` **and the complete `assets/` directory together** to the existing repository root. All paths are relative and work under `/personal-fitness-hq/`. Publishing only index.html will omit the guides. Keep private exported workout backups out of this repository.

After Pages finishes deploying, reload the existing website without clearing browser data. Check the dashboard, an exercise guide and an existing saved workout. The update requires no storage migration or restoration. Do not restore a backup just to install an app update.

Cold offline startup and Home Screen installation are not yet implemented. The loaded page and local diagrams work without external media; videos require internet access.
