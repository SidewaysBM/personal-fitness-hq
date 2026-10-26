# FORM 0.21.0 — workout player

Based on the latest fetched `origin/main`, `19fe1eb` (26 October 2026). Work is on `codex/workout-player` in the separate `form-player` checkout. The older `personal-fitness-hq` checkout and its uncommitted startup repair were left untouched. Nothing under the synced project sources was changed.

## Implemented

- Open **Workout → Open workout player**. The existing all-exercise recording view remains available via **Show all exercises**.
- Warm-up instructions, warm-up exercises, main exercises, cooldown exercises and cooldown instructions form one ordered sequence. The picker, phase buttons, previous/next buttons, left/right swipes and keyboard arrows navigate it. Boundaries do not wrap.
- Original local exercise images and existing numbered technique references appear inside each exercise. No new pose, load, repetition, rest, superset or clinician instruction was invented.
- **Edit future sequence** stores only user-entered instructions and phase assignments. Empty instructions remain “Not supplied”. Within each phase, the existing routine order is retained. Saved session plans retain their original sequence when future routines change.
- Navigation hides/shows the existing entry controls without rebuilding them, writing training data or confirming sets. Draft input persists through the existing store. Corrections remove confirmation; only explicit confirmation contributes to results. Hidden videos pause and hidden YouTube players are removed.
- Finger and keyboard navigation ignores entry fields, links, media and buttons; vertical scrolling and multi-touch are not interpreted as exercise changes.
- Storage keys and version-2 record structure remain compatible. Optional `routine.player` metadata holds supplied instructions and phase assignments. Historical plan snapshots now also retain other routine metadata instead of dropping unknown routine fields. Existing unknown record/exercise fields remain intact.
- Both new local assets are included in offline caching and the allowlisted Pages-compatible build. Version is 0.21.0; the service-worker update still requires explicit application.

## Video policy and source gaps

The prior repository review includes actual playback evidence dated 17 October 2026 in `video-verification.json`. Nine named movement references remain eligible: back squat, barbell push press, bench press, bench-supported barbell single-leg squat, decline ring row, bent-leg sit-up, deadbug, dumbbell thruster and neutral-grip dumbbell push press. This verifies the named movement, not an individual's prescribed depth, load, grip width or range.

Seven references are withheld from both player and library playback/link controls because they are not confirmed exact matches:

| Movement | Missing match |
| --- | --- |
| Box jumps | Source jump-down versus guide step-down return |
| Overhead tricep extension | Equipment and one/two-arm setup |
| Hanging straight-leg raises | Prescribed grip and range |
| Side plank | Straight-leg versus bent-knee support |
| Burpee | Floor, push-up and jump components |
| Reverse lunge | Alternating versus same-side order and loading |
| Push-up | Toe, knee or incline support |

Renamed and custom movements do not silently inherit a verified video. User-supplied unreviewed links remain in stored data but are not presented as demonstration links. Existing example images and technique references are explicitly labelled when the individual variation is unresolved.

