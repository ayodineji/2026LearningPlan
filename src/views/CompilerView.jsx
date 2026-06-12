import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Loader2, Check, ExternalLink } from 'lucide-react';
import { useTheme } from '../theme.jsx';
import { SectionHeader } from '../components/common.jsx';

const COMPILER_EXAMPLES = {
  python: {
    'Sliding Window': `# Sliding Window: longest substring without repeating characters
def longest_unique_substring(s: str) -> int:
    seen: dict[str, int] = {}
    left = result = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        result = max(result, right - left + 1)
    return result

print(longest_unique_substring("abcabcbb"))  # 3
print(longest_unique_substring("bbbbb"))     # 1
print(longest_unique_substring("pwwkew"))    # 3
`,
    'Two Pointers': `# Two Pointers: pair with target sum in sorted array
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target: return [left, right]
        elif s < target: left += 1
        else: right -= 1
    return None

print(two_sum_sorted([2, 7, 11, 15], 9))
print(two_sum_sorted([1, 3, 4, 5, 7, 10, 11], 9))
`,
    'Binary Search': `# Modified Binary Search: first occurrence of target
def first_occurrence(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

print(first_occurrence([1, 2, 2, 2, 3, 4, 5], 2))
print(first_occurrence([1, 2, 3, 4, 5], 6))
`,
  },
  typescript: {
    'Generic Types': `interface Container<T> {
  value: T;
  describe(): string;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}
  describe(): string {
    return \`Box holding: \${JSON.stringify(this.value)}\`;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box<string>("hello");

console.log(numberBox.describe());
console.log(stringBox.describe());
`,
    'Discriminated Unions': `type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function render<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle": return "Waiting to start";
    case "loading": return "Loading...";
    case "success": return \`Got: \${JSON.stringify(state.data)}\`;
    case "error": return \`Error: \${state.error}\`;
  }
}

console.log(render({ status: "idle" }));
console.log(render<{ users: number }>({ status: "success", data: { users: 42 } }));
`,
  },
  csharp: {
    'LINQ Basics': `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evenSquares = numbers.Where(n => n % 2 == 0).Select(n => n * n).ToList();
        Console.WriteLine($"Even squares: {string.Join(", ", evenSquares)}");
    }
}
`,
    'Async / Await': `using System;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        var results = await Task.WhenAll(
            DoWorkAsync("A", 100), DoWorkAsync("B", 50));
        foreach (var r in results) Console.WriteLine(r);
    }

    static async Task<string> DoWorkAsync(string name, int delayMs)
    {
        await Task.Delay(delayMs);
        return $"{name} done in {delayMs}ms";
    }
}
`,
  },
};

let monacoLoadPromise = null;
function ensureMonaco() {
  if (monacoLoadPromise) return monacoLoadPromise;
  monacoLoadPromise = new Promise((resolve, reject) => {
    if (window.monaco) return resolve(window.monaco);
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/loader.min.js';
    loaderScript.onload = () => {
      window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs' } });
      window.require(['vs/editor/editor.main'], () => resolve(window.monaco));
    };
    loaderScript.onerror = reject;
    document.head.appendChild(loaderScript);
  });
  return monacoLoadPromise;
}

function defineCustomThemes(monaco) {
  monaco.editor.defineTheme('grind-light', {
    base: 'vs', inherit: true,
    rules: [
      { token: 'comment', foreground: '9a8f75', fontStyle: 'italic' },
      { token: 'string', foreground: 'a6614a' },
      { token: 'keyword', foreground: '8b5a8c', fontStyle: 'bold' },
      { token: 'number', foreground: 'd4ac2c' },
      { token: 'type', foreground: '6b8e74' },
    ],
    colors: {
      'editor.background': '#ebe4d2', 'editor.foreground': '#1a1814',
      'editorLineNumber.foreground': '#9a8f75', 'editorLineNumber.activeForeground': '#1a1814',
      'editor.lineHighlightBackground': '#e0d8c2', 'editorCursor.foreground': '#1a1814',
    },
  });
  monaco.editor.defineTheme('grind-dark', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: '6a6252', fontStyle: 'italic' },
      { token: 'string', foreground: 'c17d65' },
      { token: 'keyword', foreground: 'a578a6', fontStyle: 'bold' },
      { token: 'number', foreground: 'e8c15a' },
      { token: 'type', foreground: '8aaa94' },
    ],
    colors: {
      'editor.background': '#1d1b17', 'editor.foreground': '#f0ead8',
      'editorLineNumber.foreground': '#55503f', 'editorLineNumber.activeForeground': '#f0ead8',
      'editor.lineHighlightBackground': '#25221c', 'editorCursor.foreground': '#f0ead8',
    },
  });
}

