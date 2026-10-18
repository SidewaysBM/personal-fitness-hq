# Exercise mechanics and load-position review

Reviewed 18 October 2026. This supersedes earlier artwork sign-off for the nine revised assets below. Scope: visual review of both frames of all 16 built-in exercises, incorporating the second review supplied by the user. No exercise IDs, prescriptions, variants, storage keys or workout records were changed.

## Findings and changes

| Exercise | Result of this pass | Limit or remaining issue |
|---|---|---|
| Bench press | Rebuilt from the foot end so bar clearly crosses the body; supported head, planted feet, collars, improved overhead margins. | This frontal view cannot establish exact sagittal bar path or chest clearance. Not a measured joint-angle pass. |
| Overhead tricep extension | Upper arms raised, dumbbell vertical behind head in lowered phase; extension rather than behind-neck press is clearer. | Small camera/upper-arm differences remain. Exact prescribed equipment/setup still needs its source. |
| Side plank | Rebuilt held position with raised pelvis, fitted clothing and less upright neck. Elbow and stacked-foot contacts retained. | Joint centres are visual estimates, not a measured ear-to-ankle straightness certification. |
| Back squat | Added collars and widened standing stance towards the lowered stance. | Small residual foot-position drift remains; exact identical stance criterion is not passed. Unlabelled plate diameter does not identify kilograms. |
| Reverse lunge | Shorts expose knees; both hands on hips remove apparent thigh support. | No claim of measured 5% head-size tolerance. Both frames retain front-foot and rear-forefoot support. |
| Dumbbell thruster | Clearer overhead stack and increased top clearance. | Small viewpoint/stance differences remain. Exact fixed-foot and 10% margin criteria are not signed off. |
| Deadbug | Higher viewpoint exposes the near bent thigh overlapping the far extended leg, opposite the near extended arm. Head supported. | Two frames do not show a complete alternating sequence. |
| Decline ring row | Rebuilt fixed-height rings/straps, lower start and chest-to-ring finish; further raised pelvis to reduce sag. | Apparatus top extends beyond frame. Perspective and joint-centre accuracy remain approximate. |
| Burpee | Reduced forward neck extension in floor phase; zoomed out to protect raised hands in jump phase. | Two endpoints omit transitional phases; exact prescribed components remain unknown. |
| Barbell single-leg squat | Retained current supported pose, front foot grounded, rear foot on bench and head facing front leg. | Rear-foot-elevated variant is already confirmed. Pictured plate count is illustrative, not a prescription or a weight inferred from appearance. |
| Barbell push press | Reviewed dip, rack, grip and overhead phase; retained current image. | Grip-width continuity could be clearer. No single universal elbow angle asserted. |
| Neutral-grip DB push press | Reviewed neutral grips, dip and overhead support; retained. | Rack contact could be clearer; no prescribed load inferred. |
| Box jumps | Both shoes supported on box at landing; retained. | A more central landing would communicate the target better. Box height/return method need source. |
| Hanging straight-leg raise | No clear new grip, support or limb-position defect found; retained. | Prescribed range and grip remain source-specific. |
| Push-up | Grounded hands/toes and plausible trunk alignment; retained. | Slight hip elevation in lowered phase remains a visual limitation. |
| Bent-leg sit-up | Retained; existing top frame depicts a partial curl. | Full sit-up versus restricted curl range cannot be settled without the prescription. Do not silently prescribe a deeper range. |

This is a completed review with improvements, **not an all-green anatomical QA gate**. Residual stance/viewpoint issues above remain open. No numerical head-size, centre-of-mass, joint-angle or load measurement was certified. Generated candidates that worsened mechanics, changed aspect ratio or cropped the body were rejected. Exact final prompts and master hashes accompany all nine accepted replacements; older provenance is retained.

## Reconciliation with the supplied review

