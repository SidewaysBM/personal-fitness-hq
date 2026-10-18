# Optional coaching and extraction provider boundary

The release uses local deterministic coaching and local English OCR. No external provider, API credential, payment, cloud store or background upload is configured.

## Shared record interpretation

`FormSession.entries` supplies primary and additional sessions. `FormTraining` supplies confirmed-only history, comparable units, through-today totals, two-date review evidence, target calculations and retained block reviews. `FormCoach` uses those same signals. Scheduled targets, drafts, skips and future entries are not treated as completed performance.

## Drafts before changes

- Extraction returns text and confidence. `FormOCR.draft` maps explicit fields into unverified rows. `FormImport.prepare` validates an edited, explicitly reviewed draft. `FormImport.commit` creates an independent prescription snapshot; it cannot create completed sets.
- Optional saved rules prepare pending drafts on session finish, using the same calculation and approval boundary. Rules begin disabled; changed guidance pauses them. No scheduled or prescribed value becomes a completed set.
- Target calculations use an increment entered by the user and two qualifying recorded sessions. Creating a review does not apply it. Approval validates the current evidence fingerprint and updates only unsaved future routine plans.
- The conversational interface answers local record and exercise-reference questions. It does not claim generative intelligence or clinical readiness.

## If an external provider is approved later

Before activation, obtain agreement on provider, cost, exact transmitted fields, retention and deletion. Send the smallest explicitly previewed extract; never a whole backup by default. Keep profile identity, dates, free-text clinician notes and photographs out unless individually needed and approved. Do not include credentials in this public static repository or browser bundle. A trusted server or separately authorised native component would own provider credentials; that infrastructure is outside this release.

Treat provider responses as untrusted data. Accept only a bounded draft schema; disallow executable HTML, scripts, remote image fetches, storage commands and direct mutation. Match exercise identities locally, preserve source text, flag missing or uncertain fields, validate values, show before/after changes and require a separate user approval. Bind every asynchronous request and save to the original profile/store; cancellation and profile changes invalidate its result. Recheck evidence at approval so older suggestions cannot overwrite newer records.

Provider failure must leave manual entry, local summaries and existing records usable. Tests must cover malformed output, oversized results, changed profile, stale evidence, refusal, cancellation, network errors and failed local writes before activation.
