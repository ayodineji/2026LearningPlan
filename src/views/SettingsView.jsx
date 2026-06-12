import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, Database } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader } from '../components/common.jsx';
import { COURSES, CLOUD_LABS, LLD_PROBLEMS, SYSTEM_DESIGN_CASES, MOCK_TARGETS, PROJECTS } from '../data/plan.js';
import { exportSqlite, importSqlite } from '../storage/db.js';

export function SettingsView({ state, update, onReset }) {
  const theme = useTheme();
  const fileRef = useRef(null);
  // Two-step in-app confirm — native confirm() dialogs can be silently
  // suppressed by the browser, which made the reset button appear broken.
  const [resetArmed, setResetArmed] = useState(false);
  useEffect(() => {
    if (!resetArmed) return;
    const t = setTimeout(() => setResetArmed(false), 5000);
    return () => clearTimeout(t);
  }, [resetArmed]);

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
      <SectionHeader num="07" title="Settings" subtitle="Configure the plan · data tools" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Plan start date</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <input type="date" value={state.startDate}
            onChange={e => update({ startDate: e.target.value })}
            style={{ ...inputStyle, maxWidth: 200 }} />
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            Drives your current month, phase, and the "Next up" queue across the dashboard.
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
              onClick={() => {
                if (!resetArmed) { setResetArmed(true); return; }
                setResetArmed(false);
                onReset();
              }}
              className="btn-t font-mono"
              style={{
                background: resetArmed ? '#a6614a' : 'transparent',
                color: resetArmed ? '#fff' : '#a6614a',
                border: '1px solid #a6614a', padding: '8px 14px', borderRadius: 2,
                cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              {resetArmed ? 'Click again to wipe everything' : 'Reset all progress'}
            </button>
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ About</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <p className="serif" style={{ fontSize: 16, lineHeight: 1.6, color: theme.inkDim }}>
            This tracker covers the full 12-month Educative Premium Plus plan:
            {' '}{COURSES.length} courses across {COURSES.reduce((s, c) => s + c.modules.length, 0)} modules, 28 coding patterns,
            {' '}{CLOUD_LABS.length} cloud labs, {LLD_PROBLEMS.length} LLD problems,
            {' '}{SYSTEM_DESIGN_CASES.length} system design cases, {PROJECTS.length} shipped projects, and
            {' '}{Object.values(MOCK_TARGETS).reduce((s, m) => s + Object.values(m).reduce((a, b) => a + b, 0), 0)} mock interviews
            across 4 phases. Weekly target: 10-12 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
