# Reversible Health import history — 18 October 2026

The user redirected this work away from athlete artwork because it is being developed separately. No generated athlete image was integrated in this task. Artwork files and their independent work remain untouched.

## Implementation

- New local Health import receipts retain immutable original selected records. Optional metadata is backwards compatible with version-2 profiles, without load-time writes or changed storage keys.
- Undo archives unchanged imported activities, excluding them from reports; later corrections, manual activities and gym logs remain intact. Restore only fills absent identities and cannot replace current records. Archived originals remain in JSON backups.
- Paginated receipt review distinguishes unchanged, corrected, archived, conflicting and missing records. It displays original receipt values, with compact scrollable rows and available actions on small screens.
- Re-import treats saved/archived receipt identities as duplicates. Separate identities with an exact start instant, workout type and duration match are flagged, including timezone-equivalent times. Import needs explicit extra confirmation; no heuristic merging occurs.
- Backup comparison includes receipt and archive counts. Save failures are atomic, and open forms reject profile switches or stale activity state.

## Scope and limits

Older imports have no receipt and cannot be automatically undone as a batch. Receipts add storage overhead; failed quota writes preserve the existing profile. The original raw Health export is neither stored nor uploaded. No physical-device or real-export verification is claimed. Artist work is separately owned; do not continue that rollout from this workstream unless the user asks.

## Verification and handover

Passed: full `npm test` for 0.18.0, three-browser `npm run test:updates`, focused Health import/history checks and `git diff --check`. Browser coverage uses desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit with synthetic records. Actual JSON file restoration retains archived receipts; Chrome offline undo also passed. Desktop and phone receipt screenshots were reviewed. Physical iPhone and real Health export checks remain unverified.

All work remains uncommitted on `codex/session-changes`. A fresh fetch showed HEAD equals origin/main: zero commits await push. No live deployment was performed. The ongoing artist work is separate and was not changed by this task.

Ready-to-copy Summary: `Add reversible Health import history and duplicate warnings`

Exact files touched by this task (shared files also contain earlier work):

- README.md
- assets/data-store.js
- assets/health-import.js
- assets/health-history.js
- index.html
- sw.js
- package.json
- package-lock.json
- tests/browser.cjs
- tests/data-store.cjs
- tests/health-import.cjs
- tests/health-import-browser.cjs
- tests/health-history.cjs
- tests/health-history-browser.cjs
- docs/apple-health.md
- docs/development-2026-10-18-health-history.md
- docs/RELEASE-CHECKLIST.md

No user action is required now; the user requested one final review. Eventual review is at Progress → Activities → Health import history → Review import on the local 0.18.0 build. Existing older imports intentionally have no receipt; do not re-import or fabricate training merely to create one. Publishing steps remain held in the cumulative release checklist. No workout-data restoration is required to install this change.

Next non-artwork development focus: exercise preferences and future programming restrictions, using user-entered rules without inferring clinical advice.
