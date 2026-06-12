# The 12-Month Learning Plan

A complete, opinionated playbook for the Educative Premium Plus curriculum. The companion dashboard lives in `src/`; **the dashboard derives all of its "do this now" recommendations from the rules below**, so when you change cadence or scope here, also update `src/data/plan.js`.

This document is split into three layers, each more concrete than the last:

1. **The shape of the year** — phases, why they exist, what closes them out
2. **The weekly rhythm** — exactly how to slot courses, patterns, labs, LLD, and mocks into a real week
3. **Pacing rules and recovery** — what to do when you're behind, ahead, or stuck

---

## 1. The shape of the year

Four 3-month phases, each layered on the previous. **You do not stop the previous tracks when you start a new phase** — coding patterns, mocks, and labs are ongoing background work; the foreground course set rotates.

| Phase | Months | Theme | What's added | What continues |
|-------|--------|-------|--------------|----------------|
| **1 · Core Foundations** | 1–3 | Coding fluency + a real language | C#, System Design Fundamentals, Patterns 1–9 | (start here) |
| **2 · System Design & Frontend** | 4–6 | Big systems + frontend stack | Modern System Design, TypeScript + React, Patterns 10–18, LLD intro (M6) | C#, coding patterns, labs, mocks |
| **3 · Data Skills** | 7–9 | SQL & data engineering | SQL Patterns, Data Engineering, Patterns 19–24 | System design (cases), LLD, coding, labs |
| **4 · Interview Mastery** | 10–12 | Polish + mocks | Patterns 25–28, advanced SD, mock marathon | Everything from previous phases on review/maintenance |

**Why this ordering**: a language (Phase 1) is the substrate everything else runs on. System design (Phase 2) is the highest-variance interview topic and benefits from the longest exposure. SQL and data (Phase 3) are concentrated because the content is dense. Phase 4 is deliberately light on new content — the job is to consolidate and rehearse.

### Phase exit criteria

A phase isn't "done" because the calendar says so. Each phase has an exit criterion the dashboard treats as a non-negotiable before phase N+1 should fully start.

- **Phase 1 → 2**: Patterns 1–9 ✓, C# fundamentals course ≥ 75%, System Design Fundamentals 100%, ≥ 4 mocks total.
- **Phase 2 → 3**: Patterns 10–18 ✓, TypeScript course ≥ 75%, ≥ 4 system-design case studies, LLD started.
- **Phase 3 → 4**: Patterns 19–24 ✓, SQL course 100%, Data Engineering course ≥ 75%, ≥ 12 mocks cumulative.
- **Phase 4 done**: All 28 patterns ✓, all 9 courses ≥ 90%, ≥ 25 mocks cumulative, ≥ 10 LLD + ≥ 10 SD cases done.

If you hit a month boundary without the exit criteria from the previous phase, the dashboard's "This week · do these" panel will keep recommending catch-up work from earlier months under the **Catch-up** badge.

---

## 2. The weekly rhythm

The plan is 10–12 hours/week. **Treat 11h as the baseline.** Below 9h/week for two consecutive weeks is a structural problem; above 14h/week sustained is unsustainable.

The dashboard's "Weekly rhythm" card on the Overview shows the phase-appropriate version of this table. The general structure:

### A standard week (any phase)

| Day | Block 1 | Block 2 | Approx. |
|-----|---------|---------|---------|
| **Mon** | Foreground course of the phase (1.5h) | Secondary course (1h) | 2.5h |
| **Tue** | Coding patterns (1.5h) | Python practice (0.5h) | 2h |
| **Wed** | Foreground course (1.5h) | Secondary course (1h) | 2.5h |
| **Thu** | Coding patterns (1.5h) | Phase-specific block (0.5h) | 2h |
| **Fri** | Cloud lab (1h) | Project work or LLD (1h) | 2h |
| **Sat** | Mock interview (1h) | Notes review (0.5h) | 1.5h |
| **Sun** | Buffer / off day | — | 0–1h |
| **Total** | | | ~11h |

### Phase-specific substitutions

- **Phase 1**: foreground = C#; secondary = SD Fundamentals. Phase-specific block = OOP exercises.
- **Phase 2**: foreground = Modern SD; secondary = TypeScript + React. Phase-specific = LLD reading (from M6).
- **Phase 3**: foreground = SQL Patterns; secondary = Data Engineering. Phase-specific = LLD problem.
- **Phase 4**: foreground = LLD problems; secondary = advanced SD case studies. Phase-specific = consolidation.

### Why mocks every Saturday

Mocks compound. One mock teaches more than three solo problems. The Saturday slot is fixed because (a) you've accumulated material to test by then, (b) you're not too tired from the week, and (c) it forces a hard deadline on the rest of the week's prep.

