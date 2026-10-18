# Georgie artwork — 18 October 2026

The selected profile now determines the athlete variant passed to the shared FormArt renderer. Ben uses male artwork; Georgie uses female artwork. This is presentation only: no new profile fields, storage keys, schemas, prescriptions or workout records. The first converted exercise is the existing unconfirmed rear-foot-elevated single-leg squat example. The remaining 15 exercises still use the previous shared vector fallback.

Asset: `assets/exercise-images/single-leg-squat-female-isometric-v1.png`. Generated using the built-in image-generation tool, using the male image as the edit reference. This is a generic athlete, not a likeness of Georgie. Both assets are included in the offline shell.

## Exact generation prompt

Edit target: the supplied two-panel exercise illustration. Replace the male athlete in BOTH panels with the SAME adult female athlete, natural athletic female anatomy and realistic proportions, dark hair tied securely back, green sleeveless training top with full torso coverage, slate training shorts and light trainers with teal accents. This is a generic exercise model, not a portrait of a real person. Preserve the realistic 3D scientific fitness reference style, neutral lighting, dark teal background, isometric three-quarter camera, framing and EXACT two-panel layout. Preserve the barbell rear-foot-elevated split squat: left panel high position, right panel lowered position, front sole firmly grounded, rear instep on bench, plausible front-leg loading, aligned neutral neck, both hands correctly gripping bar across upper back. Keep bench and barbell placement and scale consistent, full body and equipment visible, no text or labels. Do not change the exercise or create exaggerated sexualised proportions. Output horizontal 2:1 image, both halves equal width.

## Commit scope

Summary: `Add female exercise artwork for Georgie`

- index.html
- assets/exercise-art.js
- assets/exercise-images/single-leg-squat-female-isometric-v1.png
- docs/exercise-art-style-guide.md
- docs/georgie-artwork.md
- sw.js
- tests/browser.cjs
- tests/app-update-browser.cjs

These files share earlier uncommitted application changes; review alongside the combined release checklist before publishing. This change depends on the preceding male artwork asset. No workout restoration is needed.