- It correctly identified important bench-axis, triceps, neck, clothing and continuity problems. It overlooked changing ring heights and the burpee neck, which were also corrected.
- There are 15 cast-v1 images plus one single-leg-squat-v2 image, 16 built-in guides total.
- The bench-supported single-leg variant was already confirmed; do not ask again. The bench prompt was already recovered before this pass.
- `EXERCISE_IMAGE_SPEC.md` is still absent. The pasted review is not that missing document. No invented replacement has been presented as the user's original specification. The existing design guide remains the available authority, with additional review rules below.
- Exact plate mass cannot be derived from its diameter or appearance. Do not select new prescription weights from an illustration or from perceived age, ethnicity, sex or body size. Artwork loads remain illustrative and stored values remain unchanged.
- Tight source margins are a risk, but reported clipping must be checked in the actual app. Pixel bounds and successful decoding do not establish anatomical correctness.

## Reference checks

General mechanics were compared with these provider references; they do not establish personal physiotherapy instructions or certify the drawings. This pass did not verify playback of every demonstration video.

- [CrossFit back squat](https://www.crossfit.com/essentials/the-back-squat) and [push press](https://www.crossfit.com/essentials/the-push-press): supported bar positions and movement phases.
- [CrossFit ring row](https://www.crossfit.com/essentials/the-ring-row): movement reference.
- [Catalyst Athletics overhead dumbbell tricep extension](https://www.catalystathletics.com/exercise/828/Dumbbell-Overhead-Tricep-Extension/): elbows held high during extension rather than driven forwards.
- [Peak Physio full side plank](https://www.peak-physio.com.au/exercise/side-plank-full/): elbow support and stacked body position.
- [NASM deadbug](https://www.nasm.org/resource-center/exercise-library/dead-bug): opposite arm/leg pattern.
- [ACE push-up](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/): hand/foot support and head/spine alignment.
- [Human Kinetics rear-foot-elevated split squat](https://us.humankinetics.com/blogs/excerpt/building-strength-for-soccer-with-the-rear-foot-elevated-split-squat): support and front-leg loading.

## Verification and release

`npm run test:release` passed after the final asset changes: application/HTML/privacy/data regressions, update/offline tests and artwork checks. Unchanged candidate fingerprint: `0ff2f8737a3aecd1abec91af951232e218f1ce080c3544a848ba72dfd49a7494`, cache `form-shell-0.20.0-security1-art14`. The initial sandboxed Chrome launch failed; the authorised isolated browser run succeeded outside that restriction.

All 16 guides were opened, decoded and captured in desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit with no page errors. Changed artwork was visually inspected in source images and actual app screenshots, including mobile bench/overhead margins. Captures are ignored `test-results/position-*.png`. The user's existing local preview tab was updated through `update.html` and its new bench image visually confirmed. No user workout entry or restore was performed.

Physical-device and live deployment remain separate gates. Original specification/source gaps and the residual visual issues above remain open regardless of browser test results. No video playback re-certification is claimed. At handoff all 21 files in this task are uncommitted, with no existing commit ahead of the tracked upstream. The 0.20.0 security/art13 fingerprint in earlier documents is historical, not the fingerprint for these replacements.

Commit scope: the `.webp` and `.json` pairs in `assets/exercise-images/` for `back-squat-cast-v1`, `bench-cast-v1`, `burpee-cast-v1`, `deadbug-cast-v1`, `lunge-cast-v1`, `ring-row-cast-v1`, `side-plank-cast-v1`, `thruster-cast-v1`, `tricep-extension-cast-v1`; `sw.js`; `docs/exercise-art-style-guide.md`; this document. No generated masters, private context, workout backups or test screenshots belong in the commit.

Suggested Summary: `Improve exercise mechanics, support contacts and artwork review rules`

Review locally at http://127.0.0.1:8765/ in Exercises. If an older installation is open, save any unfinished entry first, then use http://127.0.0.1:8765/update.html → Apply update and open FORM. Never clear website data. No workout-data restoration or repeated import is needed. Follow the consolidated release handover before merge/push; this review does not establish live deployment.
