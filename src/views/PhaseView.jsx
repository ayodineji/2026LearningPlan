import React from 'react';
import { ExternalLink, FileText, ChevronRight, Minus, Plus, Flag } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { Checkbox } from '../components/common.jsx';
import { COURSES, MOCK_TYPE_LABELS, PROJECTS, REVIEW_ITEMS } from '../data/plan.js';
import { computePhaseItems, computeExitCriteria, phaseCompletion, courseProgressPct } from '../lib/objectives.js';

// One page per phase: everything the phase contains, as flat
// checklists with notes. "What to do, what's done, what's next."

export function PhaseView({ phaseN, state, stats, handlers, openNote }) {
  const theme = useTheme();
  const { phaseInfo, sections, mocks } = computePhaseItems(phaseN, state);
  const exit = computeExitCriteria(phaseN, state);
  const completion = phaseCompletion(phaseN, state);
  const isCurrent = stats.currentPhase === phaseN;
  const ongoing = COURSES.filter(c => c.ongoing);

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      {/* Phase masthead */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
          Phase 0{phaseN} · {phaseInfo.months}
        </span>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: isCurrent ? phaseInfo.color : undefined, opacity: isCurrent ? 1 : 0.6 }}>
          {isCurrent ? '● You are here' : `${Math.round(completion * 100)}% complete`}
        </span>
      </div>
      <div className="divider-dotted" style={{ marginBottom: 24 }} />

      <h2 className="font-display" style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, margin: '0 0 8px', color: phaseInfo.color }}>
        {phaseInfo.name}
      </h2>
      <p className="serif" style={{ fontStyle: 'italic', fontSize: 17, color: theme.inkDim, maxWidth: 640, margin: '0 0 16px', lineHeight: 1.5 }}>
        {phaseInfo.summary}
      </p>
      <div className="font-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, marginBottom: 16 }}>
        {phaseInfo.focus}
      </div>

      {/* Completion bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 4, background: theme.muted, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion * 100}%`, background: phaseInfo.color, transition: 'width 0.5s' }} />
        </div>
        <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>
          {Math.round(completion * 100)}%
        </span>
      </div>

      {/* Exit criteria */}
      <div style={{
        border: `2px solid ${theme.ink}`, borderRadius: 2, background: theme.bgElev,
        padding: '20px 24px', marginBottom: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Flag size={14} style={{ color: phaseInfo.color }} />
          <span className="font-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: phaseInfo.color }}>
            Exit criteria — phase isn't done until these are
          </span>
        </div>
        {exit.map((c, i) => (
          <div key={c.id} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center',
            padding: '9px 0',
            borderBottom: i < exit.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
          }}>
            <Checkbox done={c.done} color={phaseInfo.color} />
            <span className="serif" style={{ fontSize: 15, opacity: c.done ? 0.55 : 1, textDecoration: c.done ? 'line-through' : 'none' }}>
              {c.label}
            </span>
            <span className="font-mono" style={{ fontSize: 11, opacity: 0.55 }}>{c.detail}</span>
          </div>
        ))}
      </div>

      {/* Ongoing tracks strip */}
      <OngoingStrip ongoing={ongoing} state={state} handlers={handlers} openNote={openNote} phaseColor={phaseInfo.color} />

      {/* Sections */}
      {sections.map((section, si) => (
        <Section key={section.key} num={si + 1} section={section} phaseInfo={phaseInfo}
          state={state} handlers={handlers} openNote={openNote} />
      ))}

      {/* Mocks */}
      {mocks.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <SectionLabel num={sections.length + 1} title="Mock interviews" hint="Tap to increment · spread across the phase, not crammed" />
          <div style={{ borderTop: `1px solid ${theme.ink}` }}>
            {mocks.map((m, i) => (
              <div key={m.type} style={{
                display: 'grid', gridTemplateColumns: '110px auto 1fr auto', gap: 16, alignItems: 'center',
                padding: '12px 8px', borderBottom: `1px dotted ${theme.ruleDim}`,
              }}>
                <span className="font-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: phaseInfo.color, fontWeight: 700 }}>
                  {MOCK_TYPE_LABELS[m.type] || m.type}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CounterBtn onClick={() => handlers.setMock(m.type, Math.max(0, m.have - 1))}><Minus size={11} /></CounterBtn>
                  <span className="font-mono" style={{ fontSize: 14, fontWeight: 700, minWidth: 48, textAlign: 'center' }}>
                    {m.have}<span style={{ opacity: 0.45, fontWeight: 400 }}>/{m.target}</span>
                  </span>
                  <CounterBtn filled color={phaseInfo.color} onClick={() => handlers.setMock(m.type, m.have + 1)}><Plus size={11} /></CounterBtn>
                </div>
                <div style={{ height: 2, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (m.have / m.target) * 100)}%`, background: phaseInfo.color, transition: 'width 0.3s' }} />
                </div>
                <span className="font-mono" style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {m.have >= m.target ? 'Target met' : `${m.target - m.have} owed`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================

function SectionLabel({ num, title, hint }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
          § {String(num).padStart(2, '0')} · {title}
        </span>
        {hint && <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.45 }}>{hint}</span>}
      </div>
      <div className="divider-dotted" style={{ marginBottom: 16 }} />
    </>
  );
}

function Section({ num, section, phaseInfo, state, handlers, openNote }) {
  const theme = useTheme();
  const doneCount = section.items.filter(i => i.done).length;
  const nextId = section.items.find(i => !i.done)?.id;

  return (
    <div style={{ marginBottom: 48 }}>
      <SectionLabel num={num} title={section.title} hint={`${doneCount}/${section.items.length} done`} />
      {section.sourceNote && (
        <div className="serif" style={{ fontStyle: 'italic', fontSize: 13.5, color: theme.inkDim, opacity: 0.85, margin: '-6px 0 12px' }}>
          {section.sourceNote}
        </div>
      )}
      {section.key === 'courses' ? (
        section.items.map(it => (
          <CourseCard key={it.id} item={it} phaseInfo={phaseInfo} state={state}
            handlers={handlers} openNote={openNote} isNext={it.id === nextId} />
        ))
      ) : (
        <div style={{ borderTop: `1px solid ${theme.ink}` }}>
          {section.items.map(it => (
            <CheckRow key={`${it.kind}-${it.id}`} item={it} color={phaseInfo.color}
              isNext={it.id === nextId}
              onToggle={() => handlers.toggleItem(it.kind, it.id)}
              onNote={() => openNote({ kind: it.kind, id: it.id, title: it.label.replace(/^#\d+ — /, ''), subtitle: it.sub, url: it.url })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CheckRow({ item, color, isNext, onToggle, onNote }) {
  const theme = useTheme();
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center',
      padding: '11px 8px',
      borderBottom: `1px dotted ${theme.ruleDim}`,
      background: isNext ? color + '11' : 'transparent',
    }}>
      <button onClick={onToggle} className="btn-t" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
        <Checkbox done={item.done} color={color} />
      </button>
      <div style={{ minWidth: 0 }}>
        <span className="serif" style={{
          fontSize: 16, opacity: item.done ? 0.5 : 1,
          textDecoration: item.done ? 'line-through' : 'none',
        }}>
          {item.label}
        </span>
        {item.sub && (
          <div style={{ fontSize: 12, opacity: 0.55, marginTop: 2, lineHeight: 1.45 }}>{item.sub}</div>
        )}
      </div>
      {isNext && (
        <span className="font-mono" style={{
          fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em',
          color, fontWeight: 700, border: `1px solid ${color}66`, borderRadius: 2, padding: '2px 7px',
        }}>
          Next up
        </span>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-t" title="Open on Educative"
            style={{ display: 'flex', alignItems: 'center', padding: 6, color: theme.ink, border: `1px solid ${theme.ruleDim}`, borderRadius: 2 }}>
            <ExternalLink size={12} />
          </a>
        )}
        <button onClick={onNote} className="btn-t" title="Notes"
          style={{ display: 'flex', alignItems: 'center', padding: 6, color: theme.ink, background: 'transparent', border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer' }}>
          <FileText size={12} />
        </button>
      </div>
    </div>
  );
}

function CourseCard({ item, phaseInfo, state, handlers, openNote, isNext }) {
  const theme = useTheme();
  const c = item.course;
  const [open, setOpen] = React.useState(isNext);
  const pct = item.pct;

  return (
    <div style={{
      border: `1px solid ${isNext ? phaseInfo.color : theme.rule}`,
      borderRadius: 2, marginBottom: 12, background: theme.bgElev,
    }}>
      <button onClick={() => setOpen(o => !o)} className="btn-t" style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, alignItems: 'center',
        width: '100%', padding: '16px 18px', background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: phaseInfo.color, fontWeight: 700, marginBottom: 4 }}>
            {c.track} · ~{c.hours}h · {c.weeklyHours}/wk
          </div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>{c.name}</div>
          {c.note && <div className="serif" style={{ fontSize: 13, fontStyle: 'italic', opacity: 0.65, marginTop: 4, lineHeight: 1.45 }}>{c.note}</div>}
        </div>
        <span className="font-display" style={{ fontSize: 26, fontWeight: 400, color: pct >= 100 ? phaseInfo.color : theme.ink }}>
          {pct}<span style={{ fontSize: 14, opacity: 0.5, fontStyle: 'italic' }}>%</span>
        </span>
        <div style={{ width: 90, height: 3, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: phaseInfo.color, transition: 'width 0.4s' }} />
        </div>
        <ChevronRight size={16} style={{ opacity: 0.5, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: `1px dotted ${theme.ruleDim}` }}>
          {c.modules.map(m => {
            const done = !!state.moduleChecks[m.id];
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px dotted ${theme.ruleDim}` }}>
                <button onClick={() => handlers.toggleItem('module', m.id)} className="btn-t"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <Checkbox done={done} color={phaseInfo.color} />
                </button>
                <span style={{ fontSize: 14, opacity: done ? 0.5 : 1, textDecoration: done ? 'line-through' : 'none' }}>{m.name}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-t font-mono"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', color: theme.ink, textDecoration: 'none', border: `1px solid ${theme.ink}`, borderRadius: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Open course <ExternalLink size={10} />
            </a>
            <button onClick={() => openNote({ kind: 'course', id: c.id, title: c.name, subtitle: `Course · ${c.track}`, url: c.url })}
              className="btn-t font-mono"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', color: theme.ink, background: 'transparent', border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <FileText size={10} /> Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Slim strip for year-long tracks (coding patterns course, Python reps).
function OngoingStrip({ ongoing, state, handlers, openNote, phaseColor }) {
  const theme = useTheme();
  if (!ongoing.length) return null;
  return (
    <div style={{ marginBottom: 40 }}>
      <SectionLabel num={0} title="Ongoing all year" hint="Background tracks — never skipped" />
      {ongoing.map(c => {
        const pct = courseProgressPct(c, state);
        return (
          <div key={c.id} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 14, alignItems: 'center',
            padding: '10px 8px', borderBottom: `1px dotted ${theme.ruleDim}`,
          }}>
            <div>
              <span style={{ fontSize: 14.5 }}>{c.name}</span>
              <span className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginLeft: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {c.weeklyHours}/wk
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{pct}%</span>
            <div style={{ width: 90, height: 2, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: phaseColor, transition: 'width 0.3s' }} />
            </div>
            <button onClick={() => openNote({ kind: 'course', id: c.id, title: c.name, subtitle: `Course · ${c.track}`, url: c.url })}
              className="btn-t" title="Notes"
              style={{ display: 'flex', alignItems: 'center', padding: 6, color: theme.ink, background: 'transparent', border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer' }}>
              <FileText size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CounterBtn({ children, onClick, filled, color }) {
  const theme = useTheme();
  return (
    <button onClick={onClick} className="btn-t" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 22, height: 22,
      background: filled ? (color || theme.ink) : 'transparent',
      color: filled ? '#fafaf5' : theme.ink,
      border: `1px solid ${filled ? (color || theme.ink) : theme.ruleDim}`,
      borderRadius: 2, cursor: 'pointer', padding: 0,
    }}>
      {children}
    </button>
  );
}
