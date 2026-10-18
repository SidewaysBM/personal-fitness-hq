# FORM privacy and hosting handover

18 October 2026. Local implementation; no account settings or hosting changed.

## Immediate exposure containment

1. In the browser or installed app that holds actual records, open FORM → Settings → Backup JSON. Select the other profile and repeat if it has records. Save both files privately and check profile names, dates and record counts. Each device has independent storage: export separately where histories differ. Do not put backups in the repository, email them or clear website data.
2. Open https://github.com/SidewaysBM/personal-fitness-hq/settings → General → Danger Zone → Change repository visibility → Change to private. Read GitHub’s confirmation and confirm the repository name. Verify the Private badge and that a signed-out window cannot open it.
3. GitHub Free Pages requires a public repository; private-repository Pages requires an eligible paid plan. Do not assume the existing website will remain available after changing visibility. The existing browser data is still tied to its original origin. Do not uninstall the original app before exports are verified. [GitHub visibility documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility), [GitHub Pages availability](https://docs.github.com/en/pages/quickstart).
4. Making the repository private does not undo previous downloads, forks or indexing. Local redaction does not erase Git history. History rewriting remains a separate coordinated decision; no rewrite or force-push has been performed.

## New hosting — prepare before moving data

Cloudflare Pages supports private repositories. Use its Git integration, grant access only to this repository and use the reviewed `main` branch as production. Set framework to None, build command to `node scripts/build-site.cjs`, output directory to `dist`, and Node version to 24. The build copies only the app, offline assets and local OCR resources; never publish the repository root. [Private Git integration](https://developers.cloudflare.com/learning-paths/personal-website/pages-setup/connect-git-pages/), [build configuration](https://developers.cloudflare.com/pages/get-started/git-integration/).

Initially deploy an empty placeholder from a separate setup branch while configuring Access. Do not deploy FORM or import records until all hostnames are protected and checked. A Pages site is otherwise publicly reachable during setup. Keep preview deployments disabled until their protection is ready.

### Protect production and previews

1. Cloudflare dashboard → Workers & Pages → project → Settings → Enable access policy → Manage.
2. In Access → Applications, configure the created application. Remove the `*` wildcard from its hostname to protect the production `PROJECT.pages.dev` address. Save.
3. Return to the Pages project and enable the preview access policy again. Verify separate applications cover both `PROJECT.pages.dev` and `*.PROJECT.pages.dev`.
4. If using a custom domain, add/verify it in Pages before creating its Access policy. Then Zero Trust → Access controls → Applications → Create new application → Self-hosted and private → Add public hostname. Add that exact custom domain.
5. Configure every application with an Allow policy containing only the two full email addresses. Do not use Everyone or an email-domain-wide rule. Remove broader default policies. Production, preview aliases and any custom domain must all be covered.

These hostname steps follow [Cloudflare’s Pages Access instructions](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain). The preview checkbox alone does not protect production.

Enable One-time PIN as the login method in Cloudflare One’s identity-provider settings. Use the complete intended addresses, not `ben@` or `georgie@` placeholders. Each approved person receives a code by email. This is separate from FORM’s local encryption PIN. Review the current plan shown in the account before selecting any subscription; no paid service has been approved. [Email PIN setup](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/).

### Verify access before migration

- In a fresh private window, production, previews and custom domain must request login before serving app files. Test direct `/index.html`, `/sw.js` and asset URLs, not only the homepage. An unapproved email must not gain access.
- Each approved email must sign in successfully. Test logout and session expiry. A previously cached offline app can still open locally after Access expires: the local PIN protects that copy.
- Only after these checks deploy the reviewed FORM release, open the stable production URL, select the intended profile and restore its JSON backup. Compare counts and several real sessions. Repeat for the other profile/device where needed.
- Re-enable PIN encryption on the new origin, take a fresh backup and install the new URL to the iPhone Home Screen. Test offline reopening and record correction on a real phone. Keep the old app and backup until this is verified.
- Changing the URL does not migrate localStorage automatically. Cloudflare Access does not provide shared histories, cloud backup or cross-device sync.

## Local security implementation

- Personal project context stays in an ignored local file. Known profile details are rejected in working-tree Git candidates and changed staged files. This is a specific-content guard, not a universal personal-information detector or historical cleanup.
- New profiles start with unentered measurements; existing saved profiles are never reset by this change.
- Optional six-digit PIN per profile: PBKDF2-SHA256 (310,000 iterations), a random 16-byte salt, AES-256-GCM with a fresh 12-byte IV per write and profile-key binding. The existing storage keys remain unchanged. Keys stay in memory. Each encrypted envelope contains the saved JSON and pre-restore recovery bytes.
- Enabling encryption verifies decryption before migration, checks for concurrent changes and removes the separate plaintext recovery copy. Writes are awaited before success and fail without replacing the previous ciphertext. Reload, profile switch and one minute in the background lock the profile.
- A six-digit PIN has limited entropy and can be guessed offline by someone who obtains the encrypted data. Keep device passcodes, OS encryption and browser security enabled. An app PIN cannot protect an already-unlocked page against malicious extensions or compromised same-origin code.
- Forgotten PIN: download the encrypted original, restore a known good JSON backup through the locked screen, then set up a new PIN. The old PIN is not recoverable. Restoring replaces the selected profile; it does not merge histories.
- JSON/CSV downloads remain plaintext. The reminder tracks when a backup download was requested, not whether the user saved it successfully.
- CSP blocks inline event code, unknown scripts, objects and unauthorised media hosts. The startup script is pinned by hash; `node scripts/update-csp.cjs` updates it after intentional edits. Local OCR retains the narrowly required worker/blob/WASM permissions. The release gate rejects a stale hash.

## Remaining gates

Real-profile backups and their browser/device location; full Access email addresses; account plan and optional custom domain; physical iPhone verification; actual Cloudflare Access checks and deployment. No real backups, live deployment, visibility change or history cleanup is claimed here.

For local desktop review, use the existing localhost preview. A plain HTTP home-network address is not a substitute for HTTPS PWA hosting on an iPhone. Local review uses its own storage, separate from the live site's records.
