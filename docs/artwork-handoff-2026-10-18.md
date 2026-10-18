# Artwork handoff — 18 October 2026

Status: stable artwork candidate for combined security/release checks. Not deployed.

All 16 exercises now use one fixed fictional model per exercise, shared across profiles. Average builds, ages, backgrounds and clothing vary between movements. No workout data, storage keys or prescriptions were changed by the artwork work.

Bench press: both heads fully supported on the pad, natural neck length beside shoulders; bar over chest. Deadbug: opposite arm/leg extension. Neutral-grip press: inward palms. Single-leg squat: reviewed v2 larger plate scale, stable bench and flat trainers. Generated illustrations remain general references, not medical certification or confirmed individual prescriptions.

All 16 WebPs retain original 1774 × 887 pixels, quality 88, total under 1.1 MB; individual assets 46–97 KB, below the 250 KB target. PNG masters retained in ignored private/exercise-image-masters and generated_images; new large PNGs are not staged for publishing. Adjacent JSON files contain exact final generation prompt, generation identity/hash, source spec and export settings. EXERCISE_IMAGE_SPEC.md remains unavailable; do not claim compliance. Casting JSON is a fictional creative brief, never inferred personal identity or measured weight.

Checks passed: artwork invariants; all 16 guides in desktop Chrome and iPhone 13/SE WebKit; startup, navigation, recording/correction, persistence, backup/restore, custom fallback, profile isolation; multitab stale-cache update with byte-identical saved profiles and offline decoding of all 16 WebPs. Actual desktop/iPhone-size screenshots reviewed; final bench supported in both frames. Small framing inset removes generated separator lines. Physical iPhone, live videos and deployed site remain unverified. Final combined security regression is owned by the Secure public FORM repository chat.

## Commit scope

Suggested Summary: Refine exercise anatomy and add diverse exercise-specific artwork

Artwork-owned files:

- `assets/exercise-art.js`
- `docs/exercise-art-casting.json`
- `docs/exercise-art-style-guide.md`
- `docs/exercise-cast-prompts.json`
- `tests/exercise-art-browser.cjs`
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
- `assets/exercise-images/sit-up-cast-v1.json`
- `assets/exercise-images/sit-up-cast-v1.webp`
- `assets/exercise-images/thruster-cast-v1.json`
- `assets/exercise-images/thruster-cast-v1.webp`
- `assets/exercise-images/tricep-extension-cast-v1.json`
- `assets/exercise-images/tricep-extension-cast-v1.webp`
- `assets/exercise-images/single-leg-squat-isometric-v2.webp`
- `assets/exercise-images/single-leg-squat-isometric-v2.json`

Shared files: preserve the security changes; do not commit these as an isolated artwork release without the combined checks:

- `index.html`
- `sw.js`
- `tests/app-update-browser.cjs`
- `tests/backup-browser.cjs`
- `tests/browser.cjs`
- `tests/calendar-browser.cjs`
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
- `tests/review-prompts-browser.cjs`
- `tests/session-changes-browser.cjs`
- `tests/training-browser.cjs`
- `tests/unknown-rest-browser.cjs`
- `tests/workout-ocr-browser.cjs`

Other current changes belong to security, source-prescription and broader release work. Do not blindly commit all files under the artwork title. No commit/push performed by this artwork chat. At handoff branch codex/session-changes already has one earlier commit ahead of origin/main, plus these uncommitted changes; that earlier commit is not this artwork update.

## Next user action

Review locally via http://127.0.0.1:8765/update.html, then Exercises > Bench press. Never clear website data. No separate commit, merge, push or restore is requested now; use the consolidated security/release handover after final checks. Future publishing must check current Git status and provide the combined commit manifest and live-verification steps.
