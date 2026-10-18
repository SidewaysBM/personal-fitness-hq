# FORM exercise artwork design guide

This is the standing design specification for all new and revised exercise poses. It accompanies the shared renderer in `assets/exercise-art.js`; reuse its rendering interface while varying the models and clothing between exercises as specified below.

Last refined: 18 October 2026 — realistic isometric artwork direction requested by the user. This document is the exercise image specification; keep future updates here rather than creating a competing style specification.

## New primary direction: realistic isometric reference

The user has superseded the flat vector aesthetic with realistic 3D fitness artwork, in an isometric/three-quarter view at minimum. Vary model ethnicity, skin tone, hair and gym clothing between exercises. Keep each model and outfit identical within that exercise’s start/end frames. The vector implementation below remains the fallback for exercises not yet converted; it is not the target quality for new artwork.

- Use an orthographic three-quarter camera with gentle elevation, clear depth and readable joint alignment. Do not fake isometric depth by skewing the old side-view drawing.
- Aim for natural adult proportions (approximately eight heads in standing reference), average recreational-gym builds with soft natural contours and modest muscle bulk. Avoid rigid mannequin joints, exaggerated bodybuilding proportions and plastic skin.
- Keep neutral studio lighting, a clean dark teal background and realistic fabric. Keep identity, limb lengths, camera, equipment and lighting consistent across start/end frames.
- Adapt alignment to the exact exercise. A Romanian-deadlift hip-hinge cue is not a universal instruction for squats, presses or floor exercises. Artwork must not add or change clinical prescriptions.
- Treat “medical-grade” as the requested visual style, not a certification or accuracy claim. Inspect generated anatomy, equipment grips, contacts and balance individually. Do not infer muscle activation measurements from shading.
- Use the built-in image generation workflow. Keep final assets in `assets/exercise-images/`, not external URLs. Record the exact prompt and generation provenance in the review document. Preserve `FormArt(id, name, sequence)` as the common entry point and retain readable HTML/SVG labels.
- Start with the existing rear-foot-elevated single-leg example, retaining its unconfirmed-variant caveat. Conversion of the other 15 exercises remains outstanding until each is produced and visually reviewed.
- Generated images do not provide exact joint coordinates; the vector contact tests apply only to the fallback vector poses. Test image loading, offline availability, clipping, accessible labels and actual desktop/mobile rendering separately.

### Average-build appearance (latest user direction)

Both models must look like ordinary adults who exercise recreationally. Use softer shoulders, arms, thighs and calves, a natural waist and subtle anatomical shading. Remove pronounced veins, striations and deeply separated muscle groups. Do not use bodybuilding, fitness-model or extremely lean physiques. Keep skin texture and joint structure readable; do not blur the image to conceal muscle detail. Maintain the same person across both phases of one exercise; use varied models across different exercises. This supersedes the earlier requests for high-definition muscle engagement and superficial vascularity.

### Body size and age diversity

Assign body build and age independently of ethnic background, using the fixed briefs in `docs/exercise-art-casting.json`. Mix shorter/taller frames, slim/average/stockier builds, broader waists and natural soft midsections across and within backgrounds. Include ordinary adults in their 30s through 60s, with natural skin texture, greying or thinning hair and practical grooming. Avoid polished stock-fitness advertising faces. Do not use ethnicity as a proxy for height, weight, strength or exercise capability. Keep body proportions stable between phases; a larger build must still have plausible support and equipment contact.

The applied single-leg-squat examples now use a stockier Black man around 55 and a slender East Asian woman around 45, with blue/plum tees and distinct shorts/leggings. This is one pair, not an ethnicity-to-body-size rule. Both are fictional models, not portraits of the users.

### Profile-specific athletes

Use male models for Ben and female models for Georgie, with varied identities across exercises, selected through the optional fourth `FormArt` argument (`male`/`female`). The app passes this explicitly from the active profile; never infer it from exercise names, prescriptions or stored measurements. Do not store artwork selection inside workout history.

Generate female counterparts from the reviewed male composition to retain camera, equipment, phase and lighting consistency. Use average adult anatomy with subdued muscle definition. Vary practical full-coverage training tops, shorts or leggings, trainers and hairstyles between exercises. Secure longer hair away from equipment. These are generic models, not likenesses of either user. Do not merely change the face or add hair to a male figure.

Both single-leg squat variants are now local PNG assets. Future exercise conversions require both variants, mobile review, profile-switch tests and offline image decoding. The other 15 movements remain the earlier vector fallback until converted.

### Diversity and clothing across exercises (latest direction)

