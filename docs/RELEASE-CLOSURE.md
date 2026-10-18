# FORM — path to a finished release

Reconciled across the FORM development chats on 18 October 2026 against the original handover, current project instructions and passing 0.20.0 combined tests. This document is the cumulative status authority; historical handovers retain their original evidence but do not override this current release state.

## Definition of green

Green implementation means the stated local feature is implemented and its relevant automated checks passed. It does not mean physically verified on an iPhone or deployed. Final release green requires the separate release gates below. Do not expand a finished feature's acceptance criteria with optional future products. Do not drop a real unmet requirement merely to turn a row green.

## Original seven priorities

| Workstream | Implementation status | Completion evidence / remaining work |
|---|---|---|
| 1. Stability and data protection | [x] 🟢 Complete | Startup, atomic persistence, conflict guards, legacy compatibility, JSON restore/recovery and CSV covered by full suite. |
| 2. Exercise/workout management | [ ] Partial — 🟡 Partial | Custom library, instructions, recording, substitutions, timers and calendars tested. All 16 compact raster guides are implemented and checked; exact exercise-variant/source gaps remain; do not invent missing physio details. |
| 3. Ben/Georgie profiles | [x] 🟢 Complete | Independent programmes, schedules, histories and backups covered by browser tests. Cloud synchronisation is not enabled. |
| 4. Deterministic progression | [x] 🟢 Complete for original Phase 4 | Confirmed-evidence calculations, session reviews, four-week checkpoints, explicit proposal approval, preference safeguards and frozen historical plans tested. No claim of autonomous clinical readiness. |
| 5. Expanded activities | [x] 🟢 Complete | Flexible categories/custom activities, actual confirmation, correction and reporting tested. |
| 6. Coaching and screenshot-import foundations | [x] 🟢 Complete for local foundations | Shared verified-record interpretation, limited local conversational interface, English OCR/editable reviewed imports and documented secure provider boundary. Generative session creation is not implemented or represented as complete. |
| 7. Apple Health import pathway | [x] 🟢 Complete for original Phase 7 | Bounded local ZIP/XML import, explicit workout summaries, correction/duplicate safeguards and reversible receipts tested; native companion requirements documented. Real-export validation remains below. |
| Offline, history and long-term framework | [x] 🟢 Complete for local implementation | Cached app, explicit updates, immutable prescriptions, extendable 52-week framework, multi-year calendar and annual reviews tested. Physical Home Screen checks remain below. |

## Finite release closure queue

Work in this order; reopen a completed item only for a concrete regression or new requirement. Keep the original scope visible.

1. **Exercise-source audit — Codex.** Identify the exact unresolved movement variants/instructions using available read-only sources and existing guide records. Resolve supported facts; produce one short missing-source list for anything that cannot be established. Never fabricate a prescription. Missing clinical detail blocks a claim of complete prescription fidelity; it need not be disguised as an application defect.
2. **Artwork handoff — complete.** All 16 compact guides and prompt/provenance sidecars are included in the tested 0.20.0 candidate. Missing personal source details and the absent image specification remain separate.
3. **Final combined regression — complete for 0.20.0.** Full application/privacy, update/offline and artwork checks passed with desktop/mobile visual review. The recorded candidate fingerprint still matches after commit. Reopen only for application changes or a concrete regression.
4. **One device/source review — Ben, only when the candidate is ready.** Verify iPhone startup, real-record visibility, ordinary recording/correction, profile selection, backup download and Home Screen offline reopening. Check a real Health export locally if Health compatibility is to be signed off. Gather any unresolved physio sources in the same review. Do not create invented completed sessions or clear website data. Browser emulation cannot sign off these checks.
5. **Publish and verify — after final review.** Use the existing GitHub Desktop branch and reviewed manifest, merge/push, check Pages success, verify the deployed version and essential interactions. Keep deploy status separate until this is done. Reference sequential publishing steps in RELEASE-CHECKLIST.md.

## Initial source audit — completed in this task

The original handover and current guide definitions were inspected. There is no `sources/` directory in this checkout, and the supplied handover names movements but does not supply the original workout screenshots or complete prescriptions. No clinical source was edited.

The existing guide caveats identify the finite source questions:

- **Barbell single-leg squat:** bench-supported/rear-foot-elevated variation confirmed on 18 October 2026; prescribed depth and other missing parameters still require source material.
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

The release audit now has one command: `npm run test:release`. It records the current application/test files, runs application/update/artwork compatibility checks, then rejects any changed candidate. `npm run check:release` performs packaging and recognised private-path checks alone. The 0.20.0 candidate passed the combined run and unchanged-file check; current evidence is in `docs/RELEASE-0.20.0.md`. The older 0.19.0 record remains historical. Passing this command does not sign off physical/source/live checks.

## Security and artwork release candidate — 18 October 2026

The current work includes public-safe local instructions, private-context isolation, content/path release guards, optional per-profile PIN encryption with tested migration, CSP-compatible actions, backup reminders and an allowlisted static hosting build. The original seven priorities above remain the cumulative baseline; new security requirements do not erase their earlier completion evidence.

- [x] Local security implementation and focused desktop/iPhone browser checks.
- [x] Final combined 0.20.0 regression passed: `npm run test:release` (application, privacy, update/offline and artwork suites). Candidate fingerprint `0d62496918fb9da1b46fdf7c0f2c9850cd43fbffa786e88bd52f438eedd056e9` unchanged.
- [ ] Physical iPhone Home Screen, real-record/backup and real Health-export verification.
- [ ] Repository visibility change, historical exposure decision, full Access addresses, account setup and live deployment.
- [ ] Original exercise-source gaps and missing EXERCISE_IMAGE_SPEC.md verification. Bench-supported single-leg variant is confirmed; do not reopen that question.

Use SECURITY-HOSTING.md for backup, repository privacy and Cloudflare Access steps. No real profile backup, repository visibility change, history rewrite or live deployment was performed by these local checks. Generative coaching, broader autonomous programming, native Apple Health synchronisation and cross-device sync remain separate outstanding extensions above.

## Cross-chat reconciliation — 18 October 2026

- Application release committed and pushed as `8c93ea7` on `codex/session-changes`; no application commit awaits push. Fetched `origin/main` is `0432534`, the merge of the earlier `c3b89c5` checkpoint. Branch divergence is one commit each; this is not itself evidence of a merge conflict.
- Earlier 0.19 deployment succeeded (PR #1 / Pages run #12, corroborated by the live service worker returning `form-shell-0.19.0-art10`). Version 0.20 is not deployed. A successful deployment is not physical-device verification.
- Two source workouts have already been imported into the second profile in the Codex in-app browser at http://127.0.0.1:8766/ (a different storage origin from port 8765), with a private resulting backup kept outside Git. Do not repeat that import. No automatic transfer to a phone occurred; preserve both source and destination histories before any transfer. One truncated preparation instruction, unspecified intervals between superset movements, and demonstrations for newly imported movements remain outstanding. Private source details belong outside tracked documentation.
- Earlier in-app video playback was checked in Chrome. Recheck current live/physical-device playback separately; old playback evidence does not certify all future versions or newly imported movements.
- The reported mobile Safari certificate/privacy warning has no confirmed resolution. Retain an explicit physical-device HTTPS check; do not bypass a warning or clear website data.
- The original standalone v0.4 copy is superseded by this repository; do not upload it over the current app.
- This chat owns the consolidated release handover. Other workstreams should use this document and RELEASE-0.20.0.md, avoid duplicate imports or separate publish requests, and check current Git state before instructions. This sync changes documentation only; no application deployment or workout-data restoration is required.
