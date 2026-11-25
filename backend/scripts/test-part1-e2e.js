const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const app = require("../app");
const http = require("http");

let server;
const PORT = 5099;

const runE2ETests = async () => {
  console.log("===============================================================");
  console.log("   NEXUSFLOW PART 1 (DAYS 1-15) COMPLETE E2E VERIFICATION     ");
  console.log("===============================================================\n");

  try {
    await connectDB();

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`[E2E] Test HTTP server listening on http://127.0.0.1:${PORT}`);

    const baseURL = `http://127.0.0.1:${PORT}/api`;

    // 1. Register User
    console.log("\n--> TEST 1: User Registration (POST /api/auth/register)");
    const registerRes = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Lead Architect",
        email: `architect-${Date.now()}@nexusflow.io`,
        password: "MasterSecureKey2026!",
        role: "admin"
      })
    });
    const registerData = await registerRes.json();
    if (!registerRes.ok || !registerData.data?.token) {
      throw new Error(`Register failed: ${JSON.stringify(registerData)}`);
    }
    const token = registerData.data.token;
    console.log(`    Status: ${registerRes.status} | User ID: ${registerData.data.user.id} | Token generated.`);

    // 2. Protected Route Authentication
    console.log("\n--> TEST 2: Protected Identity Verification (GET /api/auth/me)");
    const meRes = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    if (!meRes.ok || !meData.data?.user) {
      throw new Error(`Auth me check failed: ${JSON.stringify(meData)}`);
    }
    console.log(`    Status: ${meRes.status} | Authenticated as: ${meData.data.user.name} (${meData.data.user.role})`);

    // 3. Create & Serialize Visual Graph in MongoDB
    console.log("\n--> TEST 3: Create Visual Workflow (POST /api/graphs)");
    const sampleGraph = {
      name: "Industrial Turbine Cooling Pipeline",
      description: "Moving average filter with temperature threshold alert",
      config: {
        version: "1.0",
        executionMode: "realtime",
        isEnabled: true
      },
      nodes: [
        {
          id: "sensor-1",
          type: "sensor",
          position: { x: 100, y: 150 },
          data: { label: "Turbine Sensor", deviceId: "TURBINE-001", metric: "temperature" }
        },
        {
          id: "filter-1",
          type: "movingAverage",
          position: { x: 350, y: 150 },
          data: { label: "Moving Average", windowSize: 3 }
        },
        {
          id: "threshold-1",
          type: "threshold",
          position: { x: 600, y: 150 },
          data: { label: "Threshold", operator: "gte", value: 80 }
        },
        {
          id: "action-1",
          type: "actionTrigger",
          position: { x: 850, y: 150 },
          data: { label: "Alert Trigger", actionType: "alert", message: "Critical turbine temperature detected!" }
        }
      ],
      edges: [
        { id: "e1-2", source: "sensor-1", target: "filter-1" },
        { id: "e2-3", source: "filter-1", target: "threshold-1" },
        { id: "e3-4", source: "threshold-1", target: "action-1" }
      ]
    };

    const graphRes = await fetch(`${baseURL}/graphs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sampleGraph)
    });
    const graphData = await graphRes.json();
    if (!graphRes.ok || !graphData.data?._id) {
      throw new Error(`Graph create failed: ${JSON.stringify(graphData)}`);
    }
    const createdGraphId = graphData.data._id;
    console.log(`    Status: ${graphRes.status} | Workflow ID: ${createdGraphId} | Nodes: ${graphData.data.nodes.length}`);

    // 4. Validate Graph via API
    console.log("\n--> TEST 4: Graph Validation API (POST /api/graphs/validate)");
    const valRes = await fetch(`${baseURL}/graphs/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sampleGraph)
    });
    const valData = await valRes.json();
    if (!valRes.ok || !valData.success) {
      throw new Error(`Validation API failed: ${JSON.stringify(valData)}`);
    }
    console.log(`    Status: ${valRes.status} | Validation: ${valData.message}`);

    // 5. Ingest Single Telemetry Reading into Time-Series
    console.log("\n--> TEST 5: Single Telemetry Ingestion (POST /api/telemetry)");
    const singleTelemRes = await fetch(`${baseURL}/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: "TURBINE-001",
        metric: "temperature",
        value: 84.6,
        timestamp: new Date().toISOString()
      })
    });
    const singleTelemData = await singleTelemRes.json();
    if (!singleTelemRes.ok) {
      throw new Error(`Single telemetry ingestion failed: ${JSON.stringify(singleTelemData)}`);
    }
    console.log(`    Status: ${singleTelemRes.status} | Ingested: ${singleTelemData.data.deviceId} = ${singleTelemData.data.value}`);

    // 6. Bulk Telemetry Ingestion into Time-Series
    console.log("\n--> TEST 6: Bulk Telemetry Ingestion (POST /api/telemetry/bulk)");
    const bulkPayload = {
      readings: [
        { deviceId: "TURBINE-001", metric: "temperature", value: 87.2 },
        { deviceId: "PUMP-002", metric: "pressure", value: 122.5 },
        { deviceId: "BOILER-003", metric: "temperature", value: 98.4 },
        { deviceId: "VALVE-004", metric: "flowRate", value: 45.0 }
      ]
    };
    const bulkRes = await fetch(`${baseURL}/telemetry/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload)
    });
    const bulkData = await bulkRes.json();
    if (!bulkRes.ok || bulkData.count !== 4) {
      throw new Error(`Bulk ingestion failed: ${JSON.stringify(bulkData)}`);
    }
    console.log(`    Status: ${bulkRes.status} | Ingested count: ${bulkData.count}`);

    // 7. Mock Telemetry Generator
    console.log("\n--> TEST 7: Mock Telemetry Generator (POST /api/telemetry/mock)");
    const mockRes = await fetch(`${baseURL}/telemetry/mock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 12 })
    });
    const mockData = await mockRes.json();
    if (!mockRes.ok || mockData.count !== 12) {
      throw new Error(`Mock generator failed: ${JSON.stringify(mockData)}`);
    }
    console.log(`    Status: ${mockRes.status} | Generated: ${mockData.count} readings`);

    // 8. Query Telemetry with Filters
    console.log("\n--> TEST 8: Query Filtered Telemetry (GET /api/telemetry?deviceId=TURBINE-001)");
    const queryRes = await fetch(`${baseURL}/telemetry?deviceId=TURBINE-001&limit=5`);
    const queryData = await queryRes.json();
    if (!queryRes.ok) {
      throw new Error(`Telemetry query failed: ${JSON.stringify(queryData)}`);
    }
    console.log(`    Status: ${queryRes.status} | Returned ${queryData.count} readings | Total matching: ${queryData.total}`);

    // 9. Dashboard Aggregation API
    console.log("\n--> TEST 9: Dashboard Aggregated Stats (GET /api/dashboard/stats)");
    const dashRes = await fetch(`${baseURL}/dashboard/stats`);
    const dashData = await dashRes.json();
    if (!dashRes.ok) {
      throw new Error(`Dashboard stats failed: ${JSON.stringify(dashData)}`);
    }
    console.log(`    Status: ${dashRes.status} | Total Workflows: ${dashData.data.totalWorkflows} | Devices: ${dashData.data.connectedDevices} | Total Ingested: ${dashData.data.totalReadings}`);

    // 10. Native MongoDB Time-Series Verification
    console.log("\n--> TEST 10: MongoDB Native Time-Series Meta Inspection");
    const collections = await mongoose.connection.db.listCollections({ name: "telemetries" }).toArray();
    const coll = collections[0];
    console.log(`    Collection Name: ${coll.name} | Type: ${coll.type}`);
    if (coll.type !== "timeseries") {
      throw new Error(`Collection is of type '${coll.type}', expected 'timeseries'`);
    }
    console.log("    [PASS] Verified native MongoDB Time-Series collection.");

    console.log("\n===============================================================");
    console.log(">>> ALL PART 1 (DAYS 1-15) E2E VERIFICATIONS PASSED 100%! <<<");
    console.log("===============================================================\n");
  } catch (error) {
    console.error("\n[FAIL] E2E Verification Error:", error.message);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    console.log("Server and database connection closed cleanly.");
  }
};

runE2ETests();
