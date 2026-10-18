# Source-prescription compatibility — 0.19.1

Two user-supplied workouts were transcribed into the requested local profile using its exported backup as the baseline. The private transcription, original backup, resulting export and screenshot remain outside this repository. No private workout data is embedded in application code, tests or public documentation. The saved export was compared exactly with the prepared profile. No actual performance, personal records or completed sets were created. Existing data was retained; no ongoing weekly schedule was inferred from the dated sources.

The app now accepts an explicit `null` rest value for an unspecified source interval. Existing numeric prescriptions, storage keys and version-2 records are unchanged; no load-time migration or rewrite is performed. Unknown rest displays as “Rest not supplied”, has no per-exercise timer and does not auto-start a timer after confirmation. Explicit rest must be supplied when editing targets. Preserved source instructions are also visible beside the set controls. A previously recorded null interval remains in its historical snapshot after future targets change. Older app versions cannot validate null intervals: use 0.19.1 or later when importing these backups.

Focused synthetic tests cover desktop Chrome and iPhone WebKit, unknown intervals, recording/reload, explicit target editing, immutable history and independent profiles. No private source values are used in the test fixture. The combined release result is recorded after completion below.

Remaining source detail: one collapsed/truncated preparation instruction is retained as incomplete rather than reconstructed. New movements without reviewed guides retain the app's explicit guide fallback; no generic movement was presented as a verified match.

This task does not complete the separate artwork rollout, physical iPhone/real Health-export verification, external generative coaching or native Health synchronisation. Follow RELEASE-CLOSURE.md for cumulative release gates. Deployment and private profile transfer are separate: publishing code does not transfer local workout data between browsers or devices.

## Verification and publishing state

`npm run test:release` passed: full application suite, explicit update/offline tests, artwork compatibility checks and unchanged-candidate verification. Candidate fingerprint: `653ec976381f00f433ef94a54d8199556897a16eea4c0cc02251c4ce458702bf`. Additional private-fixture tests observed both routines rendering correctly in desktop Chrome and iPhone WebKit with source targets, no confirmed sets and no horizontal overflow. This is browser emulation, not a physical iPhone check. No live deployment was performed.

Branch: `codex/session-changes`. The prior combined-release commit `c3b89c5` is one commit ahead of fetched `origin/main`. This task's files are uncommitted: `assets/data-store.js`, `assets/program-editor.js`, `assets/training-ui.js`, `index.html`, `package.json`, `package-lock.json`, `sw.js`, `tests/unknown-rest-browser.cjs`, and this document. The separate `docs/exercise-art-casting.json` edit belongs to the artwork workstream.

Future GitHub Desktop Summary: `Preserve unspecified rest intervals and source instructions`. Keep the private profile files and screenshots out of Git. No immediate commit/push request: consolidate with the outstanding release work under RELEASE-CLOSURE.md. Local profile data has already been saved; it does not require repeating the import on this browser. Transfer to another browser/device is a separate private-data operation after the compatible app release, and must preserve any existing data there.
