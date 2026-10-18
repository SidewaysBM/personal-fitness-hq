# FORM 0.19.0 — current combined release

All work remains local and uncommitted on `codex/session-changes`. This checklist supersedes publishing steps in earlier handovers and includes the previously separate artwork work. No application deployment has been performed in this task.

The list also includes the separate update-helper changes now present in this workspace, because the test configuration and offline controls depend on them. The artwork changes are also included, following the separate artwork reviews recorded below. The latest male/female isometric single-leg images and their offline dependencies are described in `docs/exercise-isometric-artwork.md`; its 15 remaining illustration conversions are a separate unfinished artwork rollout.

## Cumulative project position

See [the release closure queue](RELEASE-CLOSURE.md) for the finite remaining steps, original-phase acceptance checks and separately retained longer-term requirements.

The user has requested one review when all work is green. Continue authorised development without intermediate review/commit requests. Do not turn unverified gates green. This table distinguishes software checks from final release verification.

| Workstream | Status | Remaining work |
|---|---|---|
| Stability and data protection | [x] 🟢 Complete — implemented and automated checks passed | Physical-device checks are tracked below. |
| Exercise and workout management | [ ] Partial — 🟡 Partial | Full original physiotherapy prescriptions and ambiguous exercise variation still need their source; the separate realistic-artwork rollout has 15 remaining vector illustrations; no missing instructions were invented. Recording, guides, personal notes/preferences, substitutions, targets and calendars are implemented/tested. |
| Independent Ben/Georgie profiles | [x] 🟢 Complete — local profiles tested | Phone-to-phone sync is not enabled or approved. |
| Deterministic progression — original Phase 4 | [x] 🟢 Complete — implementation and automated checks | Evidence calculations, session reviews, four-week checkpoints, explicit approval, dated targets and preference safeguards tested. Broader adaptive programming remains separately outstanding in RELEASE-CLOSURE.md; clinical readiness is not inferred. |
| Expanded activities | [x] 🟢 Complete — categories, drafts, confirmation, corrections, reports | Physical-device checks are tracked below. |
| Coaching and screenshot-import foundations | [x] 🟢 Complete — local foundations tested | Local coach is deterministic. OCR needs readable English and manual resolution of ambiguous layouts; external generative AI remains optional and unapproved. |
| Apple Health import and native pathway | [x] 🟢 Complete — bounded local import tested and pathway documented | Real export/iPhone checks are unverified. Explicit workout-level heart-rate/active-energy summaries are implemented. Live HealthKit and a native companion remain future extensions. |
| Offline PWA, history and long-term planning | [x] 🟢 Complete — automated coverage | Physical iPhone Home Screen/offline checks remain below; videos require internet. |
| Automated release checks | [x] 🟢 Complete — full suite, updates, artwork, source and embedded videos | Synthetic records and browser emulation do not substitute for physical devices. |
| Physical-device and original-source verification | [ ] 🔴 Blocked from this environment | Physical iPhone, real Health export and complete original physio source required. |
| Commit/push/live deployment | [ ] ⚪ Not started for this combined release | All changes remain uncommitted. HEAD equals fetched origin/main; zero commits await push. Last live HTML inspection reported 0.6; this 0.19 release has not been deployed. |

## Added across this batch

- Repeatable release gate: checks app/package/offline versions, startup and OCR assets, subdirectory manifest and recognised private Git candidate paths. A combined release command runs the application/update/artwork compatibility suites and rejects files changed during the run. Private material stays outside the public source; the filename guard is not a general content scanner. See `docs/development-2026-10-18-release-gate.md`.

- Personal exercise preferences with optional notes, independent profiles, imported-library matching and progression safeguards. Avoid/review pauses target proposals; changed preferences pause automatic rules. Workout, library, prescription and substitution screens show the saved instruction. Actual recording and historical prescriptions remain intact. Settings supports editing/removal; backups and offline use retain preferences. No restrictions or clinical readiness are inferred.