Use a diverse cast of ordinary adult men and women across the library, including Black, East Asian, South Asian, Southeast Asian, Middle Eastern, Latino and white models. These are fictional casting descriptions for generated artwork, not inferred identities or user profile attributes. Vary skin tones, hair textures and facial features naturally, without caricatures or ethnicity-specific strength/body stereotypes.

Vary ordinary gym clothing as well as colours: crew-neck training tees, sleeveless tops, shorts and full-length leggings. Use muted but distinct palettes that read against the teal background. Avoid logos, decorative costumes and clothing that hides the joints needed to understand the exercise. Do not associate a clothing style, exercise difficulty or body size with an ethnic background.

- Keep male/female variants for every converted exercise. Their backgrounds and outfits may differ.
- Keep the SAME individual, outfit, hairstyle and proportions in that exercise's two phases, card, guide and future corrections.
- Preserve common camera treatment, average builds, lighting and background so the library remains cohesive.
- Assign and record models/outfits when producing each asset; do not randomly change appearances during app use or store ethnicity in workout records.
- Use the latest reviewed single-leg-squat pair. Introduce variety as the other exercises are converted; do not claim diversity rollout complete while those assets remain the old vector fallback.

The fixed, randomly shuffled assignments in `docs/exercise-art-casting.json` supersede the illustrative starting briefs below. Use that file for production. Assignments are creative model briefs, not inferences about users or existing images. Do not reshuffle on reload, between phases, or when regenerating a correction. Use the latest reviewed single-leg-squat pair. Planned assignments become visible only when their assets are generated and integrated.

Earlier illustrative starting briefs (superseded by the casting file):

| Exercise | Male model / outfit | Female model / outfit |
|---|---|---|
| Back squat | Black; slate tee, charcoal shorts | East Asian; dusty blue top, graphite leggings |
| Push press | South Asian; muted rust tee, navy shorts | Black; plum sleeveless top, charcoal shorts |
| Box jumps | East Asian; teal tee, slate shorts | Latina; muted coral tee, navy leggings |
| Bench press | Middle Eastern; blue tee, grey shorts | South Asian; sage tee, charcoal leggings |
| Deadbug | Latino; charcoal tee, blue shorts | Southeast Asian; muted mauve tee, slate leggings |

Use these as the beginning of a balanced cast, not a rigid ethnic quota or universal mapping. Record the actual chosen brief with each generated asset. The remaining exercises should continue the variety rather than repeat one outfit or model throughout.

## Vector fallback design to preserve

The legacy vector fallback uses one shared adult figure until each exercise is converted. The new raster assets follow the diverse-cast rules above. The style is a restrained, shaded vector illustration with recognisable human anatomy. It is not a clinical anatomy model or a portrait of the user.

- Keep the short dark hair, defined brow/nose/jaw, small ear and subtle facial shading implemented by `portrait()`.
- Use the green sleeveless training top, slate shorts, pale socks and light trainers with teal details. Keep the neckline, seams and restrained fabric folds.
- Build arms and legs with the continuous two-bone contours in `anatomy()`. Elbows and knees must connect smoothly. Do not return to separate capsule limbs, joint circles, stick figures or sharply pointed joints.
- Show an athletic chest/back, narrower waist, believable hips, thighs and calves. Preserve a consistent head/body scale and limb thickness across poses; do not make a seated or crouching figure a different body type.
- Keep highlights soft. Far limbs are darker to show depth, not a different skin colour or outfit. Avoid glossy plastic shading, heavy black outlines and excessive muscle-detail lines.
- Use `hand()` for relaxed hands, equipment grips and floor palms. Use `footwear()` for shoe shape, sole, laces and direction. Hands must wrap around the actual grip; shoes must contact their actual support.

### Anatomy and material detail

- Give the deltoid, upper arm, forearm, thigh and calf distinct volumes within the single continuous silhouette. Broad, low-opacity highlight/shadow shapes are the primary modelling device. Small crease lines may clarify an elbow or knee, but must not encircle the joint or become an anatomical muscle map.
- Taper forearms into wrists and calves into ankles. Preserve a recognisable shoulder cap and asymmetric calf shape. Do not make every limb a uniform tube, or add a detached circle at a shoulder, elbow or knee.
- Keep the face readable at card size: a small brow/eye, projecting nose, cheek plane, jaw and ear. Skin highlights remain subdued; do not enlarge eyes or use photographic textures. Hair remains short and dark with just a few directional highlights.
- The singlet follows chest, upper back, waist and hip volume. Use a restrained neck binding, armhole cue and a few folds at the waist. All garment details follow the trunk's local axes so they rotate correctly in bench, plank and hanging poses.
- Shorts have a shaped hem, an understated side panel and small seam/fold details. Avoid hard rectangular leg openings, decorative logos or high-contrast stripes. Keep the same outfit and material palette across all movements.
- Trainers have a distinct upper, heel counter, lacing and sole. Far shoes remain darker. Render the sole as a small shape rather than a heavy black outline. These details must stay legible and unobtrusive in the two-column mobile library.

