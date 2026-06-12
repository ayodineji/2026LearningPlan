import React, { useState } from 'react';
import { ChevronRight, ExternalLink, StickyNote } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, FilterChip, Checkbox } from '../components/common.jsx';
import { COURSES, PHASES } from '../data/plan.js';

export function CoursesView({ state, setCourseProgress, toggleModule, openNote }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [filterPhase, setFilterPhase] = useState('all');

  const filtered = filterPhase === 'all' ? COURSES : COURSES.filter(c => c.phase === parseInt(filterPhase));

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="01" title="Courses" subtitle="Nine structured courses · expand to check modules · click Notes to open the side editor" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
        <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
        {PHASES.map(p => (
          <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>
            P{p.n}
          </FilterChip>
        ))}
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}` }}>
        {filtered.map((course, i) => (
          <CourseRow
            key={course.id}
            course={course}
            progress={state.courseProgress[course.id] || 0}
            moduleChecks={state.moduleChecks}
            expanded={!!expanded[course.id]}
            onToggle={() => setExpanded(e => ({ ...e, [course.id]: !e[course.id] }))}
            onProgressChange={(p) => setCourseProgress(course.id, p)}
            onToggleModule={toggleModule}
            onOpenNote={() => openNote({
              kind: 'course', id: course.id,
              title: course.name,
              subtitle: `${course.track} · Phase ${course.phase} · ~${course.hours}h`,
              url: course.url,
            })}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function CourseRow({ course, progress, moduleChecks, expanded, onToggle, onProgressChange, onToggleModule, onOpenNote, index }) {
  const theme = useTheme();
  const phase = PHASES[course.phase - 1];
  const modulesDone = course.modules.filter(m => moduleChecks[m.id]).length;

  return (
    <div style={{ borderBottom: `1px solid ${theme.ink}` }}>
      <button
        onClick={onToggle}
        className="btn-t hover-bg"
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr auto 120px auto',
          gap: 20, alignItems: 'center',
          padding: '20px 16px', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
      >
        <span className="font-mono" style={{ fontSize: 12, opacity: 0.5 }}>#{String(index + 1).padStart(2, '0')}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
              P{course.phase} · {course.track}
            </span>
            <span style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: course.priority }).map((_, i) => (
                <span key={i} style={{ color: phase.color }}>⚡</span>
              ))}
            </span>
          </div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>
            {course.name}
          </h3>
          <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ~{course.hours}h · {course.lessons} lessons · {course.weeklyHours}/wk
            {course.modules.length > 0 && ` · ${modulesDone}/${course.modules.length} modules`}
          </div>
        </div>
        <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: phase.color, letterSpacing: '-0.02em', textAlign: 'right' }}>
          {progress}<span className="serif" style={{ fontStyle: 'italic', opacity: 0.4, fontSize: 16, fontWeight: 300 }}>%</span>
        </div>
        <div style={{ height: 3, background: theme.muted, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: phase.color, transition: 'width 0.4s' }} />
        </div>
        <div style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <ChevronRight size={18} />
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 28px 64px', animation: 'slideIn 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <a
              href={course.url} target="_blank" rel="noopener noreferrer"
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: theme.ink, color: theme.invert,
                padding: '8px 14px', borderRadius: 2, textDecoration: 'none',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              Open course <ExternalLink size={12} />
            </a>
            <button
              onClick={onOpenNote}
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: theme.ink,
                border: `1px solid ${theme.ink}`,
                padding: '8px 14px', borderRadius: 2, cursor: 'pointer',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              <StickyNote size={12} /> Open notes editor
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="range" min={0} max={100} value={progress} onChange={e => onProgressChange(parseInt(e.target.value))} style={{ width: 160 }} />
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 25, 50, 75, 100].map(v => (
                  <button
                    key={v} onClick={() => onProgressChange(v)}
                    className="btn-t font-mono"
                    style={{
                      padding: '4px 8px',
                      background: progress === v ? phase.color : 'transparent',
                      color: progress === v ? theme.invert : theme.ink,
                      border: `1px solid ${progress === v ? phase.color : theme.ink}`,
                      borderRadius: 1, cursor: 'pointer',
                      fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {course.note && (
            <div className="serif" style={{
              fontStyle: 'italic', fontSize: 14, marginBottom: 20, paddingLeft: 16,
              borderLeft: `3px solid ${phase.color}`, color: theme.inkDim,
            }}>
              {course.note}
            </div>
          )}

          {course.modules.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>Modules</span>
                <span className="font-mono" style={{ fontSize: 10, opacity: 0.5 }}>{modulesDone} / {course.modules.length}</span>
              </div>
              <div style={{ borderTop: `1px dotted ${theme.ruleDim}` }}>
                {course.modules.map((m, mi) => {
                  const done = !!moduleChecks[m.id];
                  return (
                    <button
                      key={m.id} onClick={() => onToggleModule(m.id)}
                      className="btn-t hover-bg"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '8px 4px', width: '100%', textAlign: 'left',
                        background: 'transparent', border: 'none',
                        borderBottom: `1px dotted ${theme.ruleDim}`, cursor: 'pointer',
                      }}
                    >
                      <Checkbox done={done} color={phase.color} />
                      <span style={{ fontSize: 14, flex: 1, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>
                        {m.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, opacity: 0.3 }}>{String(mi + 1).padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
