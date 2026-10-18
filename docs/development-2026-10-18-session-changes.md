# FORM 0.7 — session changes

## Completed in this task

- Skip remaining sets with an optional reason; resume without inventing completion.
- Session-only substitution from the existing library, with explicitly entered sets, repetitions/seconds, per-set loads and rest. Original targets are not copied into substitute fields.
- Original prescription snapshots and all recorded actuals remain intact. Already-recorded original sets remain visible and correctable beside the substitute.
- Separate substitute identity, snapshot and confirmation. Statistics and coaching resolve the actual movement and unit; they never count a skip or substitution selection as a completed set.
- Skip remaining substitute sets and resume them. Undo substitution before any substitute actuals exist. Once actuals exist, removal is blocked to retain their identity and snapshot; corrections remain available.
- Partial, unconfirmed and unrecorded session summaries. Skipped-only sessions can be saved without adding a verified workout; calendar/week views identify them as SKIPPED.
- JSON backup/restore of changes and substitute snapshots, a session-changes CSV, and prescribed/actual movement identification in the set CSV. Text that could be interpreted as a spreadsheet formula is escaped on CSV export.

## Data protection and limits

The existing version-2 storage keys and original session plans are unchanged. `logs[date].changes` is optional and is only added through an explicit session action. Each change references a movement in the original snapshot. Substitute snapshots are stored separately; original snapshots, library prescriptions, routine definitions and future schedules are not rewritten. The existing store protects against invalid restores, quota failures and conflicting tabs.

A substitute cannot already be another prescribed movement or substitute in the same session. One active substitute per prescribed movement is supported. Multiple replacement movements, deletion of existing substitute records and multiple sessions per date are not implemented. A wrong confirmed actual can be corrected or unconfirmed; removal is not a workaround for data correction. This is user-directed recording, not a clinical substitution recommendation.

Old records still load without a migration or write. Existing 0.6 snapshots remain intact. Earlier records without snapshots use the existing labelled legacy-reference process when explicitly edited. Missing historical prescriptions are not reconstructed.

## Verification

Baseline: clean `main` at `1c310d5`. Remote refreshed; public live HTML matched that version. Existing 0.6 suite passed before changes. Development branch: `codex/session-changes`.

The complete suite passed after implementation: HTML structure, JavaScript parsing, storage/coaching/import/program unit tests, existing browser workflows and the new session-change browser tests. Browser configurations: installed desktop Chrome, iPhone 13 WebKit and small iPhone SE WebKit. Final status refinements received targeted unit and browser checks.

New coverage: cancel with no writes; skip/resume with zero assumed completion; preservation of partially completed original sets; blank substitute target fields; replacement collision rejection; actual confirmation and historical corrections; failure to remove a recorded substitute; remaining-substitute skip; failed-save rollback; skipped-only calendar status and verified-workout exclusion; both CSV downloads; JSON round trip; profile isolation; overflow and application console errors. Desktop/mobile screenshots were inspected. Test records are synthetic and isolated from live user data.

Physical iPhone Safari, external video playback and live deployment of 0.7 remain unverified in this task. No paid services, external AI, cloud sync or external health-data transmission were introduced.

## Cumulative status

| Workstream | Status | Remaining |
|---|---|---|
| Stability/data protection | Partial | Cold offline startup and physical-device checks |
| Workout management | Partial | Prescriptions, snapshots, skips and substitutions implemented; ordering and more advanced session editing remain |
| Independent profiles/schedules | Core complete | Separate records and recurring schedules implemented; cloud sync intentionally off |
| Intelligent progression | Partial | Personalised proposals and approve/apply workflow |
| Expanded activities | Partial | Richer metrics and charts |
| Coaching/screenshot imports | Partial | Automatic extraction and optional generative AI |
| Apple Health | Partial | Real exports, large files, more metrics, native companion |
| Long-term programming | Not started | Rolling blocks, 52-week framework and annual reviews |
| Reporting instructions | Complete | Visual cumulative handovers and numbered user actions |
| Testing/deployment | Partial | 0.6 published; 0.7 tested locally and awaiting commit/publish plus real-device review |

Recommended next work: progression proposals with an explicit review/approve/apply flow, based only on confirmed records and without silently altering physiotherapy prescriptions. External AI integration still needs provider, cost and data-sharing approval.

## Review and publish

1. Open `http://127.0.0.1:8765/`. Use local test data: Workout → choose a training date → **Skip / substitute**. Try a skip/resume and a substitution, then confirm actuals and export a backup. Local preview data is separate from the live website.
2. In GitHub Desktop, check **Current Branch: codex/session-changes**. Review all files below and commit with Summary:

   `Add skipped exercises and verified session substitutions`

3. Click **Publish branch** (or **Push origin** if already published).
4. Choose **Current Branch → main**. In the Mac menu bar choose **Branch → Merge into current branch… → codex/session-changes → Create a merge commit**. Click **Push origin**.
5. Wait for a green deployment in [GitHub Actions](https://github.com/SidewaysBM/personal-fitness-hq/actions).
6. Reload [FORM](https://sidewaysbm.github.io/personal-fitness-hq/) normally on Mac and iPhone. Check Version 0.7, existing saved records and the **Skip / substitute** controls. Save a fresh JSON backup. Do not clear website data or restore a backup just to update.

Commit files:

- `index.html`, `package.json`, `package-lock.json`, `README.md`
- `assets/session-changes.js`, `assets/data-store.js`, `assets/coaching.js`, `assets/exercise-guides.css`
- `tests/session-changes.cjs`, `tests/session-changes-browser.cjs`, `tests/browser.cjs`, `tests/coaching.cjs`
- `docs/development-2026-10-18-session-changes.md`

All changes are uncommitted at handover. There were no unrelated starting edits. No new commit has been pushed or deployed by this task.
