import React, { useState } from 'react';
import { ExternalLink, StickyNote } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, FilterChip, Checkbox } from '../components/common.jsx';
import { CODING_PATTERNS, PHASES } from '../data/plan.js';

export function PatternsView({ state, togglePattern, openNote }) {
  const theme = useTheme();
  const [filterPhase, setFilterPhase] = useState('all');

  const filtered = filterPhase === 'all' ? CODING_PATTERNS : CODING_PATTERNS.filter(p => p.phase === parseInt(filterPhase));
  const doneCount = CODING_PATTERNS.filter(p => state.patterns[p.n]).length;

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="02" title="Coding Patterns" subtitle={`${doneCount} of 28 complete · Grokking the Coding Interview in Python`} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
          <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
          {PHASES.map(p => (
            <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>P{p.n}</FilterChip>
          ))}
        </div>
        <a
          href="https://www.educative.io/courses/grokking-coding-interview-in-python"
          target="_blank" rel="noopener noreferrer"
          className="btn-t font-mono"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: theme.ink, color: theme.invert,
            padding: '6px 12px', borderRadius: 2, textDecoration: 'none',
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
          }}
        >
          Open course <ExternalLink size={10} />
        </a>
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}` }}>
        {filtered.map(p => {
          const done = !!state.patterns[p.n];
          const phase = PHASES[p.phase - 1];
          return (
            <div key={p.n} style={{
              display: 'grid',
              gridTemplateColumns: '32px auto 1fr auto auto',
              gap: 16, alignItems: 'center',
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.ink}`,
            }}>
              <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>#{String(p.n).padStart(2, '0')}</span>
              <button onClick={() => togglePattern(p.n)} className="btn-t" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Checkbox done={done} color={phase.color} />
              </button>
              <div className="font-display" style={{
                fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
                textDecoration: done ? 'line-through' : 'none',
                opacity: done ? 0.55 : 1,
              }}>
                {p.name}
                <span className="font-mono" style={{ fontSize: 10, marginLeft: 8, opacity: 0.45, fontWeight: 400 }}>M{p.month}</span>
              </div>
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                P{p.phase}
              </span>
              <button
                onClick={() => openNote({
                  kind: 'pattern', id: p.n,
                  title: `Pattern #${p.n} — ${p.name}`,
                  subtitle: `Phase ${p.phase} · Month ${p.month}`,
                })}
                className="btn-t"
                style={{
                  background: 'transparent',
                  border: `1px solid ${phase.color}`,
                  borderRadius: 2, padding: '4px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <StickyNote size={11} />
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Note</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
