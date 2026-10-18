# FORM 0.8 combined local update

Includes the pending 0.7 work described in development-2026-10-18-session-changes.md. This document supersedes that document's publishing checklist. Branch: codex/session-changes. Nothing has been committed or published by this task.

## Delivered

- Skip, resume and substitute exercises; preserve original prescriptions and actual entries.
- Per-date target amendments and session notes. Once a movement has actual entries, correct the actuals rather than rewriting its targets. Original prescriptions remain in the snapshot.
- Accessible Move up / Move down controls in the routine editor.
- Confirmed-only history links and per-movement charts. Future entries and drafts are excluded from the new explorer. It shows per-session repetition/duration maxima and highest entered load; it does not estimate one-repetition maximums.
- User-authored progression proposals with evidence from two verified sessions; explicit approval or dismissal. Approval checks that supporting records and programming are unchanged, changes future unstarted sessions only and cannot be repeated. These are not automatic load recommendations.
- Thirteen four-week planning blocks, editable goals/recovery/reassessment notes, annual review on the final block, review completion and unlimited further 52-week extensions. These are planning metadata, not generated exercise prescriptions.
- Installable manifest, original app icons and cached offline startup. Application updates wait until existing app tabs close. External videos need internet.
- Optional, validated additions to the existing v2 data format. No storage-key changes, automatic load-time writes or rewriting of legacy records. New fields travel in JSON backups. Missing new fields in old backups are supported.

## Verification

Full existing suite passed: HTML, storage/conflicts/quota, legacy preservation, imports, coaching, programming, session changes and Chrome plus iPhone 13/SE WebKit browser checks.

Additional unit and browser checks cover proposal approval/staleness/history preservation, future/draft exclusion, movement ordering, session target locks/notes, chart navigation, multi-year planning, profile isolation, persistence and JSON backup/restore. Chrome verified actual offline page reload and offline recording. Screenshots reviewed for mobile layout.

Not verified on a physical iPhone or the live website. Home Screen installation and offline restart on a real iPhone remain user checks. No real Apple Health export or external-video playback was tested in this batch.

## Project status

| Workstream | Status | Remaining |
|---|---|---|
| Stability and data protection | Core tested | Physical devices and live 0.8 verification |
| Exercise/workout management | Partial | Multiple sessions per day, richer demonstrations and advanced editing |
| Independent Ben/Georgie profiles | Core complete | Device-to-device transfer remains manual backup/restore |
| Progression | Partial | Automatic individualised proposal generation; clinician-informed rules |
| Activities and progress | Partial | Richer activity/measurement trends and custom metrics |
| Coaching and screenshot import | Partial | Automatic extraction and generative coaching; external service approval if needed |
| Apple Health | Partial | Real export checks, ZIP/large exports and broader metrics |
| Long-term programming | Foundations complete | Adaptive periodisation and structured annual analytics |
| Offline PWA | Browser tested | Physical iPhone installation and offline verification |
| Deployment | Pending | Combined commit, merge, push and live check |

## Exact commit contents

All current changed/untracked files belong to the combined 0.7/0.8 batch:

- README.md
- index.html
- package.json
- package-lock.json
- manifest.webmanifest
- sw.js
- assets/coaching.js
- assets/data-store.js
- assets/exercise-guides.css
- assets/program-editor.js
- assets/session-changes.js
- assets/training-tools.js
- assets/training-ui.js
- assets/offline.js
- assets/icon-192.png
- assets/icon-512.png
- tests/browser.cjs
- tests/coaching.cjs
- tests/program-browser.cjs
- tests/session-changes.cjs
- tests/session-changes-browser.cjs
- tests/training-tools.cjs
- tests/training-browser.cjs
- docs/development-2026-10-18-session-changes.md
- docs/development-2026-10-18-training-batch.md

## Completion steps

