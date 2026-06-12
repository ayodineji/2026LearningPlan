export function formatDate(d) {
  if (typeof d === 'string') d = new Date(d + 'T00:00:00');
  return d.toISOString().slice(0, 10);
}
export function addDays(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
export function getPhaseFromMonth(m) { if (m <= 3) return 1; if (m <= 6) return 2; if (m <= 9) return 3; return 4; }

// Calendar position in the year (informational — progress is driven
// by checkboxes, not the calendar).
export function computeStats(state) {
  const today = new Date();
  const start = new Date(state.startDate + 'T00:00:00');
  const daysElapsed = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  const currentMonth = Math.max(1, Math.min(12, Math.floor(daysElapsed / 30) + 1));
  const currentPhase = getPhaseFromMonth(currentMonth);
  const yearPct = Math.min(100, (daysElapsed / 365) * 100);
  return { daysElapsed, currentMonth, currentPhase, yearPct };
}
