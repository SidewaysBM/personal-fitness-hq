# Dated plans and Health summaries — 18 October 2026

Versions 0.16–0.17 add bounded, user-reviewed programming and explicit workout summaries. There are no storage-key or schema-version changes, and older v2 files load without rewriting.

## Dated targets

`assets/period-plans.js` creates independent full exercise/target snapshots for one routine and an inclusive date interval. The UI offers training-block dates as a convenience; it does not prescribe recovery loads. Existing primary/extra logs win over planning changes. Legacy records receive honest legacy-reference snapshots before a change; actual sets stay byte-identical. A future plan can be cancelled; ending a current plan truncates only its applicable interval and retains the original window in saved snapshots. Same-routine overlap and invalid dates/targets are rejected. Routine editing and automatic progression approval affect normal targets, leaving dated plans unchanged.

Tests cover boundaries, overlap, base-routine changes, legacy history, active/future cancellation, full backup validation, failed saves, profile switches, reload and small-screen layout. Restore comparison includes planning counts. The target preview focuses its heading so mobile users see the plan from the top.

## Health summaries

A bounded extension of the existing local XML/ZIP reader reads direct, explicit WorkoutStatistics for active-energy sum and heart-rate average/maximum. Missing summaries stay absent; duplicated types, unknown units, invalid or contradictory values are reported unresolved. No standalone samples are correlated and no legacy total-energy value is relabelled as active energy. No raw export is retained or sent to a service.

Optional activity fields support correction/removal, fresh confirmation, strict JSON validation and CSV export. Imported source identity remains stable, so re-import does not overwrite corrections. Synthetic tests cover unit conversion, missing/duplicate/malformed values, large XML, ZIP, rollback, profile isolation, browser preview/correction, exports and offline reading. This does not validate a real Apple Watch export or implement native HealthKit synchronisation.

## Shared artwork integration

The separate artwork work added a nested PNG asset. The calendar test identified a 404 because test servers served only flat assets; all relevant test servers now allow the explicit exercise-images subfolder with the PNG content type. The production file and offline cache entry were already present. See the separate artwork review for illustration decisions.

## Final verification and release state

Passed on the final 0.17.0 code: full `npm test`, `npm run test:updates`, `npm run test:art`, `npm audit` (zero findings) and `git diff --check`. Browser coverage includes desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit. Dated-plan heading visibility was also checked after correcting the initial focus position. Reviewed small-phone screenshots of both dated targets and Health summaries. After that full run, a separate artwork update added a female isometric image and profile-aware selection. The main browser, artwork and update checks were run again for that shared change; the feature implementation remained unchanged.

All combined work remains uncommitted on `codex/session-changes`. Fetch confirmed HEAD equals origin/main, with zero commits awaiting push. The public HTML still reports Version 0.6. No real workout data was edited or cleared by this development pass, and no commit, push or release was performed. Physical-device/source gates and the separately unfinished artwork rollout remain in the cumulative release checklist.
