# Calendar workstream — 0.10.0

## Implemented

- Day agenda, Monday–Sunday week agenda, month grid and year overview, with date jump, Today and previous/next period controls.
- Separate cards and direct workout links for the primary and additional sessions on each date. Saved historical names take precedence over edited future routines.
- Explicit planned, draft, partly recorded, modified, skipped, future-entry and all-target-sets-confirmed labels. Confirmation is not a claim that actual performance matched prescribed targets; future entries remain excluded from progress.
- Reschedule an unrecorded primary or extra session. Primary moves become independent saved sessions at the destination, with a rest override at the source. Plans, target edits and notes move together; other destination sessions remain untouched.
- Sessions with any actual entries (including drafts), skips/substitutions or review markers cannot move. Historical corrections remain available in the workout player.
- Skip all exercises in an unrecorded session after confirmation; no actuals are invented. Resume individual exercises in the workout player. Existing sessions can still be modified exercise by exercise.
- Existing Add session, weekly schedule editor and session target editor integrated with calendar access.
- No storage-key or schema changes. New calendar assets included in the offline shell.

## Verification

Pure tests cover immutable reads/moves, saved plans and notes, occupied destinations, profile schedules, strict backup validation, invalid dates, leap years, draft/skip/review guards and accurate statuses. Browser tests cover all four views, direct session access, moving, cancellation, failed-save rollback, skipping, persistence, profile isolation and narrow-screen layout on desktop Chrome and iPhone 13/SE WebKit. Regression suite covers existing records, backups/restores, offline startup and workout flows.

Physical iPhone use and the deployed website remain unverified for this batch. No user records were used in tests. No commit, push or deployment performed.

## Review

Open Calendar, try each view, inspect a date and use Open session. Review rescheduling with an unrecorded session only. Do not enter invented training results into your real history. See RELEASE-CHECKLIST.md for the combined file list and publishing steps.
