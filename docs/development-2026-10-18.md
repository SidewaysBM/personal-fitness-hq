# FORM 0.6 — workout programming

## Scope

Implemented routine-specific prescription editing, separate effective-dated weekly schedules, and historical session snapshots. The exercise library's original prescriptions remain intact. A routine can override included movements, sets, repetitions/seconds, loads per set, rest and workout instructions. Program edits affect sessions that have not started; recorded sessions retain their snapshot and editable actuals.

The old comma-separated exercise-ID grouping editor has been replaced by named movement controls. Schedule editing is in Calendar, separately for each selected profile. Explicit date overrides still win. Revisions apply from their chosen date until the next revision. Dashboard schedule text follows current preferences and the app opens on the current local day/month.

## Compatibility and historical protection

Storage version 2 and both profile storage keys are unchanged. Optional `routines[].prescriptions`, `scheduleChanges` and `logs[date].plan` fields are validated on restore and save. No load-time writes occur.

On the first actual entry for a new session, the routine and resolved exercise prescriptions are cloned into the log. Before program/schedule edits, existing logs without snapshots receive a labelled reference using the pre-edit state. Their actual sets, completion flags, timestamps and unknown metadata are retained. Logs with snapshots are not rewritten. Failed saves roll back in-memory state; storage remains unchanged.

Older original prescriptions cannot be recovered if they were never stored. Such logs display a legacy warning and only their recorded movements, with current reference values explicitly marked as unverified historical targets. Unknown/removed movements remain accessible for actual corrections; unknown units are excluded from load-volume calculations. New snapshots contain the complete session plan. Correcting a set does not alter its snapshot and invalidates confirmation until the user confirms again.

Recorded dates cannot be reassigned via the routine tabs or overwritten by a workout import. This avoids hiding recorded exercises. Additional sessions on the same day and a dedicated archive browser remain future work.

## Verification

The baseline was fetched from `origin/main`, including commit `cff2b66` for the user's reporting instructions. Live HTML matched main before this update. Initial Git status was clean. Development branch: `codex/workout-programming`.

Tests: HTML structure; JavaScript parsing; all previous storage/coaching/import tests; new pure programming tests for schedule dates/overrides, snapshot immutability, legacy migration, unknown movements, strict restore validation, and non-mutation of input objects. Browser tests cover desktop Chrome, iPhone 13 WebKit and small iPhone SE WebKit.

New browser scenarios: enter/confirm a set, edit its routine, reopen the old session, check a future session uses the new targets, create an effective-dated schedule, preserve date overrides, cancel edits, simulate quota failure, configure Georgie's distinct routine/schedule, export/restore snapshots and schedules, and correct historical actuals without changing prescriptions. Layout assertions include overflow and 44-pixel schedule controls. Screenshots are in the ignored `test-results/` directory.

Physical iPhone Safari, live deployment of 0.6 and external video playback are not verified in this task. Existing guide/navigation/timer/recording/backup regressions remain part of the suite. No private live records were used.

## Cumulative progress

| Workstream | Status | Remaining |
|---|---|---|
| Stability/data protection | Partial | Cold offline PWA launch; physical-iPhone verification |
| Exercise/workout management | Partial | Skipped/substituted exercises, ordering controls, advanced session editing; editable prescriptions and snapshots implemented in 0.6 |
| Ben/Georgie profiles | Core complete | Cross-device sync remains off; separate schedules implemented in 0.6 |
| Intelligent progression | Partial | Personalised proposals and approve/apply workflow |
| Expanded activities | Partial | Richer metrics and charts |
| Coaching/screenshot imports | Partial | Automatic extraction and optional generative AI |
| Apple Health | Partial | Real-export verification, large files, richer metrics and native companion |
| Long-term programming | Not started | Rolling blocks, 52-week framework and annual reviews |
| Testing/deployment | Partial | 0.5 previously verified deployed; 0.6 needs commit, merge, push and live/physical-device checks |

Next development task: explicit skipped and substituted exercises without conflating prescriptions, actuals and confirmed performance. External AI, cloud sync and health-data transmission still require explicit approval; none was added.

## User review and publishing

1. Open `http://127.0.0.1:8765/` on the Mac. If the preview server has stopped, run `python3 -m http.server 8765 --bind 127.0.0.1` in this repository. Localhost uses separate records from the live website.
2. In Exercises, open **Edit prescriptions** for a workout. In Calendar, open **Edit weekly schedule**. Try Ben and Georgie separately using local test records. Leave real clinical prescriptions unchanged unless you intend those changes.
3. In GitHub Desktop, ensure **Current Branch** is `codex/workout-programming`. Review and commit the files below with this Summary:

   `Add editable prescriptions, weekly schedules and protected workout history`

4. Click **Publish branch** (or **Push origin** if already published).
5. Under **Current Branch**, select **main**. In the Mac menu bar, choose **Branch → Merge into current branch…**, select `codex/workout-programming`, then **Create a merge commit**. Click **Push origin**.
6. Wait for a green Pages deployment in [GitHub Actions](https://github.com/SidewaysBM/personal-fitness-hq/actions).
7. Reload [FORM](https://sidewaysbm.github.io/personal-fitness-hq/) normally on Mac and iPhone. Check Version 0.6, existing history, **Edit prescriptions**, **Edit weekly schedule**, and a backup download for each profile. Do not clear website data or restore a backup just to update the application.

Commit files:

- `index.html`, `package.json`, `package-lock.json`, `README.md`
- `assets/program.js`, `assets/program-editor.js`, `assets/data-store.js`, `assets/coaching.js`, `assets/exercise-guides.css`
- `tests/program.cjs`, `tests/program-browser.cjs`, `tests/browser.cjs`, `tests/coaching.cjs`
- `docs/development-2026-10-18.md`

All changes in this task were uncommitted at handover; no unrelated starting edits were present. No application publishing has been performed by this task.
