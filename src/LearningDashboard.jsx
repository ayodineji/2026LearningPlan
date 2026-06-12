import React, { useState, useEffect, useMemo } from 'react';
import { THEMES, ThemeContext } from './theme.jsx';
import { GlobalStyles } from './components/GlobalStyles.jsx';
import { Header, Footer } from './components/Header.jsx';
import { NotePanel } from './components/NotePanel.jsx';
import { OverviewView } from './views/OverviewView.jsx';
import { PhaseView } from './views/PhaseView.jsx';
import { NotesView } from './views/NotesView.jsx';
import { SettingsView } from './views/SettingsView.jsx';
import { CompilerView } from './views/CompilerView.jsx';
import { PLAN_START_DEFAULT } from './data/plan.js';
import { computeStats } from './lib/utils.js';
import { readStateJson, writeStateJson, readNote, writeNote, resetDb, flushSave } from './storage/db.js';

const defaultState = {
  startDate: PLAN_START_DEFAULT,
  theme: 'light',
  courseProgress: {},   // legacy manual % (course progress is now derived)
  moduleChecks: {},
  patterns: {},
  pyexChecks: {},
  labs: {},
  lldProblems: {},
  sdCases: {},
  projects: {},
  reviews: {},
  mocks: {},            // `${phase}-${type}` -> count
  weeklyGoalHours: 11,
};

// Map a checklist item kind to its slice of state.
const KIND_TO_KEY = {
  pattern: 'patterns',
  pyex: 'pyexChecks',
  module: 'moduleChecks',
  lab: 'labs',
  lld: 'lldProblems',
  'sd-case': 'sdCases',
  project: 'projects',
  review: 'reviews',
};

export default function LearningDashboard() {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('overview');

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

  const stats = useMemo(() => computeStats(state), [state]);

  const update = (patch) => setState(s => ({ ...s, ...patch }));
  const toggleItem = (kind, id) => {
    const key = KIND_TO_KEY[kind];
    if (!key) return;
    setState(s => ({ ...s, [key]: { ...s[key], [id]: !s[key][id] } }));
  };
  const setMock = (phase, type, count) =>
    setState(s => ({ ...s, mocks: { ...s.mocks, [`${phase}-${type}`]: Math.max(0, count) } }));

  const theme = THEMES[state.theme] || THEMES.light;

  // Open the slide-out notes panel for a given target (course, pattern, lab, …).
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
    await resetDb();
    const fresh = { ...defaultState, theme: state.theme };
    // Persist the fresh state immediately so a quick reload can't land on an
    // empty DB and re-trigger the legacy localStorage migration.
    await writeStateJson(fresh);
    await flushSave();
    setState(fresh);
  };

  const phaseMatch = view.match(/^phase(\d)$/);

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.ink, fontFamily: '"Inter", sans-serif', position: 'relative', transition: 'background 0.3s, color 0.3s' }}>
        <GlobalStyles theme={theme} />
        <div className="grain" />

        <Header view={view} setView={setView} stats={stats} theme={theme} toggleTheme={toggleTheme} />

        <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 32px 80px', position: 'relative', zIndex: 2 }}>
          {view === 'overview' && <OverviewView state={state} stats={stats} setView={setView} />}
          {phaseMatch && (
            <PhaseView
              key={phaseMatch[1]}
              phaseN={Number(phaseMatch[1])}
              state={state}
              stats={stats}
              handlers={{
                toggleItem,
                setMock: (type, count) => setMock(Number(phaseMatch[1]), type, count),
              }}
              openNote={openNote}
            />
          )}
          {view === 'compiler' && <CompilerView />}
          {view === 'notes' && <NotesView openNote={openNote} refreshKey={noteRefreshKey} />}
          {view === 'settings' && <SettingsView state={state} update={update} onReset={onReset} />}
        </main>

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
