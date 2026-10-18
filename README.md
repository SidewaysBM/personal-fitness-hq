# FORM. Personal Fitness HQ

A private, local-first fitness app hosted as static files on GitHub Pages. No runtime build or package installation is needed. Workout records stay in the browser under the existing `form-fitness-v02` storage key.

## Run locally

Serve this directory with any static HTTP server, for example `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/`. Localhost uses separate browser storage from the live site. It does not automatically contain your live workout history.

## Exercise guidance

All 16 original exercises have original two-position SVG diagrams, numbered technique references and embedded demonstration videos. Open a library card or use **Guide** in a workout. The guide never confirms a set or changes a prescription.

- `assets/exercise-guides.js`: instructions, exact demonstrated variations, source links and review dates.
- `assets/exercise-videos.js`: click-to-load inline players, mobile inline playback and offline feedback.
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

`node tests/embedded-videos.cjs` checks actual playback inside the app. Set `LIVE_URL=https://sidewaysbm.github.io/personal-fitness-hq/` to check the deployed site.

`npm run test:videos` is an optional network test for demonstration playback. It runs separately from app tests because publishers, ads, geography and browser restrictions can affect playback. The reviewed video URLs and observation results are in `docs/video-verification.json`.

## Deploy to GitHub Pages

Deploy `index.html` **and the complete `assets/` directory together** to the existing repository root. All paths are relative and work under `/personal-fitness-hq/`. Publishing only index.html will omit the guides. Keep private exported workout backups out of this repository.

After Pages finishes deploying, reload the existing website without clearing browser data. Check the dashboard, an exercise guide and an existing saved workout. The update requires no storage migration or restoration. Do not restore a backup just to install an app update.

Cold offline startup and Home Screen installation are not yet implemented. The loaded page and local diagrams work without external media; videos require internet access.

## Version 0.5 development update

Use the profile selector to choose Ben or Georgie. Ben's original `form-fitness-v02` key is unchanged; Georgie uses `form-fitness-georgie-v02`. Each has independent programs, records, measurements, restrictions and backups. The selected profile is remembered on the device. This is separation of records, not password protection or phone-to-phone sync. Georgie's initial routines are empty and her profile measurements unset.

- **Exercises → Add exercise:** create a movement with a category, repetitions or seconds, instructions, equipment, notes and an optional HTTPS demonstration link.
- **Exercises → Import workout:** view a local photograph/screenshot alongside editable prescription rows. Automatic image extraction is not connected. Enter known details and explicitly review before importing. Existing exercise prescriptions and recorded sets are retained.
- **Progress → Activities:** record duration and optional distance, save drafts, confirm completion and correct records. Corrections require fresh confirmation. Activities remain separate from gym-set statistics.
- **Progress → Your training review:** deterministic, confirmed-only summaries, comparable-session progression review flags and four-week reassessment reminders. The local question interface is limited and does not generate programs or alter prescriptions.
- **Progress → Import Apple Health:** preview an unzipped `export.xml` and individually confirm workouts. Supports workout dates, durations and recognised distance units; no direct Watch connection, heart rate, energy or route import. Limit: 20 MB and 500 new workouts per file. Processing is local.
- **Settings:** profile-labelled JSON backups, strict restore validation and a downloadable copy of the data replaced by the last restore. Legacy unlabelled backups are treated as Ben's. Back up both profiles separately.

Draft set edits now persist without being counted. A blank repetitions field cannot be confirmed. Corrupt/unsupported saved data opens recovery mode instead of being silently replaced. Failed writes roll back displayed state; conflicting edits from another tab are rejected until reload. New optional fields are added only when their features are used. Existing version-2 data is not rewritten merely by opening the app.

See [development verification and publishing](docs/development-2026-10-17.md) and [Apple Health integration pathway](docs/apple-health.md). Cold offline launch, automatic screenshot extraction, generative AI, full program editing, approval-based progression changes and native HealthKit integration remain future work.

## Version 0.6 — prescriptions and weekly schedules

- **Exercises → Your workout programs → Edit prescriptions:** choose included movements and edit each routine's sets, repetitions/seconds, per-set loads, rest and instructions. The shared exercise library is unchanged. Blank loads remain unknown.
- **Calendar → Edit weekly schedule:** assign a routine or rest day for each weekday, starting today or a future date. Ben and Georgie have independent schedules. Explicit choices for a single date still take priority. Multiple dated revisions are supported.
- A session's prescription is captured when its first actual entry is saved. Later program/schedule changes cannot rewrite it. Historical actuals remain editable and require reconfirmation after correction.
- Older sessions did not store their original prescription. Before a program change, their current reference is preserved with a **Legacy session** label. This is not a reconstruction of the historical prescription. Recorded values, confirmation flags, timestamps and unknown metadata are retained.
- Recorded dates cannot be reassigned to another routine; choose another date. Skipped exercises, substitutions and additional sessions on the same day remain future work.
- The dashboard and calendar now open on the current local date/month. Progress volume and comparison use saved session units where available; timed or unknown-unit movements are excluded from repetition-based load volume.

See [0.6 verification and publishing instructions](docs/development-2026-10-18.md).
