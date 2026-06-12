import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Stat } from './common.jsx';
import { PHASES } from '../data/plan.js';

export function Header({ view, setView, stats, theme, toggleTheme }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'phase1', label: 'Phase 1' },
    { id: 'phase2', label: 'Phase 2' },
    { id: 'phase3', label: 'Phase 3' },
    { id: 'phase4', label: 'Phase 4' },
    { id: 'notes', label: 'Notes' },
    { id: 'compiler', label: 'Compiler' },
    { id: 'settings', label: 'Settings' },
  ];
  const currentPhase = PHASES[stats.currentPhase - 1];
  const isDark = theme.name === 'dark';

  return (
    <header style={{ background: theme.bg, borderBottom: `1px solid ${theme.rule}`, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
            Educative Premium Plus · 12-month plan
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
              Vol. 01 · Issue {String(stats.currentMonth).padStart(2, '0')}
            </div>
            <button
              onClick={toggleTheme}
              className="btn-t"
              title={isDark ? 'Switch to light' : 'Switch to dark'}
              aria-label="Toggle theme"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent',
                color: theme.ink,
                border: `1px solid ${theme.rule}`,
                borderRadius: 2,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
              <span className="font-mono">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingBottom: 16 }}>
          <h1 className="font-display" style={{ fontSize: 72, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 0.88, margin: 0 }}>
            The <em style={{ fontWeight: 400, fontStyle: 'italic', color: currentPhase.color }}>Grind</em>
          </h1>
          <div style={{ display: 'flex', gap: 20, paddingBottom: 4 }}>
            <Stat label="Day" value={`${stats.daysElapsed}/365`} />
            <Stat label="Month" value={`${stats.currentMonth}/12`} />
            <Stat label="Phase" value={`0${stats.currentPhase}`} accent={currentPhase.color} />
          </div>
        </div>
        <div className="rule-thick" />
        <nav style={{ display: 'flex', overflowX: 'auto', marginTop: -1 }} className="custom-scroll">
          {tabs.map((t, i) => {
            const active = view === t.id;
            const isCurrentPhase = t.id === `phase${stats.currentPhase}`;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className="btn-t font-mono"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '14px 18px',
                  background: active ? theme.ink : 'transparent',
                  color: active ? theme.invert : theme.ink,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  border: 'none',
                  borderRight: i < tabs.length - 1 ? `1px solid ${theme.rule}` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {isCurrentPhase && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentPhase.color, display: 'inline-block' }} />
                )}
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ maxWidth: 920, margin: '0 auto', padding: '0 32px 40px', position: 'relative', zIndex: 2 }}>
      <div className="rule-thick" style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }} className="font-mono">
        <span>— End of document —</span>
        <span>SQLite · auto-saved</span>
      </div>
    </footer>
  );
}