- New Health import receipts with paged original-value review, reversible archival of unchanged activities, correction/collision protection, JSON backup/restore and offline use. Re-import cannot silently restore archived records.
- Warnings and explicit confirmation for distinct source identities sharing an exact workout type, duration and start instant; no automatic merging.

The user explicitly redirected this work away from athlete artwork on 18 October because it is being handled separately. Leave that artwork rollout to its existing workstream. The current feature update changes no athlete image or renderer.

- Dated prescription plans: choose a workout/date range or training-block dates, review all targets, and apply only within that window. Same-workout overlap is rejected. End/cancel plans without rewriting saved sessions or actual performance. Restore comparisons include planning counts.
- Explicit Apple Health workout summaries for active energy (kcal/kJ/J) and average/maximum heart rate (count/min), conservative unknown/ambiguity handling, editable activity summaries and CSV export with source and confirmation status. Standalone samples and legacy total-energy values are not inferred into these fields.
- Integration of the separately added nested artwork asset into the browser test servers, eliminating a test-only missing-image error.

- Optional automatic review rules: disabled by default, explicit increments, pending proposals after qualifying completed-session evidence, changed-guidance pause, no repeated dismissed suggestions and no automatic prescription changes. Legacy v2 data remains readable without rewriting.

- Local English screenshot recognition, conservative labelled-field extraction, editable preview, source retention, explicit reviewed import, cancellation and offline reader assets. No image/text upload.
- Editable personal exercise instructions/equipment/notes/demo links, with saved history retained.
- Optional arithmetic from the user's chosen increment, gated by two qualifying confirmed sessions; no automatic approval.
- Release audit fixes for stale-profile/session forms, blank workout dates, off-screen timers and additional-session dashboard access.


- Full target proposals (sets, reps/duration, rest, loads), before/after comparison, distinct-date evidence and resolution dates. Changed guidance/records invalidate approval; existing saved plans remain unchanged.
- Dated block review snapshots, interim/final distinctions, equal-period comparisons and full 52-week annual evidence. Existing v2 data remains readable without rewriting; old pending evidence fingerprints require a fresh proposal before approval.

- Local Apple Health ZIP/XML import with chunked reading, modern distance statistics, paged review, date filters, explicit selection, duplicate preservation, cancellation and profile-change protection. Limits: 200 MB file/expanded XML and 50,000 workouts; no live HealthKit connection.

- Local structured-text import preview, retained workout instructions and independent imports onto occupied dates. Missing prescriptions block import; no actual performance is assumed.
- Consistent evidence rules across coach/progression reviews, direct links to draft sessions and saved-guidance lookup.

- Independent multiple workouts per day; preserved primary logs and historical plans.
- Skips, substitutions, date-specific targets, notes, exercise ordering and safe rescheduling of unrecorded extra sessions.
- Automatic evidence-review prompts and 8/26/52-week summaries. Prompts never prescribe new loads or confirm readiness.
- Target review/approve/dismiss, confirmed-only history, records and chart metrics separated by units.
- Day/week/month/year calendar, direct session access, whole-session skips and safe moves of unrecorded primary or extra sessions. Drafts, actuals and reviewed sessions cannot be moved; occupied destination dates remain intact.
- Annual calendar, extendable 52-week framework and block/annual evidence reviews.
- Activity totals; custom measurements, trend charts, corrections and CSV export.
- Restore comparisons, profile-change protection and direct restoration of the pre-restore recovery copy. Each successful restore replaces the single recovery copy with the data it replaced; download older copies if you need to retain them.
- Offline app startup and installation manifest.
- Consistent through-today report totals; future entries remain accessible and are explicitly labelled. Partial sessions are not labelled as fully completed workouts.
- Grouped Progress reports (Overview, History, Reviews, Activities, Measurements) with an All reports option. Switching groups preserves unsaved fields and chart choices.
- Focused workout view, exercise navigation, next-unfinished shortcut, explicit target/draft/confirmed states and optional automatic rest timer.
- Refined shared athlete, corrected single-leg squat facing/front-leg balance and standing artwork design rules.
- Explicit updates without closing all tabs, fresh asset downloads that bypass stale HTTP caches, and a recovery update page for old installations.

