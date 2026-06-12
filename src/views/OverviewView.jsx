import React, { useMemo } from 'react';
import { ArrowUpRight, ChevronRight, ExternalLink, Target } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { BigStat } from '../components/common.jsx';
import {
  PHASES, MONTHLY_MILESTONES, LLD_PROBLEMS, SYSTEM_DESIGN_CASES,
  CLOUD_LABS, CODING_PATTERNS, COURSES,
} from '../data/plan.js';
import { getPhaseFromMonth, formatDate, addDays } from '../lib/utils.js';
import { computeNowObjectives, computeThisWeek } from '../lib/objectives.js';

export function OverviewView({ state, stats, setView, openNote }) {
  const theme = useTheme();
  const currentPhase = PHASES[stats.currentPhase - 1];
  const currentMilestone = MONTHLY_MILESTONES[stats.currentMonth - 1];
  const nextMilestone = stats.currentMonth < 12 ? MONTHLY_MILESTONES[stats.currentMonth] : null;

  const objectives = useMemo(() => computeNowObjectives(state, stats), [state, stats]);
  const thisWeek = useMemo(() => computeThisWeek(objectives), [objectives]);

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 01 · Current standing</span>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div className="divider-dotted" style={{ marginBottom: 32 }} />

      {/* Header band */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 32,
        alignItems: 'start',
        marginBottom: 32,
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 12, color: currentPhase.color }}>
            Phase {currentPhase.n} · {currentPhase.months} · Month {stats.currentMonth}
          </div>
          <h2 className="font-display" style={{ fontSize: 48, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 16px' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Right now you should be working on</em>
          </h2>
          <p className="serif" style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 560, marginTop: 12, color: theme.inkDim }}>
            Below is the literal queue for this week — your active courses, the exact patterns this month wants from you, the next labs to run, and any mocks owed. Click any item to jump to it.
          </p>
        </div>
        <ProgressRing stats={stats} currentPhase={currentPhase} theme={theme} />
      </div>

      {/* NOW PANEL — the centerpiece */}
      <NowPanel objectives={objectives} thisWeek={thisWeek} setView={setView} openNote={openNote} />

      {/* High-level numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}`, margin: '40px 0' }}>
        <BigStat label="Year progress" value={`${stats.progressPct.toFixed(1)}`} unit="%" sub={`${stats.daysElapsed} of 365 days`} />
        <BigStat label="Hours logged" value={stats.totalHoursLogged.toFixed(0)} unit="h" sub={`${stats.weekHours.toFixed(1)}h this week / ${state.weeklyGoalHours}h goal`} border />
        <BigStat label="Mock interviews" value={stats.mockTotal} unit={`/${stats.mockTargetTotal}`} sub="Across all types" border />
      </div>

      {/* Month focus card */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 02 · This month at a glance</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>M{String(stats.currentMonth).padStart(2, '0')}</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Focus</div>
            <h3 className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, color: currentPhase.color, margin: '0 0 16px' }}>
              {currentMilestone.focus}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {currentMilestone.items.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', gap: 12, padding: '10px 0',
                  borderBottom: i < currentMilestone.items.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                }}>
                  <span className="font-mono" style={{ fontSize: 10, opacity: 0.4, paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="serif" style={{ fontSize: 16 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderLeft: `1px solid ${theme.ink}`, paddingLeft: 24 }}>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Next month</div>
            {nextMilestone ? (
              <>
                <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>Month {nextMilestone.month}</div>
                <h4 className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 12px' }}>
                  {nextMilestone.focus}
                </h4>
                <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.55 }}>
                  {nextMilestone.items.join(' · ')}
                </div>
              </>
            ) : (
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 18, opacity: 0.6 }}>Final month. Mock marathon.</div>
            )}
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 03 · Ledger</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>Completion by component</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <Ledger stats={stats} setView={setView} />
      </div>

      {/* Year timeline */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 04 · Timeline</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>12 months at a glance</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <YearTimeline stats={stats} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <RecentActivity state={state} />
        <WeeklyRhythm state={state} objectives={objectives} />
      </div>
    </div>
  );
}

