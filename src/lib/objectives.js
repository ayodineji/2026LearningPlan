import {
  COURSES, CODING_PATTERNS, CLOUD_LABS, LLD_PROBLEMS,
  SYSTEM_DESIGN_CASES, PROJECTS, REVIEW_ITEMS, PYTHON_EXERCISES,
  MOCK_TARGETS, EXIT_CRITERIA, PHASES,
} from '../data/plan.js';

// ------------------------------------------------------------
// Course progress: derived from module checks when modules
// exist; the coding-patterns course derives from the 28 pattern
// checkboxes; otherwise fall back to the manual percent.
// ------------------------------------------------------------

export function courseProgressPct(course, state) {
  if (course.id === 'coding_patterns') {
    const done = CODING_PATTERNS.filter(p => state.patterns[p.n]).length;
    return Math.round((done / CODING_PATTERNS.length) * 100);
  }
  if (course.id === 'pyex') {
    const done = PYTHON_EXERCISES.filter(e => state.pyexChecks[e.id]).length;
    return Math.round((done / PYTHON_EXERCISES.length) * 100);
  }
  if (course.modules.length > 0) {
    const done = course.modules.filter(m => state.moduleChecks[m.id]).length;
    return Math.round((done / course.modules.length) * 100);
  }
  return state.courseProgress[course.id] || 0;
}

// ------------------------------------------------------------
// Everything that belongs to a phase, grouped into sections.
// PhaseView renders this directly; Overview pulls "next up"
// from it. Every item: { id, kind, label, done, sub?, url? }.
// ------------------------------------------------------------

export function computePhaseItems(phaseN, state) {
  const courses = COURSES.filter(c => c.phase === phaseN && !c.ongoing);
  const patterns = CODING_PATTERNS.filter(p => p.phase === phaseN);
  const labs = CLOUD_LABS.filter(l => l.phase === phaseN);
  const sdCases = SYSTEM_DESIGN_CASES.filter(s => s.phase === phaseN);
  const lldProblems = LLD_PROBLEMS.filter(l => l.phase === phaseN);
  const project = PROJECTS.find(p => p.phase === phaseN) || null;
  const reviews = REVIEW_ITEMS.filter(r => r.phase === phaseN);
  const mockTargets = MOCK_TARGETS[phaseN] || {};

  const sections = [];

  sections.push({
    key: 'courses', title: 'Courses',
    items: courses.map(c => ({
      id: c.id, kind: 'course', label: c.name, url: c.url,
      done: courseProgressPct(c, state) >= 100,
      pct: courseProgressPct(c, state),
      course: c,
    })),
  });

  sections.push({
    key: 'patterns', title: 'Coding patterns',
    sourceNote: 'Chapters of Grokking the Coding Interview Patterns (Python) — each link opens the chapter',
    items: patterns.map(p => ({
      id: p.n, kind: 'pattern', label: `#${String(p.n).padStart(2, '0')} — ${p.name}`,
      sub: 'Course chapter', url: p.url,
      done: !!state.patterns[p.n],
    })),
  });

  const pyex = PYTHON_EXERCISES.filter(e => e.phase === phaseN);
  if (pyex.length) {
    sections.push({
      key: 'pyex', title: 'Python practice',
      sourceNote: 'Problems from Educative\'s Python practice set, matched to this phase\'s patterns',
      items: pyex.map(e => ({
        id: e.id, kind: 'pyex', label: e.name, sub: e.topic,
        url: 'https://www.educative.io/coding-practice/python-exercises',
        done: !!state.pyexChecks[e.id],
      })),
    });
  }

  const sdCourse = COURSES.find(c => c.id === 'sd_modern');
  const lldCourse = COURSES.find(c => c.id === 'lld');
  if (sdCases.length || lldProblems.length) {
    sections.push({
      key: 'design', title: 'Design write-ups',
      sourceNote: 'Case studies from Grokking Modern System Design · problems from Grokking the LLD Interview',
      items: [
        ...sdCases.map(s => ({
          id: s.id, kind: 'sd-case', label: s.name,
          sub: 'Case study · Grokking Modern System Design', url: sdCourse?.url,
          done: !!state.sdCases[s.id],
        })),
        ...lldProblems.map(l => ({
          id: l.id, kind: 'lld', label: l.name,
          sub: 'Design problem · Grokking the LLD Interview', url: lldCourse?.url,
          done: !!state.lldProblems[l.id],
        })),
      ],
    });
  }

  if (labs.length) {
    sections.push({
      key: 'labs', title: 'Cloud labs',
      items: labs.map(l => ({
        id: l.id, kind: 'lab', label: l.name, sub: l.category, url: l.url,
        done: !!state.labs[l.id],
      })),
    });
  }

  if (project) {
    sections.push({
      key: 'project', title: 'Phase project',
      items: [{
        id: project.id, kind: 'project', label: project.name, sub: project.desc,
        done: !!state.projects[project.id],
      }],
    });
  }

  if (reviews.length) {
    sections.push({
      key: 'review', title: 'Review & career',
      items: reviews.map(r => ({
        id: r.id, kind: 'review', label: r.name, sub: r.desc,
        done: !!state.reviews[r.id],
      })),
    });
  }

  // Mocks are counters, not checkboxes — kept separate from sections.
  const mocks = Object.entries(mockTargets).map(([type, target]) => ({
    type, target, have: state.mocks[`${phaseN}-${type}`] || 0,
  }));

  return { phaseN, phaseInfo: PHASES[phaseN - 1], sections, mocks };
}

