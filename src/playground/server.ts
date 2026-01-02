import http from 'http';
import { exec } from 'child_process';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import { generateProject } from '../generator.js';
import type { ProjectConfig } from '../prompts.js';

const PORT = 3333;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>create-techstack-app</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #000000;
      --bg-secondary: #0a0a0a;
      --bg-card: #111111;
      --bg-hover: #1a1a1a;
      --border: #27272a;
      --border-hover: #3f3f46;
      --text-primary: #ffffff;
      --text-secondary: #a1a1aa;
      --text-muted: #71717a;
      --accent: #ffffff;
      --success: #22c55e;
      --error: #ef4444;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      min-height: 100vh;
      color: var(--text-primary);
      line-height: 1.6;
    }
    .container { max-width: 720px; margin: 0 auto; padding: 3rem 1.5rem; }
    .header { text-align: center; margin-bottom: 3rem; }
    .logo { font-size: 3rem; margin-bottom: 0.5rem; }
    h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 0.95rem; }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    .card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .card-header h2 { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .options { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    .option {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }
    .option:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .option.selected { background: var(--text-primary); border-color: var(--text-primary); }
    .option.selected .icon, .option.selected .label { color: var(--bg-primary); }
    .option .icon { font-size: 1.5rem; margin-bottom: 0.375rem; display: block; }
    .option .label { font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 0; border-bottom: 1px solid var(--border); }
    .toggle-row:last-child { border-bottom: none; padding-bottom: 0; }
    .toggle-row:first-child { padding-top: 0; }
    .toggle-row span { font-size: 0.9rem; color: var(--text-secondary); }
    .toggle {
      width: 44px; height: 24px;
      background: var(--bg-hover);
      border: 1px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
    }
    .toggle.on { background: var(--text-primary); border-color: var(--text-primary); }
    .toggle::after {
      content: '';
      position: absolute;
      width: 18px; height: 18px;
      background: var(--text-muted);
      border-radius: 50%;
      top: 2px; left: 2px;
      transition: all 0.15s ease;
    }
    .toggle.on::after { transform: translateX(20px); background: var(--bg-primary); }
    .preview {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: pre;
      overflow-x: auto;
      line-height: 1.8;
    }
    .preview .folder { color: var(--text-primary); font-weight: 500; }
    .btn {
      background: var(--text-primary);
      border: none;
      border-radius: 10px;
      padding: 1rem 1.5rem;
      color: var(--bg-primary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: all 0.15s ease;
      margin-top: 0.5rem;
    }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .input-row label { display: block; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
    .input-row input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 1rem;
      font-family: 'JetBrains Mono', monospace;
      transition: border-color 0.15s ease;
    }
    .input-row input:focus { outline: none; border-color: var(--text-secondary); }
    .input-row input::placeholder { color: var(--text-muted); }
    .status { text-align: center; padding: 1rem; font-size: 0.9rem; color: var(--text-muted); }
    .status.success { color: var(--success); }
    .status.error { color: var(--error); }
    .footer { text-align: center; margin-top: 2rem; color: var(--text-muted); font-size: 0.8rem; }
    .footer a { color: var(--text-secondary); text-decoration: none; }
    .footer a:hover { color: var(--text-primary); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚡</div>
      <h1>create-techstack-app</h1>
      <p class="subtitle">Configure your project visually</p>
    </div>

    <div class="card">
      <div class="input-row">
        <label>Project Name</label>
        <input type="text" id="projectName" value="my-app" placeholder="my-project">
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Project Type</h2></div>
      <div class="options" id="projectType">
        <div class="option selected" data-value="fullstack"><span class="icon">🔗</span><span class="label">Full Stack</span></div>
        <div class="option" data-value="frontend"><span class="icon">◻️</span><span class="label">Frontend</span></div>
        <div class="option" data-value="backend"><span class="icon">▣</span><span class="label">Backend</span></div>
      </div>
    </div>

    <div class="card" id="frontendCard">
      <div class="card-header"><h2>Frontend</h2></div>
      <div class="options" id="frontend">
        <div class="option selected" data-value="react"><span class="icon">⚛️</span><span class="label">React</span></div>
        <div class="option" data-value="nextjs"><span class="icon">▲</span><span class="label">Next.js</span></div>
        <div class="option" data-value="vue"><span class="icon">◆</span><span class="label">Vue</span></div>
        <div class="option" data-value="vanilla"><span class="icon">◇</span><span class="label">Vanilla</span></div>
      </div>
    </div>

    <div class="card" id="backendCard">
      <div class="card-header"><h2>Backend</h2></div>
      <div class="options" id="backend">
        <div class="option selected" data-value="express-mongodb"><span class="icon">🍃</span><span class="label">MongoDB</span></div>
        <div class="option" data-value="express-postgres"><span class="icon">🐘</span><span class="label">PostgreSQL</span></div>
        <div class="option" data-value="express-mysql"><span class="icon">🐬</span><span class="label">MySQL</span></div>
        <div class="option" data-value="go-gin"><span class="icon">◈</span><span class="label">Go Gin</span></div>
        <div class="option" data-value="go-fiber"><span class="icon">◉</span><span class="label">Go Fiber</span></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Options</h2></div>
      <div class="toggle-row" id="tailwindRow">
        <span>Tailwind CSS</span>
        <div class="toggle on" id="tailwind"></div>
      </div>
      <div class="toggle-row">
        <span>TypeScript</span>
        <div class="toggle on" id="typescript"></div>
      </div>
      <div class="toggle-row">
        <span>Git Repository</span>
        <div class="toggle on" id="git"></div>
      </div>
      <div class="toggle-row">
        <span>Install Dependencies</span>
        <div class="toggle on" id="deps"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Preview</h2></div>
      <div class="preview" id="preview"></div>
    </div>

    <button class="btn" id="generate">Generate Project →</button>
    <div class="status" id="status"></div>

    <div class="footer">
      Built by <a href="https://harib.vercel.app" target="_blank">hariswarreddy</a> • <a href="https://github.com/hariswarreddy/create-techstack-app">GitHub</a>
    </div>
  </div>

  <script>
    const config = {
      projectName: 'my-app',
      projectType: 'fullstack',
      frontend: 'react',
      backend: 'express-mongodb',
      tailwind: true,
      typescript: true,
      git: true,
      deps: true
    };

    function updatePreview() {
      let preview = '';
      const name = config.projectName || 'my-project';
      preview += '<span class="folder">' + name + '/</span>\\n';
      
      if (config.projectType === 'fullstack') {
        preview += '├── <span class="folder">frontend/</span>\\n';
        preview += '│   ├── src/\\n';
        preview += '│   └── package.json\\n';
        preview += '└── <span class="folder">backend/</span>\\n';
        preview += '    ├── src/\\n';
        if (config.typescript && config.backend.startsWith('express')) {
          preview += '    ├── tsconfig.json\\n';
        }
        preview += '    └── package.json';
      } else {
        preview += '├── src/\\n';
        if (config.typescript && config.projectType === 'backend' && config.backend.startsWith('express')) {
          preview += '├── tsconfig.json\\n';
        }
        preview += '└── package.json';
      }
      
      document.getElementById('preview').innerHTML = preview;
    }

    function updateVisibility() {
      document.getElementById('frontendCard').style.display = config.projectType === 'backend' ? 'none' : 'block';
      document.getElementById('backendCard').style.display = config.projectType === 'frontend' ? 'none' : 'block';
      const showTailwind = config.projectType !== 'backend' && ['react', 'nextjs'].includes(config.frontend);
      document.getElementById('tailwindRow').style.display = showTailwind ? 'flex' : 'none';
    }

    document.querySelectorAll('.options').forEach(group => {
      group.addEventListener('click', e => {
        const option = e.target.closest('.option');
        if (!option) return;
        group.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        config[group.id] = option.dataset.value;
        updateVisibility();
        updatePreview();
      });
    });

    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        config[toggle.id] = toggle.classList.contains('on');
        updatePreview();
      });
    });

    document.getElementById('projectName').addEventListener('input', e => {
      config.projectName = e.target.value;
      updatePreview();
    });

    document.getElementById('generate').addEventListener('click', async () => {
      const btn = document.getElementById('generate');
      const status = document.getElementById('status');
      btn.textContent = 'Generating...';
      btn.disabled = true;
      status.textContent = '';
      status.className = 'status';
      
      try {
        const res = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
        const data = await res.json();
        if (data.success) {
          status.textContent = '✓ ' + data.message;
          status.className = 'status success';
          btn.textContent = 'Done!';
        } else {
          status.textContent = '✗ ' + data.message;
          status.className = 'status error';
          btn.textContent = 'Generate Project →';
          btn.disabled = false;
        }
      } catch (err) {
        status.textContent = '✗ Connection failed';
        status.className = 'status error';
        btn.textContent = 'Generate Project →';
        btn.disabled = false;
      }
    });

    updateVisibility();
    updatePreview();
  </script>
