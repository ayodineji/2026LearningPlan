import React, { useState } from 'react';
import { ExternalLink, StickyNote } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, FilterChip, Checkbox } from '../components/common.jsx';
import { CLOUD_LABS, PHASES } from '../data/plan.js';

export function LabsView({ state, toggleLab, openNote }) {
  const theme = useTheme();
  const [filterPhase, setFilterPhase] = useState('all');

  const categories = [...new Set(CLOUD_LABS.map(l => l.category))];
  const done = Object.values(state.labs).filter(Boolean).length;
  const filtered = filterPhase === 'all' ? CLOUD_LABS : CLOUD_LABS.filter(l => l.phase === parseInt(filterPhase));

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="04" title="Cloud Labs" subtitle={`${done} of ${CLOUD_LABS.length} complete · target 24-32 hands-on labs`} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
        <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
        {PHASES.map(p => (
          <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>P{p.n}</FilterChip>
        ))}
      </div>

      {categories.map(cat => {
        const catLabs = filtered.filter(l => l.category === cat);
        if (catLabs.length === 0) return null;
        const catDone = catLabs.filter(l => state.labs[l.id]).length;
        return (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', margin: 0 }}>{cat}</h3>
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
                {catDone}/{catLabs.length} done
              </span>
            </div>
            <div style={{ borderTop: `1px solid ${theme.ink}` }}>
              {catLabs.map(lab => {
                const isDone = !!state.labs[lab.id];
                const phase = PHASES[lab.phase - 1];
                return (
                  <div key={lab.id} style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto',
                    gap: 12, alignItems: 'center',
                    padding: '12px',
                    borderBottom: `1px solid ${theme.ink}`,
                  }}>
                    <button onClick={() => toggleLab(lab.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Checkbox done={isDone} color={phase.color} />
                    </button>
                    <div style={{ fontSize: 14, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1 }}>
                      {lab.name}
                    </div>
                    <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                      P{lab.phase}
                    </span>
                    <a href={lab.url} target="_blank" rel="noopener noreferrer"
                      className="btn-t font-mono"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.ink, textDecoration: 'none', padding: '4px 8px', border: `1px solid ${theme.ink}`, borderRadius: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Open <ExternalLink size={10} />
                    </a>
                    <button
                      onClick={() => openNote({
                        kind: 'lab', id: lab.id,
                        title: lab.name,
                        subtitle: `${lab.category} · Phase ${lab.phase}`,
                        url: lab.url,
                      })}
                      className="btn-t"
                      style={{
                        background: 'transparent',
                        border: `1px solid ${phase.color}`,
                        borderRadius: 2, padding: '4px 8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <StickyNote size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
