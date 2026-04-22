# The Grind

A 12-month learning plan tracker designed around Educative Premium Plus. Editorial journal meets command center — every course, pattern, cloud lab, LLD problem, and mock interview in one place, with an in-browser compiler for Python, TypeScript, and C#.

![The Grind — editorial dashboard](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white) ![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## What it tracks

- **9 courses** across 4 phases, with per-module checkboxes and inline notes
- **28 coding patterns** (Grokking the Coding Interview in Python) with per-pattern notes
- **14 LLD problems** and **15 system design case studies** with notes per item
- **24+ AWS cloud labs** grouped by category
- **~45 mock interviews** with per-month targets
- **Calendar + session log** with 14-day activity sparkline
- **In-browser compiler** — Python (Pyodide), TypeScript (tsc), C# (Monaco editor + .NET Fiddle handoff)
- **Light & dark themes** with custom Monaco themes that match the dashboard aesthetic

All progress persists to `localStorage`.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

To build for production:

```bash
npm run build
npm run preview  # optional: test the production build locally
```

---

## Deploy to Vercel via GitHub

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If you don't have a repo yet, create one at [github.com/new](https://github.com/new) first (no README, no .gitignore — this project has its own).

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo you just pushed
3. Vercel auto-detects Vite — no config changes needed (the included `vercel.json` handles it)
4. Click **Deploy**

First deploy takes ~30 seconds. Every push to `main` auto-deploys after that.

### 3. Custom domain (optional)

In the Vercel project settings → Domains, add your domain and follow the DNS instructions. Free on the hobby tier.

---

## Project structure

```
grind-dashboard/
├── public/
│   └── favicon.svg              # "G." typographic mark
├── src/
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Minimal reset
│   └── LearningDashboard.jsx    # Single-file app (~3000 lines)
├── index.html                   # Vite HTML entry
├── package.json
├── vite.config.js
├── vercel.json                  # Vercel build + SPA rewrite config
└── .gitignore
```

Intentionally single-file for the dashboard. You can absolutely split it later — the component boundaries are clean — but keeping it together makes the architecture legible and easier to iterate on.

---

## Architecture

### State & storage

All progress lives in a single `state` object at the root component, persisted to `localStorage` under the key `edu_plan_v2` with a 400ms debounce. Storage shape:

```js
{
  startDate: '2026-04-21',
  theme: 'light' | 'dark',
  courseProgress: { [courseId]: 0-100 },
  courseNotes: { [courseId]: string },
  moduleChecks: { [moduleId]: boolean },
  patterns: { [patternNum]: boolean },
  patternNotes: { [patternNum]: string },
  labs: { [labId]: boolean },
  labNotes: { [labId]: string },
  lldProblems, lldNotes,
  sdCases, sdNotes,
  projects,
  mockInterviews: { '<month>-<type>': count },
  sessions: [{ id, date, type, duration, courseId, notes }],
  customNotes: { [dateStr]: string },
  weeklyGoalHours: number,
}
```

### Theme system

Light and dark themes are defined as a single `THEMES` object with tokens for `bg`, `bgElev`, `ink`, `inkDim`, `rule`, `ruleDim`, `muted`, `invert`, `overlay`, `grainOpacity`, `grainBlend`, `scrollThumb`. A `ThemeContext` exposes the active theme to every component via `useTheme()`. Theme swap is instant — no flash, all styles re-render from context.

Monaco editor ships with two custom themes (`grind-light`, `grind-dark`) that match the dashboard palette: phase-3 terracotta for strings, phase-4 purple for keywords, phase-1 gold for numbers, phase-2 sage for types.

### Views

Nine views, switched by a single `view` state string:

- **Overview** — editorial hero with asymmetric layout, circular SVG progress ring, interactive ledger of all components, year timeline, 14-day activity sparkline
- **Courses** — expandable cards with per-module checkboxes, progress slider, inline notes
- **Patterns** — 28 coding patterns, toggleable with per-pattern expandable notes
- **Design** — tabbed LLD and System Design with notes per item
- **Labs** — cloud labs grouped by AWS category with per-lab notes + external links
- **Mocks** — grid tracker with increment/decrement per type per month
- **Calendar** — monthly grid, session logging modal, per-day reflection notes
- **Compiler** — Monaco editor with Python (Pyodide runs it), TypeScript (tsc transpiles, sandboxed `new Function` runs it), C# (copy-and-open .NET Fiddle handoff)
- **Settings** — start date, weekly goal, export JSON, reset all

### Compiler internals

Monaco Editor is loaded once from cdnjs as a singleton via a shared `ensureMonaco()` promise. All three language tabs share the same editor instance, switching language and theme dynamically via `monaco.editor.createModel` / `setTheme`.

- **Python** — Pyodide 0.26 from jsdelivr CDN (~10MB, cached after first load). CPython 3.12 in WebAssembly. stdout/stderr captured via `pyodide.setStdout({ batched })`.
- **TypeScript** — `typescript@5.4.5` from jsdelivr (~10MB, cached). `ts.transpileModule` with ES2020 target; output runs in a `new Function()` scope with `console.log` monkey-patched for capture. Full IntelliSense is live in the editor thanks to Monaco's built-in TS language service.
- **C#** — Monaco with C# syntax highlighting; executing C# in-browser requires the ~35MB .NET WASM runtime which doesn't fit the artifact/lightweight-bundle model. Instead there's a "Copy & Run on .NET Fiddle" button that copies code to clipboard and opens Fiddle in a new tab. Two-click round trip to execution, and you still get proper syntax editing on this side.

---

## Extending

**Add a course**: append to the `COURSES` array near the top of `LearningDashboard.jsx`. Each course needs `id`, `name`, `url`, `hours`, `lessons`, `phase` (1-4), `priority` (1-3), `track`, `weeklyHours`, `note`, and a `modules` array. Everything else wires up automatically.

**Add a cloud lab**: append to `CLOUD_LABS`. Required: `id`, `name`, `category`, `phase`, `url`.

**Change phase colors**: edit the `PHASES` array — `color` is used everywhere for that phase (ledger, ring, Monaco theme accents, course cards, month timeline).

**Swap storage backends**: the `loadState` / `saveState` functions at the top are the only place storage is touched. Point them at IndexedDB, a remote API, or any sync service — the rest of the app doesn't care.

---

## Tech

- **React 18** + **Vite 5** — fast HMR, zero config, instant builds
- **lucide-react** — icons
- **Monaco Editor** — VS Code's editor, loaded from cdnjs on demand
- **Pyodide** + **TypeScript compiler** — loaded from CDN on first use, then cached by browser
- **Fraunces** (display serif) + **JetBrains Mono** (code) + **Inter** (UI) — from Google Fonts

No backend. No auth. No tracking. Everything lives in your browser's `localStorage`.

---

## License

MIT. Use it, fork it, gut it, make it yours.
