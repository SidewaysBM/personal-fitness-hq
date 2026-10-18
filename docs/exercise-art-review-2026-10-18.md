# Exercise diagram refinement — 18 October 2026

Scope: assets/exercise-art.js only, plus this review record. Existing uncommitted programming, progression, offline and test changes belong to separate work and were preserved.

## Visual review

Rendered all 16 two-frame sequences, inspected the contact sheet, refined them, rendered again, and inspected close-up desktop Chrome and iPhone-sized WebKit screens in the actual application. Further passes corrected issues visible in those renders.

- Curved muscle contours and more natural torso/shorts silhouettes replace straight capsule limbs.
- Head orientation follows the pose, with downward-facing profiles for push-ups and the burpee floor phase.
- Hands distinguish equipment grips from floor support; palms meet the floor.
- Foot orientation follows raised legs, with a separate supported rear-foot angle.
- Barbell plates show depth and hubs. Bench-press wrists meet the lower bar, with vertical forearms at the bottom and straighter arms at the top.
- Hanging illustrations show clearance beneath the feet.

These remain stylised original vector illustrations, not photorealistic images or clinician validation. Existing movement variants, prescription caveats, instructions, video sources and stored workout data are unchanged. No new external media or services were introduced.

## Verification

The complete npm test suite passed during refinement: HTML/JS, storage, profiles, programming/history, imports, coaching, session editing, progression, backup/restore and desktop/iPhone 13/iPhone SE browser regressions. Chrome offline checks passed as part of the existing suite. After final visual corrections, actual application screenshots were rendered again in desktop Chrome and iPhone WebKit without page errors, and the main browser regression suite was rerun.

Review images are local ignored files under test-results/: artwork-review.png and art-{desktop,iphone}-{back-squat,bench,pushup,deadbug}.png. They are not release assets.

Physical iPhone testing and live deployment of this artwork remain outstanding. External demonstration playback was not reverified in this artwork task.

## Commit and release

Branch at review: codex/session-changes. This task did not commit or push.

Commit only:
- assets/exercise-art.js
- docs/exercise-art-review-2026-10-18.md

Summary: Refine exercise anatomy, equipment and movement illustrations

Review locally at http://127.0.0.1:8765/ → Exercises → open a movement guide. If an older offline app controls the preview, open http://127.0.0.1:8765/update.html and choose Apply update and open FORM. Do not clear website data. No workout-data restoration is needed.

Keep the separate pending training/offline batch in its own commit(s). Once the branch's pending work is committed and reviewed, merge codex/session-changes into main in GitHub Desktop and Push origin. Wait for a successful Pages deployment, then check the exercise guides and existing history at https://sidewaysbm.github.io/personal-fitness-hq/ on Mac and iPhone.

## Further refinement — 18 October 2026

A further render/review/refine cycle improved all 16 illustrations:

- Added scoped SVG shading, smoother muscle joins, fitted sleeves and continuous shorts. Removed the rounded joint overlays after close-up review showed an artificial segmented appearance.
- Corrected the side-plank upper-arm length and the body's support height; improved deadbug proportions.
- Turned the reverse-lunge and supported single-leg-squat profiles/lead shoes toward the front leg, and corrected the latter's lowered torso position.
- Raised box-jump shoes out of the box surface and adjusted the supported rear foot.
- Replaced bright block dumbbells with bevelled, darker weights; depicted the triceps dumbbell vertically with a visible two-handed hold.

Final artwork was inspected in a complete 16-exercise contact sheet and larger four-exercise detail sheet. Actual app screens were inspected in desktop Chrome and iPhone-sized WebKit. HTML validation and the complete main browser regression suite passed on desktop, iPhone 13 WebKit and iPhone SE WebKit, including all 16 guides, confirmed-set recording, persistence, JSON restore, profile isolation and unchanged legacy data. A separate check rendered 64 card/guide SVGs together and verified finite geometry, unique IDs and correctly scoped gradient references.

