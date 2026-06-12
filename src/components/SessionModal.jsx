import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { COURSES } from '../data/plan.js';

export function SessionModal({ date, onSave, onClose }) {
  const theme = useTheme();
  const [type, setType] = useState('Coding Patterns');
  const [duration, setDuration] = useState(1);
  const [courseId, setCourseId] = useState('');
  const [notes, setNotes] = useState('');

  const types = ['System Design', 'Coding Patterns', 'C# / TypeScript', 'SQL', 'Data Engineering', 'LLD', 'Cloud Lab', 'Mock Interview', 'Python Exercises', 'Onyx study', 'Vibe coding', 'Other'];

  const handleSave = () => {
    if (duration <= 0) return;
    onSave({ date, type, duration: parseFloat(duration), courseId: courseId || null, notes });
  };

  const inputStyle = {
    width: '100%', background: theme.bgElev, border: `1px solid ${theme.ink}`,
    borderRadius: 2, color: theme.ink, padding: '8px 10px', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: theme.overlay, backdropFilter: 'blur(4px)',
      zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.invert, border: `2px solid ${theme.ink}`, borderRadius: 2,
        padding: 32, width: '100%', maxWidth: 480, animation: 'slideIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 4 }}>New entry</div>
            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Log session</h3>
          </div>
          <button onClick={onClose} className="btn-t" style={{ opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div className="rule-thick" style={{ marginBottom: 20 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Date"><input type="date" value={date} readOnly style={inputStyle} /></Field>
          <Field label="Activity type">
            <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Related course (optional)">
            <select value={courseId} onChange={e => setCourseId(e.target.value)} style={inputStyle}>
              <option value="">— None —</option>
              {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Duration (hours)">
            <input type="number" min={0.25} step={0.25} value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Notes (optional)">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What you worked on..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Fraunces, serif' }} />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={onClose} className="btn-t font-mono"
            style={{ flex: 1, padding: '10px 0', background: 'transparent', color: theme.ink, border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-t font-mono"
            style={{ flex: 1, padding: '10px 0', background: theme.ink, color: theme.invert, border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Save session
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
