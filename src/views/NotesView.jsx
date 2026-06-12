import React, { useEffect, useState, useMemo } from 'react';
import { Search, FileText } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, FilterChip } from '../components/common.jsx';
import { listAllNotes } from '../storage/db.js';
import { COURSES, CLOUD_LABS, LLD_PROBLEMS, SYSTEM_DESIGN_CASES, CODING_PATTERNS } from '../data/plan.js';

// Resolve a (kind, id) pair back to a human-readable title + subtitle.
function resolveTarget(kind, id) {
  switch (kind) {
    case 'course': {
      const c = COURSES.find(x => x.id === id);
      return c ? { title: c.name, subtitle: `Course · ${c.track}`, url: c.url } : null;
    }
    case 'pattern': {
      const p = CODING_PATTERNS.find(x => String(x.n) === String(id));
      return p ? { title: `Pattern #${p.n} — ${p.name}`, subtitle: `Coding pattern · Month ${p.month}` } : null;
    }
    case 'lab': {
      const l = CLOUD_LABS.find(x => x.id === id);
      return l ? { title: l.name, subtitle: `${l.category} lab`, url: l.url } : null;
    }
    case 'lld': {
      const l = LLD_PROBLEMS.find(x => x.id === id);
      return l ? { title: l.name, subtitle: `LLD problem` } : null;
    }
    case 'sd-case': {
      const s = SYSTEM_DESIGN_CASES.find(x => x.id === id);
      return s ? { title: s.name, subtitle: `System Design case` } : null;
    }
    default:
      return { title: `${kind} #${id}`, subtitle: kind };
  }
}

export function NotesView({ openNote, refreshKey }) {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    listAllNotes().then(setNotes).catch(e => console.error(e));
  }, [refreshKey]);

  const kinds = useMemo(() => {
    const s = new Set(notes.map(n => n.target_type));
    return ['all', ...Array.from(s)];
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter(n => {
      if (filter !== 'all' && n.target_type !== filter) return false;
      if (!q) return true;
      const meta = resolveTarget(n.target_type, n.target_id);
      const hay = `${meta?.title || ''} ${n.body || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [notes, query, filter]);

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="08" title="Notes" subtitle="Every note you've written, in one place · click any to keep editing" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          flex: 1, minWidth: 240,
          padding: '8px 12px',
          background: theme.bgElev, border: `1px solid ${theme.ruleDim}`, borderRadius: 2,
        }}>
          <Search size={14} style={{ opacity: 0.5 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search title or body…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.ink, fontSize: 14 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {kinds.map(k => (
            <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
              {k}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="serif" style={{
          fontStyle: 'italic', fontSize: 16, opacity: 0.55,
          padding: '40px 0', textAlign: 'center',
        }}>
          {notes.length === 0
            ? 'No notes yet — open any item from Courses, Patterns, Labs, or Design and write something.'
            : 'No matches for that filter.'}
        </div>
      ) : (
        <div style={{ borderTop: `1px solid ${theme.ink}` }}>
          {filtered.map(n => {
            const meta = resolveTarget(n.target_type, n.target_id);
            const preview = (n.body || '').slice(0, 200).replace(/\s+/g, ' ').trim();
            return (
              <button
                key={`${n.target_type}-${n.target_id}`}
                onClick={() => openNote({
                  kind: n.target_type,
                  id: n.target_id,
                  title: meta?.title || `${n.target_type} #${n.target_id}`,
                  subtitle: meta?.subtitle,
                  url: meta?.url,
                })}
                className="btn-t hover-bg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  gap: 16, alignItems: 'start',
                  padding: '14px 12px', width: '100%', textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${theme.ink}`,
                  cursor: 'pointer',
                }}
              >
                <FileText size={14} style={{ opacity: 0.55, marginTop: 4 }} />
                <div>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {meta?.title || `${n.target_type} · ${n.target_id}`}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {n.target_type}
                    {meta?.subtitle ? ` · ${meta.subtitle}` : ''}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 6, color: theme.inkDim, lineHeight: 1.5 }}>
                    {preview || <em style={{ opacity: 0.5 }}>(empty)</em>}
                  </div>
                </div>
                <div className="font-mono" style={{ fontSize: 10, opacity: 0.45, whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {new Date(n.updated_at).toLocaleDateString()}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