Updated the first line of the existing pending sw.js from cache form-shell-0.9.1 to form-shell-0.9.1-art2. A real Chrome service-worker upgrade test loaded the old artwork, saved a confirmed synthetic workout, installed the new cache, closed/reopened the page, and verified the new artwork and byte-identical workout storage both online and offline. No actual user records were accessed or changed.

The artwork commit still consists of assets/exercise-art.js and this document. Keep sw.js with the pending offline/feature batch described in docs/RELEASE-CHECKLIST.md; its cache-name change is the only edit this artwork task made to that file. The separate release batch and its other files were not changed by this task.

Summary for the artwork commit: Refine exercise anatomy, shading and equipment contact

These updates remain uncommitted and unpublished. Physical-device and live verification remain outstanding. No data restoration is required. Review local artwork in Exercises; an installed copy updates after FORM tabs are closed and reopened online.

## Athlete redesign and future-pose rules

Rebuilt the person with continuous two-bone limb silhouettes, rounded joint transitions, an athletic singlet, fitted shorts, a newly drawn face/hair/ear/jaw, differentiated grip/palm/relaxed hands and detailed trainers. Reused the established exercise catalogue and equipment; no workout data or instructions were replaced. Reviewed all 16 sequences and large comparisons, then removed outlines that created distracting marks at sharply bent joints.

At the user's request, corrected the barbell single-leg-squat example: head/chest face the grounded front foot, torso and bar move forward over that leg, and the rear support moves closer to avoid an overstretched leg. Both frames and the mobile guide were inspected. The standing/lowered bar centres are x=56/x=50, close to the working ankle at x=56/x=53. This is a visual balance correction, not a numerical centre-of-mass analysis. The original variant-unconfirmed caveat and prescription are retained. Primary reference checked: Human Kinetics, https://us.humankinetics.com/blogs/excerpt/building-strength-for-soccer-with-the-rear-foot-elevated-split-squat/ .

Added docs/exercise-art-style-guide.md and a required link from AGENTS.md. The guide specifies the shared person, materials, proportions, pose coordinate format, facing/contact/load checks, rendering workflow, offline-cache updates and data-preservation rules. Future poses should extend this renderer rather than introduce a differently styled person.

The current service-worker cache suffix advances to art3 while retaining the newer concurrent 0.9.2 release version. Only the cache name was changed by this artwork task. The synthetic old-installation upgrade test waits for worker activation before reopening, then checks the redesigned artwork and byte-identical confirmed workout records online and offline.

Art/rules commit files now:
- AGENTS.md
- assets/exercise-art.js
- docs/exercise-art-style-guide.md
- docs/exercise-art-review-2026-10-18.md

Summary: Redesign exercise athlete, correct single-leg squat and document pose standards

Keep sw.js with the separate pending offline/feature release. Follow docs/RELEASE-CHECKLIST.md for that batch once ready. This task has not committed, pushed or published. Physical-device/live verification remains outstanding. Rules alone require no deployment; the new artwork does. Neither requires workout-data restoration.

## Existing-browser delivery fix

The user's existing in-app browser still displayed the older athlete and single-leg squat, despite newer files on disk. There were two independent causes: multiple open tabs prevented the waiting service worker from activating, and installation reused artwork from the browser's HTTP cache. Merely advancing the cache name did not fix the second cause. The actual screen exposed this after the first update attempt.

Added a dedicated update page outside the cached shell, explicit activation messaging and a persistent update notice that opens a new tab. A shell installation now fetches all assets with `cache:'reload'`. Activation navigates only the updater tab; it does not reload other tabs or touch workout storage. The shell revision is `form-shell-0.9.5-art5`.

The regression first failed with old artwork under a long-lived HTTP cache, then passed after the fresh-fetch change. Desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit tests retain confirmed synthetic training, independent profile bytes, unrelated storage and an unsaved field in an old tab through two update cycles, then verify offline artwork reopening. The update notice is also tested across view changes and when an update was already waiting on load.

