# FORM 0.20.0 — consolidated review and publishing

Candidate: `codex/session-changes`, committed and pushed as `8c93ea7` ("Add encrypted profiles, privacy safeguards and optimised exercise guides"). No application changes remain uncommitted and no branch commits await push. `origin/main` is `0432534`, the merge of the prior 0.19 checkpoint; the branches each have one unique commit. Version 0.20 has not been merged or deployed. The live service worker checked on 18 October still identifies 0.19.0.

The file list below is the historical release manifest, not an instruction to recommit these files. Current cross-chat reconciliation is in RELEASE-CLOSURE.md.

## Scope

Optional per-profile PIN encryption and awaited durable saves, migration/recovery protection, CSP-compatible controls, private-content guard, blank fresh-profile measurements, backup reminders, allowlisted hosting output, 16 compact raster exercise guides with provenance, and the confirmed bench-supported single-leg variation. Existing saved prescriptions and performance are preserved.

The prescription/source changes already present on arrival were in assets/data-store.js, assets/program-editor.js, assets/training-ui.js, index.html, sw.js, package.json, package-lock.json, docs/exercise-art-casting.json, docs/development-2026-10-18-source-prescriptions.md and tests/unknown-rest-browser.cjs. They have been retained and tested as part of the combined candidate. Some now also contain security/artwork edits. No unrelated changes were identified for inclusion.

One public-safe instruction redaction is also included in the committed release. It is deliberately omitted from the manual commit-file list as requested. Private local context is ignored and must never be added. No history rewrite is included.

## Exact application/supporting file list

- `.gitignore`
- `assets/activities.js`
- `assets/calendar-ui.js`
- `assets/data-store.js`
- `assets/exercise-art.js`
- `assets/exercise-guides.js`
- `assets/exercise-images/back-squat-cast-v1.json`
- `assets/exercise-images/back-squat-cast-v1.webp`
- `assets/exercise-images/bench-cast-v1.json`
- `assets/exercise-images/bench-cast-v1.webp`
- `assets/exercise-images/box-jumps-cast-v1.json`
- `assets/exercise-images/box-jumps-cast-v1.webp`
- `assets/exercise-images/burpee-cast-v1.json`
- `assets/exercise-images/burpee-cast-v1.webp`
- `assets/exercise-images/deadbug-cast-v1.json`
- `assets/exercise-images/deadbug-cast-v1.webp`
- `assets/exercise-images/leg-raise-cast-v1.json`
- `assets/exercise-images/leg-raise-cast-v1.webp`
- `assets/exercise-images/lunge-cast-v1.json`
- `assets/exercise-images/lunge-cast-v1.webp`
- `assets/exercise-images/neutral-push-cast-v1.json`
- `assets/exercise-images/neutral-push-cast-v1.webp`
- `assets/exercise-images/push-press-cast-v1.json`
- `assets/exercise-images/push-press-cast-v1.webp`
- `assets/exercise-images/pushup-cast-v1.json`
- `assets/exercise-images/pushup-cast-v1.webp`
- `assets/exercise-images/ring-row-cast-v1.json`
- `assets/exercise-images/ring-row-cast-v1.webp`
- `assets/exercise-images/side-plank-cast-v1.json`
- `assets/exercise-images/side-plank-cast-v1.webp`
- `assets/exercise-images/single-leg-squat-isometric-v2.json`
- `assets/exercise-images/single-leg-squat-isometric-v2.webp`
- `assets/exercise-images/sit-up-cast-v1.json`
- `assets/exercise-images/sit-up-cast-v1.webp`
- `assets/exercise-images/thruster-cast-v1.json`
- `assets/exercise-images/thruster-cast-v1.webp`
- `assets/exercise-images/tricep-extension-cast-v1.json`
- `assets/exercise-images/tricep-extension-cast-v1.webp`
- `assets/exercise-preferences.js`
- `assets/health-history.js`
- `assets/health-import.js`
- `assets/period-ui.js`
- `assets/profile-vault.js`
- `assets/program-editor.js`
- `assets/session-changes.js`
- `assets/training-ui.js`
- `assets/workout-import.js`
- `docs/RELEASE-0.20.0.md`
- `docs/RELEASE-CLOSURE.md`
- `docs/SECURITY-HOSTING.md`
- `docs/artwork-handoff-2026-10-18.md`
- `docs/development-2026-10-18-source-prescriptions.md`
- `docs/exercise-art-casting.json`
- `docs/exercise-art-style-guide.md`
- `docs/exercise-cast-prompts.json`
- `index.html`
- `package-lock.json`
- `package.json`
- `scripts/build-site.cjs`
- `scripts/release-check.cjs`
- `scripts/update-csp.cjs`
- `sw.js`
- `tests/app-update-browser.cjs`
- `tests/backup-browser.cjs`
- `tests/browser.cjs`
- `tests/calendar-browser.cjs`
- `tests/exercise-art-browser.cjs`
- `tests/exercise-preferences-browser.cjs`
- `tests/health-history-browser.cjs`
- `tests/health-import-browser.cjs`
- `tests/import-workflow-browser.cjs`
- `tests/multiple-sessions-browser.cjs`
- `tests/period-plans-browser.cjs`
- `tests/planning-review-browser.cjs`
- `tests/privacy-browser.cjs`
- `tests/program-browser.cjs`
- `tests/progression-rules-browser.cjs`
- `tests/release-audit-browser.cjs`
- `tests/release-check.cjs`
- `tests/review-prompts-browser.cjs`
- `tests/session-changes-browser.cjs`
- `tests/training-browser.cjs`
- `tests/unknown-rest-browser.cjs`
- `tests/workout-ocr-browser.cjs`

