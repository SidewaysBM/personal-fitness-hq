# Progression and long-term review workstream — 0.13.0

## Implemented

- Full manually entered target proposals: sets, repetitions/duration, rest and per-set loads. Unknown loads stay unknown; units cannot be silently changed.
- Before/after target comparisons, reasons, preserved confirmed evidence from two distinct dates and an approval/dismissal date. Duplicate pending proposals for the same routine/movement are blocked.
- Approval rechecks the routine, exercise definition, saved clinician guidance and supporting session plans/actuals. Changed evidence or guidance requires dismissing the old proposal and making a new one. No prescription is changed merely by creating a proposal.
- Approval preserves existing primary and extra session plans. Changes affect use of the routine where a session plan has not already been saved. There is no claim that scheduled targets were completed.
- Choose a start date for a new 52-week framework; Ben defaults to the supplied 13 October 2026 start. Existing frameworks retain their dates. Extend by another 52 weeks and edit weekly availability through the existing dated schedule editor.
- Block reviews compare confirmed sets, sessions, external-load volume and activity minutes with the previous equal-length period. Drafts and skipped movements remain separate. These counts are not adherence or readiness scores.
- Annual checkpoints cover the associated 13-block/52-week horizon, rather than only the final four-week block. Future blocks do not invent results.
- Dated review entries retain goals, recovery notes, conclusions and the results considered at that time. Later historical corrections update the live summary without rewriting old review entries. Interim reviews do not mark an unfinished block as fully reviewed.
- Profile/store checks prevent open review dialogs from saving into a different profile. Existing save conflict and quota rollback protections apply.

## Data compatibility and verification

Optional review fields extend version-2 records; no storage keys change and no automatic migration/write occurs on load. Old backups remain valid and unchanged when read. New fields receive validation and round-trip tests. Previously created pending reviews with the older evidence fingerprint remain visible and dismissible; approval requires a fresh review rather than silently accepting weaker old evidence.

Tests cover full target approval, unchanged historical plans, distinct-date requirements, changed-guidance invalidation, duplicate proposals, strict evidence validation, old backup compatibility, annual/equal-period summaries, frozen review snapshots, interim status, profile isolation and quota rollback. Browser tests run on Chrome and iPhone 13/SE WebKit. The full regression suite and app-update suite passed. Saved future extra-session plans were also verified unchanged after approval. Physical-device and live checks remain separate.

## Boundaries

This is a complete manual review-and-approval workflow, not automatic clinical programming. It does not infer safe load increases, effort, readiness or clinician permission. Adaptive exercise selection, automatic load recommendations and automatic periodisation remain unfinished. Complete original physiotherapist prescriptions are still required to confirm the initial program; provisional groupings remain labelled.

## Review

Use Progress → Reviews → Progression reviews to inspect/create a target review. Enter your own reviewed target, inspect before/after values, then explicitly approve or dismiss. Use Long-term training framework to open a block, compare evidence and record a review entry. Editing goals does not alter prescribed exercises or availability; use Edit weekly availability for a dated schedule change.
