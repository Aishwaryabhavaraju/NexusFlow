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

## 📋 10-Step Development Roadmap

Execute each step sequentially in your AI coding assistant (Cursor, GitHub Copilot, or ChatGPT). Complete and verify each phase before advancing.

```
Member 3 Progress: [ 0 / 10 Completed ]
```

### 1️⃣ Step 1: Project Setup & Initialization
- Initialize React with Vite using JavaScript:
  ```bash
  npm create vite@latest nexusflow-frontend -- --template react
  cd nexusflow-frontend
  npm install @xyflow/react lucide-react
  npm run dev
  ```
- Configure base design variables (dark theme: `#0f172a`, `#1e293b`, `#38bdf8`, `#10b981`, `#f59e0b`, `#ef4444`).
- Setup layout wrappers and CSS resets.

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

