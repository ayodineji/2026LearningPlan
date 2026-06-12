import React, { useState, useEffect, useMemo } from 'react';
import { THEMES, ThemeContext } from './theme.jsx';
import { GlobalStyles } from './components/GlobalStyles.jsx';
import { Header, Footer } from './components/Header.jsx';
import { NotePanel } from './components/NotePanel.jsx';
import { SessionModal } from './components/SessionModal.jsx';
import { OverviewView } from './views/OverviewView.jsx';
import { CoursesView } from './views/CoursesView.jsx';
import { PatternsView } from './views/PatternsView.jsx';
import { DesignView } from './views/DesignView.jsx';
import { LabsView } from './views/LabsView.jsx';
import { MocksView } from './views/MocksView.jsx';
import { CalendarView } from './views/CalendarView.jsx';
import { NotesView } from './views/NotesView.jsx';
import { SettingsView } from './views/SettingsView.jsx';
import { CompilerView } from './views/CompilerView.jsx';
import { COURSES, MOCK_INTERVIEW_TARGETS, PLAN_START_DEFAULT } from './data/plan.js';
import { computeStats, formatDate } from './lib/utils.js';
import { readStateJson, writeStateJson, readNote, writeNote, resetDb } from './storage/db.js';

const defaultState = {
  startDate: PLAN_START_DEFAULT,
  theme: 'light',
  courseProgress: {}, courseNotes: {}, moduleChecks: {},
  patterns: {}, patternNotes: {},
  labs: {}, labNotes: {},
  lldProblems: {}, lldNotes: {},
  sdCases: {}, sdNotes: {},
  projects: {},
  mockInterviews: {},
  sessions: [],
  customNotes: {},
  weeklyGoalHours: 11,
};

export default function LearningDashboard() {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('overview');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Slide-out note panel state
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteValue, setNoteValue] = useState('');
  const [noteRefreshKey, setNoteRefreshKey] = useState(0);

  // Initial load from SQLite (with localStorage migration if first run).
  useEffect(() => {
    readStateJson()
      .then(json => { if (json) setState({ ...defaultState, ...json }); })
      .catch(e => console.warn('SQLite read failed', e))
      .finally(() => setLoaded(true));
  }, []);

  // Persist state JSON whenever it changes (debounced inside writeStateJson).
  useEffect(() => {
    if (!loaded) return;
    writeStateJson(state).catch(e => console.error('SQLite write failed', e));
  }, [state, loaded]);

  const stats = useMemo(() => computeStats(state, MOCK_INTERVIEW_TARGETS, COURSES), [state]);

  const update = (patch) => setState(s => ({ ...s, ...patch }));
  const toggle = (key, id) => setState(s => ({ ...s, [key]: { ...s[key], [id]: !s[key][id] } }));
  const setCourseProgress = (id, pct) => setState(s => ({ ...s, courseProgress: { ...s.courseProgress, [id]: Math.max(0, Math.min(100, pct)) } }));
  const addSession = (session) => setState(s => ({ ...s, sessions: [...s.sessions, { ...session, id: Date.now().toString() }] }));
  const deleteSession = (id) => setState(s => ({ ...s, sessions: s.sessions.filter(x => x.id !== id) }));
  const setMockInterview = (month, type, count) => setState(s => ({ ...s, mockInterviews: { ...s.mockInterviews, [`${month}-${type}`]: count } }));
  const setDayNote = (date, text) => setState(s => ({ ...s, customNotes: { ...s.customNotes, [date]: text } }));

  const theme = THEMES[state.theme] || THEMES.light;

  // Open the slide-out notes panel for a given target (course, pattern, lab, lld, sd, etc.)
  const openNote = async (target) => {
    setNoteTarget(target);
    const body = await readNote(target.kind, target.id);
    setNoteValue(body || '');
  };
  const closeNote = () => {
    setNoteTarget(null);
    setNoteValue('');
    setNoteRefreshKey(k => k + 1); // refresh NotesView list
  };
  const onNoteChange = (text) => {
    setNoteValue(text);
    if (noteTarget) writeNote(noteTarget.kind, noteTarget.id, text);
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 11, opacity: 0.6 }}>Loading SQLite…</div>
      </div>
    );
  }

  const toggleTheme = () => update({ theme: state.theme === 'light' ? 'dark' : 'light' });

  const onReset = async () => {
    if (!confirm('Reset everything? This wipes your SQLite progress + notes. This cannot be undone.')) return;
    await resetDb();
    setState({ ...defaultState, theme: state.theme });
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.ink, fontFamily: '"Inter", sans-serif', position: 'relative', transition: 'background 0.3s, color 0.3s' }}>
        <GlobalStyles theme={theme} />
        <div className="grain" />

        <Header view={view} setView={setView} stats={stats} theme={theme} toggleTheme={toggleTheme} />

        <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 32px 80px', position: 'relative', zIndex: 2 }}>
          {view === 'overview' && <OverviewView state={state} stats={stats} setView={setView} openNote={openNote} />}
          {view === 'courses' && <CoursesView state={state} setCourseProgress={setCourseProgress} toggleModule={(id) => toggle('moduleChecks', id)} openNote={openNote} />}
          {view === 'patterns' && <PatternsView state={state} togglePattern={(n) => toggle('patterns', n)} openNote={openNote} />}
          {view === 'design' && <DesignView state={state} toggleLLD={(id) => toggle('lldProblems', id)} toggleSD={(id) => toggle('sdCases', id)} openNote={openNote} />}
          {view === 'labs' && <LabsView state={state} toggleLab={(id) => toggle('labs', id)} openNote={openNote} />}
          {view === 'mocks' && <MocksView state={state} setMockInterview={setMockInterview} />}
          {view === 'calendar' && <CalendarView state={state} calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDayNote={setDayNote} onAddSession={() => setShowSessionModal(true)} deleteSession={deleteSession} />}
          {view === 'compiler' && <CompilerView />}
          {view === 'notes' && <NotesView openNote={openNote} refreshKey={noteRefreshKey} />}
          {view === 'settings' && <SettingsView state={state} update={update} toggleProject={(id) => toggle('projects', id)} onReset={onReset} />}
        </main>

        {showSessionModal && (
          <SessionModal
            date={selectedDate || formatDate(new Date())}
            onSave={(s) => { addSession(s); setShowSessionModal(false); }}
            onClose={() => setShowSessionModal(false)}
          />
        )}

        <NotePanel
          open={!!noteTarget}
          target={noteTarget}
          value={noteValue}
          onChange={onNoteChange}
          onClose={closeNote}
        />

        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
