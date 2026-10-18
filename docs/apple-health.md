# Apple Health pathway — 18 October 2026

## Implemented locally

The browser accepts an Apple Health `export.zip` or unzipped `export.xml`, previews workout records, excludes duplicate source records and requires users to select completed activities before saving them to the active profile. It stores only workout type, source timestamp, date, duration, supported distance and explicitly supplied workout-level active-energy and average/maximum heart-rate summaries. Imported activities do not create gym sets or increase gym load-volume totals. Editing an imported activity requires fresh confirmation; its source identity is retained to prevent re-import duplication.

The XML file stays in the browser; it is not uploaded or retained as a raw export. Non-workout records, including clinical records, routes and standalone heart-rate/energy samples, are ignored. Unsupported duration units and malformed dates are skipped with a count; unsupported distance units remain absent. Unknown workout types retain their source type under the Custom category. Chunked XML/ZIP reading supports files and expanded XML up to 200 MB and 50,000 workouts, with paged preview, date filters and cancellation. ZIP64 or split archives are rejected with an instruction to choose unzipped XML. Legacy workout distances and modern WorkoutStatistics distances are supported when their units are known. These limits are explicit; larger exports and real-device performance remain unverified.

Tests use synthetic XML/ZIP and isolated browser profiles. Real Apple Watch exports and physical iPhone import flows are not yet verified. Apple can change its export format; this importer deliberately supports a small subset and does not claim full Health export compatibility.

## Workout summaries

Only a single, explicit `WorkoutStatistics` entry directly inside the workout is read for each supported summary type. Active energy uses `HKQuantityTypeIdentifierActiveEnergyBurned` and `sum`, accepting kcal, kJ (÷ 4.184) and J (÷ 4184). Heart rate uses `HKQuantityTypeIdentifierHeartRate` with `average` and/or `maximum` in `count/min`. Values are rounded to two decimals for storage/display. Missing values stay absent. Duplicate summary types, unknown units, invalid numbers and contradictory heart-rate averages/maxima produce unresolved-summary warnings, without discarding the workout duration. Legacy `totalEnergyBurned` is not treated as active energy. Separate samples and activity-segment statistics are not associated with workouts by guesswork.

Preview shows the values before selection. Imported activities retain source identity when corrected; corrections require fresh completion confirmation. Optional fields are validated in JSON restores and included in **Export activities CSV** alongside source details and confirmation status. CSV includes drafts/future entries with their status; these do not become confirmed training totals. No calorie targets, heart-rate zones or clinical interpretation are inferred. Missing energy/heart-rate values are not zero.

## Native companion design

HealthKit is Apple's native health and fitness repository. An ordinary browser PWA cannot request HealthKit entitlements. A future Swift companion would request read access only to user-selected types: workouts first, then duration/distance, active energy and heart rate if explicitly enabled. Do not request clinical records or routes by default.

The companion should produce a versioned, user-previewed local export with stable workout identities, units, source timestamps and provenance. Users can import the file into FORM without a server. A direct native-to-web bridge requires a separate design and explicit origin checks; it is not implemented. HealthKit absence or lack of returned records must not be interpreted as proof that a user did no exercise. No cloud transport, analytics or background data sharing is authorised by this design.

Reversible import receipts are implemented for new imports. Different sources with identical start instant, workout type and duration are flagged for review; automatic cross-source reconciliation remains unimplemented. Streaming XML/ZIP, timezone-offset dates and same-source duplicate protection are implemented. Different device sources remain separate for explicit review; the importer does not silently merge them. Watch workouts cannot verify individual strength sets.

## Official references

- [Apple: Share and export Health data](https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios) documents XML export.
- [Apple Developer: HealthKit](https://developer.apple.com/documentation/healthkit) describes native health data access.
- [Apple Developer: Authorising access](https://developer.apple.com/documentation/HealthKit/authorizing-access-to-health-data) describes capability and permission requirements.
- [Apple Developer: authorisation status](https://developer.apple.com/documentation/healthkit/hkauthorizationstatus) explains that apps cannot determine denied read access from query results.

- [Apple Developer: HealthKit statistics](https://developer.apple.com/documentation/healthkit/hkstatistics) describes sum, average and maximum quantities.
- [Apple Developer: active energy](https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/activeenergyburned) distinguishes activity energy from resting energy.
- [Apple Developer: units](https://developer.apple.com/documentation/healthkit/hkunit) defines energy and count/time units.

## Import receipts, undo and restore (0.18)

New imports store an immutable copy of the selected original activity records, an import timestamp and an initially empty archived-ID list in optional `healthImports`. Existing storage keys and version 2 are unchanged. Legacy data loads without rewriting and without invented import receipts.

**Progress → Activities → Health import history → Review import** shows original entries, current comparison state and paged results. Undo archives only byte-equivalent values (object-key order ignored) that are still active. Any later correction, including notes or confirmation changes, is kept. Manual activities and gym logs are untouched. Archived originals remain in JSON backups, and can be restored with their original confirmation state only if their IDs are absent from current activities. Colliding records are never overwritten. IDs in receipts also prevent repeated imports silently restoring archived entries.

A possible-duplicate warning compares exact workout type, duration and start instant, normalising timezone offsets. Different IDs may be from separate sources or equivalent exports. The preview flags them and requires a further explicit confirmation before importing a selected flagged entry. It does not merge, delete or prove duplication. Near matches and differently timed exports are not inferred to be duplicates.

Automated coverage includes legacy loading, undo/restore, original/corrected preservation, malformed receipts, collision handling, quota rollback, cancelled confirmation, duplicate import protection, JSON restore, profile/stale-review guards and offline use. Real Health export and physical iPhone verification remain outstanding.
