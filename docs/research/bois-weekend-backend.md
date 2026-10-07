# Which backend should host Bois Weekend?

Research ticket for the **Bois Weekend** App. All sources accessed **2026-10-07**.

**Recommendation: Supabase (Free plan, Sydney region).** Runner-up: Convex.
Ruled out: Firebase, because receipt storage and server functions both need a
billing account. Also ruled out: Cloudflare, because you would have to build
sign-in and realtime yourself. The reasoning is in [Recommendation](#recommendation).

## The workload

- About 10 friends and a few Weekends a year, so the backend sits idle for weeks
  between Weekends.
- Many receipt photos. Assume they are resized in the browser to about 200–400 KB
  each, so 1 GB holds roughly 3,000 photos.
- The client is a static SPA at `https://<user>.github.io/find/`, often run as an
  installed PWA on iOS.
- Membership of a Weekend must be enforced by the server on every read and
  write, including photos and live updates.
- One server function calls the Claude API with a secret key.
- Backend code lives in `src/apps/bois-weekend/backend/` and deploys separately
  from GitHub Pages.

## Summary table

| | **Supabase** | **Firebase** | **Cloudflare (Workers + D1 + R2 + Durable Objects)** | **Convex** (alternative) |
|---|---|---|---|---|
| Free plan covers it? | Yes. 500 MB database, 1 GB files, 5 GB egress, 50k monthly active users | **No.** Cloud Storage and Cloud Functions require the paid Blaze plan; only Firestore and Auth work on the free Spark plan | Mostly. Workers, D1 and Durable Objects are free. R2 needs an "R2 subscription" checkout | Yes. 0.5 GB database, 1 GB files, **1 GB/month file egress**, 1M function calls |
| Pauses when idle | **Yes. Paused after 7 days of low activity**, restorable for 1 year | No | No | Not documented for Free |
| At the limit | Notice, then grace period, then restrictions (read-only, 402 errors, pausing) | Blaze: billed. Budgets only alert unless you set a spend cap | D1 and Durable Objects return errors until 00:00 UTC. R2 is billed | Free: writes can fail. Optional per-deployment usage limits disable the deployment |
| Google, Apple, email sign-in | All built in. Email can be a 6-digit **OTP code** | Built in, but email is **link only** | **None hosted.** You assemble a library (for example Better Auth) and an email sender | Convex Auth (**beta**): OAuth, magic link and OTP |
| Membership enforced by | Postgres RLS (declarative SQL) | Security Rules (declarative) | Your Worker code | Your function code |
| Realtime | Postgres Changes, filtered by RLS | Firestore `onSnapshot`, filtered by Rules | You build it (Durable Objects + WebSockets) | Built in (reactive queries) |
| Photos under the same rules | Storage RLS on `storage.objects` | Storage Rules (Blaze only) | Worker-proxied R2 | HTTP action check. Plain file URLs are bearer links |
| Claude function with secret | Edge Function + `supabase secrets set` | Cloud Function (Blaze) | Worker + `wrangler secret put` | Action + env var |
| AU/NZ region | `ap-southeast-2` Sydney | `australia-southeast1/2` (free GCS storage tier is US-only) | Location hint `oc` (Oceania), best effort | `aws-ap-southeast-2` Sydney, +30% unit price |
| Client bundle (min+gzip, measured) | **58 KB** | **176 KB** | ~0–12 KB (your own code, or an auth client) | **23 KB** |
| Infra as code + CLI | `supabase/` migrations, `config.toml`, functions. `supabase db push`, `functions deploy` | `firebase.json`, `.rules`, functions. `firebase deploy` | `wrangler.jsonc`, migrations. `wrangler deploy`, `d1 migrations apply` | `convex/` folder (schema and functions in TypeScript). `npx convex deploy` |

---

## 1. Free tier, limits and idle pausing

### Supabase

The Free plan includes ([plans.ts](https://github.com/supabase/supabase/blob/master/packages/shared-data/plans.ts), [pricing.ts](https://github.com/supabase/supabase/blob/master/packages/shared-data/pricing.ts), which feed [supabase.com/pricing](https://supabase.com/pricing)):

- unlimited API requests and 50,000 MAU
- a 500 MB database, plus 5 GB egress and 5 GB cached egress
- **1 GB file storage**, with a 50 MB maximum upload
- 500,000 Edge Function invocations
- 200 concurrent Realtime connections and 2M Realtime messages a month
- 2 active projects

Image transformations are not included on Free, so resize photos on the client.

**Idle pausing is the main problem for this workload.**

- Free projects with "low activity over a 7-day period" are paused. A warning email goes out about a week beforehand. "A few user requests to the database each day" usually prevents it.
- A paused project can be restored from the dashboard for **1 year**, and it comes back with its data. After that you can only download the backups.
- Sources: [Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [Restore after 1 year](https://supabase.com/docs/guides/troubleshooting/restore-project-after-90-days-pause).

A Weekend separated from the last one by a quiet month will find the project paused. Someone has to press **Resume project** first, or a keep-alive job has to stop it pausing. That job could be a scheduled GitHub Actions workflow that makes one database read a day. GitHub disables scheduled workflows in a public repo after **60 days with no repo activity** ([GitHub Docs](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)), so the keep-alive is not fire-and-forget either. Pro ($25/month) removes pausing.

**At the limit.** Exceeding the database size puts the project in read-only mode ([Database size](https://supabase.com/docs/guides/platform/database-size)). Exceeding other quotas repeatedly leads to a notification, then a grace period, then Fair Use restrictions. These can be pausing, read-only mode, or HTTP 402 on every API request ([Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#fair-use-policy)). You are never billed on Free.

### Firebase

- **Firestore** is free within the default database's quota: 1 GiB stored, 50k reads, 20k writes and 20k deletes per day, reset around midnight Pacific time. Named databases get no free quota ([Firestore pricing](https://cloud.google.com/firestore/pricing)).
- **Cloud Storage for Firebase needs Blaze.** Since 3 Feb 2026, Spark projects have no access to any bucket, including the default bucket. Calls return 402 or 403 ([Storage FAQ, Sept 2024 changes](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)).
- On Blaze, the Cloud Storage "Always Free" quota (5 GB-months, 5k Class A operations, 50k Class B operations) applies **only in US-WEST1, US-CENTRAL1 and US-EAST1**. Its 100 GB of free egress **excludes Australia destinations** ([Cloud Storage pricing](https://cloud.google.com/storage/pricing#cloud-storage-always-free)). An Australian bucket therefore pays from the first byte. The amount is cents, but it is a real bill on a real card.
- **Cloud Functions need Blaze.** The no-cost tier is 2M invocations a month ([Functions quotas](https://firebase.google.com/docs/functions/quotas), [pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)).
- An alerts-only budget does **not** cap spend. Cloud Billing now has opt-in "spend cap budgets" for supported services ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), [Spend caps](https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps)).
- Nothing pauses when idle.

### Cloudflare

- **Workers Free:** 100,000 requests a day and 10 ms CPU per request. Waiting on `fetch()` or the database does **not** count as CPU time, and HTTP requests have no wall-clock limit. Over the daily limit you get Error 1027 until 00:00 UTC ([Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [limits](https://developers.cloudflare.com/workers/platform/limits/)).
- **D1 Free:** 5M rows read and 100k rows written per day, 5 GB total, 500 MB per database. Over the limit, queries return errors until the daily reset ([D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)).
- **Durable Objects:** available on Free, SQLite-backed only. Free allows 100k requests and 13,000 GB-s per day. "If you exceed any one of the free tier limits, further operations of that type will fail" ([DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)).
- **R2:** 10 GB-month, 1M Class A and 10M Class B operations free each month, with free egress. Usage beyond that is **billed, not blocked**. Getting started requires completing "the checkout flow to add an R2 subscription" ([R2 pricing](https://developers.cloudflare.com/r2/pricing/), [R2 get started](https://developers.cloudflare.com/r2/get-started/)).
- Nothing pauses when idle. This is the roomiest free tier of the four, and the only one with free egress.

### Convex

- **Free:** 0.5 GB database, 1 GB/month database I/O, 1M function calls a month, 20 GB-hours of action compute, 1 GB file storage and **1 GB/month file egress**. "After these limits are hit on the Free plan, new mutations … may fail" ([Limits](https://docs.convex.dev/production/state/limits)).
- Optional per-deployment usage limits can disable a deployment until the window resets ([Usage limits](https://docs.convex.dev/production/usage-limits)).
- The docs describe no automatic idle pausing for Free deployments. "Idle" (30 days with no function calls) appears only as a fee waiver on Business plans.
- File egress is the tight limit here. Ten friends opening full-size photos repeatedly over a weekend could approach 1 GB, so serve thumbnails.

## 2. Auth from a static SPA on GitHub Pages, and inside an installed iOS PWA

### What holds for every provider

- **Each iOS home-screen web app has its own cookies and storage, separate from Safari** ([WebKit tracking prevention](https://webkit.org/tracking-prevention/)).
  - An emailed **magic link** opens in Safari or the mail app's browser, not in the installed PWA. Any session it creates lands in the wrong storage.
  - With Supabase's default PKCE flow, the link fails outright. The code verifier "must be initiated on the same browser and device where the flow was started" ([PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)).
  - **For the PWA, email sign-in should be a 6-digit code the user types in**, not a link.
- **Sign in with Apple** on the web requires the Apple Developer Program, which costs 99 USD a year ([Apple](https://developer.apple.com/programs/whats-included/)). With OAuth on the web, the client secret must be regenerated **every 6 months** ([Supabase Apple guide](https://supabase.com/docs/guides/auth/social-login/auth-apple)).
- **OAuth redirects (Google or Apple) inside an iOS standalone PWA.** The redirect leaves the app's scope and comes back to `/find/`. None of the vendors document this behaviour for iOS standalone mode, so **test on a real iPhone** before committing. If it misbehaves, email OTP is a fallback that always works.

### Supabase

- Google, Apple and email are built in. `signInWithOtp` sends a magic link by default. Change the email template to `{{ .Token }}` and it sends a 6-digit code instead, which `verifyOtp` checks ([Passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless)).
- Add `https://<user>.github.io/find/` to the redirect allow-list; exact paths and globs are supported ([Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)).
- The built-in email sender allows only **2 emails per hour**, is best effort, and is "not for production" ([SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [config.ts](https://github.com/supabase/supabase/blob/master/packages/shared-data/config.ts)). Plan on a free custom SMTP sender.

### Firebase

- Google and Apple are built in. Email sign-in is **link only**: there is no built-in typed email code for the web, which is a poor fit for the iOS PWA.
- On a non-Firebase host such as GitHub Pages, `signInWithRedirect` breaks in browsers that block third-party storage, Safari included. Firebase's fixes are:
  - use `signInWithPopup`, or
  - proxy `/__/auth` to `firebaseapp.com`, or
  - self-host the helper code on your own domain.

  ([Redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices))

  GitHub Pages cannot proxy, so that leaves popups or self-hosting. Popups are fragile in standalone PWAs. This is the weakest auth story here.

### Cloudflare

- The Workers platform has no hosted end-user sign-in. You would embed a library such as Better Auth with D1, register the Google and Apple OAuth apps yourself, and add an email sender for OTP codes.
- It is doable, but sign-in becomes code you own and have to secure.

### Convex

- Convex Auth supports "Magic Links & OTPs" and OAuth (GitHub, Google, Apple) for React and Vite SPAs. It is labelled **beta** ([Convex Auth](https://docs.convex.dev/auth/convex-auth)).
- Clerk or Auth0 can be plugged in instead ([Auth overview](https://docs.convex.dev/auth/overview)).

## 3. Enforcing Weekend membership on every read and write

- **Supabase.** Enable RLS on every table and write policies such as `exists (select 1 from members m where m.weekend_id = expenses.weekend_id and m.user_id = (select auth.uid()))`.
  - Postgres enforces them for PostgREST, Realtime and Storage alike ([Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)).
  - **Caveat:** RLS is not applied to `DELETE` events in Postgres Changes. Use soft deletes, or have clients refetch on delete.
  - Joining by invite link works through a `security definer` RPC, for example `join_weekend(token)`. It checks `auth.uid()` is set and inserts the membership row, so only signed-in users can join.
- **Firebase.** Security Rules can call `get()` or `exists()` on a membership document. The approach is declarative and well proven, but Storage Rules only exist on Blaze.
- **Cloudflare.** You write every check yourself in the Worker. D1 has no row-level security, so one forgotten check is a data leak.
- **Convex.** You call `ctx.auth.getUserIdentity()` and check membership in every query and mutation. It is code, not declarative rules, but it is TypeScript in the repo and easy to put behind one helper.

## 4. Realtime

- **Supabase.** Postgres Changes sends RLS-filtered row events over WebSocket. Every subscriber is authorised separately, which is irrelevant at 10 users ([Scaling](https://supabase.com/docs/guides/realtime/postgres-changes#scaling-postgres-changes)).
  - iOS throttles background tabs, so connections can drop silently. Use `heartbeatCallback` and refetch when the app becomes visible again ([Silent disconnections](https://supabase.com/docs/guides/troubleshooting/realtime-handling-silent-disconnections-in-backgrounded-applications-592794)).
- **Firebase.** Firestore `onSnapshot` gives live queries filtered by Rules.
- **Cloudflare.** Build it yourself: one Durable Object per Weekend holding hibernatable WebSockets. Hibernated objects are not billed for duration ([DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)).
- **Convex.** Every `useQuery` is live by default. This is the least code of the four.

## 5. Receipt photos under the same rules

- **Supabase.** Storage allows nothing until you add RLS policies on `storage.objects`. Policies can key on the path, for example `(storage.foldername(name))[1]` being the Weekend id ([Storage access control](https://supabase.com/docs/guides/storage/security/access-control)). The 1 GB free limit is the binding constraint.
- **Firebase.** Storage Rules can read Firestore membership, but only on Blaze (§1).
- **Cloudflare.** Use a private R2 bucket and serve every request through the Worker, which checks membership. Egress is free.
- **Convex.** `storage.getUrl` URLs work for "anyone with the URL". For a check on every request, serve files from an HTTP action that verifies membership ([Serving files](https://docs.convex.dev/file-storage/serve-files)). Each served file also counts as a function call.

## 6. Server function calling Claude with a secret key

- **Supabase.** Edge Functions, with the key set via `supabase secrets set`. Free allows a 150 s wall clock and 2 s CPU per request; waiting on I/O is excluded from CPU ([Secrets](https://supabase.com/docs/guides/functions/secrets), [Limits](https://supabase.com/docs/guides/functions/limits)). The function can check the caller's JWT and membership before calling Claude.
- **Firebase.** Cloud Functions with Secret Manager, on Blaze only.
- **Cloudflare.** A Worker, with the key set via `wrangler secret put` ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)). The 10 ms CPU limit excludes the time spent waiting on the Claude API.
- **Convex.** An action, with the key in a deployment environment variable ([Env vars](https://docs.convex.dev/production/environment-variables)).

## 7. Australia / NZ region

None of the four has a New Zealand region. All offer Sydney or Oceania.

- **Supabase:** `ap-southeast-2` (Sydney) ([regions.ts](https://github.com/supabase/supabase/blob/master/packages/shared-data/regions.ts)).
- **Firebase:** Firestore in `australia-southeast1` (Sydney) or `australia-southeast2` (Melbourne) ([Firestore locations](https://firebase.google.com/docs/firestore/locations)). The free Cloud Storage tier is US-only (§1).
- **Cloudflare:** D1, R2 and Durable Objects accept the `oc` (Oceania) location hint. It is best effort, not guaranteed ([D1](https://developers.cloudflare.com/d1/configuration/data-location/), [R2](https://developers.cloudflare.com/r2/reference/data-location/), [DO](https://developers.cloudflare.com/durable-objects/reference/data-location/)).
- **Convex:** `aws-ap-southeast-2` (Sydney), billed at 1.3× ([Regions](https://docs.convex.dev/production/regions)).

## 8. Client bundle size

I measured these with esbuild 0.28 (`--bundle --minify`, React external), importing what Bois Weekend would use: auth, data, realtime, storage and functions.

| SDK (version) | min | min+gzip |
|---|---|---|
| `firebase` 12.19 (app, auth, firestore, storage, functions) | 648 KB | **176 KB** |
| `@supabase/supabase-js` 2.117 | 223 KB | **58 KB** |
| `convex` 1.46 + `@convex-dev/auth` 0.0.96 (React client) | 81 KB | **23 KB** |
| `better-auth` 1.7 client + magic-link plugin (Cloudflare option) | 33 KB | **12 KB** |

The Registry lazy-loads each App, so whichever SDK you pick lands in Bois Weekend's own chunk. It does not touch the Shell's precached bundle. After the first open, the service worker caches it like any other App chunk (see AGENTS.md, "Offline").

## 9. Schema, rules and functions as code, deployed from a CLI

All four keep their config in files and deploy from a CLI. Each would live in `src/apps/bois-weekend/backend/`. Because these are separate deploy targets rather than a Vite plugin, nothing needs adding to `vite.config.ts` or the tsconfigs. You only need to exclude the backend folder from the app's TypeScript build where its runtime differs: Deno for Supabase, Workers types for Cloudflare.

- **Supabase:** the `supabase/` folder holds `config.toml`, `migrations/*.sql` (tables, RLS and storage policies), `seed.sql` and `functions/`. Deploy with `supabase db push` and `supabase functions deploy` ([CLI workflows](https://supabase.com/docs/guides/local-development/cli-workflows), [Managing config](https://supabase.com/docs/guides/local-development/managing-config), [Deploy](https://supabase.com/docs/guides/functions/deploy)). Supabase also runs locally under Docker.
- **Firebase:** `firebase.json`, `firestore.rules`, `storage.rules`, indexes and `functions/`, deployed with `firebase deploy`.
- **Cloudflare:** `wrangler.jsonc`, `migrations/*.sql`, then `wrangler d1 migrations apply` and `wrangler deploy` ([D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)).
- **Convex:** a `convex/` folder holding the schema and functions in TypeScript, deployed with `npx convex deploy` ([Hosting](https://docs.convex.dev/production/hosting/custom)).

---

## Recommendation

**Use Supabase on the Free plan, in `ap-southeast-2`.**

- It is the only option that meets every requirement on a free plan with no card on file.
- Membership is declarative RLS, and the same policies cover rows, live updates and photos.
- Google, Apple and an **email OTP code** are built in. The code is the method that works reliably inside an installed iOS PWA.
- Edge Functions keep the Claude key server-side.
- Everything lives as SQL and TypeScript in `backend/supabase/` and deploys from the CLI.

Accept and mitigate three things:

1. **Idle pausing.** Before each Weekend, someone resumes the project in the dashboard, or a scheduled keep-alive stops it pausing. If pausing becomes a nuisance, Pro costs $25/month.
2. **The 1 GB file limit.** Resize and compress receipts on the client to roughly 1600 px JPEG/WebP, and optionally delete photos after a Weekend is settled.
3. **Email.** Configure a custom SMTP sender, because the built-in one allows 2 emails per hour. Use the `{{ .Token }}` OTP template rather than links.

**Choose Convex instead** if idle pausing is unacceptable and you are comfortable with authorisation in code rather than RLS, with a beta auth library, and with 1 GB/month of file egress. It has the best realtime developer experience and the smallest bundle, and it offers a Sydney region.

**Do not choose:**

- **Firebase.** Storage and Functions need Blaze, the free storage tier is US-only, it is the heaviest client by far (176 KB gzipped), it has no email OTP, and `signInWithRedirect` is fragile on GitHub Pages.
- **Cloudflare.** It has the most generous limits and no pausing, but you would hand-build auth, realtime and every membership check. That is far more security-critical code to own for a friends-only app.

### Still unverified

- How Google and Apple OAuth redirects behave inside an iOS standalone PWA. No vendor documents it, so prototype on a real iPhone first.
- I read the Firebase pages through search results only, because `firebase.google.com` was blocked from this environment. The Cloud Storage figures come from `cloud.google.com`, which I read directly.