The current palette lives in `materials()`. Reuse its gradient references rather than introducing per-exercise colours:

| Material | Existing colour family |
|---|---|
| Near skin | `#edc5a1`, `#dca67d`, `#c18a64`, `#aa7253` |
| Far skin | `#ba9278`, `#a57a64`, `#795747` |
| Training top | `#93cbb0`, `#5aa78d`, `#38796e`, `#285951` |
| Shorts | `#536779`, `#354a5f`, `#1e3143` |
| Hair | `#29313a` |
| Direction arrows and step numbers | `#b6f47c` |
| Panel background | `#10242e` |

Each SVG must have unique gradient IDs. The card, open guide and repeated copies of an exercise can coexist. Do not use shared fixed IDs, external image URLs, remote fonts or new runtime dependencies.

## Adding a pose

1. Identify the exact exercise variant and its source demonstration before drawing it. If the original prescription is incomplete, retain the visible uncertainty label. A new illustration must not silently choose a different clinical exercise, grip, depth, load or support.
2. Add the exercise to the `poses` catalogue using the existing `p(head, shoulder, hip, far, near, equipment)` helper. Keep the shared athlete renderer and `window.FormArt(id, name, sequence)` interface.
3. Give each movement two useful frames: setup/start and the distinguishing movement/end position. Use short action labels. These frames are visual references, not a complete substitute for the step-by-step instructions and video.
4. Add movement arrows only where their meaning is clear. Keep them away from the person, equipment and labels. Do not add invented angle measurements or prescription targets.
5. Check the rendering rules in `figure()` and `FormArt()` for facing direction, prone support, grip, front/behind equipment, rear-foot support and hanging ground clearance. Do not assume the default standing/right-facing case fits every new exercise. If a new view requires metadata, add it deliberately and preserve existing callers.

Each far/near string has exactly two paths, in this order:

```text
M shoulderX shoulderY L elbowX elbowY L wristX wristY
M hipX hipY L kneeX kneeY L ankleX ankleY
```

The first is an arm, the second a leg. The renderer adds body thickness, clothing, hands and shoes. Coordinate strings contain only those three joint points per limb; do not insert extra decoration into them. Equipment is separate SVG markup from `bar()`, `db()`, `box()`, `bench` or another original shared helper.

## Framing and proportions

- Coordinates increase rightwards and downwards. A single card uses a `210 × 200` viewBox. A two-frame guide uses `440 × 240`, with the second frame translated 230 units rightwards.
- In each guide panel, artwork occupies approximately y=15–195; labels sit at y=217. Keep hands, equipment, hair and arrows inside the panel. Check the thumbnail separately: its height is only 200 units.
- The usual ground line is y=186. Hanging poses use a lower floor reference. Shoe soles extend beyond the ankle coordinate; the ankle itself must not be placed on the support surface as though it were the sole.
- Head height is roughly 20–22 illustration units. Body scale and bone lengths should stay recognisable between the two frames. Compare shoulder–elbow–wrist and hip–knee–ankle lengths before polishing details. Small projection differences are acceptable; arbitrary stretching to reach equipment is not.
- Keep the camera/view and equipment location consistent between frames. If a view changes, label it explicitly and reconsider whether it makes the movement harder to understand.

## Movement and contact checks

Review the silhouette and joint arrangement before adding detail. A polished face cannot rescue an implausible exercise pose.

- The face and chest must agree with the direction of movement. Check the head together with the neck and trunk; rotating the face alone is insufficient.
- Keep neck positioning consistent with the reference demonstration. Do not add exaggerated looking-up or twisting poses for visual appeal.
- Trace every support point: planted palm, forearm, whole foot, toe, bench contact, ring grip or hanging grip. Nothing should float, sink into a platform, detach or pass through the body.
- Show the person and external load balanced plausibly over the intended support. This is a visual plausibility check, not a computed centre-of-mass measurement or biomechanical certification.
- Keep both endpoints of equipment in the right layer. A bar can pass behind the upper body while the hands grip it; a dumbbell must not disappear inside an arm or head.
- Inspect floor exercises for straight body alignment where appropriate and natural elbow length. Inspect bent limbs for self-intersections and sharp corners.

### Foot and palm support rules

Do not infer every shoe orientation solely from the shin angle. `limbs()` resolves contact placement before drawing the connected lower leg, then passes the support mode to `footwear()`:

