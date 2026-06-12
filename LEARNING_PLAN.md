# The 12-Month Learning Plan (v2)

A complete, opinionated playbook for the Educative Premium Plus year. The companion dashboard lives in `src/`; **the dashboard renders this plan from `src/data/plan.js`** — when you change scope or cadence here, change the data file in the same commit.

The goal of the year, in order:

1. **Become a better engineer** — depth in a language, system design instincts, hands-on cloud, shipped projects
2. **Land higher-paying roles** — interview mastery: patterns, system design, LLD, SQL, behavioral, mocks
3. **Be forward-looking** — the AI track (LLM fundamentals → RAG → GenAI & agentic system design) plus public artifacts that prove it

This plan deliberately uses the **breadth** of the Educative Plus subscription — many courses, labs, and problem sets — but anchors that breadth to four phase-sized themes so it never becomes channel-surfing.

---

## 1. The shape of the year

Four 3-month phases. Each phase page in the dashboard shows everything the phase contains — courses, patterns, design write-ups, labs, the phase project, review items, and mock targets — as flat checklists. **The phase page answers three questions: what do I do, what's done, what's next.**

| Phase | Months | Theme | Foreground | AI track |
|-------|--------|-------|-----------|----------|
| **1 · Core Foundations** | 1–3 | Coding fluency + a real language | C#, SD Fundamentals, Patterns 1–9 | — |
| **2 · Systems, Frontend & AI Foundations** | 4–6 | Big systems + frontend + how LLMs work | Modern SD, TS + React, Patterns 10–18 | LLM Essentials |
| **3 · Data & Applied AI** | 7–9 | SQL, pipelines, retrieval | SQL Patterns, Data Engineering, Patterns 19–24 | RAG with LangChain |
| **4 · Interview Mastery & Forward Look** | 10–12 | Rehearsal + GenAI design | LLD, advanced SD, mock marathon, Patterns 25–28 | GenAI SD, Agentic SD, AI crash course |

**Why this ordering**: a language (Phase 1) is the substrate everything else runs on. System design (Phase 2) is the highest-variance interview topic and gets the longest exposure; the AI track starts there with fundamentals so that Phase 3 can *build* with LLMs (RAG over real pipelines) and Phase 4 can *design* with them (GenAI/agentic system design — the forward-looking interview category). Phase 4 adds almost no other new material: the job is consolidation and rehearsal.

### Ongoing tracks (never rotate out)

- **Coding patterns** — the 28 chapters of Grokking the Coding Interview Patterns (Python), distributed 9/9/6/4 across phases. Each phase page links straight to the chapters. Two 1.5h sessions/week, every week.
- **Python practice exercises** — all 63 named problems from Educative's Python practice set, assigned to the phase whose patterns they reinforce (sliding window in Phase 1, backtracking/DP in Phase 2, graphs in Phase 3, bitwise/stacks in Phase 4). 1–2/week keeps pace.

### One shipped project per phase — non-negotiable

Courses get you skills; **public artifacts get you hired**. Each phase has exactly one project, tracked as a first-class item with the same weight as a course:

1. **Phase 1** — C# project (RPG Combat Engine or Cash Flow Manager) shipped to GitHub: public repo, real README, tests.
2. **Phase 2** — A deployed TypeScript/React app that calls an LLM API. Exercises the frontend stack and the LLM fundamentals together.
3. **Phase 3** — A data pipeline + RAG over your own dataset. The data-engineering and RAG courses converge here.
4. **Phase 4** — An agentic capstone (an agent using tools, e.g. against the Phase 3 data) + final portfolio polish.

### Phase exit criteria

A phase isn't done because the calendar says so. The dashboard computes these live from your checkboxes and shows them at the top of each phase page:

- **Phase 1 → 2**: Patterns 1–9 ✓ · C# ≥ 75% · SD Fundamentals 100% · project shipped · mock targets met (4 SD + 4 coding)
- **Phase 2 → 3**: Patterns 10–18 ✓ · TypeScript ≥ 75% · LLM Essentials ✓ · ≥ 4 SD cases written up · LLM app deployed · mock targets met
- **Phase 3 → 4**: Patterns 19–24 ✓ · SQL 100% · RAG course ✓ · behavioral course + first STAR stories ✓ · pipeline+RAG project deployed · mock targets met
- **Phase 4 done**: All 28 patterns ✓ · GenAI SD complete · ≥ 10 LLD + ≥ 10 SD write-ups (cumulative) · capstone shipped · career items done · mock targets met

---

## 2. The weekly rhythm

