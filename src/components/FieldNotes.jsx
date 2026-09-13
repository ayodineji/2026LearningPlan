import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useTheme } from '../theme.jsx';

// Course field notes rendered inline on a course card: an index of
// layers you can scan, each expanding to the ideas underneath it.
// Content lives in data/fieldNotes.js.

// Ideas are plain strings with **bold** around the term being defined.
function RichText({ text }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
        chunk.startsWith('**') && chunk.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 700 }}>{chunk.slice(2, -2)}</strong>
          : <React.Fragment key={i}>{chunk}</React.Fragment>
      )}
    </>
  );
}

function NotePart({ part, color, open, onToggle }) {
  const theme = useTheme();
  return (
    <div style={{ borderBottom: `1px dotted ${theme.ruleDim}` }}>
      <button onClick={onToggle} className="btn-t hover-bg" style={{
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
        width: '100%', padding: '11px 6px', background: 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div>
          <div className="font-mono" style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em',
            color, fontWeight: 700, marginBottom: 3,
          }}>
            {part.label}
          </div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
            {part.title}
          </div>
          {!open && (
            <div className="serif" style={{ fontSize: 13, fontStyle: 'italic', opacity: 0.6, marginTop: 3, lineHeight: 1.45 }}>
              {part.essence}
            </div>
          )}
        </div>
        <ChevronRight size={14} style={{
          opacity: 0.5, marginTop: 12,
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s',
        }} />
      </button>

      {open && (
        <div className="animate-in" style={{ padding: '0 6px 16px' }}>
          <p className="serif" style={{ fontSize: 14, fontStyle: 'italic', color: theme.inkDim, margin: '0 0 12px', lineHeight: 1.5, maxWidth: '62ch' }}>
            {part.essence}
          </p>
          {part.ideas.map((idea, i) => (
            <p key={i} className="serif" style={{
              fontSize: 14.5, lineHeight: 1.6, margin: '0 0 11px',
              paddingLeft: 12, borderLeft: `2px solid ${color}`, maxWidth: '62ch',
            }}>
              <RichText text={idea} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function FieldNotes({ notes, color }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openParts, setOpenParts] = React.useState({});
  const allOpen = notes.parts.every(p => openParts[p.id]);

  return (
    <div style={{ marginTop: 16, border: `1px solid ${theme.ruleDim}`, borderRadius: 2 }}>
      <button onClick={() => setOpen(o => !o)} className="btn-t hover-bg" style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '10px 12px', background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <BookOpen size={13} style={{ color, flex: 'none' }} />
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          Field notes
        </span>
        <span className="font-mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.12em' }}>
          {notes.parts.length} layers
        </span>
        <ChevronRight size={14} style={{
          marginLeft: 'auto', opacity: 0.5,
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s',
        }} />
      </button>

      {open && (
        <div className="animate-in" style={{ padding: '0 12px 12px', borderTop: `1px dotted ${theme.ruleDim}` }}>
          <p className="serif" style={{ fontSize: 13, fontStyle: 'italic', color: theme.inkDim, margin: '12px 0 10px', lineHeight: 1.5, maxWidth: '62ch' }}>
            {notes.blurb}
          </p>
          <button
            onClick={() => setOpenParts(allOpen ? {} : Object.fromEntries(notes.parts.map(p => [p.id, true])))}
            className="btn-t font-mono"
            style={{
              padding: '4px 9px', marginBottom: 6, background: 'transparent', color: theme.ink,
              border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer',
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em',
            }}>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
          {notes.parts.map(part => (
            <NotePart
              key={part.id}
              part={part}
              color={color}
              open={!!openParts[part.id]}
              onToggle={() => setOpenParts(s => ({ ...s, [part.id]: !s[part.id] }))}
            />
          ))}
          <div className="font-mono" style={{ fontSize: 9, opacity: 0.45, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 12 }}>
            Source · {notes.source}
          </div>
        </div>
      )}
    </div>
  );
}
