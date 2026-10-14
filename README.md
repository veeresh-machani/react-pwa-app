# Handling PWA Updates and Chunk Failures in React 19

Companion repo for a blog post on Progressive Web Apps with React 19, TypeScript, and `vite-plugin-pwa`. It shows how this project handles two common deployment issues without forcing reloads on users:

1. **Stale cache on refresh** — Default `prompt` registration leaves the new service worker waiting, so refresh can still serve the old cache.
2. **Missing chunk 404s** — After a deploy, an open tab can request a hashed lazy chunk that no longer exists and white-screen (`ChunkErrorBoundary`).

The demo UI is a contact form on purpose: you can be mid-typing when an update lands, see the snackbar, and choose to update or snooze.

---

## Key files

| File | Role |
| :--- | :--- |
| `vite.config.ts` | PWA + Workbox config (`skipWaiting`, `clientsClaim`, caching) |
| `src/context/VersionContext.tsx` | Registers the SW, polls for updates, listens for `controllerchange` |
| `src/components/LatestVersion.tsx` | Update snackbar (Update / Remind me Later) |
| `src/components/ChunkErrorBoundary.tsx` | Catches chunk load failures and shows a reload UI |
| `src/main.tsx` | Wires boundary + version provider around the app |
| `src/App.tsx` | Contact form used to demo mid-session updates |

---

## How this repo handles updates

1. **Activate in the background** — `vite.config.ts` sets `skipWaiting: true` and `clientsClaim: true` so the new worker takes over as soon as it installs (refresh then loads the new build).
2. **Detect updates while the tab stays open** — `VersionContext.tsx` uses `useRegisterSW` from `virtual:pwa-register/react` and polls `reg.update()` every 10 seconds.
3. **Prompt without force-reload** — On `controllerchange`, if the page already had a controller (`hadController`), `LatestVersion.tsx` offers **Update** or **Remind me Later** (1-hour snooze).

Workbox also uses `cleanupOutdatedCaches`, NetworkFirst for documents (and `/api/`), and hashed-asset caching via `dontCacheBustURLsMatching`.

---

## Setup

Requires Node.js 18+. Service workers only work on `localhost` or HTTPS.

```bash
npm install
```

Use `npm run dev` only for UI work. To test the update flow below, serve a **production** build (`preview` or MAMP)—that exercises the real service worker.

---

## Testing the update flow

Use **one** of the two serve options. Keep the same browser tab open across the whole flow (do not close it between builds).

### 1. Serve build A

**Option A — Vite preview (recommended)**

```bash
npm run build
npm run preview
```

Open the URL Vite prints (usually `http://localhost:4173`). Leave this terminal running.

**Option B — MAMP (macOS)**

1. Start MAMP (Apache on, default `http://localhost:8888`).
2. Deploy:

```bash
npm run deploy:mamp
```

3. Open `http://localhost:8888` (or your MAMP host/port).

### 2. Confirm the first load is controlled

1. Open the app in a normal browser window (not a private/incognito window if you want the SW to persist across steps).
2. Hard-refresh once if needed, then reload normally so the service worker can install and control the page.
3. Optional check in Chrome: **DevTools → Application → Service Workers** — you should see an active worker for this origin.
4. On this first visit you should **not** see the update snackbar (`hadController` is false until a later deploy).

### 3. Start mid-session work

1. Fill part of the contact form (name, email, message).
2. Leave the tab open and do not reload yet.

### 4. Deploy build B (new version)

In a **second** terminal, change a visible string so you can tell versions apart—for example in `src/App.tsx` change `v2.1` to `v2.2`.

Then ship the new build **without closing the first tab**:

**If you used preview:** rebuild only; keep `npm run preview` running (it serves the updated `dist`):

```bash
npm run build
```

**If you used MAMP:** deploy again:

```bash
npm run deploy:mamp
```

### 5. What you should see

Within about **10 seconds** (the poll interval), the open tab should show **New version is available**:

| Action | Expected result |
| :--- | :--- |
| Do nothing for a moment | Form data stays; snackbar stays visible |
| **Remind me Later** | Snackbar hides; form data stays; prompt can return after ~1 hour |
| **Update** | Page reloads; you see the new version tag (`v2.2`); form resets (full reload) |
| Skip the snackbar and press refresh (`F5` / `Cmd+R`) | New version loads anyway, because the new service worker already activated and claimed the page |

### Tips if the snackbar never appears

- Wait at least 10–15 seconds after the second build finishes.
- Confirm build B actually changed files under `dist/` (or MAMP `htdocs`).
- Confirm the tab is still on the same origin/port you served.
- In DevTools → Application → Service Workers, click **Update** once, or check that a new worker installed.
- Avoid testing only with `npm run dev` if you want production-like SW behavior; use `preview` or MAMP.
