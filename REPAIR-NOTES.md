> Historical startup-repair notes. For the current exercise-guide update, follow README.md: deploy index.html and assets/ together. The single-file upload instructions below describe the earlier release only.

# FORM startup and mobile repair — 17 October 2026

## Update the live app

1. Open https://github.com/SidewaysBM/personal-fitness-hq on your Mac.
2. Select **Add file → Upload files**. Upload this folder's `index.html` into the repository root, replacing the existing file. Do not upload the whole folder or an archive.
3. Commit the update to `main`. Wait for the Pages deployment in the repository's **Actions** tab to finish successfully.
4. Reload https://sidewaysbm.github.io/personal-fitness-hq/ in Mac Chrome and iPhone Safari. On Chrome use Command–Shift–R if the old page persists. Do not clear website data: that removes local workout records.
5. Confirm the dashboard appears, then open Settings (now available in the mobile bottom navigation) and download a JSON backup. Check your existing records before recording another session.

The live deployment has not been changed by this repair. No GitHub publishing credentials or deployment permission were assumed. Only `index.html` needs uploading; tests and screenshots are local evidence.

## Diagnosis and scope

Latest inspected repository commit: `2ddb3c79cbc78a12497ef666976d4f65cad0faa1`.
The downloaded live HTML was byte-for-byte identical to that commit's index.html.

The classic script declared `const top` in global scope. Browser Window already exposes the non-configurable `top` property. Global declaration instantiation therefore fails before any code runs, producing Chrome's exact `Identifier 'top' has already been declared` error. The existing try/catch around render cannot catch this pre-execution failure. Renamed the helper and all six callers to `pageHeader`; no browser globals are modified.

Also repaired:
- Mobile navigation omitted Settings, preventing access to backup/restore.
- Settings grid inputs overflowed at iPhone widths in WebKit.
- Exercise SVG equipment markup nested a whole path element inside another path's `d` attribute, generating console errors.
- Set and session confirmation counts stayed stale until navigation; they now update immediately without re-rendering or discarding other inputs.
- Added an inline SVG favicon, avoiding the implicit missing favicon request.
- Raised confirmation buttons and mobile navigation targets to at least 44 pixels in height.

No changes to `form-fitness-v02`, version 2 data shape, initial exercise prescriptions, routine groupings, date scheduling logic, or stored records. No migrations, new storage services, dependencies in the deployed page, or external assets. Original provisional-physio wording retained.

## Verification

Passed locally on macOS using installed Google Chrome and Playwright WebKit 27.2:
- Desktop viewport 1440 × 1000.
- iPhone 13 emulation 390 × 664 and iPhone SE emulation 375 × 667.
- Original Chrome blank screen and exact error reproduced before testing the fix.
- JavaScript parsed; HTML structural checks passed (element nesting/closing, duplicate IDs/attributes and quoted attributes).
- Actual browser rendering and all six navigation views; no horizontal overflow in any view.
- Explicit set confirmation, changed actual reps/weight, correction removes confirmation, reconfirmation and immediate session count.
- Confirmed values survive reload. Prescribed values alone create no completed records.
- Rest timer start/stop and finishing a session.
- Downloaded real JSON backup; changed profile; restored backup through file input and confirmation dialogue; full data equality checked before and after reload.
- Zero JavaScript or console errors during the repaired flows.
- Source comparison confirms initial schema, all prescriptions and routine definitions unchanged.
- Desktop dashboard and mobile workout screenshots visually reviewed.
- Served at `/personal-fitness-hq/`, matching the Pages subdirectory. App remains a self-contained static HTML file.

Screenshots are in `test-results/`. Browser regression checks are in `tests/browser.cjs`.

To rerun from this repository with Node and Chrome installed:

```sh
npm install --no-save playwright
npx playwright install webkit
node tests/browser.cjs
```

## Limits

This is a tested local repair, not a verified live release. Physical iPhone Safari, the Safari app itself, Home Screen installation, offline cold startup, and the post-upload Pages deployment have not been tested. WebKit device emulation does not reproduce all iOS behaviours, including the native keyboard and Files/download UI. No private browser profile or real workout data was accessed; tests use isolated temporary browser profiles and synthetic records.

Existing broader product gaps remain outside this repair: no service worker/manifest for offline cold starts, exercise artwork is illustrative, and initial date selection remains the original programme start. This work does not certify malformed-backup handling or every pre-existing feature.
