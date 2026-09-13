# Working on Find

Find is a **Shell** that hosts several self-contained **Apps**. Read
[CONTEXT.md](./CONTEXT.md) for the vocabulary before changing anything.

The design rule behind everything here: **adding an App must not disturb the
Apps already there.** Prefer a change that touches one folder over a clever one
that touches many.

## Adding an App

1. Create `src/apps/<id>/`.
2. Give it an `index.tsx` whose **default export** is the App's root component,
   and which imports the App's own CSS:

   ```tsx
   import './my-app.css'
   import MyApp from './MyApp'
   export default MyApp
   ```

3. Add one entry to `registry` in `src/shell/registry.ts`:

   ```ts
   {
     id: 'my-app',
     name: 'My App',
     description: 'One line, shown on the Home tile',
     icon: MyAppIcon,          // declared in registry.ts, not in the App
     accent: '#7dd3fc',        // tints the App's Home tile
     load: () => import('../apps/my-app'),
   }
   ```

That is the whole procedure. Do not edit `Shell.tsx`, `Home.tsx`, `router.ts`,
or any other App.

## Rules an App must follow

- **Namespace every class name.** Pick a short prefix (`lc-`, `devices-`) and
  use it on every selector, including the root element. Apps share one document;
  a bare `.row` or `.header` will collide with the next App.
- **Scope your tokens to your root class**, not `:root`. See
  `src/apps/devices/palette.css`.
- **Declare the icon in `registry.ts`, not in your App.** Importing it from the
  App would pull the App's whole chunk into the initial bundle and defeat lazy
  loading.
- **Assume nothing about the Shell.** Apps import nothing from `src/shell/`. The
  Shell passes no props, no storage, no navigation handle.
- **Clean up on unmount.** The Shell unmounts an App when you leave it, so
  return teardown from every `useEffect` that starts a watch, timer or socket.
  A leaked sensor runs behind another App's UI.
- **Treat ≥880px as the tablet breakpoint** if you have two postures. It is a
  convention, not a token — CSS custom properties cannot be used in media
  queries.

## What the Shell gives you

Only two things, both inherited automatically:

- **A container.** `.shell-host` is a fixed, contained box below the Shell bar.
  It is a containing block for `position: fixed` descendants, so `inset: 0`
  inside your App fills the host rather than the viewport. Your z-indexes cannot
  escape it, so use whatever values you like.
- **Device tokens.** `--safe-t`, `--safe-b`, `--safe-l`, `--safe-r` from
  `src/shell/tokens.css`, plus the reset and the reduced-motion clamp in
  `src/shell/reset.css`. **Use the safe-area tokens** on anything pinned to a
  screen edge, or it will sit under the notch on an installed PWA.

Everything else — colour, type, radii, shadows, motion — is yours.

## The one exception to "one folder plus one Registry entry"

Some things are build-time config and cannot be expressed at runtime inside an
App. Two Apps need this today:

- **Devices** adds a `workbox.runtimeCaching` rule for OpenStreetMap tiles.
- **IDE** needs the repository's own source, so it ships a Vite plugin
  (`src/apps/ide/snapshot.plugin.ts`) exposing `virtual:project-snapshot`.

Keep the plugin in the App's own folder and add a single import plus one entry
in `vite.config.ts`, as the IDE does. That way the exception costs one line of
shared config rather than a block of app-specific logic. Label anything you add
with the App's name.

A node-side plugin must also be added to `tsconfig.node.json`'s `include` and
excluded from `tsconfig.app.json`, since it uses node APIs rather than DOM
ones.

## Before you push

```bash
npm run build   # tsc -b + vite build
npm run lint    # oxlint
npm run preview # serves at http://localhost:4173/find/
```

Check the App at phone width (390px) **and** tablet width (1024px), and confirm
the other Apps still work — the point of the Shell is that they should.
