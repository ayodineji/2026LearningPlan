import React, { useEffect, useState, useRef } from 'react';
import { X, Save, FileText, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../theme.jsx';

// Global slide-out drawer for editing notes against any item in the plan.
// Props:
//   open: boolean
//   target: { kind, id, title, subtitle?, url? } | null
//   value: string  (note body)
//   onChange: (text) => void   (caller persists)
//   onClose: () => void
//
// Behavior:
//   - Slides in from the right.
//   - Large textarea (monospace-friendly) so it feels like a code/file editor.
//   - Auto-saves on every change via the parent (parent debounces to DB).
//   - Cmd/Ctrl-S = explicit save flush + close.
//   - Escape closes.
//   - "Expand" toggles to a wider full-height pane for long-form writing.

export function NotePanel({ open, target, value, onChange, onClose }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    setTimeout(() => taRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  if (!open || !target) return null;

  const width = expanded ? 'min(900px, 92vw)' : 'min(560px, 92vw)';

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: theme.overlay,
          backdropFilter: 'blur(2px)',
          zIndex: 200,
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width,
          background: theme.bg,
          borderLeft: `2px solid ${theme.ink}`,
          boxShadow: theme.name === 'dark' ? '0 0 60px rgba(0,0,0,0.6)' : '-4px 0 40px rgba(0,0,0,0.12)',
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.24s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header bar */}
        <header style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.rule}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme.bgElev, border: `1px solid ${theme.ruleDim}`,
            borderRadius: 2,
          }}>
            <FileText size={14} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-mono" style={{
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em',
              opacity: 0.55, marginBottom: 2,
            }}>
              Notes · {target.kind}
            </div>
            <div className="font-display" style={{
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {target.title}
            </div>
            {target.subtitle && (
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{target.subtitle}</div>
            )}
          </div>
          {target.url && (
            <a
              href={target.url} target="_blank" rel="noopener noreferrer"
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', textDecoration: 'none',
                background: 'transparent', color: theme.ink,
                border: `1px solid ${theme.ink}`, borderRadius: 2,
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              Open <ExternalLink size={10} />
            </a>
          )}
          <button
            onClick={() => setExpanded(e => !e)}
            className="btn-t"
            title={expanded ? 'Collapse' : 'Expand'}
            style={{
              background: 'transparent', border: `1px solid ${theme.ruleDim}`,
              padding: 6, borderRadius: 2, cursor: 'pointer', color: theme.ink,
            }}
          >
            {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            className="btn-t"
            title="Close (Esc)"
            style={{
              background: 'transparent', border: `1px solid ${theme.ruleDim}`,
              padding: 6, borderRadius: 2, cursor: 'pointer', color: theme.ink,
            }}
          >
            <X size={14} />
          </button>
        </header>

        {/* Editor body */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          padding: 0,
          background: theme.bgElev,
          overflow: 'hidden',
        }}>
          <textarea
            ref={taRef}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`# Notes for ${target.title}\n\nWrite your insights, code snippets, gotchas, links — anything you want to remember.\n\nMarkdown-friendly: use # headings, **bold**, \`code\`, - bullets.`}
            style={{
              width: '100%', flex: 1,
              background: theme.bgElev,
              color: theme.ink,
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '20px 24px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              lineHeight: 1.65,
              letterSpacing: '0.005em',
            }}
            spellCheck={true}
          />
        </div>

        {/* Footer status */}
        <footer style={{
          padding: '10px 20px',
          borderTop: `1px solid ${theme.rule}`,
          background: theme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div className="font-mono" style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.5,
          }}>
            <Save size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Auto-saved · {(value || '').length} chars
          </div>
          <div className="font-mono" style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.45,
          }}>
            ⌘S / Esc to close
          </div>
        </footer>
      </aside>
    </>
  );
}