function MonacoEditor({ language, value, onChange, theme, height = 320 }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    ensureMonaco().then(monaco => {
      if (disposed || !containerRef.current) return;
      defineCustomThemes(monaco);
      editorRef.current = monaco.editor.create(containerRef.current, {
        value, language,
        theme: theme.name === 'dark' ? 'grind-dark' : 'grind-light',
        automaticLayout: true,
        fontSize: 13.5, fontFamily: '"JetBrains Mono", monospace',
        minimap: { enabled: false }, scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 }, tabSize: 2, wordWrap: 'on',
        bracketPairColorization: { enabled: true },
      });
      const model = editorRef.current.getModel();
      if (model) {
        model.onDidChangeContent(() => { if (onChange) onChange(editorRef.current.getValue()); });
      }
      setReady(true);
    }).catch(err => console.error('Monaco load failed:', err));
    return () => {
      disposed = true;
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !editorRef.current || !window.monaco) return;
    const monaco = window.monaco;
    const newModel = monaco.editor.createModel(editorRef.current.getValue(), language);
    const old = editorRef.current.getModel();
    editorRef.current.setModel(newModel);
    if (old) old.dispose();
  }, [language, ready]);

  useEffect(() => {
    if (!ready || !editorRef.current) return;
    if (editorRef.current.getValue() !== value) editorRef.current.setValue(value);
  }, [value, ready]);

  useEffect(() => {
    if (!ready || !window.monaco) return;
    window.monaco.editor.setTheme(theme.name === 'dark' ? 'grind-dark' : 'grind-light');
  }, [theme.name, ready]);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {!ready && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bgElev }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Loader2 size={12} className="spin" /> Loading editor…
          </div>
        </div>
      )}
    </div>
  );
}

export function CompilerView() {
  const theme = useTheme();
  const [lang, setLang] = useState('python');

  const langs = [
    { id: 'python', label: 'Python', color: '#6b8e74' },
    { id: 'typescript', label: 'TypeScript', color: '#3b82f6' },
    { id: 'csharp', label: 'C#', color: '#8b5a8c' },
  ];

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="09" title="Compiler" subtitle="Monaco editor · Python (Pyodide) & TypeScript run here · C# hands off to .NET Fiddle" />

      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `2px solid ${theme.rule}` }}>
        {langs.map(l => {
          const active = lang === l.id;
          return (
            <button
              key={l.id} onClick={() => setLang(l.id)}
              className="btn-t font-mono"
              style={{
                padding: '14px 22px',
                background: active ? theme.ink : 'transparent',
                color: active ? theme.invert : theme.ink,
                fontWeight: active ? 600 : 500, cursor: 'pointer',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                border: 'none', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, background: l.color, borderRadius: 1, display: 'inline-block' }} />
              {l.label}
            </button>
          );
        })}
      </div>

      {lang === 'python' && <PythonRunner theme={theme} />}
      {lang === 'typescript' && <TypeScriptRunner theme={theme} />}
      {lang === 'csharp' && <CSharpRunner theme={theme} />}
    </div>
  );
}

function PythonRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.python['Sliding Window']);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const pyodideRef = useRef(null);
  const loadingRef = useRef(false);

  const loadPy = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (loadingRef.current) return null;
    loadingRef.current = true;
    setStatus('loading-runtime');
    await new Promise((resolve, reject) => {
      if (window.loadPyodide) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
    pyodideRef.current = pyodide; setStatus('ready');
    return pyodide;
  };

  const run = async () => {
    setRunning(true); setOutput('');
    try {
      const pyodide = await loadPy(); if (!pyodide) return;
      let captured = '';
      pyodide.setStdout({ batched: (s) => { captured += s + '\n'; } });
      pyodide.setStderr({ batched: (s) => { captured += '⚠ ' + s + '\n'; } });
      await pyodide.runPythonAsync(code);
      setOutput(captured || '(no output)');
    } catch (e) { setOutput(`Error: ${e.message || e}`); }
    finally { setRunning(false); }
  };

  return <RunnerShell theme={theme} language="python" filename="main.py" examples={COMPILER_EXAMPLES.python}
    onExampleSelect={(name) => setCode(COMPILER_EXAMPLES.python[name])}
    code={code} setCode={setCode} onRun={run} running={running} output={output} status={status}
    statusLabel={status === 'loading-runtime' ? 'Loading Pyodide (~10MB)…' : status === 'ready' ? 'Pyodide ready · CPython 3.12' : 'Click Run to initialize Pyodide (~10MB, cached)'} />;
}

function TypeScriptRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.typescript['Generic Types']);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const tsRef = useRef(null);
  const loadingRef = useRef(false);

  const loadTS = async () => {
    if (tsRef.current) return tsRef.current;
    if (loadingRef.current) return null;
    loadingRef.current = true; setStatus('loading-runtime');
    await new Promise((resolve, reject) => {
      if (window.ts) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/typescript@5.4.5/lib/typescript.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    tsRef.current = window.ts; setStatus('ready'); return window.ts;
  };

  const run = async () => {
    setRunning(true); setOutput('');
    try {
      const ts = await loadTS(); if (!ts) return;
      const js = ts.transpileModule(code, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None, strict: false },
      }).outputText;
      const captured = [];
      const originalLog = console.log;
      const originalError = console.error;
      console.log = (...args) => captured.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      console.error = (...args) => captured.push('⚠ ' + args.map(String).join(' '));
      try {
        // eslint-disable-next-line no-new-func
        new Function(js)();
        setOutput(captured.join('\n') || '(no output)');
      } catch (e) { setOutput(`Runtime: ${e.message}`); }
      finally { console.log = originalLog; console.error = originalError; }
    } catch (e) { setOutput(`Compile: ${e.message || e}`); }
    finally { setRunning(false); }
  };

  return <RunnerShell theme={theme} language="typescript" filename="main.ts" examples={COMPILER_EXAMPLES.typescript}
    onExampleSelect={(name) => setCode(COMPILER_EXAMPLES.typescript[name])}
    code={code} setCode={setCode} onRun={run} running={running} output={output} status={status}
    statusLabel={status === 'loading-runtime' ? 'Loading TypeScript 5.4…' : status === 'ready' ? 'TypeScript ready' : 'Click Run to load compiler'} />;
}

function CSharpRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.csharp['LINQ Basics']);
  const [copied, setCopied] = useState(false);

  const copyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.open('https://dotnetfiddle.net/', '_blank', 'noopener,noreferrer');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) { window.open('https://dotnetfiddle.net/', '_blank', 'noopener,noreferrer'); }
  };

  return (
    <div>
      <div style={{ padding: '14px 16px', background: theme.bgElev, border: `1px solid ${theme.muted}`, borderRadius: 2, marginBottom: 16 }}>
        <div className="serif" style={{ fontSize: 14, lineHeight: 1.55, color: theme.inkDim }}>
          The Roslyn runtime is too large for in-browser execution. Write code here with full C# highlighting, then hand it off to .NET Fiddle.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 4 }}>Load example</span>
        {Object.keys(COMPILER_EXAMPLES.csharp).map(name => (
          <button key={name} onClick={() => setCode(COMPILER_EXAMPLES.csharp[name])} className="btn-t font-mono"
            style={{ padding: '5px 10px', background: 'transparent', color: theme.ink, border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {name}
          </button>
        ))}
      </div>

      <div style={{ border: `1px solid ${theme.rule}`, borderRadius: 2, overflow: 'hidden', background: theme.bgElev }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: theme.ink, color: theme.invert }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={12} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Program.cs</span>
          </div>
          <button onClick={copyAndOpen} className="btn-t font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8b5a8c', color: theme.invert, border: '1px solid #8b5a8c', padding: '4px 10px', borderRadius: 1, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            {copied ? <Check size={12} /> : <Play size={12} />}
            {copied ? 'Copied' : 'Copy & Run on .NET Fiddle'}
          </button>
        </div>
        <MonacoEditor language="csharp" value={code} onChange={setCode} theme={theme} height={420} />
      </div>
    </div>
  );
}

function RunnerShell({ theme, language, filename, examples, onExampleSelect, code, setCode, onRun, running, output, status, statusLabel }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 4 }}>Load example</span>
        {Object.keys(examples).map(name => (
          <button key={name} onClick={() => onExampleSelect(name)} className="btn-t font-mono"
            style={{ padding: '5px 10px', background: 'transparent', color: theme.ink, border: `1px solid ${theme.ruleDim}`, borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {name}
          </button>
        ))}
      </div>

      <div style={{ border: `1px solid ${theme.rule}`, borderRadius: 2, overflow: 'hidden', background: theme.bgElev }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: theme.ink, color: theme.invert }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={12} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{filename}</span>
          </div>
          <button onClick={onRun} disabled={running} className="btn-t font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: running ? 'transparent' : '#6b8e74', color: theme.invert, border: `1px solid ${running ? theme.invert + '55' : '#6b8e74'}`, padding: '4px 10px', borderRadius: 1, cursor: running ? 'wait' : 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            {running ? <Loader2 size={12} className="spin" /> : <Play size={12} />}
            {running ? 'Running' : 'Run'}
          </button>
        </div>
        <MonacoEditor language={language} value={code} onChange={setCode} theme={theme} height={360} />
      </div>

      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.55, marginTop: 8, marginBottom: 12, color: status === 'ready' ? '#6b8e74' : theme.ink }}>
        {status === 'loading-runtime' && <Loader2 size={10} className="spin" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />}
        § {statusLabel}
      </div>

      <div style={{ border: `1px solid ${theme.rule}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', background: theme.muted, color: theme.ink }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Output</span>
        </div>
        <pre style={{
          margin: 0, padding: '14px 16px',
          background: theme.bgElev, color: theme.ink,
          fontSize: 12.5, fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 1.55, minHeight: 120, maxHeight: 300,
          overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {output || <span style={{ opacity: 0.4, fontStyle: 'italic', fontFamily: 'Fraunces, serif' }}>Output will appear here after you click Run.</span>}
        </pre>
      </div>
    </div>
  );
}
