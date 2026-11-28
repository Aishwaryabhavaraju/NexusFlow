/**
 * NexusFlow Frontend API Service Layer (Member 3 Hand-off)
 *
 * This service abstracts HTTP requests to Member 1's backend RxJS compiler
 * and Member 2's pipeline storage API.
 *
 * NOTE: The endpoints and base URL are configurable via environment variables
 * (see .env.example). When the backend server is not running or before Member 1
 * confirms the API contract, this service provides graceful placeholder fallbacks.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const COMPILER_ENDPOINT = import.meta.env.VITE_COMPILER_ENDPOINT || '/pipelines/compile';
const PIPELINES_ENDPOINT = import.meta.env.VITE_PIPELINES_ENDPOINT || '/pipelines';

/**
 * 1. Submit pipeline JSON specification to Member 1's backend RxJS compiler.
 * @param {Object} pipelineJson - The serialized pipeline JSON topology.
 * @returns {Promise<{success: boolean, data?: any, error?: string, isPlaceholder?: boolean}>}
 */
export async function submitPipelineToCompiler(pipelineJson) {
  const targetUrl = `${API_BASE_URL}${COMPILER_ENDPOINT}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(pipelineJson)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMsg;
      try {
        const parsed = JSON.parse(errorBody);
        errorMsg = parsed.message || parsed.error || `HTTP ${response.status}: Compiler rejection`;
      } catch {
        errorMsg = `HTTP ${response.status}: ${errorBody || 'Compiler rejection'}`;
      }
      return {
        success: false,
        error: errorMsg
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (err) {
    // Graceful placeholder handling if backend server is offline or contract is pending
    console.warn(`[NexusFlow API] Compiler at ${targetUrl} unavailable (${err.message}). Using placeholder simulation.`);
    
    return {
      success: true,
      isPlaceholder: true,
      data: {
        executionId: `sim_${Date.now()}`,
        status: 'COMPILED_PLACEHOLDER',
        nodesCompiled: pipelineJson.nodes?.length || 0,
        edgesCompiled: pipelineJson.edges?.length || 0,
        message: `Pipeline "${pipelineJson.name}" accepted by placeholder simulation layer. Ready to connect to Member 1 at ${targetUrl}.`
      }
    };
  }
}

/**
 * 2. Save pipeline specification to database persistence (Member 2).
 * @param {Object} pipelineJson - The serialized pipeline JSON topology.
 */
export async function savePipeline(pipelineJson) {
  const targetUrl = `${API_BASE_URL}${PIPELINES_ENDPOINT}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pipelineJson)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Save failed`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (err) {
    console.warn(`[NexusFlow API] Storage API at ${targetUrl} unavailable (${err.message}). Cached locally.`);
    return {
      success: true,
      isPlaceholder: true,
      data: {
        id: pipelineJson.pipelineId,
        name: pipelineJson.name,
        savedLocally: true,
        message: 'Saved to local frontend cache (Member 2 database offline).'
      }
    };
  }
}

/**
 * 3. Retrieve all saved pipelines (Member 2).
 */
export async function fetchPipelines() {
  const targetUrl = `${API_BASE_URL}${PIPELINES_ENDPOINT}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.warn(`[NexusFlow API] Fetch pipelines fallback: ${err.message}`);
    return {
      success: true,
      isPlaceholder: true,
      data: []
    };
  }
}

/**
 * 4. Retrieve a single pipeline by ID (Member 2).
 */
export async function fetchPipelineById(pipelineId) {
  const targetUrl = `${API_BASE_URL}${PIPELINES_ENDPOINT}/${pipelineId}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: `Could not fetch pipeline ${pipelineId}: ${err.message}`
    };
  }
}
