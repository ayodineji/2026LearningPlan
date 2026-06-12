import React, { useState } from 'react';
import { ExternalLink, StickyNote } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, Checkbox, TabBtn } from '../components/common.jsx';
import { LLD_PROBLEMS, SYSTEM_DESIGN_CASES, PHASES } from '../data/plan.js';

export function DesignView({ state, toggleLLD, toggleSD, openNote }) {
  const theme = useTheme();
  const [tab, setTab] = useState('lld');
  const lldDone = Object.values(state.lldProblems).filter(Boolean).length;
  const sdDone = Object.values(state.sdCases).filter(Boolean).length;

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="03" title="Design" subtitle="LLD problems and System Design case studies" />

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `2px solid ${theme.ink}` }}>
        <TabBtn active={tab === 'lld'} onClick={() => setTab('lld')}>
          LLD Problems ({lldDone}/{LLD_PROBLEMS.length})
        </TabBtn>
        <TabBtn active={tab === 'sd'} onClick={() => setTab('sd')}>
          System Design Cases ({sdDone}/{SYSTEM_DESIGN_CASES.length})
        </TabBtn>
      </div>

      {tab === 'lld' && (
        <Checklist
          items={LLD_PROBLEMS}
          checks={state.lldProblems}
          onToggle={toggleLLD}
          onOpenNote={(item) => openNote({
            kind: 'lld', id: item.id,
            title: item.name,
            subtitle: `LLD problem · Phase ${item.phase}`,
          })}
          intro="14 real-world OOP design problems across Phases 2-4."
          url="https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles"
        />
      )}
      {tab === 'sd' && (
        <Checklist
          items={SYSTEM_DESIGN_CASES}
          checks={state.sdCases}
          onToggle={toggleSD}
          onOpenNote={(item) => openNote({
            kind: 'sd-case', id: item.id,
            title: item.name,
            subtitle: `System Design case · Phase ${item.phase}`,
          })}
          intro="15 system design case studies from Modern System Design Interview."
          url="https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers"
        />
      )}
    </div>
  );
}

function Checklist({ items, checks, onToggle, onOpenNote, intro, url }) {
  const theme = useTheme();
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p className="serif" style={{ fontStyle: 'italic', fontSize: 14, opacity: 0.7 }}>{intro}</p>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="btn-t font-mono"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, textDecoration: 'none', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Open course <ExternalLink size={10} />
        </a>
      </div>
      <div style={{ borderTop: `1px solid ${theme.ink}` }}>
        {items.map((item, i) => {
          const done = !!checks[item.id];
          const phase = PHASES[item.phase - 1];
          return (
            <div key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: '32px auto 1fr auto auto',
              gap: 16, alignItems: 'center',
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.ink}`,
            }}>
              <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>#{String(i + 1).padStart(2, '0')}</span>
              <button onClick={() => onToggle(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Checkbox done={done} color={phase.color} />
              </button>
              <div className="font-display" style={{
                fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
                textDecoration: done ? 'line-through' : 'none',
                opacity: done ? 0.55 : 1,
              }}>
                {item.name}
              </div>
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                P{item.phase}
              </span>
              <button
                onClick={() => onOpenNote(item)}
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
    </>
  );
}