## Verified and remaining

**Current repeatable release audit:** `npm run test:release` passed for 0.19.0, including the complete application suite, update/offline suite, artwork compatibility suite and unchanged candidate fingerprint `70f71cb0193b4e19803fedbc780faafdbd034776efbfea307056c210912784f7`. Details: `docs/development-2026-10-18-release-gate.md`. This is a green automated result for the current candidate; future artwork edits require a fresh final run. The separate unfinished artwork rollout, source and physical-device checks remain outstanding. No runtime app changes or deployment occurred in this task.

Status clarification: the original Phase 7 requires a compatible import mechanism and documented native pathway, not a shipped native HealthKit app. The original Phase 4 requires deterministic calculations/reviews/approval. Their implemented scope is green; physical verification and broader future functionality remain explicit separate items. This documentation change reran no application tests and adds no new functionality.

**0.19.0 current feature checks:** full `npm test` and three-configuration `npm run test:updates` passed. Preference tests cover cancellation, removal, failed-save rollback, unchanged history/routines, blocked approvals/calculations/rules, imported aliases, honest actual recording, library/programme/substitution reminders, JSON file restore, profile isolation and offline reload. Desktop and small-iPhone preference screenshots were inspected. `git diff --check` passed. These are synthetic records in isolated browsers; no physical-device or live deployment verification is implied. Ongoing artist edits after these checks need their own verification.

Artwork refinement (`art6`): `npm run test:art`, the main three-browser application suite, HTML validation and the three-browser app-update suite passed. The existing local preview was updated and visually inspected. See `docs/exercise-art-review-2026-10-18.md` for the exact refinement and `docs/exercise-art-style-guide.md` for the standing image specification. Include `tests/exercise-art-browser.cjs` in the combined release. The combined 0.17.0 feature run and latest art8 asset checks are recorded below.

The full `npm test` suite passed for 0.18.0. Focused 0.18.0 import/history checks passed on all three browser configurations, including archival, restored receipts, retained corrections, rollback, profile/stale guards and offline use. New coverage includes date-bounded plans, preserved primary/extra/legacy snapshots, cancellation, overlap rejection, restore validation, Health summary conversions, correction/CSV workflows and profile protection. Existing coverage includes local OCR, stale-form protection, dashboard session links, timer cleanup, editable personal instructions and chosen-increment calculations, including optional automatic review rules, strict rule backup validation, full target approvals, frozen review evidence, annual/interim summaries, legacy backup compatibility, profile isolation and quota rollback. Health-specific tests also passed on all three browser configurations after the final filter-layout changes, including ZIP preview, paged selection, future exclusion, rollback, profile isolation and offline ZIP parsing in Chrome. Other checks include structured import preview, required-field blocking, occupied-date preservation, failed-save rollback and stale-profile rejection. Automated Chrome, iPhone 13 WebKit and iPhone SE WebKit checks cover startup, navigation, layout overflow, recording, history preservation, profiles, imports, backups/restores, exports, timers and the new workflows. Chrome offline reload/recording passed. Calendar cancellation and failed-save rollback passed on all three browser configurations. Following the late female-artwork integration, the main three-browser suite, artwork suite and three-browser offline update suite passed again. The current 0.17.0 artwork suite also passed; npm audit reported zero vulnerabilities. The separate app-update suite also passed on all three configurations, including offline decoding of the isometric PNG. `npm run test:updates` additionally passed on all three browsers, covering several open legacy tabs, stale HTTP-cached artwork, an already-waiting update, preserved unsaved forms and byte-identical saved profiles, and offline reopening under the GitHub Pages subpath. Automated tests use synthetic records in isolated browsers. The 0.18.0 app-update suite passed on all three configurations. The refined import-history layout also passed a focused small-iPhone heading/layout check. Ongoing artwork edits remain separately owned and need their own final release verification.