// ============================================================
// NOW PANEL — literal current objectives
// ============================================================

function NowPanel({ objectives, thisWeek, setView, openNote }) {
  const theme = useTheme();
  const phase = objectives.phaseInfo;

  return (
    <div style={{
      border: `2px solid ${theme.ink}`,
      borderRadius: 2,
      background: theme.bgElev,
      padding: '24px 28px',
      marginBottom: 32,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={16} style={{ color: phase.color }} />
          <span className="font-mono" style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em',
            color: phase.color, fontWeight: 700,
          }}>
            This week · do these
          </span>
        </div>
        <span className="font-mono" style={{
          fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.55,
        }}>
          {objectives.cadence?.total ?? 11}h target · Phase {phase.n}
        </span>
      </div>

      {thisWeek.length === 0 ? (
        <div className="serif" style={{ fontStyle: 'italic', fontSize: 16, opacity: 0.6, padding: '12px 0' }}>
          Nothing queued for this month — you're caught up. Pick a stretch lab or extra mock from the Labs/Mocks tabs.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {thisWeek.map((item, i) => (
            <button
              key={`${item.kind}-${item.id}-${i}`}
              onClick={() => setView(item.view)}
              className="btn-t hover-bg"
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto auto',
                gap: 16, alignItems: 'center',
                padding: '14px 12px',
                background: 'transparent',
                border: 'none',
                borderBottom: i < thisWeek.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                cursor: 'pointer', textAlign: 'left',
                width: '100%',
              }}
            >
              <span
                className="font-mono"
                style={{
                  display: 'inline-block',
                  fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '3px 8px',
                  background: item.color + '22',
                  color: item.color,
                  border: `1px solid ${item.color}55`,
                  borderRadius: 2,
                  fontWeight: 700, textAlign: 'center',
                }}
              >
                {item.kind}
              </span>
              <div>
                <div className="serif" style={{ fontSize: 16, lineHeight: 1.3, color: theme.ink }}>
                  {item.label}
                </div>
                <div className="font-mono" style={{ fontSize: 10, opacity: 0.55, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {item.hint}
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: 10, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {item.track}
              </span>
              <ArrowUpRight size={14} style={{ opacity: 0.45 }} />
            </button>
          ))}
        </div>
      )}

      {objectives.activeCourses.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px dotted ${theme.ruleDim}` }}>
          <div className="font-mono" style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em',
            opacity: 0.55, marginBottom: 10,
          }}>
            Active courses this month
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {objectives.activeCourses.map(ac => (
              <button
                key={ac.course.id}
                onClick={() => setView('courses')}
                className="btn-t"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px',
                  background: theme.bg,
                  border: `1px solid ${phase.color}55`,
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: 10, color: phase.color, fontWeight: 700, letterSpacing: '0.1em' }}>
                  {ac.progress}%
                </span>
                <span style={{ fontSize: 12 }}>{ac.course.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Below: reused components from the original Overview
// ============================================================

function ProgressRing({ stats, currentPhase, theme }) {
  const size = 200;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const progress = stats.progressPct / 100;

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const innerR = radius - 8;
    const outerR = radius + 2;
    return {
      month: i + 1,
      x1: center + Math.cos(rad) * innerR,
      y1: center + Math.sin(rad) * innerR,
      x2: center + Math.cos(rad) * outerR,
      y2: center + Math.sin(rad) * outerR,
      isPast: i + 1 < stats.currentMonth,
      isCurrent: i + 1 === stats.currentMonth,
    };
  });

  const indicatorAngle = (progress * 360) - 90;
  const indicatorRad = (indicatorAngle * Math.PI) / 180;
  const indicatorX = center + Math.cos(indicatorRad) * radius;
  const indicatorY = center + Math.sin(indicatorRad) * radius;

  return (
    <div className="fade-scale" style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {PHASES.map((phase, i) => {
          const startAngle = (i * 3 / 12) * 360 - 90;
          const endAngle = ((i + 1) * 3 / 12) * 360 - 90;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = center + Math.cos(startRad) * radius;
          const y1 = center + Math.sin(startRad) * radius;
          const x2 = center + Math.cos(endRad) * radius;
          const y2 = center + Math.sin(endRad) * radius;
          return (
            <path
              key={phase.n}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={phase.color}
              strokeWidth={strokeWidth + 1}
              opacity={phase.n === currentPhase.n ? 0.9 : 0.22}
            />
          );
        })}
        {ticks.map(t => (
          <line
            key={t.month}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={theme.ink}
            strokeWidth={t.isCurrent ? 2 : 1}
            opacity={t.isCurrent ? 1 : t.isPast ? 0.6 : 0.3}
          />
        ))}
        <circle cx={indicatorX} cy={indicatorY} r={6} fill={currentPhase.color} stroke={theme.bg} strokeWidth={2} />
        <circle cx={indicatorX} cy={indicatorY} r={10} fill="none" stroke={currentPhase.color} strokeWidth={1} opacity={0.4} />
        <text x={center} y={center - 10} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill={theme.ink} opacity={0.55} letterSpacing="0.15em">YEAR</text>
        <text x={center} y={center + 18} textAnchor="middle" fontFamily="Fraunces, serif" fontSize={42} fontWeight={700} fill={theme.ink} letterSpacing="-0.03em">
          {stats.progressPct.toFixed(0)}
          <tspan fontSize={24} fontWeight={300} fontStyle="italic" opacity={0.5} dx={2}>%</tspan>
        </text>
        <text x={center} y={center + 36} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill={theme.ink} opacity={0.45} letterSpacing="0.15em">
          M{String(stats.currentMonth).padStart(2, '0')} / 12
        </text>
      </svg>
    </div>
  );
}

function Ledger({ stats, setView }) {
  const theme = useTheme();
  const items = [
    { label: 'Courses (avg progress)', val: `${stats.courseAvg.toFixed(0)}%`, fill: stats.courseAvg, view: 'courses' },
    { label: 'Coding Patterns', val: `${stats.patternsDone}/28`, fill: (stats.patternsDone / 28) * 100, view: 'patterns' },
    { label: 'LLD Problems', val: `${stats.lldDone}/${LLD_PROBLEMS.length}`, fill: (stats.lldDone / LLD_PROBLEMS.length) * 100, view: 'design' },
    { label: 'System Design Cases', val: `${stats.sdDone}/${SYSTEM_DESIGN_CASES.length}`, fill: (stats.sdDone / SYSTEM_DESIGN_CASES.length) * 100, view: 'design' },
    { label: 'Cloud Labs', val: `${stats.labsDone}/${CLOUD_LABS.length}`, fill: (stats.labsDone / CLOUD_LABS.length) * 100, view: 'labs' },
    { label: 'Mock Interviews', val: `${stats.mockTotal}/${stats.mockTargetTotal}`, fill: (stats.mockTotal / stats.mockTargetTotal) * 100, view: 'mocks' },
  ];
  return (
    <div>
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => setView(item.view)}
          className="btn-t hover-bg"
          style={{
            display: 'grid', gridTemplateColumns: '24px 1fr 60px 1fr 80px', gap: 16,
            alignItems: 'center', padding: '14px 12px', width: '100%', textAlign: 'left',
            background: 'transparent', border: 'none',
            borderTop: i === 0 ? `1px solid ${theme.ink}` : `1px dotted ${theme.ruleDim}`,
            borderBottom: i === items.length - 1 ? `1px solid ${theme.ink}` : 'none',
            cursor: 'pointer',
          }}
        >
          <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
          <span className="serif" style={{ fontSize: 16 }}>{item.label}</span>
          <span className="font-mono" style={{ fontSize: 12, opacity: 0.6, textAlign: 'right' }}>{item.val}</span>
          <div style={{ height: 2, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.fill}%`, background: theme.ink, transition: 'width 0.5s' }} />
          </div>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            Open <ArrowUpRight size={10} />
          </span>
        </button>
      ))}
    </div>
  );
}

