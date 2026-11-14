
# NexusFlow
Visual IoT Telemetry & Dynamic Rule Engine

---

# NexusFlow – Member 3: React & React Flow Visual Graph Builder

Welcome to the **NexusFlow** frontend repository for **Member 3**. This project contains the visual graph builder interface for building Industrial IoT (IIoT) data pipelines using **React**, **Vite**, and **@xyflow/react**.

---

## 📌 Role & Scope Overview

As **Member 3**, your responsibility is strictly focused on the **Frontend Visual Graph Builder**:
- **Included Scope:**
  - Visual canvas implementation using `@xyflow/react`.
  - Node library with drag-and-drop capabilities.
  - 16 custom IIoT nodes across 4 categories.
  - Dynamic node properties inspection and configuration panel.
  - Frontend graph topological and configuration validation.
  - Pipeline JSON serialization, export, and preview.
  - Integration interface layer for Member 1's backend RxJS compiler.

- **Out of Scope (Handled by other teammates):**
  - **Member 1:** Backend RxJS data pipeline compiler and stream execution engine.
  - **Member 2:** MongoDB database schemas, persistent storage, and authentication API.
  - **Member 4:** Real-time metrics dashboard, live charts, and physical alert dispatching (SMS/Email/Webhook gateways).

---

## 🛠️ Technology Stack

- **Framework:** React 18+ (JavaScript / JSX)
- **Bundler & Dev Server:** Vite
- **Graphing Engine:** `@xyflow/react` (React Flow)
- **Styling:** Modular / Component-specific CSS (Dark Industrial IoT Theme)
- **Icons:** Lucide React (or standard SVG icons)

---

## 📂 Project Architecture & Recommended Folder Structure

```text
nexusflow-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.css
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── canvas/
│   │   │   ├── GraphCanvas.jsx
│   │   │   ├── GraphCanvas.css
│   │   │   └── EmptyCanvasState.jsx
│   │   ├── nodes/
│   │   │   ├── BaseNode.jsx
│   │   │   ├── BaseNode.css
│   │   │   ├── sources/
│   │   │   │   ├── TurbineSensorNode.jsx
│   │   │   │   ├── TemperatureSensorNode.jsx
│   │   │   │   ├── PressureSensorNode.jsx
│   │   │   │   └── VibrationSensorNode.jsx
│   │   │   ├── processing/
│   │   │   │   ├── MovingAverageNode.jsx
│   │   │   │   ├── MinMaxNode.jsx
│   │   │   │   ├── MathOperationNode.jsx
│   │   │   │   └── FilterNode.jsx
│   │   │   ├── conditions/
│   │   │   │   ├── ThresholdNode.jsx
│   │   │   │   ├── GreaterThanNode.jsx
│   │   │   │   ├── LessThanNode.jsx
│   │   │   │   └── AndOrNode.jsx
│   │   │   ├── actions/
│   │   │   │   ├── SmsAlertNode.jsx
│   │   │   │   ├── EmailAlertNode.jsx
│   │   │   │   ├── WebhookNode.jsx
│   │   │   │   └── LogEventNode.jsx
│   │   │   └── nodeTypes.js
│   │   ├── nodeLibrary/
│   │   │   ├── NodeLibrary.jsx
│   │   │   ├── NodeLibrary.css
│   │   │   └── NodeCategory.jsx
│   │   ├── properties/
│   │   │   ├── PropertiesPanel.jsx
│   │   │   ├── PropertiesPanel.css
│   │   │   └── forms/
│   │   │       ├── SourceConfigForm.jsx
│   │   │       ├── ProcessingConfigForm.jsx
│   │   │       ├── ConditionConfigForm.jsx
│   │   │       └── ActionConfigForm.jsx
│   │   └── validation/
│   │       ├── ValidationBanner.jsx
│   │       └── ValidationBanner.css
│   ├── services/
│   │   └── pipelineApi.js
│   ├── utils/
│   │   ├── graphValidator.js
│   │   ├── jsonSerializer.js
│   │   └── nodeDefaults.js
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📅 10-Day Commit Plan & Milestone Tracker (Weeks 1–2)

> **🎯 Goal:** Commit on 10 different days during Weeks 1–2  
> **📊 Current Progress:** `2 / 10 Days Documented / In Progress` *(8 more different days to commit)*  
> **⚠️ Critical Grading Requirement:** Only commits with **50+ changed characters** count towards your score.

| Day | Schedule Window | Planned Step & Feature | Deliverables (Ensure 50+ chars changed) | Status |
| :---: | :---: | :--- | :--- | :---: |
| **Day 1** | Week 1, Day 1 | **Step 1: Setup & Specifications** | React & React Flow workspace initialization, complete `README.md` spec | ✅ **Done (1/10)** |
| **Day 2** | Week 1, Day 2 | **Step 2: Main Graph Builder Layout** | 3-section layout (Top Navbar, Left Library, Center Canvas, Right Panel), CSS | ✅ **Ready to Commit (2/10)** |
| **Day 3** | Week 1, Day 3 | **Step 3: Draggable Node Library** | Accordion UI with 16 nodes across 4 categories, HTML5 drag-and-drop | ⏳ Pending |
| **Day 4** | Week 1, Day 4 | **Step 4: React Flow Canvas Core** | Viewport controls (zoom, fit-view), edge connections with arrows, empty state | ⏳ Pending |
| **Day 5** | Week 1, Day 5 | **Step 5: Custom Node Components** | 16 custom node components with category colors, icons, handles, and selection states | ⏳ Pending |
| **Day 6** | Week 1, Day 6 | **Step 6: Dynamic Properties Panel** | Live node configuration forms, state update propagation, node deletion | ⏳ Pending |
| **Day 7** | Week 2, Day 1 | **Step 7: Graph Validation Engine** | 10 topological pipeline rules, disconnected node detection, Run guard | ⏳ Pending |
| **Day 8** | Week 2, Day 2 | **Step 8: Save & JSON Export Modal** | Pipeline serialization, formatted JSON viewer modal, copy & download buttons | ⏳ Pending |
| **Day 9** | Week 2, Day 3 | **Step 9: Backend API Service Layer** | `pipelineApi.js` service abstraction, loading/error states, Member 1 hand-off | ⏳ Pending |
| **Day 10** | Week 2, Day 4 | **Step 10: Final Testing & UI Polish** | End-to-end user flow testing, responsive styling adjustments, console cleanup | ⏳ Pending |

---

## 📋 10-Step Development Roadmap

Execute each step sequentially in your AI coding assistant (Cursor, GitHub Copilot, or ChatGPT) on each corresponding day. Complete and verify each phase before advancing.

```
Member 3 Progress: [ 2 / 10 Documented ] - 8 More Different Days to Commit
```

### 1️⃣ Step 1: Project Setup & Initialization (Detailed Implementation)

> **Focus:** Initialize the frontend architecture with Vite, React (JavaScript), and `@xyflow/react`, creating a clean Industrial IoT application shell with modular CSS.

#### 1.1 CLI Commands to Initialize & Run
```bash
# 1. Create Vite React project (JavaScript template)
npm create vite@latest . -- --template react

