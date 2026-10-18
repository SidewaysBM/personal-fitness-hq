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

Deploy `index.html`, `update.html`, `sw.js`, `manifest.webmanifest` **and the complete `assets/` directory together** to the existing repository root. All paths are relative and work under `/personal-fitness-hq/`. Publishing only index.html will omit the guides. Keep private exported workout backups out of this repository. Use the current exact file list in [the release checklist](docs/RELEASE-CHECKLIST.md).

After Pages finishes deploying, open [the update page](https://sidewaysbm.github.io/personal-fitness-hq/update.html) and choose **Apply update and open FORM**. An already current installation offers **Open updated FORM**. Check the dashboard, an exercise guide and an existing saved workout. The update requires no storage migration or restoration. Do not restore a backup just to install an app update.

Offline reopening and an installation manifest are implemented. Browser tests cover offline startup; physical iPhone Home Screen installation still needs verification. Videos require internet access.

## Version 0.5 development update

Use the profile selector to choose Ben or Georgie. Ben's original `form-fitness-v02` key is unchanged; Georgie uses `form-fitness-georgie-v02`. Each has independent programs, records, measurements, restrictions and backups. The selected profile is remembered on the device. This is separation of records, not password protection or phone-to-phone sync. Georgie's initial routines are empty and her profile measurements unset.

- **Exercises → Add exercise:** create a movement with a category, repetitions or seconds, instructions, equipment, notes and an optional HTTPS demonstration link.
- **Exercises → Import workout:** view a local photograph/screenshot alongside editable prescription rows. Local English OCR can extract source text. Review its output, resolve uncertain details and explicitly approve prescriptions before importing. Existing exercise prescriptions and recorded sets are retained.
- **Progress → Activities:** record duration and optional distance, save drafts, confirm completion and correct records. Corrections require fresh confirmation. Activities remain separate from gym-set statistics.
- **Progress → Your training review:** deterministic, confirmed-only summaries, comparable-session progression review flags and four-week reassessment reminders. The local question interface is limited and does not generate programs or alter prescriptions.
- **Progress → Import Apple Health:** preview `export.zip` or `export.xml` locally, filter/page through workouts and explicitly confirm completed activities. Supports workout dates, durations, recognised distance units and explicit workout-level active-energy/heart-rate summaries; no direct Watch connection or route import. Limits: 200 MB selected/expanded XML and 50,000 workouts. ZIP64 requires an unzipped XML file.
- **Settings:** profile-labelled JSON backups, strict restore validation and a downloadable copy of the data replaced by the last restore. Legacy unlabelled backups are treated as Ben's. Back up both profiles separately.

Draft set edits now persist without being counted. A blank repetitions field cannot be confirmed. Corrupt/unsupported saved data opens recovery mode instead of being silently replaced. Failed writes roll back displayed state; conflicting edits from another tab are rejected until reload. New optional fields are added only when their features are used. Existing version-2 data is not rewritten merely by opening the app.

See [earlier development verification](docs/development-2026-10-17.md), [the current release checklist](docs/RELEASE-CHECKLIST.md) and [Apple Health integration pathway](docs/apple-health.md). Generative AI, automated personalised periodisation and native HealthKit integration remain future work. Local screenshot text extraction and user-selected increment calculations are implemented in 0.14; they require explicit review. Subsequent sections describe the implemented offline, programming and review tools.

## Version 0.6 — prescriptions and weekly schedules

- **Exercises → Your workout programs → Edit prescriptions:** choose included movements and edit each routine's sets, repetitions/seconds, per-set loads, rest and instructions. The shared exercise library is unchanged. Blank loads remain unknown.
- **Calendar → Edit weekly schedule:** assign a routine or rest day for each weekday, starting today or a future date. Ben and Georgie have independent schedules. Explicit choices for a single date still take priority. Multiple dated revisions are supported.
- A session's prescription is captured when its first actual entry is saved. Later program/schedule changes cannot rewrite it. Historical actuals remain editable and require reconfirmation after correction.
- Older sessions did not store their original prescription. Before a program change, their current reference is preserved with a **Legacy session** label. This is not a reconstruction of the historical prescription. Recorded values, confirmation flags, timestamps and unknown metadata are retained.
- Recorded dates cannot be reassigned to another routine; choose another date. Skipped exercises, substitutions and additional sessions on the same day remain future work.
- The dashboard and calendar now open on the current local date/month. Progress volume and comparison use saved session units where available; timed or unknown-unit movements are excluded from repetition-based load volume.

See [0.6 verification and publishing instructions](docs/development-2026-10-18.md).

## Version 0.7 — skipped exercises and substitutions

In **Workout**, use **Skip / substitute** beside a movement. Skip remaining sets, resume them, or choose a substitute from the library and enter its targets. Changes apply only to that date and profile. Original prescriptions, original recorded sets and future programs remain unchanged.

Substitute targets start blank: loads and repetitions are not copied from the original movement. Confirm the substitute's actual sets separately. Existing original sets remain editable; correcting any actual set removes its confirmation until confirmed again. A movement already in the session cannot also be its substitute, avoiding ambiguous set identities.

You can remove a substitution before entering its actuals. Once it has recorded entries (including drafts), its snapshot is retained: correct those entries or skip its remaining sets instead. Fully confirmed target sets cannot be marked skipped without first correcting the actual records. Skipped-only days appear as **SKIPPED** in the calendar and never increase verified-workout totals. Session summaries distinguish skipped, substituted, partially confirmed, unconfirmed and unrecorded movements.

JSON backups include session changes and substitute snapshots. **Settings → Export session changes CSV** exports dispositions and notes. The existing set CSV now includes the originally prescribed movement alongside the actual movement performed. See [0.7 verification and publishing](docs/development-2026-10-18-session-changes.md).

## FORM 0.8 — training tools and offline app

Builds on the uncommitted 0.7 session changes. Progress now includes confirmed-only session history, per-movement performance exploration, explicit target review/approve/dismiss, and a 52-week framework extendable by another year at any time. Four-week blocks have editable goals/recovery notes and a final annual review. Reviews are user-authored targets supported by two recorded sessions, not medical or automated readiness recommendations. Approval changes only unstarted routine sessions; changed evidence invalidates an old proposal.

Workout prescriptions can be reordered. A specific session can have notes and separate target amendments (sets, reps/duration, rest and loads) before that movement has actual entries. The original snapshot remains intact. Existing actual entries are corrected through the set controls.

The manifest and service worker cache the app shell for offline reopening after a successful online visit. External videos still require internet. Updates offer **Update in a new tab**; existing forms and timers remain in their original tabs. Settings → Check offline availability also links to the update page. For an older installation without this control, open `update.html` directly. The updater downloads fresh shell assets, bypassing stale HTTP-cache copies, and activates only after an explicit update action. **Increment the cache identifier in sw.js whenever cached application files change in a subsequent release.** Never clear browser storage as a refresh step. No workout data is placed in the shell cache or sent to a server. `npm run test:updates` reproduces legacy multi-tab and stale HTTP-cache updates on desktop Chrome and iPhone-sized WebKit.

See `docs/development-2026-10-18-training-batch.md` for verification, limitations and the combined publishing checklist.

### 0.8.1 follow-on improvements

Adds chart metric/unit controls, dated confirmed records, annual calendar navigation, block/annual evidence summaries, activity totals and weight trends. Progress has section shortcuts. Approval fingerprints now cover exercise definitions and evidence units; skip checks honour session-specific targets. See the combined handover for limitations and verification.

## FORM 0.9 — multiple daily sessions and custom measurements

Workout now offers **Session on this date** and **Add another session**. Each additional session captures an independent plan, actual sets, skips, substitutions, notes and target amendments. Existing daily logs are unchanged. Unrecorded additional sessions can be rescheduled; sessions with entries or skips retain their recorded dates. Progress/history, coaching totals, calendar counts and exports include all sessions. CSV includes a session ID to distinguish records on the same date. The local coach avoids comparing ambiguous repeated sets across multiple sessions on a date.

Progress also supports named custom measurements with explicit units, dated values, notes and correction controls. Measurement CSV includes these plus existing weight/waist entries. JSON backups retain all additional sessions and measurements; legacy backups without these optional fields remain valid.

Custom measurement charts separate each name/unit combination and open correction controls from a bar. Recorded-weight charts also support historical corrections. Calendar month/week views show additional planned sessions on otherwise unscheduled days.

### 0.9.1 — focused workout recording

Optional one-exercise focus mode hides other exercise cards without losing drafts. Previous/next, direct selection and next-unfinished navigation never record or confirm results. Set rows explicitly distinguish targets, saved drafts and confirmed results, including accessible pressed states. Rest after confirming is optional and off by default on a fresh app load; it never confirms a set. The active timer remains reachable on mobile and can be tapped to stop.

The current consolidated publishing checklist and remaining work are in `docs/RELEASE-CHECKLIST.md`.

### 0.9.2 — evidence reviews and weekly summaries

Progression review prompts appear only after two separate dates in the same routine meet all matching target sets with confirmed performance. Repetition-based movements require known prescribed loads matching actual loads; timed movements compare duration. Drafts, substitutions, missing loads, changed targets and mismatched records prevent prompts. Prompts offer a review rather than a new prescription; the proposed target remains blank until the user enters it. Manual proposal evidence is now routine-specific. Old pending reviews whose evidence fingerprint no longer matches must be dismissed and recreated.

Weekly training offers 8/26/52-week views of confirmed sets, distinct training days, sessions, external-load volume and activity minutes. Select a week for its breakdown. Future results and drafts are excluded; days with partial workouts are not presented as full adherence.

### 0.9.3 — organised Progress reports

Progress opens with an Overview. History, Reviews, Activities and Measurements have dedicated report groups, while All reports retains the full view. Section shortcuts reveal the appropriate group. Switching groups does not rerender forms, write workout data, erase unsaved measurement values or reset chart selections. Group choice is temporary UI state and is not stored with training records.

### 0.9.4 — reporting consistency

Dashboard, progress totals, activity totals, weekly charts and coaching report confirmed results through today. Future-dated records are retained in backups/exports and remain accessible from history for correction, but do not inflate these reports. Future entries are labelled in the workout screen and calendar rather than styled as completed training. Previous-performance references exclude future dates. Session counts explicitly include partial sessions; they do not imply a full workout was completed. The dashboard shows the selected session's saved plan, including historical and additional sessions, instead of calling every selected date the next session.

### 0.9.5 — reviewable restore and recovery

JSON restore now compares current and incoming session, confirmed/draft-set, activity and measurement counts plus session date ranges before confirmation. Counts describe saved records across all dates, not completed workouts. Restore replaces rather than merges records. Cancellation writes nothing. A file read is bound to the profile/store selected when it starts, preventing a profile switch from redirecting a restore. Settings can restore the pre-restore copy directly after the same validation and comparison. The existing current records become the new single recovery copy; download older recovery copies before replacing them if needed. Corrupt copies remain downloadable without being loaded into the app.

### 0.10.0 — complete calendar navigation and safe scheduling

Calendar offers day/week/month/year views, date jumps and separate session cards. Unrecorded sessions can move with their saved plans, target edits and notes; existing destination workouts are preserved. Draft, confirmed, skipped and reviewed sessions retain their dates. Session skips never create completed sets, and future entries stay excluded from progress. See `docs/development-2026-10-18-calendar.md` and the combined release checklist.

### 0.11.0 — reviewed text imports and consistent local coaching

Import structured source text into editable draft rows, preserve workout-level instructions and create independent sessions on occupied dates without replacing records. Missing prescription fields must be resolved before import; blank loads stay unknown. Local coaching now shares the progression screen’s strict evidence checks and links to individual sessions with unconfirmed entries. Automatic screenshot reading and external AI remain unavailable. See `docs/development-2026-10-18-import-coaching.md`.

### 0.12.0 — local Apple Health ZIP and larger-history import

Read ZIP or XML exports locally in chunks (200 MB file/expanded XML and 50,000-workout limits), review paged results with date filters, and explicitly select completed workouts. Modern distance statistics are supported; unknown fields stay unknown. Duplicate imports preserve corrections and stale profile imports are rejected. No raw export, heart-rate data or routes are stored. See `docs/development-2026-10-18-health-import.md` for verification, limitations and review steps.

### 0.13.0 — complete target reviews and retained planning evidence

Target proposals now support sets, repetitions/duration, rest and loads, with before/after comparisons, confirmed evidence and explicit resolution dates. Changed records or saved guidance invalidate approval; existing session snapshots remain intact. Training blocks retain dated review evidence, distinguish interim reviews, and summarise the full 52-week horizon at annual checkpoints. No automatic load prescription or clinical readiness inference is introduced. See `docs/development-2026-10-18-planning-reviews.md`.


## FORM 0.14 — screenshot reading and release audit

**Exercises → Import workout → Read screenshot text** runs English recognition locally. The first read downloads about 14 MB of static reader files from the app; no workout image or extracted text is uploaded. After a successful online read and controlled app load, those assets support offline recognition. Review the source text and choose **Preview extracted exercises**. Exact library names or `Exercise: name` headings identify rows; explicit sets/reps/duration/kg/rest labels fill fields. Ambiguous values, shorthand, tables and ranges need manual review. Nothing is saved until the reviewed import is confirmed. Complete recognised source text is retained with the imported instructions; the image itself is not stored. Recognition confidence is not verification. Images are limited to 15 MB and 12 million pixels; English only. See [reader licences](docs/screenshot-reader-licenses.md).

Library guides offer **Edit my instructions** for personal instructions, equipment, notes and a demonstration link. Existing recorded session snapshots remain unchanged. Reference guides remain separate from personal notes.

Target reviews offer an optional calculator using an increment the user enters. It requires two separate qualifying sessions, changes only draft fields, and leaves final approval separate. No increment, clinical readiness or automatic load prescription is inferred.

The audit also fixes stale-profile/session forms, cleared workout dates, timer cleanup away from the workout screen and additional-session dashboard access. All seven original workstreams and remaining release gates are tracked in [the current release checklist](docs/RELEASE-CHECKLIST.md). The [optional provider boundary](docs/ai-provider-boundary.md) documents future external integration without enabling it.


## FORM 0.15 — optional automatic review rules

**Progress → Reviews → Progression reviews → My automatic review rules** lets each profile configure its own repetition/duration or per-set kg increment. Rules default disabled and have no default increment. After two separate fully confirmed sessions with matching saved targets, finishing a session prepares a pending proposal. It never applies the proposal: review the before/after values and approve explicitly.

Changed clinician guidance pauses a rule until it is reviewed and saved again. Changed rules invalidate old pending approvals. Dismissal prevents repeating the same rule/evidence proposal. After approval, qualifying sessions against the new target are needed before another draft. Draft sets, future entries, unknown loads and inconsistent units do not qualify. Rules are optional v2 fields, retained by JSON backups, isolated by profile and accepted only after strict restore validation. Old v2 records load without being rewritten; older pending evidence fingerprints may require dismissal and recreation.

This supports user-configured progression, not automatic clinical readiness or clinician-designed periodisation. Recovery/block planning remains an explicit review process.

## FORM 0.16–0.17 — dated targets and Health workout summaries

- **Progress → Reviews → Long-term training framework → Dated training plans → Plan dated targets:** select a workout and dates, optionally from a training block, then review the full targets. Plans apply only inside their date window and cannot overlap for the same workout. Normal routines and saved sessions retain their targets. Cancel an upcoming plan or end an active one from today without rewriting historical plans or actual performance.
- Backup comparison now includes dated plans, training blocks, review/rule counts and schedule changes. Older v2 data remains readable with no load-time rewrite.
- **Progress → Activities → Import Apple Health:** explicit workout summaries may supply active energy and average/maximum heart rate. Unknown/ambiguous values remain absent, with a warning; separate samples are ignored. See the Apple Health pathway for supported fields/units and limits.
- **Correct** can edit or remove optional activity summaries, with fresh confirmation. **Export activities CSV** includes values, source identity and confirmation status. No medical interpretation or energy targets are generated.
- Browser test servers now serve the exercise artwork subfolder, matching the deployed app. These features remain locally implemented; physical iPhone, original prescription/source checks and live release are separate gates.

## FORM 0.18 — reversible Apple Health import history

**Progress → Activities → Health import history → Review import** lists each new import receipt. Review original values before choosing **Undo unchanged activities** or **Restore archived activities**. Undo removes only unchanged imported records from active totals and retains their originals in the profile's JSON backup. Corrected activities, manual activities and gym sessions stay in place. Restore never replaces a current record with the same identity. Older imports remain usable but do not gain invented receipts.

Re-import excludes IDs already saved or archived; use import history to restore archived entries. Different source records with exactly matching start instant, workout type and duration receive a possible-duplicate warning and an additional confirmation before import. These warnings do not merge records or prove they are duplicates.

Receipts and archived counts appear in backup comparisons. Storage failures roll back the complete import/history change. The added history occupies local storage; no export, workout data or receipt is sent to an external service.

## FORM 0.19 — personal exercise preferences

**Settings → Exercise preferences → Set exercise preference** saves a personal label and optional instruction for the active profile. Choose **Preferred**, **Avoid for now**, or **Review before progressing**; choose **No preference / remove** to clear it. No choice is inferred from age, diagnosis or recorded performance. Matched imported copies inherit the library movement's preference.

Avoid/review pauses evidence prompts, calculations, new progression proposals and approval. Optional automatic rules also pause when their saved preference changes and need review before reuse. Existing routines, dated plans, historical prescriptions and actual recording remain available; change future programmes explicitly when needed. The workout, library, prescription editor and substitution chooser show current preferences. The local coach can repeat these user-entered instructions without interpreting medical readiness.

Preferences stay local, separate by profile, work offline and travel in JSON backups. Older version-2 profiles remain readable without a load-time rewrite. See [preference verification and scope](docs/development-2026-10-18-exercise-preferences.md). Athlete artwork remains a separate ongoing workstream.

## Release verification

`npm run check:release` checks matching app/package/cache versions, locally available startup assets, offline coverage, OCR dependencies and a subdirectory-compatible manifest. It rejects recognised private/export paths in Git candidates, including files force-added despite ignore rules. This is a path guard, not a complete content/privacy scanner; review the final commit list too. Keep private material outside the repository.

`npm run test:release` records an application/test file fingerprint, runs the complete application, update and artwork compatibility suites, then checks that those files did not change during the run. A changed candidate fails verification and lists only changed paths. The generated report stays in ignored `test-results/release-candidate.json`; it contains hashes, never workout data. A passing result covers that exact candidate's automated checks. It does not certify new illustrations, original clinical prescriptions, real Health exports, physical iPhone use or live deployment.
