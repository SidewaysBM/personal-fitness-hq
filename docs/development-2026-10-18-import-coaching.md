# Local import and coaching workstream — 0.11.0

## Delivered

- Local structured-text preview: seven pipe-separated or tab-separated columns per exercise (name, sets, reps/seconds, unit, kg, rest seconds, instructions). This is a strict text parser, not OCR. Unrecognised units remain unresolved; missing sets, reps and rest block import. Unknown loads remain unknown.
- Preview creates editable rows only. Replacing populated draft rows requires confirmation and resets the reviewed checkbox. Cancel does not save. Free-form text is rejected rather than guessed. Source images remain local object URLs and are released when the dialog closes.
- Workout-level instructions preserve supplied warm-ups, cooldowns, supersets and source notes alongside individual exercise instructions.
- Reviewed imports always create an independent extra session, even on occupied dates. Existing schedules, actuals, snapshots and notes are preserved. No completed sets are created.
- Profile/store identity is checked at submission; existing storage conflict protection and rollback apply to the entire import.
- Coach progression prompts now use the same complete-snapshot, known-load evidence rules as Progression reviews. Legacy partial comparisons no longer produce a progression prompt.
- Coach identifies unconfirmed entries through today and links directly to their specific session. It can quote saved restrictions/clinician guidance without adding instructions or changing prescriptions.

## Verification

Unit tests cover strict parsing, unresolved fields, no source mutation, occupied-date preservation, instruction retention, backup validity and consistent coaching evidence. Desktop Chrome and iPhone 13/SE WebKit tests cover preview, required-field blocking, failed-save rollback, importing onto an occupied date, persistence, session-specific draft routing and profile isolation, including rejection of stale-profile imports. Synthetic test records only.

The full regression and update suites passed on the tested browser configurations. Physical-device and live checks remain separate. No external AI, OCR engine, cloud service, schema migration, commit, push or deployment is introduced.

## Remaining beyond these local foundations

Automatic screenshot extraction and personalised adaptive coaching remain unfinished. Any external service requires approval. Physiotherapist prescriptions must come from the actual source; unresolved fields must not be invented. The next independent workstream is broader local Apple Health import support and validation.