// Overall completion fraction for a phase (checkbox items + mock counts).
export function phaseCompletion(phaseN, state) {
  const { sections, mocks } = computePhaseItems(phaseN, state);
  let total = 0, done = 0;
  for (const s of sections) {
    for (const it of s.items) {
      if (it.kind === 'course') {
        // weight courses by their module count so a 10-module course
        // isn't worth the same as one checkbox
        const n = Math.max(1, it.course.modules.length);
        total += n;
        done += Math.round((it.pct / 100) * n);
      } else {
        total += 1;
        done += it.done ? 1 : 0;
      }
    }
  }
  for (const m of mocks) {
    total += m.target;
    done += Math.min(m.have, m.target);
  }
  return total === 0 ? 0 : done / total;
}

// ------------------------------------------------------------
// Exit criteria — evaluate the declarative specs in plan.js.
// Returns [{ id, label, done, detail }].
// ------------------------------------------------------------

export function computeExitCriteria(phaseN, state) {
  const specs = EXIT_CRITERIA[phaseN] || [];
  return specs.map(spec => {
    switch (spec.type) {
      case 'patterns': {
        const pats = CODING_PATTERNS.filter(p =>
          spec.label.startsWith('All') ? true : p.phase === phaseN);
        const done = pats.filter(p => state.patterns[p.n]).length;
        return { ...spec, done: done >= pats.length, detail: `${done}/${pats.length}` };
      }
      case 'course': {
        const c = COURSES.find(x => x.id === spec.course);
        const pct = c ? courseProgressPct(c, state) : 0;
        return { ...spec, done: pct >= spec.min, detail: `${pct}%` };
      }
      case 'project': {
        return { ...spec, done: !!state.projects[spec.project], detail: state.projects[spec.project] ? 'shipped' : 'not yet' };
      }
      case 'mocks': {
        const targets = MOCK_TARGETS[phaseN] || {};
        const entries = Object.entries(targets);
        const met = entries.filter(([t, want]) => (state.mocks[`${phaseN}-${t}`] || 0) >= want).length;
        const have = entries.reduce((s, [t]) => s + (state.mocks[`${phaseN}-${t}`] || 0), 0);
        const want = entries.reduce((s, [, w]) => s + w, 0);
        return { ...spec, done: met === entries.length, detail: `${have}/${want}` };
      }
      case 'design-sd': {
        // cumulative across all phases up to this one
        const pool = SYSTEM_DESIGN_CASES.filter(s => s.phase <= phaseN);
        const done = pool.filter(s => state.sdCases[s.id]).length;
        return { ...spec, done: done >= spec.min, detail: `${done}/${spec.min}` };
      }
      case 'design-lld': {
        const pool = LLD_PROBLEMS.filter(l => l.phase <= phaseN);
        const done = pool.filter(l => state.lldProblems[l.id]).length;
        return { ...spec, done: done >= spec.min, detail: `${done}/${spec.min}` };
      }
      case 'review': {
        const items = REVIEW_ITEMS.filter(r => r.phase === phaseN);
        const done = items.filter(r => state.reviews[r.id]).length;
        return { ...spec, done: done >= items.length, detail: `${done}/${items.length}` };
      }
      default:
        return { ...spec, done: false, detail: '?' };
    }
  });
}

// ------------------------------------------------------------
// "Next up" — the first unchecked item per section of a phase,
// used by the Overview. Mocks owed appended as one entry.
// ------------------------------------------------------------

export function computeNextUp(phaseN, state, limitPerSection = 1) {
  const { sections, mocks, phaseInfo } = computePhaseItems(phaseN, state);
  const items = [];
  for (const s of sections) {
    const next = s.items.filter(it => !it.done).slice(0, limitPerSection);
    for (const it of next) {
      items.push({ ...it, section: s.title, sectionKey: s.key, color: phaseInfo.color });
    }
  }
  const owed = mocks.filter(m => m.have < m.target);
  if (owed.length) {
    items.push({
      id: `mocks-${phaseN}`, kind: 'mock',
      label: 'Mock interviews owed this phase',
      sub: owed.map(m => `${m.target - m.have} ${m.type.toUpperCase()}`).join(' · '),
      section: 'Mocks', sectionKey: 'mocks', color: phaseInfo.color, done: false,
    });
  }
  return items;
}