Publisher pages for the back squat, push press, bench press, feet-elevated ring row, neutral-grip dumbbell push press and deadbug were cross-checked on 26 October. Existing source links and technique text were retained. See [CrossFit](https://www.crossfit.com/essentials/the-back-squat), [Programme](https://programme.app/exercises/feet-elevated-ring-row/319), [Sweat](https://sweat.com/exercises/dumbell-push-press) and [Physitrack](https://ca.physitrack.com/home-exercise-video/supine-dead-bugs).

The referenced conversation returned text requests but only inaccessible content-reference markers for its design images. Exact visual matching to that mockup cannot be verified. Original programme screenshots, warm-up/cooldown instructions, supersets, missing individual parameters and the previously noted artwork specification remain unavailable. The previously confirmed bench-supported single-leg variation is retained.

## Review and publish

GitHub Desktop Summary: `Clarify workout groups and correct single-arm triceps guide`

Commit only this task's files:

- `index.html`
- `assets/exercise-art.js`
- `assets/exercise-guides.js`
- `assets/exercise-images/tricep-extension-single-arm-v2.webp`
- `assets/exercise-images/tricep-extension-single-arm-v2.json`
- `assets/appearance.css`
- `assets/appearance.js`
- `assets/calendar-ui.js`
- `assets/program.js`
- `assets/training-ui.js`
- `assets/workout-player.js`
- `assets/workout-player.css`
- `sw.js`
- `package.json`
- `package-lock.json`
- `tests/app-update-browser.cjs`
- `tests/browser.cjs`
- `tests/calendar-browser.cjs`
- `tests/multiple-sessions-browser.cjs`
- `tests/workout-player-browser.cjs`
- `tests/embedded-videos.cjs`
- `tests/review-prompts-browser.cjs`
- `docs/exercise-art-casting.json`
- `docs/video-verification.json`
- `docs/WORKOUT-PLAYER-0.21.0.md`

Do not include ignored test screenshots, synthetic test records, dependencies, deployment build output, AGENTS.md, private files or the unrelated older local repair.

1. Review the local preview: Calendar → scheduled workout → overview → tap a section. Swipe right for next, left for previous. Use the top-right appearance button to switch themes. The direct Workout tab also retains the all-set-entry view and a Workout overview button. Try warm-up, picker, swipes, actual entry and explicit confirmation. The preview is a separate browser origin and does not contain your live workout records.
2. In GitHub Desktop, use **File → Add Local Repository** and select the `form-player` checkout. Confirm branch **codex/workout-player** and only the file list above. Commit using the Summary above, then **Publish branch** (or **Push origin**).
3. Create a pull request to `main`, review and merge it. Wait for the GitHub Pages deployment to succeed.
4. Open https://sidewaysbm.github.io/personal-fitness-hq/ and apply the app's offered update. Confirm version 0.21.0, existing records, profiles, set correction and JSON backup. Do not clear website data.
5. On the physical iPhone, also check touch gestures, keyboard entry, backup download and Home Screen offline reopening. These checks cannot be signed off by browser emulation.

## Cumulative project status

The previous release-closure baseline remains in `RELEASE-CLOSURE.md`:

- [x] Stability/data protection, independent profiles, confirmed-record progression, expanded activities and local coaching/import foundations implemented previously; regression coverage retained.
- [x] Local Apple Health import pathway, offline PWA, historical plans and extendable long-term framework implemented previously; physical/real-export verification remains outstanding.
- [ ] Partial: exercise/workout management now includes this player; original prescription/source gaps above remain.
- [ ] Physical iPhone, real-record visibility, backup/restore and real Apple Health export validation.
- [ ] Live deployment and post-deployment verification of this candidate.
- [ ] Broader autonomous programming, generative coaching, native Health/Watch sync and cross-device cloud sync remain separate future work; no external services were enabled.

Recommended next task: one consolidated physical-device and source review, then publication of the tested candidate. Do not replace missing clinical instructions with generic warm-ups or inferred prescriptions.

## Final verification — 26 October 2026

- **Passed:** `npm run test:release` against the complete 0.21.0 candidate. Application regressions, startup/HTML/JavaScript, protected storage, profile encryption/isolation, substitutions, historical corrections, backup/restore, imports, progression, multi-year planning, offline/update and artwork suites all passed.
- Candidate fingerprint: `afc72705496317eb8f38a9b784cf7f53e8771b2ae37c3b031d2de44209861d48`. The final check confirmed the application and test candidate did not change during the combined run.
- The dedicated player suite passed on desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit. It checks phase boundaries, picker, dispatched touch gestures and keyboard navigation, input/vertical gesture exclusions, drafts, corrections, reload, unknown-field retention, frozen plans and real JSON download/restore. Test profiles contain synthetic records only.
- Desktop and small-iPhone screenshots were visually reviewed. Existing local images remain illustrations, not clinician certification. No new artwork was created.
- Actual embedded playback passed for **all nine eligible sources**, with non-zero video dimensions and advancing playback outside advertisements. **Seven references were correctly withheld.** The probe is `tests/embedded-videos.cjs`; local observations are in ignored `test-results/embedded-playback.json`. This is current playback evidence in desktop Chrome, not physical-iPhone playback verification.
- `node scripts/build-site.cjs` passed: 61 allowlisted static files. Existing Pages-subdirectory, explicit service-worker update, multi-tab protection and offline-reopen tests passed.
- One pre-existing weekly-report test depended on the real current week. Its clock is now fixed to the fixture week; production calendar behaviour was not changed for that test.
- No physical iPhone, live deployment, real personal backup/Health export or inaccessible design mockup was verified.

Final Git state: **14 task files uncommitted** on `codex/workout-player`; HEAD remains `19fe1eb`, with no new commits waiting to push. The feature branch has not been published. The local preview is http://127.0.0.1:8765/ while its preview server is running. The live site has not been changed.

## Preview feedback follow-up — 26 October 2026

The reported screen combined a cached 0.20.0 shell with an empty secondary-profile Strength template. The pending app update was applied through the normal update page, and the original preview tab was reopened on the primary profile's populated workout. No workout entries were created, edited or confirmed through the user preview.

Changes after the initial candidate:

- Added a prominent **Start here: warm-up** introduction and **Start with warm-up** action before session settings.
- Warm-up and cooldown information stays visible in the all-exercise view. Exercise images are also visible there; opening the player reveals the full inline demonstration/technique content.
- Each player exercise explains actual entry and explicit confirmation. Navigation states the name of the next step.
- Empty routines now explain that the selected profile has no exercises, offer the library/import paths and retain visible phase information. Empty routines no longer display an empty picker, “0 of 0” navigation or a Finish session button.
- Incremented the offline cache revision to `form-shell-0.21.0-player2` while retaining the same protected storage keys.
- Added browser assertions covering visible phase information/images before player entry and the empty secondary-profile workflow.

The original candidate fingerprint above is superseded by the follow-up candidate below. The commit file list and uncommitted branch status remain the same. Original warm-up/cooldown instructions remain a missing-source requirement; the visible sections do not imply that a clinician prescription has been recovered.

Follow-up verification: the complete `npm run test:release` passed, including desktop/iPhone/SE player and empty-routine checks, persistence, backup/restore, privacy/profile isolation, offline/update compatibility and artwork. Final unchanged-candidate fingerprint: `937bfa4e064ef190b0946d97c41a07c073409d248c4d6035d9fcba8987d1a750`. The allowlisted static build also passed. Physical iPhone and live deployment remain unverified. All 14 task files remain uncommitted on `codex/workout-player`.


## Light appearance and calendar overview — 26 October 2026

- Light cream/sage surfaces, white cards and dark text are now the default. A persistent appearance button retains the dark option. The separate `form-appearance` device preference never modifies profile/workout data or backup schemas.
- Calendar month cells show workout names. A date with one session opens its overview directly; dates with multiple sessions retain their session chooser. Day/week agenda actions also open the selected session overview.
- Overview cards group warm-up, main exercises and cooldown, with exercise thumbnails and prescribed set/repetition summaries. Supplied phase instructions remain editable; missing source instructions are not invented.
- Tapping any card opens the existing detailed player. Right swipe advances and left swipe returns. Previous/Next buttons and the picker remain available. Back to overview retains mounted entry fields, including drafts; none of these actions confirms sets.
- The direct Workout navigation retains the all-set-entry view for bulk recording. Its Workout overview button opens the new layout.
- Browser tests now cover calendar routing into the overview, appearance reload persistence independent of training storage, returning to a draft through the overview, right-swipe semantics and narrow mobile layouts. Existing multi-session calendar tests now open an overview card before recording.
- Visually checked the desktop overview and iPhone detail screen; corrected faint technique/entry/navigation text in the light theme.
- The user preview was updated through the safe update page and opened on the populated primary-profile overview. No actual entries were changed. The older preview tabs were not forcibly refreshed.
- Cache revision: `form-shell-0.21.0-player5`. Static build: 63 allowlisted files.
- Current commit manifest above contains **18 files**, all uncommitted on `codex/workout-player`. No new commits or live deployment. This checkout is separate from the older `personal-fitness-hq` checkout, whose unrelated local changes remain untouched.

The initial combined run passed its functional suites but intentionally failed the final candidate fingerprint because visual contrast fixes were made during that run. A fresh combined run is required for the final unchanged candidate; the verification entry below supersedes earlier fingerprints.

Final light/overview verification: **PASS** `npm run test:release`, including complete application, privacy, offline multi-tab update and artwork suites. The unchanged-candidate fingerprint is `0948781e98605ad9e0230137755f693e1bf04011b32a0dfa43c9475932b27da2`. Desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit passed the overview/player and appearance checks. The final static build contains 63 allowlisted files; `git diff --check` passed. Session-specific target edits and substitution/skip notices remain visible in the overview. Physical-device, missing-source and live-deployment gates remain outstanding. All 18 listed files remain uncommitted; no commits await pushing and no live update was published.


## Grouped sets and single-arm correction — 26 October 2026

This section supersedes the earlier triceps uncertainty and the earlier ungrouped Strength example.

- User clarified: back squat individually; push press plus box jumps together; then one-arm overhead tricep extension, hanging straight-leg raises and deadbug together. The overview provides **Review supplied strength grouping** to apply that arrangement to the selected profile's unstarted routine through the existing history-preserving edit function. No automatic local-storage migration or bulk overwrite is performed. Other routine fields, prescriptions and unknown fields are retained; deadbug uses its existing library definition. The other routine's deadbug is not removed.
- Steps are numbered. Matching group labels appear on cards and detailed steps. Group navigation explicitly goes to the next member or returns to its first member without confirming sets or recreating inputs. The group editor accepts consecutive same-phase groups and retains unrecognised metadata.
- Set, superset and circuit meanings are explained. Prescribed set counts are not silently converted into equal rounds: push press currently has four sets and box jumps three. Group round counts, between-exercise rest and per-arm rep accounting remain unspecified. Existing targets/rest stay intact.
- User confirmed the triceps movement is standing, one dumbbell and one arm at a time. Replaced the two-arm guide and displayed image, keeping the same fictional model and outfit. A new versioned local WebP preserves the original asset for history/review. The exact built-in image-generation edit prompt and provenance are in its adjacent JSON sidecar; no external image is loaded at runtime. Anatomy visually checked at full size, including one working hand on the dumbbell, free arm lowered, head/neck clearance and equipment within frame. No clinical certification is claimed.
- Replaced the old two-arm media with Muscle & Strength's one-arm standing instructional page. Actual publisher playback was observed through its 36-second video, with 1920-pixel video width; extended and bent-elbow frames were visually reviewed. The publisher blocks third-party embedding, so the app offers **Watch single-arm instructional video** as an external link and does not display a broken player. Six other uncertain variation videos remain withheld.
- Added regression coverage for group rotation without data mutation, entered drafts retained on return, supplied-group application without historical-plan changes, unknown-field retention and the external-only verified source. Offline checks now request the corrected asset.

Current combined commit manifest: **25 files** (listed above). Original older-checkout changes remain excluded. No live publication has occurred. Physical iPhone, original preparation/cooldown sources and unresolved group round/rest details remain unverified.

## Confirmed preparation and rounds — current candidate

This supersedes the earlier unspecified-round statements above. The user confirmed two lighter push-press preparation sets with unspecified loads, three push-press/box-jump working pairs, then three passes through the three-exercise Circuit B.

- Apply **Review supplied strength grouping → Save** to the chosen profile's future unstarted Strength routine. The local preview has its own routine settings; apply this action once on the live origin after publication as well. Recorded historical plans stay unchanged.
- Back squat stays individual. Push press has five targets: two blank-load preparation sets and three working sets retaining its existing final three loads. Box jumps and each Circuit B exercise have three sets. Existing repetition/rest values and unknown metadata are preserved; no completion or actual performance is created.
- The detailed picker now has 20 steps: warm-up; back squat; two preparation sets; six alternating Superset A set entries; nine Circuit B set entries; cooldown. Overview cards remain one per exercise. Each grouped step displays the relevant existing set controls, so navigation never recreates inputs or confirms performance.
- Session target edits are used when deriving navigation. A group with too few target sets falls back to its exercise screens, retaining all entered rows. Extra targets remain accessible. Substitutions retain their separate recording controls.
- The dedicated Chrome/iPhone 13/iPhone SE suite passed all 20 steps, preparation draft retention, confirmation/next-unfinished, right swipes across pairs, reload, frozen historical plans, unknown metadata and backup/restore. Full combined regression result will be recorded below.
- Still unspecified: warm-up/cooldown instructions, group rest and per-arm repetition accounting. Physical iPhone and live deployment remain unverified. No user actual entries were entered or confirmed during preview review.
- Cache revision: `form-shell-0.21.0-player9`. Allowlisted Pages build: 63 files. Combined manifest remains the 25 files listed above; no new commits or publication.

Final combined verification: **PASS** `npm run test:release` against unchanged candidate `ba3061eefc9ea43eee65bf9fbbc2b4f1b2e750df70fdef1122fa1f7043ae27f7`. Application, desktop/mobile rendering and interactions, schema validation, profile privacy/isolation, actual recording/corrections, persistence, JSON backup/restore, history, imports, progression, offline multi-tab update, Pages subpath and artwork suites passed. Static build and `git diff --check` passed. No browser console errors occurred in the player suite. The full run includes synthetic Chrome, iPhone 13 WebKit and iPhone SE WebKit profiles, not physical devices.

The actual local preview was safely updated and the confirmed grouping applied to the unstarted Strength routine. Its first two preparation steps display unspecified target loads; the following working set retains 30 kg, then Next opens box-jump round 1. No actual fields were entered or confirmed. The corrected triceps circuit screen was visually reviewed and captured in ignored `test-results/confirmed-circuit-preview.png`; the overview is left open for review. This preview origin does not update the live site's routine data.

Final status: 25 task files uncommitted on `codex/workout-player`; zero commits ahead of `origin/main`, no commits waiting to push, no live deployment. The earlier interrupted/fingerprint-invalid grouped runs are superseded by the successful unchanged candidate above. Physical-device and source gaps remain explicit. Use the existing 25-file manifest and publishing instructions in this document.