# 2. Install core graph library & icons (no unnecessary dependencies)
npm install @xyflow/react lucide-react

# 3. Start development server
npm run dev
```

#### 1.2 Step 1 File Hierarchy
```text
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── styles/
    │   ├── variables.css
    │   └── global.css
    └── components/
        └── layout/
            ├── Header.jsx
            ├── Header.css
            ├── Sidebar.jsx
            ├── Sidebar.css
            ├── CanvasPlaceholder.jsx
            └── CanvasPlaceholder.css
```

#### 1.3 File-by-File Implementation Code

##### `package.json`
```json
{
  "name": "nexusflow-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@xyflow/react": "^12.4.2",
    "lucide-react": "^1.16.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.1"
  }
}
```

##### `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
```

##### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NexusFlow – IIoT Visual Pipeline Builder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

##### `src/styles/variables.css`
```css
:root {
  /* Dark Industrial IoT Color Palette */
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --bg-surface: #1e293b;
  --bg-surface-hover: #334155;

  /* Accent & Category Colors */
  --accent-cyan: #38bdf8;
  --accent-green: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  --accent-indigo: #6366f1;

  /* Text & Border Colors */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-subtle: #334155;
  --border-focus: #38bdf8;

  /* Typography & Layout */
  --font-main: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --header-height: 56px;
  --sidebar-width: 280px;
  --properties-width: 320px;
}
```

##### `src/styles/global.css`
```css
@import './variables.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  outline: none;
}

input, select, textarea {
  font-family: inherit;
  color: inherit;
}
```

##### `src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

##### `src/App.jsx`
```javascript
import React, { useState } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import CanvasPlaceholder from './components/layout/CanvasPlaceholder.jsx';
import './App.css';

export default function App() {
  const [pipelineName, setPipelineName] = useState('Turbine Monitoring Pipeline v1');

  return (
    <div className="app-shell">
      <Header pipelineName={pipelineName} onNameChange={setPipelineName} />
      <div className="app-body">
        <Sidebar title="Node Library" position="left">
          <p className="placeholder-text">Draggable Node Library (Coming in Step 3)</p>
        </Sidebar>
        <main className="app-canvas-container">
          <CanvasPlaceholder />
        </main>
        <Sidebar title="Node Properties" position="right">
          <p className="placeholder-text">Select a node on canvas to view attributes (Coming in Step 6)</p>
        </Sidebar>
      </div>
    </div>
  );
}
```

##### `src/App.css`
```css
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
}

.app-body {
  display: flex;
  flex: 1;
  height: calc(100vh - var(--header-height));
  position: relative;
  overflow: hidden;
}

.app-canvas-container {
  flex: 1;
  position: relative;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.placeholder-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  padding: 16px;
  line-height: 1.5;
  text-align: center;
}
```