The plan is 11–12 hours/week. Below 9h/week for two consecutive weeks is a structural problem; above 14h sustained is unsustainable. The dashboard's Overview shows the phase-appropriate rhythm.

| Day | Block 1 | Block 2 | ~ |
|-----|---------|---------|---|
| **Mon** | Foreground course (1.5h) | Secondary course (1h) | 2.5h |
| **Tue** | Coding patterns (1.5h) | Python practice (0.5h) | 2h |
| **Wed** | AI-track or secondary (1–1.5h) | SD case study (1h) | 2.5h |
| **Thu** | Coding patterns (1.5h) | Phase-specific block (0.5h) | 2h |
| **Fri** | Cloud lab (1h) | Phase project work (1h) | 2h |
| **Sat** | Mock interview (1h) | Notes review (0.5h) | 1.5h |
| **Sun** | Buffer / off day | — | 0–1h |

**Why mocks every Saturday**: one mock teaches more than three solo problems, and the fixed slot forces a hard deadline on the week's prep. Mock targets are per-phase (`MOCK_TARGETS` in `plan.js`); Phase 4 adds **GenAI mocks** — the four built into Grokking the Generative AI System Design.

**Why labs land on Friday**: hands-on click-through work fits the lowest-cognitive-load slot. The lab list was deliberately curated from 37 to 22 — duplicates cut — so every lab earns its hour. Phase 4 has no labs by design.

**Why project work is also Friday**: the project is how the week's learning compounds into something you can point at. If the week gets compressed, the project block moves to Sunday's buffer — it doesn't get skipped.

---

## 3. Pacing rules

### Rule 1 — Patterns are sacred
Patterns drop every week, never skipped. If everything else slips, patterns continue.

### Rule 2 — One foreground course at a time
Treat exactly one course as foreground (3–4h/wk) and one as secondary (2–3h/wk). The AI-track course is a third, smaller lane (1–2h/wk) — it never displaces the foreground.

### Rule 3 — Behind? Cut in this order
1. Drop the secondary course block by 1h/week
2. Drop one SD case study
3. Skip a lab Friday
4. Last resort: skip one mock (never two in a row)

The phase project and patterns are never the thing you cut.

### Rule 4 — Behind on mocks? Don't double up
Add one extra weekday mock, not two on Saturday. Two mocks in a day produces fatigue, not skill.

### Rule 5 — Ahead? Deepen, don't pull forward
Redo a previous mock with full prep, rewrite a skimmed SD case, or redo old patterns cold. The review items on each phase page exist precisely because retention is engineered, not assumed.

### Rule 6 — Notes are the highest-leverage habit
Every course, pattern, lab, design problem, and project has a note button. A good pattern note = the pseudocode template, one example you got wrong and why, one problem to redo. A bad note = a copy-paste of the lesson summary. The Notes page searches everything.

---

## 4. The career workstream

Interview skill without market contact is theory. Built into the plan:

- **Phase 1**: GitHub profile pass (README, pinned repos)
- **Phase 3**: Grokking the Behavioral Interview (free) + first 4 STAR stories
- **Phase 4**: STAR bank complete (8 stories) · resume + LinkedIn rewritten around the year's projects · **5 real calibration applications** before the big swings

---

## 5. How the dashboard maps to this doc

| Dashboard feature | Source of truth |
|-------------------|-----------------|
| Phase pages (sections + checklists) | `computePhaseItems` in `src/lib/objectives.js` |
| Exit criteria banners | `EXIT_CRITERIA` in `src/data/plan.js` |
| "Next up" panel on Overview | `computeNextUp` — first unchecked item per section |
| Course % | Derived from module checks (patterns course derives from the 28 patterns) |
| Mock targets | `MOCK_TARGETS` (per phase, per type) |
| Notes | SQLite `notes` table via `src/storage/db.js` |
| Progress persistence | SQLite (`kv` table) in IndexedDB, exportable as `.sqlite` from Settings |

---

## 6. End-of-year checklist

- [ ] All 28 coding patterns implemented + noted in your own words
- [ ] All courses on all four phase pages ≥ 90%
- [ ] All 4 phases passed their exit criteria
- [ ] Mock targets met every phase (incl. 4 GenAI mocks)
- [ ] ≥ 10 LLD + ≥ 10 system-design write-ups
- [ ] **4 shipped, public projects** — C# app, LLM-powered web app, pipeline + RAG, agentic capstone
- [ ] STAR bank, refreshed resume, 5 calibration applications submitted
- [ ] An exported `grind-{date}.sqlite` snapshot stored off-device

Hit all of those and you're interview-ready at the senior bar — with a portfolio that says "I build with AI," not just "I watched courses about it."
