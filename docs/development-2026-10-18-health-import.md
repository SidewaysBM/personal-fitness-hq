# Apple Health workout-import workstream — 0.12.0

## Implemented

- Direct `export.zip` and `export.xml` selection; local ZIP decompression with no CDN, upload, account or credentials.
- Chunked reading up to 200 MB for the selected file and expanded XML, and 50,000 workout records. Only workout fields are retained in memory; unrelated health records are discarded during parsing. No whole-document DOM is built.
- Older total-distance attributes and newer workout-distance statistics, with explicit conversion for metres, kilometres, miles and yards. Unsupported or ambiguous distances remain unknown. Unknown workout types remain Custom with the original type visible.
- Strict dates/times, duration units and well-formed XML; invalid workout rows are counted. Malformed XML, unsupported declarations, incomplete ZIPs, multiple export.xml entries and exceeded limits reject the preview without saving partial results.
- 50-row pages, date filters, persistent selections, explicit confirmation of displayed workouts, clear selections and future-date exclusion. Source names and start times remain visible for review.
- Existing duplicate identities remain compatible. Repeat imports preserve earlier corrections instead of overwriting them. Different recording sources stay separate and visible for the user to review; the app does not guess whether two devices recorded the same real-world activity.
- Selection and cancellation never save. Confirmation merges into the current active profile using existing conflict/rollback protection. Switching profiles invalidates an open import. Stale file reads cannot replace a newer preview.
- Imported activities never create gym sets or exercise records. Saved data remains compatible with existing JSON backups and exports.
- Two pinned, locally bundled dependencies: sax 1.6.1 and fflate 0.8.3; licences in `health-import-licenses.md`. Dependency audit reports zero known vulnerabilities at implementation time.

## Verification and limits

Automated tests use synthetic XML/ZIP data, including a history over 20 MB. They cover chunk boundaries, modern and legacy distance forms, malformed input, duplicate/correction preservation, cancellation, expansion limits, paging/filtering, failed saves, profile changes and no gym-set creation. Browser coverage: desktop Chrome, iPhone 13 WebKit and iPhone SE WebKit. The full regression and app-update suites passed. After final filter-layout changes, Health-specific tests passed again on all three browser configurations, including offline ZIP parsing in Chrome.

The 200 MB boundary and 50,000-workout boundary are guardrails, not a promise of acceptable performance on every phone. A real user export and physical iPhone use remain unverified. ZIP64, split/encrypted archives, live HealthKit synchronisation, heart rate, energy, routes and body-measurement imports are not supported. For ZIP64, choose the unzipped export.xml within the stated limit. No automatic cloud integration is introduced.

## User review

In Health on iPhone, tap the profile picture/initials and use Export All Health Data. Save the export in Files. In FORM use Progress → Activities → Import Apple Health, choose the ZIP or XML, review dates/types/source names and confirm only completed workouts for the selected profile. Confirm displayed workouts selects only the visible page; it does not select hidden pages or future dates. Selections remain across filters, and the selected count is shown before import.

[Apple's export instructions](https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios). Implementation references: [sax streaming parser](https://github.com/isaacs/sax-js) and [fflate ZIP streams](https://github.com/101arrowz/fflate).