##### `src/components/layout/Header.jsx`
```javascript
import React from 'react';
import { Cpu, Play, Save, CheckCircle2 } from 'lucide-react';
import './Header.css';

export default function Header({ pipelineName, onNameChange }) {
  return (
    <header className="header-container">
      <div className="header-branding">
        <Cpu className="brand-icon" size={24} />
        <span className="brand-name">NexusFlow</span>
        <span className="brand-badge">Member 3 · Graph Builder</span>
      </div>

      <div className="header-pipeline-meta">
        <input
          type="text"
          className="pipeline-name-input"
          value={pipelineName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter pipeline name..."
        />
      </div>

      <div className="header-actions">
        <button className="btn btn-secondary">
          <CheckCircle2 size={16} />
          <span>Validate</span>
        </button>
        <button className="btn btn-secondary">
          <Save size={16} />
          <span>Save</span>
        </button>
        <button className="btn btn-primary">
          <Play size={16} />
          <span>Run Pipeline</span>
        </button>
      </div>
    </header>
  );
}
```

##### `src/components/layout/Header.css`
```css
.header-container {
  height: var(--header-height);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 20;
}

.header-branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  color: var(--accent-cyan);
}

.brand-name {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.brand-badge {
  font-size: 0.75rem;
  background-color: var(--bg-tertiary);
  color: var(--accent-cyan);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.header-pipeline-meta {
  flex: 1;
  max-width: 400px;
  margin: 0 24px;
}

.pipeline-name-input {
  width: 100%;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 6px 12px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color 0.15s ease;
}

.pipeline-name-input:focus {
  border-color: var(--border-focus);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.825rem;
  font-weight: 600;
  transition: all 0.15s ease;
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.btn-secondary:hover {
  background-color: var(--bg-surface-hover);
}

.btn-primary {
  background-color: var(--accent-cyan);
  color: #04101e;
}

.btn-primary:hover {
  background-color: #7dd3fc;
}
```

##### `src/components/layout/Sidebar.jsx`
```javascript
import React from 'react';
import './Sidebar.css';

export default function Sidebar({ title, position, children }) {
  return (
    <aside className={`sidebar-pane sidebar-${position}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">{title}</h3>
      </div>
      <div className="sidebar-content">
        {children}
      </div>
    </aside>
  );
}
```

##### `src/components/layout/Sidebar.css`
```css
.sidebar-pane {
  background-color: var(--bg-secondary);
  border-color: var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 10;
  height: 100%;
}

.sidebar-left {
  width: var(--sidebar-width);
  border-right: 1px solid var(--border-subtle);
}

.sidebar-right {
  width: var(--properties-width);
  border-left: 1px solid var(--border-subtle);
}

.sidebar-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-title {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}
```

##### `src/components/layout/CanvasPlaceholder.jsx`
```javascript
import React from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import './CanvasPlaceholder.css';

const initialNodes = [
  {
    id: 'demo-1',
    position: { x: 120, y: 150 },
    data: { label: 'Turbine Sensor (Demo)' },
    type: 'input'
  },
  {
    id: 'demo-2',
    position: { x: 380, y: 150 },
    data: { label: 'Moving Average (Demo)' }
  }
];

const initialEdges = [{ id: 'e1-2', source: 'demo-1', target: 'demo-2' }];

