import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader, NoteTextarea } from '../components/common.jsx';
import { COURSES } from '../data/plan.js';
import { formatDate, addMonths } from '../lib/utils.js';

export function CalendarView({ state, calendarMonth, setCalendarMonth, selectedDate, setSelectedDate, setDayNote, onAddSession, deleteSession }) {
  const theme = useTheme();
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const sessionsByDate = useMemo(() => {
    const map = {};
    state.sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [state.sessions]);

  const selectedDateStr = selectedDate || formatDate(new Date());
  const selectedSessions = sessionsByDate[selectedDateStr] || [];
  const selectedNote = state.customNotes[selectedDateStr] || '';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="06" title="Calendar" subtitle="Log sessions · add reflections · build consistency" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
            className="btn-t" style={{ background: 'transparent', border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', padding: 8 }}>
            <ChevronLeft size={14} />
          </button>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', minWidth: 200, textAlign: 'center' }}>
            {monthNames[month]} {year}
          </div>
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            className="btn-t" style={{ background: 'transparent', border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', padding: 8 }}>
            <ChevronRight size={14} />
          </button>
        </div>
        <button onClick={() => setCalendarMonth(new Date())}
          className="btn-t font-mono"
          style={{ background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none' }}>
          Today
        </button>
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}`, padding: '16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, textAlign: 'center', paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(new Date());
            const isSelected = dateStr === selectedDateStr;
            const daysSessions = sessionsByDate[dateStr] || [];
            const hasNote = !!state.customNotes[dateStr];
            const totalHours = daysSessions.reduce((s, x) => s + (x.duration || 0), 0);
            const hasActivity = daysSessions.length > 0;

            return (
              <button
                key={i} onClick={() => setSelectedDate(dateStr)}
                className="btn-t"
                style={{
                  aspectRatio: '1 / 1',
                  background: isSelected ? theme.ink : hasActivity ? '#e6b847' + '33' : 'transparent',
                  color: isSelected ? theme.invert : theme.ink,
                  border: isToday ? `2px solid ${theme.ink}` : `1px solid ${hasActivity ? '#d4ac2c' : theme.muted}`,
                  borderRadius: 2, padding: 6,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-start', justifyContent: 'space-between',
                  position: 'relative', cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: 14, fontWeight: 700 }}>{date.getDate()}</span>
                {totalHours > 0 && <span className="font-mono" style={{ fontSize: 10 }}>{totalHours}h</span>}
                {hasNote && (
                  <div style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, background: '#a6614a', borderRadius: 1 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
            Selected · {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <button onClick={onAddSession} className="btn-t font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none' }}>
            <Plus size={12} /> Log session
          </button>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 16 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>
              Sessions ({selectedSessions.length})
            </div>
            {selectedSessions.length === 0 ? (
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, opacity: 0.5, padding: '8px 0' }}>Nothing logged yet.</div>
            ) : (
              <div style={{ borderTop: `1px solid ${theme.ink}` }}>
                {selectedSessions.map(s => {
                  const course = COURSES.find(c => c.id === s.courseId);
                  return (
                    <div key={s.id} style={{ padding: '10px 0', borderBottom: `1px dotted ${theme.ruleDim}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{s.type}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{s.duration}h</span>
                          <button onClick={() => deleteSession(s.id)} className="btn-t"
                            style={{ opacity: 0.4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      {course && <div className="font-mono" style={{ fontSize: 10, opacity: 0.6 }}>{course.name}</div>}
                      {s.notes && <div className="serif" style={{ fontStyle: 'italic', fontSize: 12, marginTop: 4, color: theme.inkDim }}>{s.notes}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Day reflection</div>
            <NoteTextarea value={selectedNote} onChange={(t) => setDayNote(selectedDateStr, t)} placeholder="Wins, blockers, what to revisit tomorrow…" rows={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
