# FORM 0.15.0 — release audit and local screenshot reading

## Delivered

- Optional per-profile automatic review rules with no default increment and disabled-by-default configuration. Finishing a session queues only pending drafts after qualifying evidence; prescriptions remain unchanged until approval. Changed guidance pauses rules, changed rule definitions invalidate old approvals and dismissed evidence is not repeatedly proposed. Optional v2 fields roundtrip with strict validation and no load-time rewrite.

- Real English OCR in a local web worker, with pinned same-origin assets, cancellation, image limits, offline asset retention and no image/text uploads. Only requested static reader files are fetched. Automatic recognition produces unverified text; explicit labelled fields populate an editable draft. Ambiguous values remain blank. The original recognised text is retained in imported instructions; images are not saved.
- Personal exercise instructions/equipment/notes/demo-link editing from library guides, preserving recorded session snapshots and original reviewed guides.
- Optional target arithmetic using an increment entered by the user. Two qualifying sessions are required, drafts block calculations, and the calculated result remains an unapproved draft. No clinical readiness or appropriate increment is inferred.
- Profile/session guards for older editors, date clearing protection, timer expiration off-screen, timer cleanup on history/session navigation and additional-session dashboard links.
- Updated Health import pathway and a provider-neutral document describing a future approved external service boundary.

## Verification — 18 October 2026

- Progression-rule unit tests and all three browser configurations passed: explicit configuration, evidence gating, draft-only creation, duplicate/dismiss protection, new-guidance pause, changed-rule invalidation, legacy compatibility, saved history, failed-write rollback, reload and profile separation.

- `npm test`: passed in full, including HTML, pure data tests, legacy compatibility, preserved actuals/plans, confirmation, imports, backup/restore, profile separation and browser interaction tests.
- Desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit: real OCR of a synthetic screenshot, review/import without confirmed sets, retained source text and cancellation passed. Desktop additionally repeated recognition offline after reload. No external image/text requests were observed.
- Screenshot extraction tests use clear synthetic English text. Handwriting, arbitrary tables, poor photographs, unknown layouts and physical iPhone memory limits are not verified. Unresolved prescriptions still require manual entry.
- Release audit checks passed on all three configurations: invalid date retention, off-screen timer cleanup, extra-session routing, stale modal rejection, immutable historical instructions and draft-only target arithmetic.
- `npm run test:updates`: passed all three configurations, including multiple old tabs, cached assets, waiting updates, untouched profile bytes and retained unsaved forms.
- `npm run test:art`: passed all 16 movements/64 simultaneous SVGs. The artwork work and its test were developed separately in this shared checkout and are included in the combined release inventory.
- `npm run test:videos`: all 16 publisher sources played. `node tests/embedded-videos.cjs`: all 16 played inside the local app. This verifies playback, not clinical appropriateness or confirmation of ambiguous original exercise variants.
- Small-iPhone OCR and dashboard screenshots inspected; no horizontal overflow. Test browsers use isolated synthetic records.
- Latest fetched `origin/main` is `1c310d5`, matching local HEAD. The live HTML still reports Version 0.6. No 0.15 deployment or physical-device verification has occurred.

No storage keys or database version were changed. Recognition creates no stored workout data until the user explicitly imports reviewed prescriptions. No user's actual entries or synced reference files were modified.

## Remaining release gates

Physical iPhone installation/offline behaviour, real Health exports and original physiotherapist instructions cannot be verified from the synthetic desktop tests. Native HealthKit, cloud synchronisation and generative coaching are separate future integrations with approval requirements; no service was activated. The user requested one review when all work is green, so this record is not an instruction to perform another intermediate review or commit.
