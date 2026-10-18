# FORM — path to a finished release

Reviewed 18 October 2026 against the original 17 October development handover, current project instructions, implemented modules and the passing 0.19.0 test logs. This is a scope/evidence audit, not new application testing or deployment.

## Definition of green

Green implementation means the stated local feature is implemented and its relevant automated checks passed. It does not mean physically verified on an iPhone or deployed. Final release green requires the separate release gates below. Do not expand a finished feature's acceptance criteria with optional future products. Do not drop a real unmet requirement merely to turn a row green.

## Original seven priorities

| Workstream | Implementation status | Completion evidence / remaining work |
|---|---|---|
| 1. Stability and data protection | [x] 🟢 Complete | Startup, atomic persistence, conflict guards, legacy compatibility, JSON restore/recovery and CSV covered by full suite. |
| 2. Exercise/workout management | [ ] Partial — 🟡 Partial | Custom library, instructions, recording, substitutions, timers and calendars tested. Separate athlete artwork rollout and exact exercise-variant/source gaps remain; do not invent missing physio details. |
| 3. Ben/Georgie profiles | [x] 🟢 Complete | Independent programmes, schedules, histories and backups covered by browser tests. Cloud synchronisation is not enabled. |
| 4. Deterministic progression | [x] 🟢 Complete for original Phase 4 | Confirmed-evidence calculations, session reviews, four-week checkpoints, explicit proposal approval, preference safeguards and frozen historical plans tested. No claim of autonomous clinical readiness. |
| 5. Expanded activities | [x] 🟢 Complete | Flexible categories/custom activities, actual confirmation, correction and reporting tested. |
| 6. Coaching and screenshot-import foundations | [x] 🟢 Complete for local foundations | Shared verified-record interpretation, limited local conversational interface, English OCR/editable reviewed imports and documented secure provider boundary. Generative session creation is not implemented or represented as complete. |
| 7. Apple Health import pathway | [x] 🟢 Complete for original Phase 7 | Bounded local ZIP/XML import, explicit workout summaries, correction/duplicate safeguards and reversible receipts tested; native companion requirements documented. Real-export validation remains below. |
| Offline, history and long-term framework | [x] 🟢 Complete for local implementation | Cached app, explicit updates, immutable prescriptions, extendable 52-week framework, multi-year calendar and annual reviews tested. Physical Home Screen checks remain below. |

## Finite release closure queue

Work in this order; reopen a completed item only for a concrete regression or new requirement. Keep the original scope visible.

1. **Exercise-source audit — Codex.** Identify the exact unresolved movement variants/instructions using available read-only sources and existing guide records. Resolve supported facts; produce one short missing-source list for anything that cannot be established. Never fabricate a prescription. Missing clinical detail blocks a claim of complete prescription fidelity; it need not be disguised as an application defect.
2. **Artwork handoff — existing artwork workstream.** Finish its rollout and provide its checked file set. This workstream must not duplicate/edit the athlete work. Do not claim its latest edits passed earlier tests.
3. **Final combined regression — Codex, after artwork is stable.** Run the full application, update/offline and artwork suites once against the combined candidate; inspect desktop/mobile results; fix failures and rerun affected checks. Verify no private exports, credentials or synced references are included. Record the exact candidate state and current Git status. This is the point for one consolidated review invitation.
4. **One device/source review — Ben, only when the candidate is ready.** Verify iPhone startup, real-record visibility, ordinary recording/correction, profile selection, backup download and Home Screen offline reopening. Check a real Health export locally if Health compatibility is to be signed off. Gather any unresolved physio sources in the same review. Do not create invented completed sessions or clear website data. Browser emulation cannot sign off these checks.
5. **Publish and verify — after final review.** Use the existing GitHub Desktop branch and reviewed manifest, merge/push, check Pages success, verify the deployed version and essential interactions. Keep deploy status separate until this is done. Reference sequential publishing steps in RELEASE-CHECKLIST.md.

## Initial source audit — completed in this task

The original handover and current guide definitions were inspected. There is no `sources/` directory in this checkout, and the supplied handover names movements but does not supply the original workout screenshots or complete prescriptions. No clinical source was edited.

The existing guide caveats identify the finite source questions:

- **Barbell single-leg squat:** rear-foot-elevated versus unsupported variation is unconfirmed. The existing rear-foot-elevated illustration/video is labelled as an example.
- **Overhead tricep extension:** equipment and one-arm/two-arm setup are unconfirmed.
- **Side plank:** straight-leg versus bent-knee prescription is not established by the name alone.
- **Burpee:** floor/push-up/jump components are not established by the name alone.
- **Other individual parameters:** box-jump return/height, hanging-raise grip/range, ring/box heights, sit-up arm position/range and any prescribed push-up/lunge modifications need the original instruction where applicable. General demonstration content cannot establish those personal details.
- **Programme fidelity:** original groupings, supersets, preparation/warm-up/cooldown instructions and any missing sets/reps/weights/rest need the original programme. The current app explicitly calls its groupings provisional and allows reviewed correction.

These are source-verification items, not a request to repeat data entry now. Collect them once at final review. Published generic demonstrations cannot establish what this user's physiotherapist prescribed. No guide or workout values were changed in this audit.

## Longer-term requirements retained separately

These remain visible, but are not missing components of the original bounded Phase 4/6/7 delivery:

- [ ] Broader adaptive strength/hypertrophy/cardio programming: existing blocks, user-selected increments and approval are implemented; autonomous programme design and clinical readiness are not. Changes to physiotherapist prescriptions still need appropriate guidance.
- [ ] Generative coaching, requested session generation and richer natural-language modifications: local foundations exist; external provider, cost, credentials and exact data-sharing terms require approval before activation.
- [ ] Live Apple Health/Watch synchronisation and native companion: requirements/pathway documented; native implementation not delivered.
- [ ] Cross-device cloud synchronisation: not enabled; requires explicit approval. Local independent iPhone histories remain the supported model.

No missing requirement is cancelled by this document. New feature ideas are recorded here rather than silently extending release acceptance criteria.

## Repeatable combined candidate check

The release audit now has one command: `npm run test:release`. It records the current application/test files, runs application/update/artwork compatibility checks, then rejects any changed candidate. `npm run check:release` performs packaging and recognised private-path checks alone. The 0.19.0 candidate passed the combined run and unchanged-file check; results are recorded in `docs/development-2026-10-18-release-gate.md`. Passing this command does not sign off unfinished illustration conversions or physical/source/live checks.

## Current checkout and user action

Documentation-only update. No application deployment or workout-data restoration is needed. All combined work remains uncommitted on codex/session-changes. HEAD matches the fetched origin/main reference, with zero commits ahead; no fresh live verification was performed.

Files changed by this status-closure task: AGENTS.md, docs/RELEASE-CLOSURE.md, docs/RELEASE-CHECKLIST.md. Earlier feature and artwork files are separate existing changes in the shared checkout.

Ready-to-copy GitHub Desktop Summary: `Clarify release completion criteria and outstanding verification`

No user action is requested now. The initial source/variant audit is recorded above. Next is the final combined candidate audit when the artwork is ready; unresolved source facts stay explicit. Commit and publishing remain deferred to the requested final review.