1. Open http://127.0.0.1:8765/. Refresh normally. Review Progress (history, target reviews, framework), Exercises (Edit workout prescriptions and ordering), Workout (session targets, notes, skip/substitute). Do not confirm invented results in your real profile.
2. In Settings, export a JSON backup for each profile with records before publishing.
3. GitHub Desktop: repository personal-fitness-hq, branch codex/session-changes. Select the files above. Summary: `Add reviewed progression, session editing, history and offline planning`. Click Commit to codex/session-changes.
4. Current Branch → main. In the Mac menu bar choose Branch → Merge into current branch… → codex/session-changes → Create merge commit. Click Push origin.
5. Wait for the latest GitHub Actions Pages deployment to turn green. Open https://sidewaysbm.github.io/personal-fitness-hq/ and refresh normally. Confirm Version 0.8 in Settings, existing history and both profiles.
6. In Settings select Check offline availability. After it reports ready, reload once online, then disconnect and reopen. On iPhone use Safari → Share → Add to Home Screen, then test offline reopening. Reconnect afterwards. Do not clear website data.

## Follow-on work: 0.8.1

Continued without requiring a commit. The exact 25-file commit list above still applies.

- Added separate rep/duration, external-load and volume chart controls, and dated best confirmed set/load records. Units are selected explicitly so duration and repetition results are not combined. Unknown loads are displayed as unknown.
- Progress section shortcuts reduce navigation scrolling.
- Annual calendar overview with direct year entry and month navigation. Planned dates and dates with confirmed sets are counted separately; neither implies a full workout was completed.
- Block/annual reviews now show confirmed session dates, sets, load volume and activity minutes for their review period.
- Confirmed activity totals by category and recorded-weight trend. Draft/future activities are excluded from new totals; distance totals state how many entries supplied distance.
- Fixed approval invalidation when underlying exercise definitions change; proposals reject mismatched evidence units.
- Fixed skip checks to use session-amended targets.
- Cache version advanced to 0.8.1. Close existing local FORM tabs and reopen to load an update if the previous service worker is already controlling them; do not clear site data.

Existing regression suite passed, and focused desktop/iPhone tests cover the new chart selectors, annual calendar, unit separation and persisted review summaries. Final focused suite also checks activity totals and weight trend rendering. Physical-device and live verification remain outstanding.

Use the same publishing steps above when ready, with Summary: `Add verified progress records, annual planning and offline workout tools`. Expect Version 0.8.1 on the live website after publishing. No commit or deployment was performed here.

### Concurrent file change observed

At the final status check, `assets/exercise-art.js` also showed edits that were not made in this task. They have been preserved and are separate from this batch's 25-file list. Do not use “select all” blindly when committing this batch. The ownership and visual review of those artwork changes should be handled with the work that produced them.

## Follow-on work: 0.9

- Multiple same-date workouts with independent saved plans, actuals, substitutions, skips, target amendments and notes. The primary legacy log remains unchanged.
- History routes back to the exact session. Counts and volume include all sessions. Calendar date totals combine confirmed sets while preserving session separation.
- CSV sets and changes include session_id. JSON retains optional extraSessions and customMetrics; strict validation rejects duplicate IDs, invalid dates, missing plans and invalid measurements. Legacy loading remains write-free.
- Unrecorded additional sessions can be rescheduled without replacing a destination session. Recorded entries/skips lock the date.
- Named custom measurements with units, notes, corrections and CSV export, separate from workout completion.
- Exercise comparison in the local coach declines ambiguous same-date repeated sets rather than matching unrelated sessions.

Add these files to the exact combined commit list above:

- assets/program.js
- tests/multiple-sessions.cjs
- tests/multiple-sessions-browser.cjs

The combined batch therefore has 28 files, excluding the separately changed assets/exercise-art.js. Current branch remains codex/session-changes. Nothing was committed or pushed by this task. Summary when ready: `Add multiple daily workouts, verified progress and offline planning`. Expect Version 0.9 after publishing.

Additional verification: same-day session creation and switching, independent actuals/notes/skips, original snapshot preservation, history routing, combined totals, CSV identity, JSON restore, profile isolation, empty-session rescheduling and custom measurement correction. Chrome and iPhone 13/SE browser checks; physical iPhone and live deployment remain outstanding.