The user's existing local browser tab was updated and visually inspected: the corrected single-leg guide is open, with no console errors. Its existing saved session remains visible in History. No actual workout entry was edited, no data was cleared and no backup restoration was performed. Other existing tabs keep their previous screen until the user finishes any edits and reopens them.

Physical iPhone installation and offline use, 0.19 live deployment, real Apple Health exports and complete original physiotherapy prescriptions remain unverified. All 16 demonstration sources and all 16 in-app videos passed playback checks on 18 October. Local screenshot extraction passed actual recognition and offline-repeat tests with synthetic English images. Automatic clinical readiness, clinician-designed adaptive periodisation, generative coaching, live Health synchronisation and exports beyond the documented limits remain unfinished. Dated user-reviewed plans and explicit workout energy/heart-rate summaries are implemented in this batch. External AI/cloud/paid services require approval and are not enabled.

The focus-mode and automatic-rest preferences are temporary UI choices. They do not modify workout data; automatic rest defaults off on fresh load. Next unfinished respects skips and substitutions and does not imply whole-session completion.

## Exact files for this combined commit (108)

Snapshot of the shared checkout, including separate ongoing artwork and earlier feature/update work. Recheck this list at final review. Current release-gate task scope is in `docs/development-2026-10-18-release-gate.md`. Do not include private exports/backups or synced source references. A passing candidate audit does not approve the unfinished artwork rollout.

- .gitignore
- AGENTS.md
- README.md
- assets/activities.js
- assets/app-update.js
- assets/calendar-ui.js
- assets/calendar.js
- assets/coaching.js
- assets/data-store.js
- assets/exercise-art.js
- assets/exercise-guides.css
- assets/exercise-images/single-leg-squat-female-isometric-v1.png
- assets/exercise-images/single-leg-squat-isometric-v1.png
- assets/exercise-preferences.js
- assets/health-history.js
- assets/health-import.js
- assets/icon-192.png
- assets/icon-512.png
- assets/ocr/LICENSE-tessdata.txt
- assets/ocr/LICENSE-tesseract-core
- assets/ocr/LICENSE-tesseract-js.md
- assets/ocr/eng.traineddata.gz
- assets/ocr/tesseract-core-lstm.wasm.js
- assets/ocr/tesseract-core-relaxedsimd-lstm.wasm.js
- assets/ocr/tesseract-core-simd-lstm.wasm.js
- assets/ocr/tesseract.min.js
- assets/ocr/tesseract.min.js.LICENSE.txt
- assets/ocr/worker.min.js
- assets/ocr/worker.min.js.LICENSE.txt
- assets/offline.js
- assets/period-plans.js
- assets/period-ui.js
- assets/program-editor.js
- assets/program.js
- assets/progression-rules.js
- assets/session-changes.js
- assets/training-tools.js
- assets/training-ui.js
- assets/vendor-fflate.js
- assets/vendor-sax.js
- assets/workout-import.js
- assets/workout-ocr.js
- docs/RELEASE-CHECKLIST.md
- docs/RELEASE-CLOSURE.md
- docs/ai-provider-boundary.md
- docs/apple-health.md
- docs/average-build-artwork.md
- docs/development-2026-10-18-calendar.md
- docs/development-2026-10-18-dated-plans-health-summaries.md
- docs/development-2026-10-18-exercise-preferences.md
- docs/development-2026-10-18-health-history.md
- docs/development-2026-10-18-health-import.md
- docs/development-2026-10-18-import-coaching.md
- docs/development-2026-10-18-planning-reviews.md
- docs/development-2026-10-18-release-audit.md
- docs/development-2026-10-18-release-gate.md
- docs/development-2026-10-18-session-changes.md
- docs/development-2026-10-18-training-batch.md
- docs/diverse-body-artwork.md
- docs/exercise-art-casting.json
- docs/exercise-art-review-2026-10-18.md
- docs/exercise-art-style-guide.md
- docs/exercise-isometric-artwork.md
- docs/georgie-artwork.md
- docs/health-import-licenses.md
- docs/screenshot-reader-licenses.md
- index.html
- manifest.webmanifest
- package-lock.json
- package.json
- scripts/release-check.cjs
- sw.js
- tests/app-update-browser.cjs
- tests/backup-browser.cjs
- tests/browser.cjs
- tests/calendar-browser.cjs
- tests/calendar.cjs
- tests/coaching.cjs
- tests/data-store.cjs
- tests/exercise-art-browser.cjs
- tests/exercise-preferences-browser.cjs
- tests/exercise-preferences.cjs
- tests/health-history-browser.cjs
- tests/health-history.cjs
- tests/health-import-browser.cjs
- tests/health-import.cjs
- tests/import-workflow-browser.cjs
- tests/import-workflow.cjs
- tests/multiple-sessions-browser.cjs
- tests/multiple-sessions.cjs
- tests/period-plans-browser.cjs
- tests/period-plans.cjs
- tests/planning-review-browser.cjs
- tests/planning-review.cjs
- tests/program-browser.cjs
- tests/progression-rules-browser.cjs
- tests/progression-rules.cjs
- tests/release-audit-browser.cjs
- tests/release-check.cjs
- tests/review-prompts-browser.cjs
- tests/session-changes-browser.cjs
- tests/session-changes.cjs
- tests/training-browser.cjs
- tests/training-tools.cjs
- tests/validate.cjs
- tests/workout-ocr-browser.cjs
- tests/workout-ocr.cjs
- update.html

