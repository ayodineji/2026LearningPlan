import React, { useRef } from 'react';
import { ExternalLink, Download, Upload, Database } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, Checkbox } from '../components/common.jsx';
import { OPTIONAL_PROJECTS, COURSES, CLOUD_LABS, LLD_PROBLEMS, SYSTEM_DESIGN_CASES, MOCK_INTERVIEW_TARGETS } from '../data/plan.js';
import { exportSqlite, importSqlite } from '../storage/db.js';

export function SettingsView({ state, update, toggleProject, onReset }) {
  const theme = useTheme();
  const fileRef = useRef(null);

  const inputStyle = {
    width: '100%', background: theme.bgElev, border: `1px solid ${theme.ink}`,
    borderRadius: 2, color: theme.ink, padding: '8px 10px', fontSize: 14, outline: 'none',
  };

  const downloadSqlite = async () => {
    const bytes = await exportSqlite();
    const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grind-${new Date().toISOString().slice(0, 10)}.sqlite`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grind-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadSqlite = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm(`Restore from "${file.name}"? Current progress will be replaced.`)) return;
    const bytes = await file.arrayBuffer();
    await importSqlite(bytes);
    window.location.reload();
  };

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="07" title="Settings" subtitle="Configure the plan · data tools · optional projects" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Plan start date</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <input type="date" value={state.startDate}
            onChange={e => update({ startDate: e.target.value })}
            style={{ ...inputStyle, maxWidth: 200 }} />
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            Drives your current month, phase, and the "This week" objectives across the dashboard.
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Weekly goal (hours)</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <input type="number" min={1} max={40} value={state.weeklyGoalHours}
            onChange={e => update({ weeklyGoalHours: parseInt(e.target.value) || 11 })}
            style={{ ...inputStyle, maxWidth: 120 }} />
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            The plan recommends 10-12 hours/week. The weekly rhythm card on Overview adapts to your current phase.
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Optional projects (vibe coding)</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <div style={{ borderTop: `1px solid ${theme.ink}` }}>
            {OPTIONAL_PROJECTS.map(p => {
              const done = !!state.projects[p.id];
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                  gap: 12, alignItems: 'center',
                  padding: '12px 8px',
                  borderBottom: `1px solid ${theme.ink}`,
                }}>
                  <button onClick={() => toggleProject(p.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Checkbox done={done} color="#6b8e74" />
                  </button>
                  <div style={{ fontSize: 14, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>{p.name}</div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="btn-t font-mono"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.ink, textDecoration: 'none', padding: '4px 8px', border: `1px solid ${theme.ink}`, borderRadius: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Open <ExternalLink size={10} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={11} /> § Data · SQLite storage
          </div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <div className="serif" style={{ fontSize: 14, marginBottom: 14, opacity: 0.8, lineHeight: 1.55 }}>
            Progress and notes live in a SQLite database backed by IndexedDB — survives across deploys and browser updates. Export the <code>.sqlite</code> file to back up, share across machines, or roll back.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={downloadSqlite}
              className="btn-t font-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.ink, color: theme.invert, padding: '8px 14px', borderRadius: 2, border: 'none', cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              <Download size={12} /> Download .sqlite
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-t font-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: theme.ink, padding: '8px 14px', borderRadius: 2, border: `1px solid ${theme.ink}`, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              <Upload size={12} /> Restore from .sqlite
            </button>
            <input ref={fileRef} type="file" accept=".sqlite,.db,application/x-sqlite3" onChange={uploadSqlite} style={{ display: 'none' }} />
            <button
              onClick={downloadJson}
              className="btn-t font-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: theme.ink, padding: '8px 14px', borderRadius: 2, border: `1px solid ${theme.ruleDim}`, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              <Download size={12} /> Export JSON (legacy)
            </button>
            <button
              onClick={onReset}
              className="btn-t font-mono"
              style={{ background: 'transparent', color: '#a6614a', border: '1px solid #a6614a', padding: '8px 14px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              Reset all progress
            </button>
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ About</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <p className="serif" style={{ fontSize: 16, lineHeight: 1.6, color: theme.inkDim }}>
            This tracker covers the full 12-month Educative Premium Plus plan:
            9 courses across {COURSES.reduce((s, c) => s + c.modules.length, 0)} modules, 28 coding patterns,
            {' '}{CLOUD_LABS.length} cloud labs, {LLD_PROBLEMS.length} LLD problems,
            {' '}{SYSTEM_DESIGN_CASES.length} system design cases, and {Object.values(MOCK_INTERVIEW_TARGETS).reduce((s, m) => s + m.sd + m.coding + m.lld + m.sql, 0)} mock interviews
            across 4 phases. Weekly target: 10-12 hours. Total: ~250-260 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
