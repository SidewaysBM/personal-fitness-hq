# Exercise preferences — 18 October 2026

## Current change

Added optional, profile-specific exercise preferences: Preferred, Avoid for now and Review before progressing, with a personal instruction. Avoid/review blocks progression evidence prompts, calculations, proposal creation and approval. Changed preferences pause previously configured automatic rules. User-reviewed imports matched to a library exercise inherit its preference.

Settings supports save, edit, cancel and remove. Workout, library, prescription editing and substitution selection show the current preference. The local coach can report the saved instruction. Actual recording and manual programming remain available; no historical prescription, result or future routine is automatically rewritten. No clinical advice, pain tracking or assumed restriction was introduced.

Optional metadata retains the v2 schema and original storage keys. Opening legacy profiles does not write preferences. Strict JSON validation, profile/stale guards and failed-save rollback protect records.

## Verification

Unit and focused desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit checks passed. Coverage includes imported aliases, progression blocking, rule/proposal invalidation, cancellation/removal, quota rollback, profile isolation, escaping notes, actual corrections, JSON file restore and offline reload. The full `npm test` suite and three-configuration `npm run test:updates` passed. Desktop and small-iPhone screenshots were inspected; `git diff --check` passed. The full results are recorded in the combined release checklist. Physical iPhone and real user-record checks remain separate. Synthetic test data was used in isolated browsers.

## Scope and publishing

All changes remain uncommitted on codex/session-changes. Fetch confirmed HEAD equals origin/main, with zero commits awaiting push. No live deployment was performed. Athlete images/renderers were not edited in this task; their ongoing shared-checkout changes belong to the separate artwork workstream.

Ready-to-copy GitHub Desktop Summary: `Add personal exercise preferences and progression safeguards`

Exact files touched by this task (shared files also contain earlier work):

- README.md
- assets/exercise-preferences.js
- assets/training-tools.js
- assets/progression-rules.js
- assets/training-ui.js
- assets/coaching.js
- assets/program-editor.js
- assets/session-changes.js
- assets/data-store.js
- index.html
- sw.js
- package.json
- package-lock.json
- tests/browser.cjs
- tests/data-store.cjs
- tests/exercise-preferences.cjs
- tests/exercise-preferences-browser.cjs
- docs/development-2026-10-18-exercise-preferences.md
- docs/RELEASE-CHECKLIST.md

No user action is needed now. Review/commit/publish stays deferred as requested. Eventual local review: finish unsaved edits, use http://127.0.0.1:8765/update.html, confirm Version 0.19.0, then Settings → Exercise preferences. Do not invent restrictions to test your real profile. No workout-data restoration or clearing website data is required. The cumulative checklist holds the eventual GitHub Desktop merge/push and live checks.

Next non-artwork development focus: audit calendar and long-term planning usability with the new preferences, retaining explicit user review and historical records.