export default function CanvasPlaceholder() {
  return (
    <div className="canvas-wrapper">
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

##### `src/components/layout/CanvasPlaceholder.css`
```css
.canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.react-flow__controls {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  overflow: hidden;
}

.react-flow__controls-button {
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-subtle);
  fill: var(--text-secondary);
}

.react-flow__controls-button:hover {
  background-color: var(--bg-surface-hover);
}
```

#### 1.4 Verification Checklist for Step 1
- [ ] Run `npm run dev` and navigate to `http://localhost:3000`.
- [ ] Top navigation bar shows NexusFlow branding, pipeline name input, and action buttons.
- [ ] Left and right sidebar drawers render with dark industrial theme.
- [ ] Central area initializes `@xyflow/react` with sample connected nodes, controls, and dot-grid background.
- [ ] Commit changes with message: `feat(setup): initialize Step 1 Vite React and React Flow shell` (satisfying the 50+ character requirement).

### 2️⃣ Step 2: Main Graph Builder Layout (Detailed Implementation)

> **Focus:** Construct the main 3-section Visual Graph Builder interface featuring a dark Industrial IoT design, a comprehensive top navigation bar, collapsible side panels for maximum canvas real estate, and centralized canvas controls (zoom, fit-view, and delete).

#### 2.1 Layout Architecture & Step 2 File Hierarchy
```text
src/
├── pages/
│   ├── GraphBuilderPage.jsx
│   └── GraphBuilderPage.css
└── components/
    ├── layout/
    │   ├── Navbar.jsx
    │   ├── Navbar.css
    │   ├── LeftSidebar.jsx
    │   ├── LeftSidebar.css
    │   ├── RightSidebar.jsx
    │   └── RightSidebar.css
    └── canvas/
        ├── GraphCanvas.jsx
        ├── GraphCanvas.css
        ├── CanvasToolbar.jsx
        └── CanvasToolbar.css
```

---

#### 2.2 File-by-File Implementation Code

##### `src/components/layout/Navbar.jsx`
```javascript
import React, { useState } from 'react';
import { 
  Activity, 
  Save, 
  Play, 
  CheckCircle, 
  Download, 
  Code2, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  pipelineName, 
  onNameChange, 
  onSave, 
  onRun, 
  onValidate, 
  onExportJson,
  isValidating = false,
  isSaving = false 
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="navbar-container">
      {/* Brand & Workspace Context */}
      <div className="navbar-brand-section">
        <div className="brand-logo-container">
          <Activity className="brand-icon" size={22} />
        </div>
        <div className="brand-text-container">
          <div className="brand-title">
            <span>Nexus</span>
            <span className="brand-accent">Flow</span>
          </div>
          <span className="brand-subtitle">IIoT Stream Engine</span>
        </div>
        <ChevronRight size={16} className="brand-separator" />
        <span className="workspace-badge">Member 3 · Graph Studio</span>
      </div>

      {/* Editable Pipeline Name Header */}
      <div className="navbar-pipeline-section">
        <label className="pipeline-name-wrapper">
          <SlidersHorizontal size={14} className="input-icon" />
          <input
            type="text"
            className="pipeline-input-field"
            value={pipelineName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name your telemetry pipeline..."
            maxLength={60}
          />
        </label>
        <span className="status-pill status-draft">Draft Mode</span>
      </div>

      {/* Action Buttons */}
      <div className="navbar-actions-section">
        <button 
          className="nav-btn nav-btn-outline" 
          onClick={onExportJson}
          title="Inspect raw JSON graph"
        >
          <Code2 size={15} />
          <span>JSON</span>
        </button>

        <button 
          className={`nav-btn nav-btn-secondary ${isValidating ? 'is-loading' : ''}`}
          onClick={onValidate}
          title="Validate node connections and required fields"
        >
          <CheckCircle size={15} />
          <span>Validate</span>
        </button>

        <button 
          className={`nav-btn nav-btn-secondary ${isSaving ? 'is-loading' : ''}`}
          onClick={onSave}
          title="Save graph state"
        >
          <Save size={15} />
          <span>Save</span>
        </button>

        <button 
          className="nav-btn nav-btn-primary" 
          onClick={onRun}
          title="Deploy & execute pipeline on Member 1 engine"
        >
          <Play size={15} className="fill-current" />
          <span>Run Pipeline</span>
        </button>
      </div>
    </header>
  );
}
```

##### `src/components/layout/Navbar.css`
```css
.navbar-container {
  height: var(--header-height, 56px);
  background: linear-gradient(180deg, #111827 0%, #0d131f 100%);
  border-bottom: 1px solid #1f293d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
  z-index: 50;
  user-select: none;
}

.navbar-brand-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo-container {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%);
  border: 1px solid rgba(56, 189, 248, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  color: var(--accent-cyan, #38bdf8);
}

.brand-text-container {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fafc;
}

.brand-accent {
  color: var(--accent-cyan, #38bdf8);
}

.brand-subtitle {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
}

.brand-separator {
  color: #334155;
}

.workspace-badge {
  font-size: 0.725rem;
  background-color: #1e293b;
  color: #94a3b8;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #334155;
  font-weight: 500;
}

.navbar-pipeline-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 440px;
  margin: 0 20px;
}

.pipeline-name-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 10px;
  color: #64748b;
  pointer-events: none;
}

.pipeline-input-field {
  width: 100%;
  background: #0a0e17;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 6px 12px 6px 32px;
  color: #f1f5f9;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.pipeline-input-field:focus {
  outline: none;
  border-color: var(--accent-cyan, #38bdf8);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
  background: #0f172a;
}

.status-pill {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 9999px;
  white-space: nowrap;
}

.status-draft {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.navbar-actions-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.nav-btn-outline {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #1e293b;
}

.nav-btn-outline:hover {
  background: #1e293b;
  color: #f8fafc;
  border-color: #334155;
}

.nav-btn-secondary {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

.nav-btn-secondary:hover {
  background: #273549;
  border-color: #475569;
}

.nav-btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  border: 1px solid #38bdf8;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
}

.nav-btn-primary:hover {
  background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.fill-current {
  fill: currentColor;
}

@media (max-width: 900px) {
  .brand-subtitle,
  .brand-separator,
  .workspace-badge,
  .status-pill {
    display: none;
  }
}
```

##### `src/components/layout/LeftSidebar.jsx`
```javascript
import React, { useState } from 'react';
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Info 
} from 'lucide-react';
import './LeftSidebar.css';

export default function LeftSidebar({ isCollapsed, onToggleCollapse, children }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <aside className={`left-sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header with Toggle */}
      <div className="sidebar-top-bar">
        {!isCollapsed && (
          <div className="sidebar-title-group">
            <Layers size={16} className="sidebar-header-icon" />
            <h2 className="sidebar-heading">Node Library</h2>
          </div>
        )}
        <button 
          className="collapse-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Node Library" : "Collapse Node Library"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Content Area */}
      {!isCollapsed && (
        <div className="left-sidebar-body">
          {/* Node Filter Search Box */}
          <div className="node-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="node-search-input"
            />
          </div>

          {/* Slot for Category Accordion (Step 3) */}
          <div className="sidebar-scrollable-content">
            {children || (
              <div className="empty-category-preview">
                <Info size={16} className="info-icon" />
                <p>Drag nodes from 4 categories into the center canvas.</p>
                <span className="hint-label">Categories: Sources · Processing · Conditions · Actions</span>
              </div>
            )}
          </div>

          {/* Quick Footer Info */}
          <div className="sidebar-footer-stats">
            <span>16 IIoT Nodes Available</span>
            <span className="dot-indicator"></span>
          </div>
        </div>
      )}
    </aside>
  );
}
```

##### `src/components/layout/LeftSidebar.css`
```css
.left-sidebar-container {
  width: var(--sidebar-width, 280px);
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  position: relative;
  z-index: 20;
  user-select: none;
}

