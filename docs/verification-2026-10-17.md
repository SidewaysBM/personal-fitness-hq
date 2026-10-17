# FORM 0.4 development verification — 17 October 2026

## Repository and startup

Inspected and fetched GitHub `origin/main` at `25f4cc6db10b50436e3c4e00d240f5d6815d45b2`. That commit already includes the prior startup repair. The live HTML and local starting HTML had identical SHA-256 hashes: `40805f5a0cf39ab672ff5c3bd08fabe735894d761ae06907ea00a284b11e2b90`.

The original `2ddb3c7` revision reproduces a blank screen and Chrome's `Identifier 'top' has already been declared`. Its top-level lexical `const top` collides with the Window property before rendering can start. The latest version uses `pageHeader`; that repair was retained, along with the favicon, mobile Settings access, corrected SVG markup and confirmation counts.

Actual live website startup was checked separately in isolated Chrome and iPhone-sized WebKit profiles: dashboard rendered, with no JavaScript page errors. The new exercise-guide update has **not** been published; the live check verifies the existing startup repair only.

The local branch was fast-forwarded to the inspected upstream commit. An autostash overlap was resolved using the saved completed local file, then the complete test suite was rerun successfully. No user changes were discarded.

## Implementation

- All 16 prescribed exercise IDs have distinct original two-position SVG guides, numbered steps, technique cues and linked demonstrations.
- Library cards are real keyboard-accessible buttons. Workout cards expose the same guide without re-rendering or losing pending set inputs.
- Modal supports Escape, backdrop dismissal, focus trapping, focus restoration, inert background and a persistent close control.
- Previous verified performance is visible in the workout. Prescription and historical information are available inside the guide.
- Guides use a separate static catalogue. No storage key, schema, initial exercise prescription, routine, existing note or historical record is changed.
- Existing customised prescriptions continue to display; custom exercise IDs show a clear no-guide fallback.
- No third-party media loads automatically. External links use `noopener noreferrer` and a no-referrer policy. Videos require internet access and can contain publisher advertisements.
- Ambiguous variations are labelled, especially the rear-foot-elevated example for “barbell single-leg squat”. No clinical approval is claimed.

## Passed verification

`npm test` passed with Playwright 1.64.1, installed Google Chrome and WebKit 27.2 on macOS, using Node 24.16.0. Viewports: desktop 1440 × 1000, iPhone 13 (390px wide), iPhone SE 375 × 667.

- JavaScript parsing and HTML structural checks: closing order, permitted nesting, duplicate attributes/IDs and attribute quoting.
- Real startup and rendering; all six navigation views; no horizontal page overflow.
- All 16 guides opened through UI, each with four steps, two labelled SVG positions and an HTTPS video source. No horizontal overflow in dialogs.
- Escape dismissal, focus cycling/restoration and mobile close controls.
- External video link opens a new tab and retains the workout/guide. This wiring test uses an intercepted destination; actual publisher playback was checked separately.
- Unconfirmed entered reps survive opening/closing a guide. Merely reading guides does not write to storage or confirm anything.
- Set confirmation, edited actual reps/load, removing confirmation on correction, reconfirmation, immediate counts and reload persistence.
- Rest timer start/stop and session completion.
- JSON backup download, changed profile, real restore through file input/confirmation and exact restored-data equality after reload.
- CSV download includes the synthetic verified set's date, actual values and confirmation flag.
- Existing version-2 fixture with altered prescription, old confirmed/unconfirmed records, measurements, routine override, clinician notes, custom exercise and unknown metadata remains byte-for-byte unchanged after reload and guide use.
- Initial schema, original prescriptions and routines compared against upstream and found identical.
- Zero JavaScript or console errors throughout the repaired app flows.
- Relative JS/CSS assets served and tested under `/personal-fitness-hq/`, matching GitHub Pages.
- Desktop/mobile screenshots and all original diagram sequences visually reviewed.
- Actual demonstration playback observed for all 16 selected references; evidence in `video-verification.json`. No third-party media assets copied into the app.

## Remaining limits

No physical iPhone, Safari application, Home Screen installation or cold offline startup test was performed. WebKit emulation is not a physical-device guarantee. The app still has no service worker/manifest. Original physiotherapy screenshots were unavailable, so clinical variation details cannot be certified. New guides do not add a migration, cloud storage, automatic training progression or new prescription values.

Tests use isolated temporary profiles and synthetic data. They never access the user's real browser workout records. Existing malformed-backup handling and broader pre-existing product gaps are outside this update.

## Deployable files

Publish `index.html` and the three files in `assets/` together through the existing GitHub Pages workflow. Development dependencies, tests and synthetic screenshots are not required at runtime. Private exported backups must never be published. See the root README for setup and deployment checks.
