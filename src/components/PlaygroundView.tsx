import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Check, 
  Terminal, 
  Layers, 
  Eye, 
  Download,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlaygroundViewProps {
  initialCode?: { html?: string; css?: string; js?: string };
  onAskGemini: (code: string, userPrompt?: string) => void;
  onProjectSave: () => void;
}

const TEMPLATES = [
  {
    id: 'portfolio',
    name: 'Personal Portfolio Card',
    icon: '📇',
    html: `<div class="card">
  <div class="avatar-glow">
    <div class="avatar">👨‍💻</div>
  </div>
  <h2>Alex Chen</h2>
  <span class="role-tag">Frontend Apprentice</span>
  <p class="bio">Building websites with semantic HTML, CSS Grid, and modern JavaScript animations.</p>
  <div class="stats-row">
    <div class="stat"><span class="num">12</span><span class="lbl">Projects</span></div>
    <div class="stat"><span class="num">680</span><span class="lbl">XP</span></div>
    <div class="stat"><span class="num">4d</span><span class="lbl">Streak</span></div>
  </div>
  <button id="connectBtn" class="primary-btn">Connect With Me 🚀</button>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1e1b4b, #0f172a);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #f8fafc;
}
.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.avatar-glow {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar {
  background: #0f172a;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
}
h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
}
.role-tag {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.bio {
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 1rem 0;
}
.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1.25rem;
}
.stat .num {
  display: block;
  font-weight: 800;
  font-size: 1.1rem;
  color: #38bdf8;
}
.stat .lbl {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
}
.primary-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
}`,
    js: `document.getElementById('connectBtn').addEventListener('click', () => {
  alert('Connected! Thanks for checking out my website portfolio ✨');
  console.log('Connect button pressed at: ' + new Date().toLocaleTimeString());
});`,
  },
  {
    id: 'glow_btn',
    name: 'Cyberpunk Glow Button',
    icon: '⚡',
    html: `<div class="container">
  <button id="glowBtn" class="cyber-btn">
    <span class="btn-text">INITIALIZE SYSTEM</span>
  </button>
  <p id="statusMsg">Clicks: 0</p>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #09090b;
  color: #a1a1aa;
  font-family: monospace;
}
.container {
  text-align: center;
}
.cyber-btn {
  background: transparent;
  color: #00ffcc;
  border: 2px solid #00ffcc;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.4);
}
.cyber-btn:hover {
  background: #00ffcc;
  color: #09090b;
  box-shadow: 0 0 35px rgba(0, 255, 204, 0.8);
}`,
    js: `let count = 0;
const btn = document.getElementById('glowBtn');
const msg = document.getElementById('statusMsg');
btn.addEventListener('click', () => {
  count++;
  msg.innerText = 'System Activated! Total Clicks: ' + count;
  console.log('Cyber button activated: ' + count);
});`,
  },
];

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  initialCode,
  onAskGemini,
  onProjectSave,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [html, setHtml] = useState(initialCode?.html || TEMPLATES[0].html);
  const [css, setCss] = useState(initialCode?.css || TEMPLATES[0].css);
  const [js, setJs] = useState(initialCode?.js || TEMPLATES[0].js);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile' | '3d'>('desktop');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // Update when initialCode changes (e.g. from Google Meet lesson starter)
  useEffect(() => {
    if (initialCode?.html) setHtml(initialCode.html);
    if (initialCode?.css) setCss(initialCode.css);
    if (initialCode?.js) setJs(initialCode.js);
    setRunKey(prev => prev + 1);
  }, [initialCode]);

  const handleTemplateLoad = (template: typeof TEMPLATES[0]) => {
    setHtml(template.html);
    setCss(template.css);
    setJs(template.js);
    setLogs([]);
    setRunKey(prev => prev + 1);
  };

  const handleRun = () => {
    setRunKey(prev => prev + 1);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  const handleSave = () => {
    setIsSaved(true);
    onProjectSave();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAskByteAI = () => {
    const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${js}`;
    onAskGemini(fullCode, "Please review my website code! Tell me what is good, any bugs, and how I can make it look even cooler.");
  };

  // Build sandboxed HTML
  const compiledSrc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Intercept console.log
          const origLog = console.log;
          console.log = function(...args) {
            origLog.apply(console, args);
            window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'CONSOLE_ERROR', message: 'Error: ' + msg + ' (Line ' + line + ')' }, '*');
          };
          try {
            ${js}
          } catch(err) {
            console.log('Runtime Error: ' + err.message);
          }
        </script>
      </body>
    </html>
  `;

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'CONSOLE_LOG' || e.data?.type === 'CONSOLE_ERROR') {
        setLogs(prev => [...prev.slice(-15), e.data.message]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  return (
    <div className="space-y-6">
      {/* Playground Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Interactive Web Playground
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live HTML5, CSS3 & JavaScript simulator with instant preview
            </p>
          </div>
        </div>

        {/* Templates dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Templates:</span>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplateLoad(t)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.name}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Run, Save, Ask AI */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAskByteAI}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Ask Byte AI Review</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved! (+50 XP)' : 'Save Project'}</span>
          </button>

          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Main Split Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[580px]">
        
        {/* Left Side: Code Editor with Tabs */}
        <div className="flex flex-col bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          
          {/* Tab Selector Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-1">
              {(['html', 'css', 'js'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                    activeTab === tab
                      ? tab === 'html'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : tab === 'css'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab === 'html' ? 'index.html' : tab === 'css' ? 'styles.css' : 'script.js'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (activeTab === 'html') setHtml('');
                if (activeTab === 'css') setCss('');
                if (activeTab === 'js') setJs('');
              }}
              title="Clear current tab"
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>

          {/* Textarea Code Input */}
          <div className="flex-1 p-4 relative font-mono text-sm leading-relaxed">
            {activeTab === 'html' && (
              <textarea
                value={html}
                onChange={e => setHtml(e.target.value)}
                aria-label="HTML code editor"
                placeholder="<!-- Write your HTML markup here -->"
                className="w-full h-full min-h-[350px] bg-transparent resize-none border-none outline-none text-orange-200 placeholder-slate-600 font-mono text-xs sm:text-sm selection:bg-orange-500/30"
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={css}
                onChange={e => setCss(e.target.value)}
                aria-label="CSS code editor"
                placeholder="/* Write your CSS styles here */"
                className="w-full h-full min-h-[350px] bg-transparent resize-none border-none outline-none text-blue-200 placeholder-slate-600 font-mono text-xs sm:text-sm selection:bg-blue-500/30"
                spellCheck={false}
              />
            )}
            {activeTab === 'js' && (
              <textarea
                value={js}
                onChange={e => setJs(e.target.value)}
                aria-label="JavaScript code editor"
                placeholder="// Write your JavaScript logic here"
                className="w-full h-full min-h-[350px] bg-transparent resize-none border-none outline-none text-yellow-200 placeholder-slate-600 font-mono text-xs sm:text-sm selection:bg-yellow-500/30"
                spellCheck={false}
              />
            )}
          </div>

          {/* Console Log Drawer */}
          <div className="bg-slate-950 border-t border-slate-800 p-3 max-h-36 overflow-y-auto font-mono text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Console Logs</span>
            </div>
            {logs.length === 0 ? (
              <div className="text-slate-600 italic">No output yet. Run your code to see console logs.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-emerald-400 font-mono leading-tight">
                  &gt; {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Live Responsive Preview */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Viewport Control Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Preview</span>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                title="Desktop View"
                aria-label="Desktop viewport"
                className={`p-1.5 rounded-md ${viewport === 'desktop' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                title="Tablet View"
                aria-label="Tablet viewport"
                className={`p-1.5 rounded-md ${viewport === 'tablet' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                title="Mobile View"
                aria-label="Mobile viewport"
                className={`p-1.5 rounded-md ${viewport === 'mobile' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('3d')}
                title="3D Spatial Perspective View"
                aria-label="3D Spatial perspective"
                className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-bold ${viewport === '3d' ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 border border-purple-300 dark:border-purple-800' : 'text-slate-400'}`}
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">3D</span>
              </button>
            </div>
          </div>

          {/* Iframe Preview Container */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950/60 p-4 flex items-center justify-center overflow-auto [perspective:1400px]">
            <div
              className={`bg-white rounded-xl border border-slate-300 dark:border-slate-800 overflow-hidden transition-all duration-500 ${
                viewport === 'mobile'
                  ? 'w-[375px] h-[520px] shadow-lg'
                  : viewport === 'tablet'
                  ? 'w-[520px] h-[520px] shadow-lg'
                  : viewport === '3d'
                  ? 'w-[90%] h-[480px] shadow-2xl [transform:rotateX(12deg)_rotateY(-12deg)_rotateZ(2deg)] hover:[transform:rotateX(6deg)_rotateY(-6deg)_rotateZ(1deg)] ring-4 ring-indigo-500/20'
                  : 'w-full h-full min-h-[460px] shadow-lg'
              }`}
            >
              <iframe
                key={runKey}
                title="Code Playground Preview"
                srcDoc={compiledSrc}
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-none bg-white"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
