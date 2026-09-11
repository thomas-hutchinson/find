# Find

Find is a personal workbench: one installable web app that holds several small,
self-contained apps. It exists so that adding a new app never disturbs the ones
already there.

## Language

**Shell**:
The host that owns the window — routing, the Home screen, and the reset and
device tokens every app inherits. It renders exactly one App at a time.
_Avoid_: framework, container, host app, scaffolding

**App**:
A self-contained experience living in `src/apps/<id>/`, reached by one Registry
entry. An App knows nothing about the Shell or about any other App.
_Avoid_: module, plugin, page, tab, mini-app

**Registry**:
The single list of Apps, in `src/shell/registry.ts`. Adding an App means adding
one entry here and nothing else. Distinct from the *PWA manifest*, which
describes the installed Find itself.
_Avoid_: manifest, catalogue, index

**Home**:
The Shell's app-picker screen: a grid of tiles, one per Registry entry. The
route when no App is selected.
_Avoid_: launcher, dashboard, menu, index

## The styling boundary

**Device tokens**:
CSS custom properties describing *the machine*, not taste — safe-area insets,
reduced-motion durations, the tablet breakpoint. Owned by the Shell, inherited
by every App.
_Avoid_: global tokens, base tokens, theme

**App palette**:
An App's own colours, type scale, radii and shadows, scoped to that App's
folder. Two Apps are expected to look nothing alike.
_Avoid_: theme, skin, design system

## The Apps

**Devices**:
Locates your things on a live map. Was called *Find* when it was the only app;
that name now belongs to the Shell.
_Avoid_: Find, locator, tracker

**Lifecycle**:
Traces every read, write and derivation on a JavaScript object over one run.
_Avoid_: visualizer, tracer, debugger
