# Apple Health pathway — 17 October 2026

## Implemented locally

The browser accepts an unzipped Apple Health `export.xml`, previews workout records, excludes duplicate source records and requires users to select completed activities before saving them to the active profile. It stores only workout type, source timestamp, date, duration and supported distance. Imported activities do not create gym sets or increase gym load-volume totals. Editing an imported activity requires fresh confirmation; its source identity is retained to prevent re-import duplication.

The XML file stays in the browser; it is not uploaded or retained as a raw export. Non-workout records, including clinical records, routes, heart rate and energy, are ignored. Unsupported duration units and malformed dates are skipped with a count; unsupported distance units remain absent. Unknown workout types retain their source type under the Custom category. Limits of 20 MB and 500 new workouts protect mobile responsiveness; large real-world exports need a streaming parser in a later release. ZIP files are not accepted: extract `export.xml` in Files or on a Mac first.

Tests use synthetic XML only. Real Apple Watch exports and physical iPhone import flows are not yet verified. Apple can change its export format; this importer deliberately supports a small subset and does not claim full Health export compatibility.

## Native companion design

HealthKit is Apple's native health and fitness repository. An ordinary browser PWA cannot request HealthKit entitlements. A future Swift companion would request read access only to user-selected types: workouts first, then duration/distance, active energy and heart rate if explicitly enabled. Do not request clinical records or routes by default.

The companion should produce a versioned, user-previewed local export with stable workout identities, units, source timestamps and provenance. Users can import the file into FORM without a server. A direct native-to-web bridge requires a separate design and explicit origin checks; it is not implemented. HealthKit absence or lack of returned records must not be interpreted as proof that a user did no exercise. No cloud transport, analytics or background data sharing is authorised by this design.

A later importer should add streaming XML/ZIP support, unit conversion tests for energy and heart rate, timezone/DST fixtures, duplicate reconciliation across sources and a reversible import batch history. Watch workouts cannot verify individual strength sets.

## Official references

- [Apple: Share and export Health data](https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios) documents XML export.
- [Apple Developer: HealthKit](https://developer.apple.com/documentation/healthkit) describes native health data access.
- [Apple Developer: Authorising access](https://developer.apple.com/documentation/HealthKit/authorizing-access-to-health-data) describes capability and permission requirements.
- [Apple Developer: authorisation status](https://developer.apple.com/documentation/healthkit/hkauthorizationstatus) explains that apps cannot determine denied read access from query results.
