# Find — a personal workbench

**Find** is an installable web app that holds other apps. Open it and you get a
grid of tiles; tap one and that app takes the screen. It exists so that building
a new small app never means clobbering the last one.

Three apps live here today:

| App | What it does |
| --- | --- |
| **Devices** | Locates your things on a live dark map — distance, last-seen and battery on every row. |
| **Lifecycle** | Traces every read, write, method call and derivation on a JavaScript object over one run. |
| **IDE** | Reads and edits this project's own source from a phone — syntax highlighting, a symbol row for the characters phone keyboards bury, and edits that survive leaving the app. |

## The idea

Adding an app is **one new folder plus one line in the registry**. Nothing else
changes — not the shell, not the router, and certainly not the other apps. That
constraint is the whole design, and everything below follows from it.

- **Apps know nothing about the shell.** No props, no SDK, no storage handle, no
  navigation. An app is a React component behind a dynamic import.
- **Apps know nothing about each other.** Each owns its palette, its type scale
  and its class-name prefix. Devices is warm amber; Lifecycle is cool slate;
  neither had to compromise.
- **The shell owns the device, apps own the look.** The shell provides a reset,
  safe-area insets and a reduced-motion clamp. Everything aesthetic belongs to
  the app.
- **Apps unmount when you leave them.** Devices runs a GPS watch; it stops the
  moment you go back to Home rather than draining battery behind a code editor.
- **Apps load lazily.** Opening Lifecycle never downloads Leaflet, and neither
  of them downloads the IDE's editor.

See [CONTEXT.md](./CONTEXT.md) for the vocabulary and
[AGENTS.md](./AGENTS.md) for how to add an app.

## Tech

- **Vite + React 19 + TypeScript**, no UI framework and no router dependency —
  hash routing is ~30 hand-rolled lines over `popstate`
- **Leaflet** with OpenStreetMap tiles for Devices, restyled dark via a CSS
  filter and cached by the service worker for offline use
- **CodeMirror 6** for the IDE, lazily loaded so it costs nothing until opened
- **Installable PWA** (`vite-plugin-pwa`) — add it to your home screen and it
  runs full-screen with safe-area insets. Only the shell is precached; each app
  is cached the first time you open it, so installing Find does not download
  every app's dependencies. An app you have never opened will not work offline.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Open it on your phone (same network, or deploy it) and **allow location** to see
yourself on the map in Devices.

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build at /find/
npm run lint       # oxlint
```

> Location requires a secure context. `localhost` and any `https://` host work;
> plain-HTTP LAN IPs will not grant geolocation.

## Project layout

```
src/
  main.tsx                mounts the Shell, registers the service worker
  shell/
    registry.ts           the single list of Apps — add an App here
    types.ts              AppEntry: id, name, description, icon, accent, load
    Shell.tsx             route → App, bar, unmount-on-leave
    Home.tsx              the tile grid
    router.ts             hash routing
    reset.css             a true reset, nothing app-specific
    tokens.css            device tokens only (safe-area insets)
    shell.css             bar, Home and App host
  apps/
    devices/              index.tsx, App.tsx, components/, hooks/, lib/,
                          store/, devices.css, palette.css
    lifecycle/            index.tsx, LifecycleApp.tsx, components/,
                          parser.ts, tracer.ts, lifecycle.css
    ide/                  index.tsx, IdeApp.tsx, workspace.ts, components/,
                          hooks/, ide.css, snapshot.plugin.ts
```

### The IDE's edits

The IDE ships a build-time snapshot of this repository, so it opens instantly
and works offline. Edits live in `localStorage` and never leave the device on
their own — there is no backend and no token. To move work off the phone, use
**⋯ → Copy patch** or **Download patch** and `git apply` it elsewhere. Editing a
file in the IDE does not change the running app; the snapshot is fixed until the
next deploy.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes to a `gh-pages` branch on
every push. Production builds use a `/find/` base path; override with the
`BASE_PATH` env var for a custom domain or a user site.

One-time setup, then it's automatic:

1. Push the branch — the **Deploy to GitHub Pages** action builds and creates
   the `gh-pages` branch.
2. In the repo, go to **Settings → Pages → Build and deployment**, set
   **Source = Deploy from a branch**, choose **`gh-pages` / `root`**, and save.
3. Open `https://<your-user>.github.io/find/` and **Add to Home Screen**. HTTPS
   satisfies the geolocation secure-context requirement, so Devices' live map
   works.

## Going multi-device (future)

Devices stores everything in `localStorage`, so there is no backend and no
account — private, instant and offline-capable, but rings only sound on the
device you're holding and devices don't sync on their own. To change that you'd
replace the read/write in `src/apps/devices/store/devices.ts` with a small sync
service. Nothing outside that folder needs to change.