Applied the update in the user's existing local preview tab and visually confirmed the new athlete and both corrected single-leg frames. The guide now says “Front foot bears weight” and “Lower over front leg”. Its console reported no errors. The existing future-dated session remains visible in History; newer through-today report filtering explains its exclusion from dashboard totals. No user workout entry was edited or cleared. Screenshot: ignored `test-results/form-updated-in-your-browser.jpg`.

The current consolidated commit list and publishing instructions are in `docs/RELEASE-CHECKLIST.md`; these supersede the earlier separated-batch instructions above. No live deployment or physical iPhone verification has occurred in this task.

## Further anatomy, clothing and contact refinement

Read and followed `docs/exercise-art-style-guide.md`, the folder's standing exercise image specification. Refined the existing vector renderer rather than changing its identity or introducing raster assets. The shared athlete now has more distinct shoulder/upper-arm/forearm and thigh/calf volumes, subdued facial planes, a shaped singlet with neck binding and waist folds, curved shorts hems, more legible grips and constructed trainer uppers/soles.

The first rendered review exposed contact problems, which were corrected in a second pass: push-up/burpee floor palms point towards the head; push-up and reverse-lunge rear feet have raised heels with toe support; the single-leg squat rear shoe no longer intersects the platform; ring-row heels rest on their box; bench/sit-up far soles no longer float. The existing left-facing single-leg squat and forward load placement are retained. Its prescribed variant remains explicitly unconfirmed. No exercise instructions, prescriptions, storage keys, schemas or records were changed by this artwork task.

Updated the specification with anatomical/material detail rules, the shared `footwear()` helper, contact anchors, illustrative rotations, review requirements and reference links. Future poses must resolve the ankle and lower leg together with the support contact; a rotated shoe alone is not sufficient.

Verification for this refinement:

- `npm run test:art`: all 16 movements, 64 simultaneous card/guide SVGs, finite geometry, unique local gradient references, measured toe/platform contact heights and floor-palm direction passed.
- HTML validation and JavaScript parsing passed. The existing guide regression was corrected to count two top-level movement frames, allowing nested shoe/palm transforms; it still requires two distinct guide panels.
- `node tests/browser.cjs`: desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit passed startup, navigation, all 16 guides, recording/corrections, timers, profiles, persistence, backup/restore and byte-identical legacy-data checks without console errors.
- `npm run test:updates`: all three browser configurations passed legacy multi-tab updates, stale HTTP-cached artwork, unsaved old-tab preservation and offline reopening with byte-identical saved profiles.
- Rendered/reviewed the all-exercise contact sheet and enlarged athlete comparison. Actual-app screenshots were regenerated at desktop, iPhone 13 and iPhone SE sizes for back squat, bench, push-up, deadbug, single-leg squat, ring row and reverse lunge. Reviewed the final push-up and ring-row support detail, plus the corrected squat, after the second refinement. No page errors occurred.
- Applied the artwork update in the user's existing local browser tab, inspected the guide visually and left it open. Its console showed no errors. Screenshot: ignored `test-results/form-refined-athlete-in-browser.jpg`. Additional review files remain under ignored `test-results/`.

This task advances the current release's cache suffix to `art6`, preserving the newer concurrent application release version. Other active development continues to share the checkout. These checks validate the artwork changes; physical iPhone testing, live deployment and any later concurrent feature edits require their own final release verification.

Files changed for this refinement: `assets/exercise-art.js`, `docs/exercise-art-style-guide.md`, this review document, `sw.js`, `package.json`, `tests/browser.cjs`, and new `tests/exercise-art-browser.cjs`. The release checklist also records the new artwork test. Existing changes in the shared package, browser test and service worker belong to the broader uncommitted release and must be preserved.

Artwork commit Summary: `Refine athlete anatomy, support contacts and future pose standards`. Use the combined release checklist for the complete deployment file set once concurrent development is finished. No commit, push or live deployment was performed here; no workout-data restoration is needed.
