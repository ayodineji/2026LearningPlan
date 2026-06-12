import React from 'react';

export function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; background: ${theme.bg}; }
      .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      .font-mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "zero"; }
      .serif { font-family: 'Fraunces', serif; }
      button { color: inherit; }
      .btn-t { transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); }
      .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      .custom-scroll::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; border-radius: 3px; }
      input[type="range"] { accent-color: ${theme.ink}; }
      input, textarea, select { font-family: 'Inter', sans-serif; color: ${theme.ink}; }
      @keyframes slideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes fadeInScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      .animate-in { animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
      .spin { animation: spin 0.8s linear infinite; }
      .fade-scale { animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .grain::before {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1000;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        opacity: ${theme.grainOpacity}; mix-blend-mode: ${theme.grainBlend};
      }
      .divider-dotted { border-bottom: 1px dotted ${theme.ruleDim}; }
      .rule-thick { border-bottom: 2px solid ${theme.rule}; }
      .hover-bg:hover { background: ${theme.bgElev}; }
    `}</style>
  );
}
