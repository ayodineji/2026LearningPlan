import {
  COURSES, CODING_PATTERNS, CLOUD_LABS, LLD_PROBLEMS,
  SYSTEM_DESIGN_CASES, MOCK_INTERVIEW_TARGETS, PHASES,
  WEEKLY_CADENCE, DAILY_RHYTHM,
} from '../data/plan.js';

// Compute literal objectives for the current week based on state and the current month.
// Returns a structured object the OverviewView "Now" panel can render directly.
export function computeNowObjectives(state, stats) {
  const month = stats.currentMonth;
  const phase = stats.currentPhase;

  // 1) Active courses: those whose activeMonths include the current month, AND <100% complete.
  const activeCourses = COURSES
    .filter(c => c.activeMonths.includes(month))
    .map(c => {
      const progress = state.courseProgress[c.id] || 0;
      const modulesDone = c.modules.filter(m => state.moduleChecks[m.id]).length;
      const nextModule = c.modules.find(m => !state.moduleChecks[m.id]) || null;
      return { course: c, progress, modulesDone, nextModule };
    })
    .filter(x => x.progress < 100 || (x.course.modules.length > 0 && x.modulesDone < x.course.modules.length));

  // 2) Patterns for this month — explicit pattern numbers, then filter to those not done.
  const monthPatterns = CODING_PATTERNS.filter(p => p.month === month);
  const remainingMonthPatterns = monthPatterns.filter(p => !state.patterns[p.n]);
  // Carryover: any earlier phase pattern still undone (gentle catch-up reminder)
  const carryoverPatterns = CODING_PATTERNS
    .filter(p => p.month < month && !state.patterns[p.n])
    .slice(0, 3);

  // 3) Labs — the next 1-2 phase-appropriate labs not yet done.
  const remainingLabs = CLOUD_LABS
    .filter(l => l.phase === phase && !state.labs[l.id])
    .slice(0, 2);

  // 4) LLD — only kick in starting month 6. Next undone, phase-appropriate.
  const lldActive = month >= 6;
  const nextLLD = lldActive
    ? LLD_PROBLEMS.find(l => l.phase <= phase && !state.lldProblems[l.id]) || null
    : null;

  // 5) System Design cases — start month 4.
  const sdActive = month >= 4;
  const nextSD = sdActive
    ? SYSTEM_DESIGN_CASES.find(s => s.phase <= phase && !state.sdCases[s.id]) || null
    : null;

  // 6) Mocks owed this month
  const target = MOCK_INTERVIEW_TARGETS[month] || { sd: 0, coding: 0, lld: 0, sql: 0 };
  const owedMocks = Object.entries(target)
    .map(([type, want]) => {
      const have = state.mockInterviews[`${month}-${type}`] || 0;
      return { type, want, have, remaining: Math.max(0, want - have) };
    })
    .filter(m => m.remaining > 0);

  const cadence = WEEKLY_CADENCE[phase];
  const rhythm = DAILY_RHYTHM[phase];

  return {
    month, phase,
    phaseInfo: PHASES[phase - 1],
    activeCourses,
    monthPatterns,
    remainingMonthPatterns,
    carryoverPatterns,
    remainingLabs,
    nextLLD, lldActive,
    nextSD, sdActive,
    owedMocks,
    cadence, rhythm,
  };
}

// Return a flattened list of "do these THIS week" items — used by the compact next-up card.
export function computeThisWeek(objectives) {
  const items = [];
  const phase = objectives.phaseInfo;

  // Top active course's next module
  objectives.activeCourses.slice(0, 2).forEach(ac => {
    if (ac.nextModule) {
      items.push({
        kind: 'course',
        track: ac.course.track,
        color: phase.color,
        label: `${ac.course.name}: ${ac.nextModule.name}`,
        hint: `Next module · ${ac.course.weeklyHours}/wk`,
        id: ac.nextModule.id,
        view: 'courses',
      });
    } else if (ac.progress < 100) {
      items.push({
        kind: 'course',
        track: ac.course.track,
        color: phase.color,
        label: `${ac.course.name}`,
        hint: `Continue · ${ac.progress}% done`,
        id: ac.course.id,
        view: 'courses',
      });
    }
  });

  // Patterns: explicit numbers and names
  objectives.remainingMonthPatterns.forEach(p => {
    items.push({
      kind: 'pattern',
      track: 'Coding',
      color: phase.color,
      label: `Pattern #${p.n} — ${p.name}`,
      hint: 'Target this month',
      id: p.n,
      view: 'patterns',
    });
  });

  // Carryover patterns
  objectives.carryoverPatterns.forEach(p => {
    items.push({
      kind: 'pattern',
      track: 'Coding',
      color: '#a6614a',
      label: `Catch-up: Pattern #${p.n} — ${p.name}`,
      hint: 'Carryover from earlier month',
      id: p.n,
      view: 'patterns',
    });
  });

  // Labs
  objectives.remainingLabs.forEach(l => {
    items.push({
      kind: 'lab',
      track: l.category,
      color: phase.color,
      label: `Lab: ${l.name}`,
      hint: `${l.category} · Phase ${l.phase}`,
      id: l.id,
      view: 'labs',
    });
  });

  // SD case
  if (objectives.nextSD) {
    items.push({
      kind: 'sd',
      track: 'System Design',
      color: phase.color,
      label: `SD case: ${objectives.nextSD.name}`,
      hint: 'Next case study',
      id: objectives.nextSD.id,
      view: 'design',
    });
  }

  // LLD
  if (objectives.nextLLD) {
    items.push({
      kind: 'lld',
      track: 'LLD',
      color: phase.color,
      label: `LLD: ${objectives.nextLLD.name}`,
      hint: 'Next OOP problem',
      id: objectives.nextLLD.id,
      view: 'design',
    });
  }

  // Mocks
  if (objectives.owedMocks.length > 0) {
    const text = objectives.owedMocks.map(m => `${m.remaining} ${m.type.toUpperCase()}`).join(', ');
    items.push({
      kind: 'mock',
      track: 'Mocks',
      color: '#8b5a8c',
      label: `Mock interviews owed this month`,
      hint: text,
      id: 'mocks',
      view: 'mocks',
    });
  }

  return items;
}