</body>
</html>`;

interface PlaygroundConfig {
  projectName: string;
  projectType: 'fullstack' | 'frontend' | 'backend';
  frontend: string;
  backend: string;
  tailwind: boolean;
  typescript: boolean;
  git: boolean;
  deps: boolean;
}

let server: http.Server;

export async function startPlayground(): Promise<void> {
  server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(HTML_CONTENT);
      return;
    }

    if (req.method === 'POST' && req.url === '/generate') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const config: PlaygroundConfig = JSON.parse(body);
          
          const projectConfig: ProjectConfig = {
            projectName: config.projectName || 'my-project',
            projectType: config.projectType,
            frontend: config.projectType === 'backend' ? 'none' : config.frontend as any,
            backend: config.projectType === 'frontend' ? 'none' : config.backend as any,
            useTailwind: config.tailwind && ['react', 'nextjs'].includes(config.frontend),
            typescript: config.typescript,
            initGit: config.git,
            installDeps: config.deps,
          };

          await generateProject(projectConfig);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Project "' + config.projectName + '" created! Server closing...'
          }));

          // Auto-shutdown after successful generation
          console.log();
          logger.success('✅ Project created! Shutting down playground...');
          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 1000);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to generate project'
          }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log();
    logger.success('🎮 Playground running at ' + chalk.cyan('http://localhost:' + PORT));
    logger.info('Configure your project visually and click Generate!');
    console.log();
    logger.info('Press ' + chalk.yellow('Ctrl+C') + ' to stop the server');
    console.log();

    const url = 'http://localhost:' + PORT;
    const cmd = process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(cmd + ' ' + url);
  });
}
