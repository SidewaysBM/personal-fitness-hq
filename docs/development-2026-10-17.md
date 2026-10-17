# FORM 0.5 development handover

## Baseline and repository state

- Latest fetched `origin/main`: `ef890bb` (`Update browser.cjs`). The downloaded live `index.html` matched the checkout byte-for-byte before development. This checks HTML identity, not deployment of every asset.
- The original baseline suite passed in installed desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit (375 px). No repair of the resolved startup conflict was needed.
- Work is on `codex/protect-local-records`. Changes are uncommitted; there are no new commits awaiting Push origin. This update has not been deployed or verified live.
- Existing changes were present in `AGENTS.md`, `README.md`, `assets/exercise-guides.js`, `assets/exercise-videos.js`, `tests/browser.cjs`, and untracked `tests/embedded-videos.cjs`. Those were preserved. README and browser tests now also include this update.

## Implemented

1. Modular, validated storage boundary with no load-time migration. Corrupt records remain untouched; a recovery screen can download their original bytes. Saves reject stale tabs, handle quota failures without reporting success, and retain a pre-restore snapshot before replacing records.
2. Persistent unconfirmed actual set drafts, blank/invalid confirmation checks, correction invalidation, previous-date performance lookup and exclusion of timed holds from repetition-based load volume.
3. Independent Ben/Georgie records and remembered profile selection. Ben's original key and prescriptions remain unchanged. Georgie starts with empty routines and no assumed prescription values. JSON exports identify the profile; cross-profile restores are blocked. Original unlabelled backups are assigned to Ben.
4. Custom exercise/activity editor with instructions, equipment, notes and HTTPS demonstration links. Custom links are marked user-supplied, not reviewed.
5. Activity records with duration, optional distance, drafts, explicit confirmation and historical corrections. They have separate totals and do not create gym sets.
6. Deterministic coaching summaries and a limited local question interface sharing the same verified records. Comparable performance flags and four-week reassessment prompts are review suggestions only.
7. Local screenshot reference and manual prescription import, required review, exact-name library matching and retained instructions. Imported workouts add independent prescriptions without modifying existing exercise prescriptions or logs. No automatic extraction provider is connected.
8. Local Apple Health XML workout preview/import with individual confirmation and duplicate detection. Supported subset and native pathway are documented separately.

## Verification

`npm test` includes HTML structure checks, JavaScript parsing, unit tests and browser tests in all three configurations above. Tests use isolated profiles and synthetic records, never the user's live history.

Verified: six-view navigation; startup; existing exercise guides and keyboard handling; set recording, correction, timer and reload persistence; CSV export; JSON restore/download; preserved legacy data and unknown fields; invalid/corrupt backups; quota failures; conflicting storage writes; profile separation and remembered selection; custom instructions; activity draft/confirmation/correction; reviewed workout import without completed sets; Health XML confirmation, duplicate prevention and malformed-workout exclusion; coach responses; new-record backup round trips; no captured application console errors; relative asset loading under `/personal-fitness-hq/`.

Desktop and mobile screenshots were inspected. Form overflow checks cover narrow iPhone layout. Generated screenshots are ignored in `test-results/`.

Not verified: physical iPhone execution, real Apple Health exports, actual external video playback in this turn, cold offline startup, or deployment of this update. Existing embedded-video tests are separate because external publishers can fail independently of the app.

## Data compatibility and remaining work

No rewrite or version increment of stored version-2 records is required. `activities`, custom exercise metadata and exported `backupProfile` are optional additive fields; legacy records remain byte-for-byte unchanged until an explicit edit. The exact previous restore bytes remain locally under the active profile's `-before-restore` key. Downloads of valid recovery copies add a profile label so Georgie's recovery backup can be restored safely. The snapshot is the previous restore only, not an ongoing backup archive.

The profile selector is not authentication. Both profiles on one device are accessible to its user. Separate phones do not synchronise. Back up each profile separately. Localhost storage is separate from the live website.

Remaining work: cold offline PWA installation; full prescription editing with historical prescription snapshots; independent recurring schedule editing; skipped/substituted exercise records; personalised approval-based load progression; long-term periodisation and annual reviews; automatic image extraction; secure optional generative AI; large/ZIP Health exports and richer health metrics; native companion integration. Imported screenshot instructions are preserved as text, not automatically interpreted as supersets or warm-ups. No prescriptions are silently adapted.

## Review locally

Open `http://127.0.0.1:8765/` on the Mac. The existing preview server was verified to serve the current HTML. If it stops, serve this directory with `python3 -m http.server 8765 --bind 127.0.0.1`.

Try switching profiles, creating a custom exercise, entering and reloading an unconfirmed set, recording an activity, and exporting each profile. Use synthetic records in the local preview; live data does not transfer automatically.

## GitHub Desktop publishing

Suggested Summary:

```text
Add protected profiles, verified activities and local coaching/import tools
```

Files for this development commit:

- `index.html`, `package.json`, `package-lock.json`, `README.md`
- `assets/data-store.js`, `assets/activities.js`, `assets/coaching.js`, `assets/workout-import.js`, `assets/health-import.js`, `assets/exercise-guides.css`
- `tests/browser.cjs`, `tests/data-store.cjs`, `tests/coaching.cjs`, `tests/imports.cjs`
- `docs/development-2026-10-17.md`, `docs/apple-health.md`

README and browser tests include preserved edits that were already present. Review those combined diffs. Existing changes to `AGENTS.md`, `assets/exercise-guides.js`, `assets/exercise-videos.js` and `tests/embedded-videos.cjs` are separate from this development update; review and commit them separately if intended. Do not discard them. The automated suite ran against the entire working tree, including those preserved edits.

1. In GitHub Desktop, review the listed changes on `codex/protect-local-records` and commit with the Summary above. Resolve the separate existing changes by reviewing/committing them before switching branches.
2. Publish the development branch for review. When ready, switch to `main`, choose **Branch → Merge into current branch**, select `codex/protect-local-records`, then **Push origin**. Alternatively merge its reviewed pull request into `main`.
3. Wait for the repository's GitHub Pages deployment to finish. Publish `index.html` and all referenced assets together.
4. Open the live site on Mac and iPhone and reload normally. Do not clear website data. Check Version 0.5, the profile selector, Ben's existing history, one exercise guide, and Settings backup download. Select Georgie on her phone and enter her own program. No restore is needed just to install the update.
