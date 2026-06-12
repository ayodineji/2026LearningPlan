import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../theme.jsx';

export function Stat({ label, value, accent }) {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ opacity: 0.5, textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.2em' }} className="font-mono">{label}</span>
      <span style={{ color: accent || theme.ink, fontWeight: 700, fontSize: 14 }} className="font-mono">{value}</span>
    </div>
  );
}

export function BigStat({ label, value, unit, sub, border }) {
  const theme = useTheme();
  return (
    <div style={{ padding: '28px 24px', borderLeft: border ? `1px solid ${theme.ink}` : 'none' }}>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>{label}</div>
      <div className="font-display" style={{ fontSize: 64, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
        {value}<span className="serif" style={{ fontStyle: 'italic', opacity: 0.4, fontSize: 32, fontWeight: 300 }}>{unit}</span>
      </div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 8 }}>{sub}</div>
    </div>
  );
}

export function Checkbox({ done, color }) {
  const theme = useTheme();
  return (
    <div style={{
      width: 18, height: 18, minWidth: 18,
      border: `1.5px solid ${done ? color : theme.ink}`,
      background: done ? color : 'transparent',
      borderRadius: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}>
      {done && <Check size={12} color="#fafaf5" strokeWidth={3} />}
    </div>
  );
}

export function FilterChip({ active, onClick, color, children }) {
  const theme = useTheme();
  return (
    <button
      onClick={onClick}
      className="btn-t font-mono"
      style={{
        padding: '5px 10px',
        background: active ? (color || theme.ink) : 'transparent',
        color: active ? theme.invert : theme.ink,
        border: `1px solid ${active ? (color || theme.ink) : theme.ink}`,
        borderRadius: 2,
        cursor: 'pointer',
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
      }}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ num, title, subtitle }) {
  const theme = useTheme();
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ {num}</div>
      <h2 className="font-display" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, margin: '0 0 4px' }}>
        {title}
      </h2>
      <p className="serif" style={{ fontStyle: 'italic', fontSize: 18, marginTop: 8, color: theme.inkDim }}>{subtitle}</p>
      <div className="rule-thick" style={{ marginTop: 16 }} />
    </div>
  );
}

export function NoteTextarea({ value, onChange, placeholder, rows = 4 }) {
  const theme = useTheme();
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: theme.bgElev, border: `1px solid ${theme.muted}`,
        borderRadius: 2, padding: 12, fontSize: 14, color: theme.ink,
        outline: 'none', resize: 'vertical',
        fontFamily: 'Fraunces, serif', lineHeight: 1.5,
      }}
    />
  );
}

export function TabBtn({ active, onClick, children }) {
  const theme = useTheme();
  return (
    <button
      onClick={onClick}
      className="btn-t font-mono"
      style={{
        padding: '14px 20px',
        background: active ? theme.ink : 'transparent',
        color: active ? theme.invert : theme.ink,
        border: 'none', cursor: 'pointer',
        fontWeight: active ? 600 : 500,
        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
      }}
    >
      {children}
    </button>
  );
}