Review locally: Workout → choose a date → Add another session → choose routine → Save. Switch using Session on this date. Progress → Custom measurements → Add measurement; click a saved measurement to correct it. Use test data only in a separate test browser/profile; do not confirm invented performance in your real history.

Remaining: richer reviewed demonstrations, custom-metric charts, automated screenshot extraction, broader real-world Apple Health imports, automatic personalised coaching/progression and adaptive periodisation. Physical device installation and live verification require publishing and access to the user's phone. Cloud/paid/external AI features remain approval-dependent.

Final 0.9 additions: custom-measurement trend selection keeps different names/units separate; chart bars open record corrections. Recorded-weight bars open historical date/weight/waist corrections. These changes were browser tested with synthetic data. Extra planned sessions now appear in the month/week calendar even on a day without a primary routine. Changing workout date stops the previous session's rest timer.

The separate artwork work also created docs/exercise-art-review-2026-10-18.md. It is preserved and excluded from this batch's 28-file list alongside assets/exercise-art.js.

## Current release checklist

0.9.1 adds focused workout recording, direct/previous/next/unfinished exercise navigation, explicit saved-draft/confirmed labels, accessible confirmation state and optional rest-after-confirmation. Final verification includes draft preservation across focus navigation, no writes from navigation alone, timer start/stop and mobile layout. The current consolidated 29-file commit list and publishing steps are in RELEASE-CHECKLIST.md; that document supersedes all earlier publishing sections here.

## 0.9.2 evidence review pass

Added automatic, read-only review prompts using full confirmed targets on two distinct dates in the same routine, with known loads for repetition-based movements. Clicking a prompt preselects its routine/movement and shows evidence but leaves the proposed target blank. Correction of a supporting set automatically withdraws the prompt. Pending reviews are not duplicated by prompts. The feature does not recommend clinical progression or change any prescription automatically.

Added 8/26/52-week summaries separating confirmed sets, distinct training days, sessions, load volume and activity minutes, with selectable weekly breakdowns. Tests cover incomplete/missing/future/changed evidence, multiple same-day sessions, no writes from navigation, and UI withdrawal after a correction on desktop Chrome and iPhone 13/SE WebKit. Current consolidated commit list: 30 files in RELEASE-CHECKLIST.md. Nothing committed or published.

## 0.9.3 report navigation

Organised Progress into Overview, History, Reviews, Activities and Measurements, with All reports available. Section shortcuts reveal hidden sections before navigating. Switching groups preserves DOM input state and chart selections without data writes. Existing end-to-end tests use the explicit All reports route; dedicated tests verify actual group visibility, accessible pressed state, unsaved measurement preservation, chart selection preservation and unchanged stored records on Chrome and both iPhone sizes. Current release checklist remains 30 batch files.

## 0.9.4 consistency audit

Fixed older dashboard/progress/activity totals that included future results while newer reports excluded them. Reporting now consistently uses confirmed results through today. Future records remain in full history, backups and exports with exclusion labels; actual records are not modified. Calendar entries for future actuals no longer use completed styling; previous-performance references exclude future dates. Renamed session counts to avoid implying complete workouts. Dashboard session name comes from the saved snapshot and its heading accurately says selected session/week.

Additional synthetic browser checks verify matching dashboard/progress/coaching totals, excluded future activity minutes, retained future history navigation, correct historical dashboard plan and unchanged storage during navigation. Current release checklist remains 30 files. No commit or deployment performed.

## 0.9.5 backup/restore improvements

Added a current-versus-incoming comparison before restore, including primary/additional sessions, confirmed/draft sets, activities, measurements and session date range. Explicit replacement/no-merge and single-recovery-copy wording. Added direct pre-restore recovery with the same validation, profile checks and storage-conflict protections. Async file selection captures the intended profile/store and rejects a changed profile. Read errors reset the file input for a retry.

New tests cover summary counts/no mutation, cancellation/no writes, recovery swaps, snapshot-write failures, corrupt recovery copies, profile mismatch and stale-profile rejection across Chrome and iPhone 13/SE. Current exact commit list is 32 files in RELEASE-CHECKLIST.md. Nothing committed or published.
