# Parallel Journal — Marketing Site

Marketing/privacy/support website for the Parallel Journal iOS/macOS app, at parallel-journal.com.

## Stack & deployment

- Currently plain static HTML/CSS, no build step. Fine to evolve to Astro + TypeScript for the full marketing homepage if that's still the direction — nothing here is locked in.
- Hosted on Cloudflare via the Workers static-assets model (not classic Pages — Cloudflare has folded Pages into Workers). Config is `wrangler.toml`:
  ```
  [assets]
  directory = "."
  ```
  If you add a build step (e.g. Astro), update `directory` to point at the build output folder and set the dashboard's deploy command accordingly.
- GitHub repo: `davidthiele-code/parallel-journal-site`, branch `main`. Push to `main` — the Cloudflare Worker project is connected to this repo and redeploys automatically (confirm in the Cloudflare dashboard whether it auto-builds on push or needs a manual "Deploy" click; last known state required a manual redeploy trigger through the dashboard).
- Live domain: `parallel-journal.com` (attached as a custom domain on the Worker). Also reachable at `parallel-journal-site.david-dba.workers.dev`.
- Support email: `support@parallel-journal.com` → Cloudflare Email Routing → forwards to `dthizzle@me.com`. New-domain mail may land in junk at first; this is normal and not a routing problem.

## Current state

- `/` — minimal placeholder homepage (name + tagline + nav)
- `/privacy` — live, submitted to App Store Connect as the Privacy Policy URL
- `/support` — live, submitted to App Store Connect as the Support URL
- Marketing URL in App Store Connect also points at `/` (root domain)

The app has already been submitted to App Review with these URLs in place. **Changing `/privacy` or `/support` content later is fine, but don't break or remove those URLs** — they're referenced from a live App Store Connect submission.

## Next task

Build out the full marketing homepage (and likely additional pages — features, pricing/IAP explanation, etc.) using copy/structure from an earlier ChatGPT planning session the user did (not preserved verbatim here — ask the user if they still have it, or draft fresh copy and check it with them).

## Ground truth about the app — verify, don't assume

The actual app is a separate project at `/Users/david/Developer/journal-app` (SwiftUI, iOS 17+/macOS 14+, SwiftData + CloudKit). Before stating any technical/privacy claim in website copy, verify it against that source rather than trusting old planning docs, since assumptions have drifted before. Facts already verified as of 2026-07-25 (re-verify if it's been a while or the app has changed):

- **No third-party SDKs at all.** Only Apple system framework imports (SwiftUI, SwiftData, StoreKit, CloudKit, PhotosUI, LocalAuthentication, etc.) — no analytics, no crash reporting, no ad frameworks, no tracking.
- **CloudKit private database only.** `JournalApp.swift` uses `cloudKitDatabase: .private(...)`, never `.public` or `.shared`. This is Apple's architecture where only the user's own iCloud account can access records — the developer has no access path to journal content, synced or local.
- **No account/sign-in required** to use the app.
- **In-app purchase**: "Unlock Relationship Mode" — processed entirely through StoreKit; the site/developer never sees payment info.
- **Export compliance**: app only uses system-provided TLS (URLSession/CloudKit/StoreKit), no custom encryption implementation. `ITSAppUsesNonExemptEncryption = false` is set in the app's Info.plist.
- iPad is explicitly NOT supported yet (iPhone-only build) — don't imply iPad support in marketing copy.

## Working style notes (carried over from the app project)

- The user prefers plain-text instructions over computer-use/GUI-driving for anything involving external dashboards (Cloudflare, App Store Connect, GitHub web UI) — describe steps for them to click through rather than trying to drive the browser, unless they ask otherwise for this project.
- Confirm before pushing to `main` / triggering a redeploy, since it's a live production site tied to an active App Store submission.
