import React from 'react';
import { useTheme } from '../theme.jsx';
import { SectionHeader } from '../components/common.jsx';
import { MOCK_INTERVIEW_TARGETS, PHASES } from '../data/plan.js';
import { getPhaseFromMonth } from '../lib/utils.js';

export function MocksView({ state, setMockInterview }) {
  const theme = useTheme();
  const types = [
    { key: 'sd', name: 'Sys Design', color: '#8b5a8c' },
    { key: 'coding', name: 'Coding', color: '#6b8e74' },
    { key: 'lld', name: 'LLD', color: '#a6614a' },
    { key: 'sql', name: 'SQL', color: '#d4ac2c' },
  ];
  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="05" title="Mock Interviews" subtitle="45+ across the year · tap to increment" />

      <div style={{ borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px repeat(4, 1fr) 100px',
          gap: 8, padding: '12px 16px',
          borderBottom: `1px solid ${theme.ink}`,
        }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>Month</div>
          {types.map(t => (
            <div key={t.key} className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: t.color, fontWeight: 700 }}>
              {t.name}
            </div>
          ))}
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, textAlign: 'right' }}>Total</div>
        </div>
        {Object.entries(MOCK_INTERVIEW_TARGETS).map(([month, target], i) => {
          const monthNum = parseInt(month);
          const phase = PHASES[getPhaseFromMonth(monthNum) - 1];
          const monthTotal = types.reduce((s, t) => s + (state.mockInterviews[`${month}-${t.key}`] || 0), 0);
          const monthTarget = target.sd + target.coding + target.lld + target.sql;
          return (
            <div key={month} style={{
              display: 'grid', gridTemplateColumns: '60px repeat(4, 1fr) 100px',
              gap: 8, padding: '12px 16px',
              borderBottom: i < 11 ? `1px dotted ${theme.ruleDim}` : 'none',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 20, background: phase.color }} />
                <span className="font-mono" style={{ fontSize: 14, fontWeight: 700 }}>M{String(monthNum).padStart(2, '0')}</span>
              </div>
              {types.map(t => {
                const key = `${month}-${t.key}`;
                const count = state.mockInterviews[key] || 0;
                const targetN = target[t.key];
                const met = count >= targetN && targetN > 0;
                return (
                  <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setMockInterview(monthNum, t.key, Math.max(0, count - 1))}
                      className="btn-t font-mono"
                      style={{ width: 24, height: 24, border: `1px solid ${theme.ink}`, background: 'transparent', borderRadius: 2, cursor: 'pointer', fontSize: 14 }}
                    >
                      −
                    </button>
                    <span className="font-mono" style={{ fontSize: 14, fontWeight: 700, width: 48, textAlign: 'center', color: met ? t.color : theme.ink }}>
                      {count}<span style={{ opacity: 0.4 }}>/{targetN}</span>
                    </span>
                    <button
                      onClick={() => setMockInterview(monthNum, t.key, count + 1)}
                      className="btn-t font-mono"
                      style={{ width: 24, height: 24, border: `1px solid ${t.color}`, background: t.color, color: theme.invert, borderRadius: 2, cursor: 'pointer', fontSize: 14 }}
                    >
                      +
                    </button>
                  </div>
                );
              })}
              <div className="font-mono" style={{ fontSize: 14, textAlign: 'right' }}>
                <span style={{ fontWeight: 700 }}>{monthTotal}</span>
                <span style={{ opacity: 0.4 }}>/{monthTarget}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Bonus · Targeted company interviews</div>
        <div className="divider-dotted" style={{ marginBottom: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${theme.ink}`, borderBottom: `1px solid ${theme.ink}` }}>
          {['Meta', 'Google', 'Amazon', 'Apple'].map((co, i) => (
            <div key={co} style={{
              padding: '20px 16px',
              borderLeft: i > 0 ? `1px solid ${theme.ink}` : 'none',
              textAlign: 'center',
            }}>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{co}</div>
              <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 4 }}>System Design</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