.left-sidebar-container.collapsed {
  width: 44px;
}

.sidebar-top-bar {
  height: 44px;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 14px;
  background: #0b1120;
}

.sidebar-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-header-icon {
  color: var(--accent-cyan, #38bdf8);
}

.sidebar-heading {
  font-size: 0.775rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #cbd5e1;
}

.collapse-toggle-btn {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.collapse-toggle-btn:hover {
  background: #334155;
  color: #ffffff;
}

.left-sidebar-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.node-search-box {
  padding: 10px 12px;
  border-bottom: 1px solid #1e293b;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 19px;
  color: #64748b;
  pointer-events: none;
}

.node-search-input {
  width: 100%;
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 6px 10px 6px 30px;
  color: #f1f5f9;
  font-size: 0.8rem;
}

.node-search-input:focus {
  outline: none;
  border-color: #38bdf8;
}

.sidebar-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.empty-category-preview {
  background: rgba(30, 41, 59, 0.5);
  border: 1px dashed #334155;
  border-radius: 8px;
  padding: 18px 14px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-icon {
  color: #38bdf8;
}

.hint-label {
  font-size: 0.7rem;
  color: #64748b;
}

.sidebar-footer-stats {
  height: 32px;
  border-top: 1px solid #1e293b;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #64748b;
  background: #090e1a;
}

.dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}
```

##### `src/components/layout/RightSidebar.jsx`
```javascript
import React from 'react';
import { 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Trash2, 
  Settings2 
} from 'lucide-react';
import './RightSidebar.css';

export default function RightSidebar({ 
  isCollapsed, 
  onToggleCollapse, 
  selectedNode, 
  onDeleteNode, 
  children 
}) {
  return (
    <aside className={`right-sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header bar */}
      <div className="sidebar-top-bar">
        <button 
          className="collapse-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Properties" : "Collapse Properties"}
        >
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {!isCollapsed && (
          <div className="sidebar-title-group">
            <Sliders size={16} className="sidebar-header-icon" />
            <h2 className="sidebar-heading">Properties Panel</h2>
          </div>
        )}
      </div>

      {/* Main Body */}
      {!isCollapsed && (
        <div className="right-sidebar-body">
          {selectedNode ? (
            <div className="selected-node-wrapper">
              <div className="selected-node-banner">
                <div className="node-meta-heading">
                  <Settings2 size={16} className="node-type-icon" />
                  <div>
                    <h3 className="node-title">{selectedNode.data?.label || selectedNode.type}</h3>
                    <span className="node-id-tag">ID: {selectedNode.id}</span>
                  </div>
                </div>
                <button 
                  className="delete-node-btn"
                  onClick={() => onDeleteNode(selectedNode.id)}
                  title="Delete Selected Node"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Dynamic Form Content (Step 6) */}
              <div className="properties-form-scrollable">
                {children || (
                  <div className="properties-placeholder">
                    <SlidersHorizontal size={20} className="placeholder-icon" />
                    <p>Configurable fields for <strong>{selectedNode.type}</strong> will populate here.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection-state">
              <div className="no-selection-graphic">
                <Sliders size={24} />
              </div>
              <h4>No Node Selected</h4>
              <p>Click on any node in the graph canvas to inspect and configure its telemetry properties.</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
```

##### `src/components/layout/RightSidebar.css`
```css
.right-sidebar-container {
  width: var(--properties-width, 320px);
  background-color: #0f172a;
  border-left: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  position: relative;
  z-index: 20;
  user-select: none;
}

.right-sidebar-container.collapsed {
  width: 44px;
}

.right-sidebar-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.no-selection-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px 24px;
  text-align: center;
  color: #64748b;
}

.no-selection-graphic {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  margin-bottom: 16px;
}

.no-selection-state h4 {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.no-selection-state p {
  font-size: 0.775rem;
  line-height: 1.5;
}

.selected-node-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.selected-node-banner {
  padding: 12px 14px;
  border-bottom: 1px solid #1e293b;
  background: #0b1120;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node-meta-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.node-type-icon {
  color: #38bdf8;
}

.node-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f8fafc;
}

.node-id-tag {
  font-size: 0.675rem;
  color: #64748b;
  font-family: var(--font-mono, monospace);
  display: block;
}

.delete-node-btn {
  padding: 6px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  transition: all 0.15s ease;
}

.delete-node-btn:hover {
  background: #ef4444;
  color: #ffffff;
}

.properties-form-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.properties-placeholder {
  background: #0a0e17;
  border: 1px dashed #1e293b;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.placeholder-icon {
  color: #38bdf8;
}
```

##### `src/components/canvas/CanvasToolbar.jsx`
```javascript
import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Trash2, 
  Grid, 
  RotateCcw 
} from 'lucide-react';
import './CanvasToolbar.css';

export default function CanvasToolbar({ 
  onZoomIn, 
  onZoomOut, 
  onFitView, 
  onDeleteSelected, 
  onResetCanvas,
  hasSelection 
}) {
  return (
    <div className="canvas-floating-toolbar">
      <div className="toolbar-btn-group">
        <button 
          className="toolbar-btn" 
          onClick={onZoomIn} 
          title="Zoom In (Ctrl + Plus)"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={onZoomOut} 
          title="Zoom Out (Ctrl + Minus)"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={onFitView} 
          title="Fit View (Space / Double Click)"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-btn-group">
        <button 
          className={`toolbar-btn ${hasSelection ? 'btn-danger' : 'btn-disabled'}`}
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          title={hasSelection ? "Delete Selected (Del)" : "Select node/edge to delete"}
        >
          <Trash2 size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={onResetCanvas} 
          title="Clear / Reset Pipeline"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
```

##### `src/components/canvas/CanvasToolbar.css`
```css
.canvas-floating-toolbar {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background-color: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 15;
  user-select: none;
}

.toolbar-btn-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: #1e293b;
  margin: 0 6px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  cursor: pointer;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: #1e293b;
  color: #f8fafc;
}

.toolbar-btn.btn-danger:hover {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.toolbar-btn:disabled,
.toolbar-btn.btn-disabled {
  color: #334155;
  cursor: not-allowed;
}
```

##### `src/components/canvas/GraphCanvas.jsx`
```javascript
import React, { useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useReactFlow 
} from '@xyflow/react';
import CanvasToolbar from './CanvasToolbar.jsx';
import './GraphCanvas.css';

export default function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  selectedNodeId,
  onDeleteSelected,
  onResetCanvas
}) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleNodeClick = useCallback((event, node) => {
    if (onNodeClick) onNodeClick(node);
  }, [onNodeClick]);

  const handlePaneClick = useCallback(() => {
    if (onPaneClick) onPaneClick();
  }, [onPaneClick]);

  return (
    <div className="graph-canvas-viewport">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        {/* Dark Industrial Grid */}
        <Background 
          color="#1e293b" 
          gap={24} 
          size={1.5} 
          className="canvas-background-grid"
        />

        {/* Floating MiniMap */}
        <MiniMap 
          nodeStrokeColor="#38bdf8"
          nodeColor="#1e293b"
          maskColor="rgba(10, 14, 23, 0.75)"
          className="canvas-minimap"
        />
      </ReactFlow>

      {/* Floating Viewport Controls */}
      <CanvasToolbar
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 400 })}
        onDeleteSelected={onDeleteSelected}
        onResetCanvas={onResetCanvas}
        hasSelection={Boolean(selectedNodeId)}
      />
    </div>
  );
}
```

##### `src/components/canvas/GraphCanvas.css`
```css
.graph-canvas-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--bg-primary, #0a0e17);
  overflow: hidden;
}

.canvas-background-grid {
  background-color: #0a0e17;
}

.canvas-minimap {
  position: absolute;
  bottom: 24px;
  right: 24px;
  background-color: #0b1120 !important;
  border: 1px solid #1e293b !important;
  border-radius: 8px !important;
  overflow: hidden;
}

/* Default Edge Styling */
.react-flow__edge-path {
  stroke: #475569;
  stroke-width: 2;
}

.react-flow__edge.selected .react-flow__edge-path {
  stroke: var(--accent-cyan, #38bdf8);
  stroke-width: 2.5;
}
```

##### `src/pages/GraphBuilderPage.jsx`
```javascript
import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import Navbar from '../components/layout/Navbar.jsx';
import LeftSidebar from '../components/layout/LeftSidebar.jsx';
import RightSidebar from '../components/layout/RightSidebar.jsx';
import GraphCanvas from '../components/canvas/GraphCanvas.jsx';
import './GraphBuilderPage.css';

const initialSampleNodes = [
  {
    id: 'sample-source-1',
    type: 'input',
    position: { x: 100, y: 180 },
    data: { label: 'Turbine Vibration Sensor' }
  },
  {
    id: 'sample-filter-1',
    type: 'default',
    position: { x: 380, y: 180 },
    data: { label: 'Moving Average Window (10s)' }
  },
  {
    id: 'sample-action-1',
    type: 'output',
    position: { x: 680, y: 180 },
    data: { label: 'SMS Critical Alert' }
  }
];

const initialSampleEdges = [
  { id: 'e1-2', source: 'sample-source-1', target: 'sample-filter-1', animated: true },
  { id: 'e2-3', source: 'sample-filter-1', target: 'sample-action-1', animated: true }
];

function GraphBuilderInner() {
  const [pipelineName, setPipelineName] = useState('Industrial Turbine Pipeline Alpha');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialSampleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialSampleEdges);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  const handleResetCanvas = useCallback(() => {
    if (window.confirm('Reset all nodes and edges from this canvas?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
    }
  }, [setNodes, setEdges]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="graph-builder-layout">
      {/* 1. Top Navigation Bar */}
      <Navbar
        pipelineName={pipelineName}
        onNameChange={setPipelineName}
        onSave={() => alert(`Saving pipeline "${pipelineName}" with ${nodes.length} nodes.`)}
        onRun={() => alert(`Deploying pipeline "${pipelineName}" to Member 1 backend.`)}
        onValidate={() => alert('Validation will be active in Step 7.')}
        onExportJson={() => alert(JSON.stringify({ pipelineName, nodes, edges }, null, 2))}
      />

      {/* 2. Main 3-Pane Body */}
      <div className="graph-builder-workspace">
        {/* Left Sidebar: Node Library */}
        <LeftSidebar
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed((prev) => !prev)}
        />

        {/* Center: Graph Canvas Viewport */}
        <main className="graph-builder-center">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            selectedNodeId={selectedNodeId}
            onDeleteSelected={handleDeleteSelected}
            onResetCanvas={handleResetCanvas}
          />
        </main>

        {/* Right Sidebar: Properties Panel */}
        <RightSidebar
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed((prev) => !prev)}
          selectedNode={selectedNode}
          onDeleteNode={handleDeleteSelected}
        />
      </div>
    </div>
  );
}

export default function GraphBuilderPage() {
  return (
    <ReactFlowProvider>
      <GraphBuilderInner />
    </ReactFlowProvider>
  );
}
```

##### `src/pages/GraphBuilderPage.css`
```css
.graph-builder-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary, #0a0e17);
}

.graph-builder-workspace {
  display: flex;
  flex: 1;
  height: calc(100vh - var(--header-height, 56px));
  position: relative;
  overflow: hidden;
}

.graph-builder-center {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
}
```

##### Updated `src/App.jsx`
```javascript
import React from 'react';
import GraphBuilderPage from './pages/GraphBuilderPage.jsx';

export default function App() {
  return <GraphBuilderPage />;
}
```

---

#### 2.3 Verification Checklist for Step 2
- [ ] Run `npm run dev` and confirm the 3-section layout renders seamlessly.
- [ ] Left sidebar expands and collapses cleanly via the toggle chevron button.
- [ ] Right sidebar toggles between empty selection state and selected node details when clicking nodes.
- [ ] Floating canvas toolbar controls (Zoom In, Zoom Out, Fit View, and Delete Selected) operate smoothly.
- [ ] Responsive breakpoint gracefully handles narrower viewports by hiding non-essential navbar badges.
- [ ] Commit Day 2 changes with message: `feat(layout): implement Step 2 three-pane graph builder interface with dark IIoT theme and canvas controls` (exceeding 50+ characters).

### 3️⃣ Step 3: Draggable Node Library
- Create an expandable/collapsible accordion catalog with 4 distinct categories:
  1. **Data Sources:** Turbine Sensor, Temperature Sensor, Pressure Sensor, Vibration Sensor.
  2. **Processing:** Moving Average, Minimum/Maximum, Math Operation, Filter.
  3. **Conditions:** Threshold, Greater Than, Less Than, AND/OR.
  4. **Actions:** SMS Alert, Email Alert, Webhook, Log Event.
- Implement HTML5 drag-and-drop (`onDragStart`, `dataTransfer.setData('application/reactflow', type)`).

### 4️⃣ Step 4: React Flow Canvas
- Wire up `@xyflow/react` `<ReactFlow />` component inside `GraphCanvas.jsx`.
- Implement `onDrop`, `onDragOver`, `onNodesChange`, `onEdgesChange`, and `onConnect`.
- Add interactive controls:
  - Zoom In/Out, Fit View, and Canvas Panning.
  - Connection arrows to indicate pipeline data flow direction.
  - Friendly empty-state banner when no nodes exist on the canvas.
- Guarantee unique node ID generation (e.g., `node_${Date.now()}_${random}`).

### 5️⃣ Step 5: Custom Node Components
- Design and register all 16 custom nodes in `nodeTypes.js`.
- Each node includes:
  - Custom category color coding & border accents.
  - Distinct iconography and descriptive sub-labels.
  - Handle configuration:
    - **Data Sources:** Source Handle (Right) only.
    - **Processing & Conditions:** Target Handle (Left) and Source Handle (Right).
    - **Actions:** Target Handle (Left) only.
  - Focus and selected-state glowing highlights.

### 6️⃣ Step 6: Dynamic Properties Panel
- Inspect the active selected node via `useOnSelectionChange` or `selectedNode` state.
- Render dynamic configuration fields based on node type:
  - *Turbine Sensor:* Sensor ID, Polling Interval (ms), Unit.
  - *Moving Average:* Window Size (samples), Target Field, Output Field.
  - *Threshold:* Comparison Operator (`>`, `<`, `==`), Threshold Value, Unit.
  - *SMS Alert:* Recipient Number, Alert Template, Severity.
- Sync property edits directly back into the node's `data` payload.

### 7️⃣ Step 7: Graph Validation Engine
- Enforce topological and functional pipeline rules:
  1. Graph must contain at least one node.
  2. All mandatory configuration inputs must be filled.
  3. Pipelines must begin with a **Data Source** node.
  4. Processing and condition nodes require valid incoming connections.
  5. Action nodes require at least one incoming connection.
  6. Prevent invalid connections (e.g., source-to-source, action-to-source).
  7. Prevent cyclic and self-referencing connections.
  8. Highlight disconnected/orphan nodes.
- Guard the **Run** button to remain disabled while validation errors exist.

### 8️⃣ Step 8: Save & JSON Export
- Provide one-click serialization conforming to Member 1's backend requirements.
- Add UI actions:
  - **Show JSON Modal:** Inspect the formatted JSON.
  - **Copy JSON:** Quick copy to clipboard.
  - **Download JSON:** Save as `pipeline_<name>.json`.
- Automatic pre-save validation checks.

### 9️⃣ Step 9: Backend API Integration Prep
- Abstract API interaction into `src/services/pipelineApi.js`.
- Expose methods:
  - `submitPipeline(pipelineJson)`
  - `savePipeline(pipelineJson)`
  - `fetchPipeline(pipelineId)`
- Read endpoints from `import.meta.env.VITE_BACKEND_API_URL`.
- Handle loading spinners, toast alerts, and connection error states cleanly.

### 🔟 Step 10: Testing, Polish & Quality Review
- Verify end-to-end user workflows:
  - Drag from library → Drop to canvas → Connect handles → Configure in panel → Validate → Export JSON.
- Audit React Flow handle alignment and line rendering.
- Eliminate duplicate re-renders and clean up warnings in the developer console.

---

## 📊 Pipeline JSON Specification (Member 1 Hand-off)

The exported JSON is formatted specifically for **Member 1's RxJS stream compiler**:

```json
{
  "pipelineId": "pipe_098124",
  "name": "Turbine Overheat Detection Pipeline",
  "version": "1.0.0",
  "createdAt": "2026-11-12T18:30:00.000Z",
  "nodes": [
    {
      "id": "node_source_1",
      "type": "turbineSensor",
      "category": "dataSource",
      "position": { "x": 100, "y": 200 },
      "data": {
        "label": "Turbine Sensor",
        "sensorId": "TURBINE-UNIT-4B",
        "samplingRateMs": 1000,
        "metric": "temperature"
      }
    },
    {
      "id": "node_proc_1",
      "type": "movingAverage",
      "category": "processing",
      "position": { "x": 400, "y": 200 },
      "data": {
        "label": "Moving Average",
        "windowSize": 10,
        "inputField": "temperature",
        "outputField": "avg_temperature"
      }
    },
    {
      "id": "node_cond_1",
      "type": "threshold",
      "category": "condition",
      "position": { "x": 700, "y": 200 },
      "data": {
        "label": "Threshold",
        "operator": ">",
        "thresholdValue": 85.0,
        "unit": "°C"
      }
    },
    {
      "id": "node_action_1",
      "type": "smsAlert",
      "category": "action",
      "position": { "x": 1000, "y": 200 },
      "data": {
        "label": "SMS Alert",
        "phoneNumber": "+1-555-0199",
        "message": "Critical Alert: Turbine 4B Temperature exceeds 85°C!"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1_2",
      "source": "node_source_1",
      "target": "node_proc_1"
    },
    {
      "id": "edge_2_3",
      "source": "node_proc_1",
      "target": "node_cond_1"
    },
    {
      "id": "edge_3_4",
      "source": "node_cond_1",
      "target": "node_action_1"
    }
  ]
}
```

---

## 🤝 Team Interface & Integration Checklist

Before connecting frontend to backend, confirm the following with team members:

| Team Member | Domain | Interface Requirement |
| :--- | :--- | :--- |
| **Member 1** | Backend RxJS Compiler | Expected endpoint route (e.g., `POST /api/pipelines/compile`) and execution response shape. |
| **Member 2** | MongoDB & Storage | Schema validation constraints, pipeline ID format, and CRUD endpoints (`GET/POST /api/pipelines`). |
| **Member 4** | Dashboard & Alerts | Node telemetry metadata naming conventions so visual components align with alerts. |

---

## 🚀 Getting Started

When you are ready to implement:
1. Run the prompt for **Step 1** in your AI assistant to generate the baseline project.
2. Verify that `npm run dev` launches the empty development shell.
3. Advance through Steps 2 through 10 one at a time.