| Current pose | Contact to preserve | Drawing rule |
|---|---|---|
| Push-up and burpee floor phase | Forefoot/toes at floor y=186 | Heel raised; both shoes face towards the head. Rotate the shoe around the resolved ankle, with its toe contact on the floor. |
| Reverse lunge rear foot | Forefoot/toes at floor y=186 | Rear heel raised; front foot remains flat. |
| Single-leg squat rear support | Rear shoe touching the platform at y=135 | Retain the existing rear-foot-elevated reference; do not let the toe sink into the box. |
| Decline ring row | Heels on platform at y=113 | Toes point upwards, with both heels contacting the platform. |
| Bench press and bent-leg sit-up | Soles at floor y=186 | Resolve both ankles to y=180 so the far foot does not float. |

The shoe's toe contact is `(11,6)` in its local drawing coordinates; the upright heel contact is `(-4.7,3.5)`. Transform that point to the intended support surface, and place the ankle and lower leg consistently. The current illustrative shoe rotations are 50° for floor toe support, 22° for the elevated rear shoe and −90° for an upright heel-supported shoe. These are rendering choices, not prescribed joint angles or biomechanical measurements. Recheck bone proportions after any contact adjustment.

Floor palms in the left-facing push-up and burpee must extend towards the head, with the palm on the ground and the wrist attached. Do not flip the whole exercise to repair a hand or foot. Keep airborne and hanging feet free of a forced floor constraint. Add an explicit contact rule for a new supported pose rather than copying an unrelated foot orientation.

Reference check: [ACE's push-up guide](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/) describes ankle dorsiflexion, hand placement and head/spine alignment. [NASM's push-up reference](https://www.nasm.org/resource-center/exercise-library/push-up) also illustrates the straight body position. These general references do not change the user's prescriptions.

### Barbell single-leg squat reference

The app currently depicts a **rear-foot-elevated example whose prescribed variant remains unconfirmed**. Retain that caveat. The athlete faces the grounded front foot, with the supporting platform behind. The torso and bar should sit visibly further forward over the working leg, not appear balanced backwards over the raised rear foot. In the corrected drawing, the bar is centred around x=56 then x=50, near the front ankle at x=56 then x=53. These are illustration coordinates, not coaching measurements or a numerical centre-of-mass calculation.

Check both frames and the single-frame library card. The rear foot remains supported without distorting the rear leg; the front sole stays grounded. Do not reverse only the head while leaving the torso and feet oriented the other way.

Reference checks for front-foot loading and neutral head position: [Human Kinetics, Rear Foot Elevated Split Squat](https://us.humankinetics.com/blogs/excerpt/building-strength-for-soccer-with-the-rear-foot-elevated-split-squat). Coaching examples allow different torso inclinations depending on the variation; [Strength Ambassadors](https://strengthambassadors.com/blog/rear-foot-elevated-split-squat/) discusses this distinction. These references do not confirm the user's original physiotherapy variant.

## Required review and verification

1. Render all exercises together as a contact sheet, then inspect the changed pose at large size. Include standing, overhead, bent-knee and floor poses when changing the shared person.
2. Render the actual library card and open guide in desktop Chrome and iPhone-sized WebKit, including a small phone viewport. Check clipping, labels, overlap and readability. Inspect the images, not only test results.
3. Refine visible problems and render again. Finish with a fresh review of the final artwork. Keep comparison screenshots in ignored `test-results/`; do not publish private workout screenshots or temporary review images as app assets.
4. Run `npm run test:art`, JavaScript parsing/HTML validation and the existing relevant browser tests. The artwork test renders all 16 movements as 64 simultaneous card/guide SVGs and checks finite geometry, unique local gradient IDs, toe/platform contact heights and floor-palm direction. For renderer changes, also cover all 16 guides, custom-exercise fallback, console errors, recording, persistence and backup/restore in the actual app. Geometry checks supplement visual review; they do not prove anatomical accuracy.
5. Advance the artwork suffix on the **current** service-worker cache name, preserving any newer release version or unrelated edits. Keep fresh-asset fetching (`Request` with `cache:'reload'`) during service-worker installation. Run `npm run test:updates`: it covers an old installation with several tabs, stale HTTP-cached artwork, explicit activation through `update.html`, preservation of unsaved older forms, byte-identical saved profiles and offline reopening. Also inspect the user's existing preview when available: isolated browser tests alone do not prove an already-open tab received the artwork. Use the update page; never clear website data or change workout storage/schema to update artwork.
6. State what was visually reviewed, what automated tests passed, and whether physical-device and live verification remain pending. Give exact commit files and a ready-to-copy Summary, following the project handover rules.

No pose change may rewrite exercise IDs, stored workout records, prescriptions, historical snapshots or completion flags. Source files under `sources/` remain read-only.
