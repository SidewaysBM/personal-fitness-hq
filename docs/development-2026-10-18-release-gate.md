# Repeatable release gate — 18 October 2026

## Change

Added a read-only packaging check and a single combined release-test command. Checks include package/display/cache versions, startup assets present in the offline list, manifest subdirectory scope, local OCR files, missing/non-regular files and symlinks. The candidate fingerprint includes application assets, tests, scripts, package manifests and ignore rules. It excludes changing test outputs and documentation.

`npm run test:release` takes a fingerprint, runs application/update/artwork compatibility suites and verifies the same candidate afterwards. Changes made during the run fail the final comparison, so an older passing result cannot silently certify a newer shared-checkout build. No artwork was generated or edited. Passing compatibility tests do not complete the separately owned illustration rollout.

The repository now ignores common local environment files, profile JSON/CSV exports, raw Health exports and private/source/backup folders. The release guard catches recognised private paths even if force-added. It is not a comprehensive secret scanner and cannot recognise arbitrarily named private files. Final commit inspection remains required. Existing workout data, keys, schemas and app behaviour are unchanged.

## Focused verification

Synthetic temporary copies verified that missing startup/OCR assets, missing offline startup entries, mismatched package versions, concurrent file changes and force-added private Health exports are rejected. Temporary files were removed. The real candidate passed the packaging check. A separate known-key-format scan of Git candidate text files flagged zero files; no secret values were printed. This scan is limited to recognised formats and is not a guarantee that arbitrary personal content is absent.

The complete `npm run test:release` passed: full application suite, desktop/iPhone 13/iPhone SE update checks, artwork geometry/compatibility suite and final unchanged-candidate comparison. No application/test files changed during the run. `git diff --check` passed. Test browsers used synthetic records; existing real browser tabs were not refreshed or edited.

Candidate version: 0.19.0; cache: form-shell-0.19.0-art10; files fingerprinted: 88; snapshot timestamp: 2026-10-18T07:22:53.684Z. SHA-256 fingerprint: `70f71cb0193b4e19803fedbc780faafdbd034776efbfea307056c210912784f7`. The detailed hash report stays ignored in test-results. This identifies the application/test state, not the entire uncommitted Git checkout; documentation is deliberately excluded. The separate artist work added `docs/diverse-body-artwork.md` during this task without changing this candidate.

Physical iPhone, real Apple Health export, exact original physiotherapy source and live deployment remain unverified. A future artwork/runtime change needs its own affected checks and a fresh final combined candidate run. This result does not mark the outstanding illustration rollout complete.

## Files and handover

Exact files changed by this task:

- .gitignore
- package.json
- scripts/release-check.cjs
- tests/release-check.cjs
- README.md
- docs/development-2026-10-18-release-gate.md
- docs/RELEASE-CLOSURE.md
- docs/RELEASE-CHECKLIST.md

Other files in the shared checkout are existing feature/artwork work. Changes remain uncommitted on codex/session-changes. No application deployment, workout-data restoration or clearing of website data is needed for this development-tool change.

Ready-to-copy GitHub Desktop Summary: `Add repeatable release checks and candidate verification`

No user action is required now. The final review and publishing steps remain deferred as requested. The app is still version 0.19.0 because no application runtime files changed in this task.
