import React, { useMemo } from 'react';
import { ArrowUpRight, Target, Flag } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { BigStat } from '../components/common.jsx';
import { PHASES, CODING_PATTERNS, MOCK_TARGETS, DAILY_RHYTHM } from '../data/plan.js';
import { getPhaseFromMonth } from '../lib/utils.js';
import { computeNextUp, computeExitCriteria, phaseCompletion } from '../lib/objectives.js';

export function OverviewView({ state, stats, setView }) {
  const theme = useTheme();
  const currentPhase = PHASES[stats.currentPhase - 1];

  const nextUp = useMemo(() => computeNextUp(stats.currentPhase, state), [state, stats.currentPhase]);
  const exit = useMemo(() => computeExitCriteria(stats.currentPhase, state), [state, stats.currentPhase]);
  const completions = useMemo(
    () => PHASES.map(p => phaseCompletion(p.n, state)),
    [state],
  );

  const patternsDone = CODING_PATTERNS.filter(p => state.patterns[p.n]).length;
  const mockTargetTotal = Object.values(MOCK_TARGETS).reduce((s, m) => s + Object.values(m).reduce((a, b) => a + b, 0), 0);
  const mocksDone = Object.values(state.mocks).reduce((s, x) => s + (x || 0), 0);
  const overallPct = (completions.reduce((s, c) => s + c, 0) / 4) * 100;
  const exitDone = exit.filter(c => c.done).length;

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', marginBottom: 32 }}>
        <div>
          <div className="font-mono" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 12, color: currentPhase.color }}>
            Phase {currentPhase.n} · {currentPhase.months} · Month {stats.currentMonth}
          </div>
          <h2 className="font-display" style={{ fontSize: 48, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 16px' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>What's next, what's done,<br />what's coming</em>
          </h2>
          <p className="serif" style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 560, marginTop: 12, color: theme.inkDim }}>
            {currentPhase.summary}
          </p>
        </div>
        <ProgressRing stats={stats} currentPhase={currentPhase} theme={theme} />
      </div>

      {/* NEXT UP — first unchecked item per section of the current phase */}
      <div style={{ border: `2px solid ${theme.ink}`, borderRadius: 2, background: theme.bgElev, padding: '24px 28px', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={16} style={{ color: currentPhase.color }} />
            <span className="font-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', color: currentPhase.color, fontWeight: 700 }}>
              Next up · Phase {currentPhase.n}
            </span>
          </div>
          <button onClick={() => setView(`phase${stats.currentPhase}`)} className="btn-t font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', color: theme.ink, border: 'none', cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.7 }}>
            Open phase page <ArrowUpRight size={11} />
          </button>
        </div>

        {nextUp.length === 0 ? (
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 16, opacity: 0.6, padding: '12px 0' }}>
            Phase {currentPhase.n} is fully checked off. Move to the next phase page, or deepen: redo a mock, rewrite a design case.
          </div>
        ) : (
          <div>
            {nextUp.map((item, i) => (
              <button
                key={`${item.kind}-${item.id}`}
                onClick={() => setView(`phase${stats.currentPhase}`)}
                className="btn-t hover-bg"
                style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 16, alignItems: 'center',
                  padding: '13px 12px', background: 'transparent', border: 'none',
                  borderBottom: i < nextUp.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <span className="font-mono" style={{
                  display: 'inline-block', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '3px 8px', background: item.color + '22', color: item.color,
                  border: `1px solid ${item.color}55`, borderRadius: 2, fontWeight: 700, textAlign: 'center',
                }}>
                  {item.section}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: 16, lineHeight: 1.3 }}>{item.label}</div>
                  {item.sub && <div className="font-mono" style={{ fontSize: 10, opacity: 0.55, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.sub}</div>}
                </div>
                <ArrowUpRight size={14} style={{ opacity: 0.45 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* High-level numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}`, margin: '40px 0' }}>
        <BigStat label="Plan complete" value={overallPct.toFixed(0)} unit="%" sub="All four phases, by checkbox" />
        <BigStat label="Patterns" value={patternsDone} unit="/28" sub="The spine of the year" border />
        <BigStat label="Mock interviews" value={mocksDone} unit={`/${mockTargetTotal}`} sub="Across all types" border />
      </div>

      {/* Exit criteria for current phase */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 02 · Phase {currentPhase.n} exit criteria</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>{exitDone}/{exit.length} met</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 32px' }}>
          {exit.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0', borderBottom: `1px dotted ${theme.ruleDim}` }}>
              <Flag size={11} style={{ color: c.done ? currentPhase.color : theme.ink, opacity: c.done ? 1 : 0.35, flexShrink: 0, alignSelf: 'center' }} />
              <span className="serif" style={{ fontSize: 14.5, flex: 1, opacity: c.done ? 0.5 : 1, textDecoration: c.done ? 'line-through' : 'none' }}>{c.label}</span>
              <span className="font-mono" style={{ fontSize: 10, opacity: 0.5 }}>{c.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The four phases */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 03 · The four phases</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>Completion by phase</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <div>
          {PHASES.map((p, i) => {
            const pct = completions[i] * 100;
            const isCurrent = p.n === stats.currentPhase;
            return (
              <button
                key={p.n}
                onClick={() => setView(`phase${p.n}`)}
                className="btn-t hover-bg"
                style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr 80px 1fr 80px', gap: 16,
                  alignItems: 'center', padding: '16px 12px', width: '100%', textAlign: 'left',
                  background: isCurrent ? p.color + '0d' : 'transparent', border: 'none',
                  borderTop: i === 0 ? `1px solid ${theme.ink}` : `1px dotted ${theme.ruleDim}`,
                  borderBottom: i === PHASES.length - 1 ? `1px solid ${theme.ink}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: p.color }}>0{p.n}</span>
                <div>
                  <div className="serif" style={{ fontSize: 17, fontWeight: isCurrent ? 600 : 400 }}>
                    {p.name}
                    {isCurrent && <span className="font-mono" style={{ fontSize: 9, marginLeft: 10, color: p.color, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>● Current</span>}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.months}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 12, opacity: 0.6, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                <div style={{ height: 3, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: p.color, transition: 'width 0.5s' }} />
                </div>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  Open <ArrowUpRight size={10} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Year timeline + weekly rhythm */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <YearTimeline stats={stats} />
        <WeeklyRhythm state={state} stats={stats} />
      </div>
    </div>
  );
}

// ============================================================

function ProgressRing({ stats, currentPhase, theme }) {
  const size = 200;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const progress = stats.yearPct / 100;

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
          {stats.yearPct.toFixed(0)}
          <tspan fontSize={24} fontWeight={300} fontStyle="italic" opacity={0.5} dx={2}>%</tspan>
        </text>
        <text x={center} y={center + 36} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill={theme.ink} opacity={0.45} letterSpacing="0.15em">
          M{String(stats.currentMonth).padStart(2, '0')} / 12
        </text>
      </svg>
    </div>
  );
}

function YearTimeline({ stats }) {
  const theme = useTheme();
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 04 · Timeline</div>
      <div className="divider-dotted" style={{ marginBottom: 14 }} />
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
                height: 38,
                background: isPast ? pObj.color : isCurrent ? pObj.color : pObj.accent + '55',
                opacity: isPast ? 0.8 : 1,
                border: isCurrent ? `2px solid ${theme.ink}` : 'none',
                borderRadius: 2,
              }} />
              <div className="font-mono" style={{ fontSize: 9, textAlign: 'center', marginTop: 6, opacity: 0.6 }}>M{month}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
        {PHASES.map(p => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, background: p.color, borderRadius: 1, flexShrink: 0 }} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>
              0{p.n} · {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyRhythm({ state, stats }) {
  const theme = useTheme();
  const rhythm = DAILY_RHYTHM[stats.currentPhase] || [];
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 05 · Weekly rhythm · Phase {stats.currentPhase}</div>
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