Mock targets per month live in `MOCK_INTERVIEW_TARGETS` in `src/data/plan.js`. If you're below target by mid-month, **steal time from the secondary course block, not from coding patterns**.

### Why labs land on Friday

Labs are hands-on and need an uninterrupted hour. Friday afternoons (or evenings) are typically the lowest-cognitive-load slot of the week — perfect for click-through hands-on work that doesn't demand fresh problem-solving.

---

## 3. Pacing rules

### Rule 1 — Patterns are sacred

Coding patterns drop **every week**, never skipped. Two 1.5h sessions/week = 3h/week = ~12h/month = enough to keep ~3 patterns moving per month (the schedule). If everything else slips, patterns continue.

### Rule 2 — One foreground course at a time

Despite the dashboard showing every course you've started, you should treat exactly **one** course as foreground (3–4h/week) and one as secondary (2–3h/week) per phase. Trying to run 4+ courses in parallel guarantees stalling on all of them.

The dashboard's "Active courses this month" chip row tells you which courses are scheduled for the current month. **If more than two are showing, you've drifted** — pick the two you'll touch this week and ignore the rest.

### Rule 3 — Behind on patterns? Cut SD case studies first

The dashboard's catch-up logic surfaces missed patterns automatically. The right way to absorb the deficit:

1. First: drop secondary course block by 1h/week
2. Then: drop one of the two weekly SD case studies
3. Last resort: skip a mock (only ever skip one in a row)

### Rule 4 — Behind on mocks? Don't double up

Mocks need recovery time. If you've missed mocks, do **one extra weekday mock** (e.g. Wednesday evening), not two on Saturday. Two mocks in a day produces fatigue, not skill.

### Rule 5 — Ahead of schedule? Don't pull forward; deepen

If you finish a month's content with a week to spare, **do not start next month's patterns early**. Instead:

- Re-do one previous mock with the recording, notes, and full prep cycle
- Write up a system-design case study you skimmed earlier
- Read one chapter of the next phase's foreground course as a warm-up only

The goal isn't velocity. The goal is depth at every layer.

### Rule 6 — A note on the notes

Notes are the single highest-leverage habit in this plan. The dashboard has a slide-out file-editor note panel attached to every course, pattern, lab, LLD problem, and SD case. **Use it on every meaningful session.** Patterns especially: write the intuition, the template, and the gotcha in your own words. The dashboard's Notes page searches across everything.

A good note is:
- The pattern's pseudocode template
- One example where you got it wrong, and why
- One link to a problem you want to redo

A bad note is a copy-paste of the lesson summary.

---

## 4. How the dashboard maps to this doc

| Dashboard feature | Source of truth in this repo |
|-------------------|------------------------------|
| "This week · do these" panel | `src/lib/objectives.js` — `computeThisWeek` |
| Per-phase weekly rhythm card | `DAILY_RHYTHM` in `src/data/plan.js` |
| Monthly pattern targets | `month` field on each entry in `CODING_PATTERNS` |
| Active courses per month | `activeMonths` field on each course |
| Mock targets per month | `MOCK_INTERVIEW_TARGETS` |
| Note storage | SQLite (`notes` table) via `src/storage/db.js` |
| Progress persistence | SQLite (`kv` table) backed by IndexedDB, exportable as `.sqlite` |

When you change a rule in this document, change the data file in the same commit. The dashboard is a **rendering** of the plan; the plan is the source.

---

## 5. Common failure modes

- **"I'll catch up on patterns later"** — you won't. The deficit compounds. Two missed weeks of patterns becomes a six-week debt by month 4.
- **Starting Phase 2 with C# at 30%** — finish C# (or at least get to 80%) before adding TypeScript. Two languages in parallel is the most common stall.
- **Hoarding labs for "when I have time"** — labs are short and cheap. Do them on Friday or they never happen.
- **Doing one mock then taking three weeks off mocks because it went badly** — mocks going badly is the entire point of doing them. Schedule the next one within 5 days.
- **Reading SD case studies instead of writing them** — passive reading does almost nothing for SD interviews. The dashboard's per-case note panel is where the actual learning lives.

---

## 6. End-of-year checklist

By month 12 the deliverables are:

- [ ] All 28 coding patterns implemented + noted in your own words
- [ ] All 9 courses ≥ 90% complete
- [ ] All 4 phases passed their exit criteria
- [ ] ≥ 25 mocks logged, with notes on each
- [ ] ≥ 10 LLD problems written up
- [ ] ≥ 10 system-design case studies written up
- [ ] One end-to-end project completed (RPG / Cash Flow / Airflow / F1 — pick one)
- [ ] An exported `grind-{date}.sqlite` snapshot stored somewhere off-device

If you hit all of those, you are interview-ready at the senior-engineer bar for most companies in the plan's target band. Good luck.
