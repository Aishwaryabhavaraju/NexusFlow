
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
> **📊 Current Progress:** `1 / 10 Days Completed` *(Commit on 9 more different days)*  
> **⚠️ Critical Grading Requirement:** Only commits with **50+ changed characters** count towards your score.

| Day | Schedule Window | Planned Step & Feature | Deliverables (Ensure 50+ chars changed) | Status |
| :---: | :---: | :--- | :--- | :---: |
| **Day 1** | Week 1, Day 1 | **Step 1: Setup & Specifications** | React & React Flow workspace initialization, complete `README.md` spec | ✅ **Done (1/10)** |
| **Day 2** | Week 1, Day 2 | **Step 2: Main Graph Builder Layout** | 3-section layout (Top Navbar, Left Library, Center Canvas, Right Panel), CSS | ⏳ Pending |
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
Member 3 Progress: [ 1 / 10 Completed ] - 9 More Different Days to Commit
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

### 2️⃣ Step 2: Main Graph Builder Layout
- Construct a 3-pane layout:
  - **Top Navigation Bar:** NexusFlow branding, pipeline name input, validation trigger, Save & Run actions.
  - **Left Sidebar:** Node Library container.
  - **Center Canvas:** Main React Flow viewport with dot grid background.
  - **Right Sidebar:** Dynamic Properties Panel for node attributes.
- Ensure the layout is responsive with collapsible drawers.

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

