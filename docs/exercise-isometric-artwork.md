# Isometric artwork rollout — 18 October 2026

## Current change

Replaced the single-leg squat reference in the library and movement guide with a realistic three-quarter illustration, generated with the built-in image-generation tool. This is a raster illustration of a 3D subject, not a rigged 3D model or medical certification. The exercise remains the explicitly unconfirmed rear-foot-elevated example. Instructions, prescriptions, storage and historical records were not changed.

Final asset: `assets/exercise-images/single-leg-squat-isometric-v1.png` (1774 × 887 PNG). The shared `FormArt` interface clips its two phases into accessible labelled panels. The original generated pixels are retained. The service worker includes the asset for offline use. Fifteen other exercise illustrations remain vector fallbacks and still need conversion and review.

## Generation prompt

Use case: scientific-educational. Create a high quality realistic 3D fitness reference illustration for FORM, a two-panel horizontal exercise sequence. Same adult male athlete in BOTH panels, realistic eight-head adult proportions, natural muscle bellies and tendons, subtle superficial vascularity, short dark hair, green sleeveless fitted training top, slate shorts, pale trainers with teal accents. Neutral studio lighting, detailed realistic skin and fabric, restrained scientific reference style, dark blue-teal clean minimalist background #10242e. Full body visible, no labels/text/arrows. Exercise: BARBELL REAR-FOOT-ELEVATED SPLIT SQUAT, isometric THREE-QUARTER view facing towards the LEFT foreground. Left panel starting high split stance: FRONT foot fully planted on floor towards LEFT, rear foot resting instep-down on a low bench to RIGHT behind athlete. Right panel bottom phase: front knee flexed about right angle, front heel grounded, hip lowered, rear knee lowered toward floor, rear instep still on the same low bench behind. Torso leans mildly forward as one neutral unit, head and neck aligned with spine, face toward LEFT. Upper body and bar load clearly over the working FRONT grounded leg rather than leaning backwards over rear bench. Barbell across muscular upper back below neck with correct two-handed grip and small balanced plates. Orthographic ISOMETRIC three-quarter camera, slightly elevated 15 degrees: see the front and side of the torso, both legs clearly separated and the depth of the bench. Bar axis crosses the shoulders with both plates visible at correct diagonal foreshortening. No flat side-profile, use clear three-dimensional depth. Keep identical person, bone lengths, bench height, camera and scale in both frames. Clearly separate both panels with whitespace only, no drawn border. Anatomically plausible joints and five finger grips, no extra limbs, no dislocated shoulders, no cartoon outlines, no plastic mannequin. This is visual artwork, not clinical certification; no medical claims in image.

## Review

Rejected the first side-profile render after the user requested isometric depth. Reviewed the replacement's face direction, shoulder grip, front sole, rear-foot bench contact, bench perspective and consistent outfit. Reviewed the integrated two-frame guide at desktop and iPhone sizes. This is a visual plausibility review, not computed biomechanics. The slightly elevated three-quarter view conveys depth; it is not a measured engineering isometric projection.

## Verification

Passed: artwork geometry regression, JavaScript parsing, HTML validation, full browser suite in desktop Chrome/iPhone 13 WebKit/iPhone SE WebKit, and multi-tab update tests with explicit offline decoding of the PNG. Browser coverage includes guide image loading, all 16 guides, navigation, set confirmation/correction, persistence, backup/restore and profile isolation. Actual existing in-app preview updated and visually checked. Desktop and both phone-sized screenshots reviewed; no clipping or page errors observed. Physical iPhone and live GitHub Pages deployment remain unverified.

## Commit scope

Suggested GitHub Desktop Summary: `Introduce realistic isometric exercise artwork`

Files for this artwork change (some also contain earlier uncommitted work):

- assets/exercise-art.js
- assets/exercise-images/single-leg-squat-isometric-v1.png
- docs/exercise-art-style-guide.md
- docs/exercise-isometric-artwork.md
- sw.js
- tests/browser.cjs
- tests/app-update-browser.cjs

Do not blindly commit this list as an independent deployable release: the current service worker and browser tests also depend on the other pending application features. The combined release must be reviewed together using `docs/RELEASE-CHECKLIST.md`. No workout-data restoration is needed.
