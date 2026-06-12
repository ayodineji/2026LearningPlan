export function formatDate(d) {
  if (typeof d === 'string') d = new Date(d + 'T00:00:00');
  return d.toISOString().slice(0, 10);
}
export function addDays(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
export function addMonths(d, months) { const r = new Date(d); r.setMonth(r.getMonth() + months); return r; }
export function getPhaseFromMonth(m) { if (m <= 3) return 1; if (m <= 6) return 2; if (m <= 9) return 3; return 4; }

export function computeStats(state, MOCK_INTERVIEW_TARGETS, COURSES) {
  const today = new Date();
  const start = new Date(state.startDate + 'T00:00:00');
  const daysElapsed = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  const currentMonth = Math.max(1, Math.min(12, Math.floor(daysElapsed / 30) + 1));
  const currentPhase = getPhaseFromMonth(currentMonth);
  const progressPct = Math.min(100, (daysElapsed / 365) * 100);
  const patternsDone = Object.values(state.patterns).filter(Boolean).length;
  const labsDone = Object.values(state.labs).filter(Boolean).length;
  const lldDone = Object.values(state.lldProblems).filter(Boolean).length;
  const sdDone = Object.values(state.sdCases).filter(Boolean).length;
  const totalHoursLogged = state.sessions.reduce((s, x) => s + (x.duration || 0), 0);
  const weekAgo = addDays(today, -7);
  const weekHours = state.sessions
    .filter(s => new Date(s.date) >= weekAgo)
    .reduce((sum, x) => sum + (x.duration || 0), 0);
  const mockTotal = Object.values(state.mockInterviews).reduce((s, x) => s + (x || 0), 0);
  const mockTargetTotal = Object.values(MOCK_INTERVIEW_TARGETS).reduce((s, m) => s + m.sd + m.coding + m.lld + m.sql, 0);
  const courseAvg = COURSES.reduce((s, c) => s + (state.courseProgress[c.id] || 0), 0) / COURSES.length;
  return {
    daysElapsed, currentMonth, currentPhase, progressPct,
    patternsDone, labsDone, lldDone, sdDone,
    totalHoursLogged, weekHours, mockTotal, mockTargetTotal, courseAvg,
  };
}