function YearTimeline({ stats }) {
  const theme = useTheme();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const phase = getPhaseFromMonth(month);
          const pObj = PHASES[phase - 1];
          const isCurrent = month === stats.currentMonth;
          const isPast = month < stats.currentMonth;
          return (
            <div key={month} style={{ position: 'relative' }}>
              <div style={{
                height: 44,
                background: isPast ? pObj.color : isCurrent ? pObj.color : pObj.accent + '55',
                opacity: isPast ? 0.8 : 1,
                border: isCurrent ? `2px solid ${theme.ink}` : 'none',
                borderRadius: 2,
              }} />
              <div className="font-mono" style={{ fontSize: 10, textAlign: 'center', marginTop: 8, opacity: 0.6 }}>M{month}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
        {PHASES.map(p => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, background: p.color, borderRadius: 1 }} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.7 }}>
              Phase 0{p.n} · {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ state }) {
  const theme = useTheme();
  const recent = [...state.sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const key = formatDate(d);
    const hours = state.sessions
      .filter(s => s.date === key)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    return { date: key, hours, dayOfWeek: d.getDay() };
  });
  const maxHours = Math.max(1, ...days.map(d => d.hours));

  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 05 · Recent sessions</div>
      <div className="divider-dotted" style={{ marginBottom: 14 }} />
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
          {days.map((d, i) => {
            const isWeekend = d.dayOfWeek === 0 || d.dayOfWeek === 6;
            const isToday = i === days.length - 1;
            return (
              <div
                key={d.date}
                title={`${d.date}: ${d.hours.toFixed(1)}h`}
                style={{
                  flex: 1,
                  height: `${Math.max(2, (d.hours / maxHours) * 100)}%`,
                  background: d.hours > 0 ? (isToday ? '#6b8e74' : theme.ink) : theme.muted,
                  opacity: d.hours > 0 ? (isWeekend ? 0.55 : 1) : 0.35,
                  borderRadius: 1,
                  transition: 'height 0.4s, opacity 0.2s',
                  cursor: 'help',
                }}
              />
            );
          })}
        </div>
        <div className="font-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.45, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="serif" style={{ fontStyle: 'italic', fontSize: 16, opacity: 0.5, padding: '12px 0' }}>
          No sessions logged yet. Head to the calendar to log your first.
        </div>
      ) : (
        <div>
          {recent.map((s, i) => {
            const course = COURSES.find(c => c.id === s.courseId);
            return (
              <div key={s.id} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12,
                padding: '10px 0',
                borderBottom: i < recent.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                alignItems: 'baseline',
              }}>
                <span className="font-mono" style={{ fontSize: 10, opacity: 0.5 }}>{s.date.slice(5)}</span>
                <div>
                  <div style={{ fontSize: 14 }}>{s.type}</div>
                  {course && <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{course.name}</div>}
                </div>
                <span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{s.duration}h</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeeklyRhythm({ state, objectives }) {
  const theme = useTheme();
  const rhythm = objectives.rhythm || [];
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 06 · Weekly rhythm · Phase {objectives.phase}</div>
      <div className="divider-dotted" style={{ marginBottom: 12 }} />
      <div className="serif" style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.inkDim }}>
        {rhythm.map((x, i) => (
          <div key={i} style={{ marginBottom: 8, display: 'grid', gridTemplateColumns: '52px 1fr', gap: 8 }}>
            <strong className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', paddingTop: 3 }}>{x.day}</strong>
            <span>{x.plan}</span>
          </div>
        ))}
      </div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 16 }}>
        Weekly target: <span style={{ color: theme.ink, fontWeight: 700 }}>{state.weeklyGoalHours}h</span>
      </div>
    </div>
  );
}