## Verification

Final combined `npm run test:release` passed for 0.20.0, including all application/privacy tests, three-engine update/offline tests and artwork checks. The candidate remained unchanged: `0d62496918fb9da1b46fdf7c0f2c9850cd43fbffa786e88bd52f438eedd056e9`. Log: ignored `test-results/release-0.20.0.log`. The static build also passed, producing 59 allowlisted files. Focused privacy tests already cover migration/cleanup failures without data loss, authenticated decryption, incorrect PIN and tampering, profile binding, encrypted persistence/recovery, failed writes, offline unlock, profile separation, background locking and CSP injection blocking. Desktop Chrome and iPhone 13/SE WebKit screenshots reviewed.

Physical iPhone/Home Screen checks, actual Health exports, missing clinical sources and EXERCISE_IMAGE_SPEC.md, live hosting and account-level privacy remain separate gates. These tests use isolated synthetic browser data. A separate chat saved a private backup of the second profile after its local source-workout import; this does not confirm current backups of every device or profile.

## One user review, then publication

1. Preserve real data first: in every browser/installed app holding real records, Settings → Backup JSON, then the other profile if used. Keep device-specific histories separate. Confirm files were saved. Do not clear website data.
2. Contain existing exposure using GitHub repository Settings → General → Danger Zone → Change repository visibility → Private. See SECURITY-HOSTING.md for Pages consequences before confirming.
3. Review the local candidate at http://127.0.0.1:8765/update.html → update in a new tab. Check Version 0.20.0 in Settings, Privacy & backups, the exercise guides and ordinary recording/restore using test data. Localhost has separate storage from the live app; do not mistake an empty local profile for lost live records.
4. Provide the missing exercise specification/source material and full intended Access email addresses. A custom domain is optional. Physical iPhone review and a real Health-export check remain required for those release gates.
5. The application commit and push are already complete. Do not repeat them. Any later documentation-only sync is separate; check current Git status and include only those changed documents in its commit. Keep ignored private material and dist excluded.
6. After the device/privacy review and hosting decision, check current Git state and fetch the latest remote. Merge the reviewed codex/session-changes release into main using the existing GitHub pull-request workflow, inspect its comparison and checks, and confirm deployment. The earlier PR #1 merged 0.19 only. Do not merge or publish again as part of this documentation sync.
7. Configure Cloudflare Pages and Access using SECURITY-HOSTING.md, deploy only dist, and verify all hostname access gates before restoring real backups to the new URL. Confirm Version 0.20.0, navigation, recording/correction, both profiles, backup/restore and Home Screen offline reopening. Never mark deployment complete solely because a build succeeded.
8. If retaining GitHub Pages instead, confirm an eligible private-repository Pages plan first. After deployment succeeds, visit https://sidewaysbm.github.io/personal-fitness-hq/update.html and check the same version and interactions. A private repository does not itself make the Pages site login-protected.

Recommended next work: close the real-device/source/privacy-hosting gates for this candidate before adding new features. Generative coaching, autonomous programme design, native Health sync and cloud sync remain separately outstanding; none is enabled by this release.