## Eventual review and publishing steps — held until final review

These are reference instructions for the eventual final review, not a request to act now. No application update or backup restoration is required at this stage.

1. Finish any edits in existing tabs. Open http://127.0.0.1:8765/update.html and select Apply update and open FORM (or Open updated FORM if current). Check Settings says Version 0.19.0. Never clear website data.
2. Review Settings → Exercise preferences and the current movement reminders. Review Progress → Reviews → Progression reviews and Long-term training framework, including before/after targets, My automatic review rules, Dated training plans and saved review entries. Review Exercises → Import workout → Read screenshot text using a non-private test image, checking every extracted field before importing. Review Progress → Activities → Import Apple Health with a ZIP or XML export, checking the selected profile and source devices before confirming anything. Health import history → Review import offers reversible undo/restore for new imports; corrected records remain active. Review Exercises → Import workout → Paste structured text, and Progress → Reviews → Your training review. Review Calendar → Day / Week / Month / Year, Open session, Add session and Reschedule on an unrecorded session. Review Workout → Focus on one exercise, Next unfinished, Rest after confirming and Add another session. Progress contains the charts, reviews and measurements. Avoid entering invented results in your real training history.
3. Download JSON backups from Settings for each profile with records.
4. In GitHub Desktop select personal-fitness-hq → branch codex/session-changes. Select the 108 files listed above after the final review. Ignore any unrelated changes that appear later; do not add private backups or files under sources/.
5. Summary: `Add exercise preferences and verified training tools`. Click Commit to codex/session-changes.
6. Current Branch → main. Mac menu bar: Branch → Merge into current branch… → codex/session-changes → Create merge commit. Click Push origin.
7. Wait for the newest Pages deployment under GitHub Actions to turn green. Open https://sidewaysbm.github.io/personal-fitness-hq/update.html and select Apply update and open FORM (or Open updated FORM). Confirm Version 0.19.0, the corrected guide labels, existing records and both profiles at https://sidewaysbm.github.io/personal-fitness-hq/.
8. Settings → Check offline availability. Once ready, reload online before testing offline reopening. On iPhone use Safari → Share → Add to Home Screen. Reconnect after testing. Do not clear browser data.
