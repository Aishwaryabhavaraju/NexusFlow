import { getNodeDefinition } from './nodeCatalog.js';

/**
 * Validates a connection between two handles before the edge is created.
 * Prevents invalid self-connections, source node inputs, and action node outputs.
 */
export function isValidConnection(connection, nodes = []) {
  const { source, target, sourceHandle, targetHandle } = connection;

  // Rule 7: Prevent self-connections
  if (source === target) {
    return false;
  }

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);

  if (!sourceNode || !targetNode) {
    return false;
  }

  const sourceDef = getNodeDefinition(sourceNode.type) || {};
  const targetDef = getNodeDefinition(targetNode.type) || {};

  // Rule 6: Type compatibility rules
  // 1. Data Sources cannot have incoming connections
  if (targetDef.category === 'sources') {
    return false;
  }

  // 2. Action nodes cannot have outgoing connections
  if (sourceDef.category === 'actions') {
    return false;
  }

  // 3. For AND/OR condition nodes, allow connecting to input-a and input-b handles
  if (targetNode.type === 'andOr' && targetHandle) {
    // Only allow input-a or input-b
    if (targetHandle !== 'input-a' && targetHandle !== 'input-b') {
      return false;
    }
  }

  return true;
}

/**
 * Comprehensive frontend pipeline validator evaluating 10 topological and configuration rules.
 */
export function validatePipelineGraph(nodes = [], edges = []) {
  const errors = [];
  const warnings = [];

  // Rule 1: Pipeline must contain at least one node
  if (!nodes || nodes.length === 0) {
    return {
      isValid: false,
      errors: [
        {
          rule: 'Rule 1: Empty Pipeline',
          message: 'A pipeline must contain at least one node to be valid.',
          severity: 'error'
        }
      ],
      warnings: [],
      stats: { totalNodes: 0, totalEdges: 0, sources: 0, processing: 0, conditions: 0, actions: 0 }
    };
  }

  // Node Degree and Reachability Maps
  const nodeMap = new Map();
  const inDegree = new Map();
  const outDegree = new Map();
  const adjacencyList = new Map();

  let sourceCount = 0;
  let processingCount = 0;
  let conditionCount = 0;
  let actionCount = 0;

  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    outDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);

    const def = getNodeDefinition(node.type) || {};
    if (def.category === 'sources') sourceCount++;
    if (def.category === 'processing') processingCount++;
    if (def.category === 'conditions') conditionCount++;
    if (def.category === 'actions') actionCount++;
  });

  // Calculate degrees and detect edge anomalies
  edges.forEach((edge) => {
    // Rule 7: Detect invalid self-connections
    if (edge.source === edge.target) {
      errors.push({
        rule: 'Rule 7: Self-Connection',
        nodeId: edge.source,
        message: `Node "${nodeMap.get(edge.source)?.data?.label || edge.source}" has an invalid self-connection loop.`,
        severity: 'error'
      });
    }

    if (inDegree.has(edge.target)) {
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    }
    if (outDegree.has(edge.source)) {
      outDegree.set(edge.source, outDegree.get(edge.source) + 1);
    }
    if (adjacencyList.has(edge.source)) {
      adjacencyList.get(edge.source).push(edge.target);
    }

    // Rule 6: Incompatible connection checks
    const srcNode = nodeMap.get(edge.source);
    const tgtNode = nodeMap.get(edge.target);

    if (srcNode && tgtNode) {
      const srcDef = getNodeDefinition(srcNode.type) || {};
      const tgtDef = getNodeDefinition(tgtNode.type) || {};

      if (tgtDef.category === 'sources') {
        errors.push({
          rule: 'Rule 6: Type Incompatibility',
          nodeId: tgtNode.id,
          message: `Data Source "${tgtNode.data?.label || tgtNode.id}" cannot accept incoming connections.`,
          severity: 'error'
        });
      }

      if (srcDef.category === 'actions') {
        errors.push({
          rule: 'Rule 6: Type Incompatibility',
          nodeId: srcNode.id,
          message: `Action node "${srcNode.data?.label || srcNode.id}" is a terminal sink and cannot have outgoing connections.`,
          severity: 'error'
        });
      }
    }
  });

  // Rule 2: Every node must have required configuration
  nodes.forEach((node) => {
    const data = node.data || {};
    const def = getNodeDefinition(node.type) || {};
    const nodeLabel = data.label || node.id;

    // Check Sources
    if (def.category === 'sources') {
      if (!data.unit || data.unit.trim() === '') {
        warnings.push({
          rule: 'Rule 2: Node Configuration',
          nodeId: node.id,
          message: `Source sensor "${nodeLabel}" is missing an engineering measurement unit.`,
          severity: 'warning'
        });
      }
      if (!data.samplingRate || data.samplingRate <= 0) {
        errors.push({
          rule: 'Rule 2: Node Configuration',
          nodeId: node.id,
          message: `Source sensor "${nodeLabel}" must have a positive sampling rate (ms).`,
          severity: 'error'
        });
      }
    }

    // Check Processing
    if (node.type === 'movingAverage' && (!data.windowSize || data.windowSize < 2)) {
      errors.push({
        rule: 'Rule 2: Node Configuration',
        nodeId: node.id,
        message: `Moving Average "${nodeLabel}" requires a sliding window size of at least 2 samples.`,
        severity: 'error'
      });
    }

    if (node.type === 'filter' && (!data.thresholdDelta || data.thresholdDelta <= 0)) {
      warnings.push({
        rule: 'Rule 2: Node Configuration',
        nodeId: node.id,
        message: `Filter node "${nodeLabel}" has a deadband delta of 0 or undefined; jitter will not be suppressed.`,
        severity: 'warning'
      });
    }

    // Check Conditions
    if (node.type === 'threshold' && (data.limit === undefined || data.limit === null || isNaN(data.limit))) {
      errors.push({
        rule: 'Rule 2: Node Configuration',
        nodeId: node.id,
        message: `Threshold node "${nodeLabel}" requires a numeric threshold limit value.`,
        severity: 'error'
      });
    }

    if ((node.type === 'greaterThan' || node.type === 'lessThan') && (data.value === undefined || isNaN(data.value))) {
      errors.push({
        rule: 'Rule 2: Node Configuration',
        nodeId: node.id,
        message: `Comparison node "${nodeLabel}" requires a valid setpoint value.`,
        severity: 'error'
      });
    }

    // Check Actions
    if (node.type === 'smsAlert') {
      const phone = data.phoneNumber || data.recipient;
      if (!phone || phone.trim() === '') {
        errors.push({
          rule: 'Rule 2: Node Configuration',
          nodeId: node.id,
          message: `SMS Alert "${nodeLabel}" is missing a destination phone number.`,
          severity: 'error'
        });
      }
    }

    if (node.type === 'emailAlert') {
      if (!data.recipient || !data.recipient.includes('@')) {
        errors.push({
          rule: 'Rule 2: Node Configuration',
          nodeId: node.id,
          message: `Email Alert "${nodeLabel}" requires a valid recipient email address.`,
          severity: 'error'
        });
      }
    }

    if (node.type === 'webhook') {
      if (!data.endpointUrl || (!data.endpointUrl.startsWith('http://') && !data.endpointUrl.startsWith('https://'))) {
        errors.push({
          rule: 'Rule 2: Node Configuration',
          nodeId: node.id,
          message: `Webhook "${nodeLabel}" requires a valid HTTP or HTTPS endpoint URL.`,
          severity: 'error'
        });
      }
    }
  });

  // Rule 3: Data source must be starting point of pipeline
  if (sourceCount === 0) {
    errors.push({
      rule: 'Rule 3: Missing Source',
      message: 'A pipeline must start with at least one Data Source (e.g. Turbine, Temperature, Pressure, Vibration).',
      severity: 'error'
    });
  }

  // Check that sources do not have incoming connections
  nodes.forEach((node) => {
    const def = getNodeDefinition(node.type) || {};
    if (def.category === 'sources' && (inDegree.get(node.id) || 0) > 0) {
      errors.push({
        rule: 'Rule 3: Source Inflow',
        nodeId: node.id,
        message: `Data Source "${node.data?.label || node.id}" cannot have incoming connections.`,
        severity: 'error'
      });
    }
  });

  // Rule 4: Processing and condition nodes must have valid incoming connections
  nodes.forEach((node) => {
    const def = getNodeDefinition(node.type) || {};
    const inCount = inDegree.get(node.id) || 0;
    const nodeLabel = node.data?.label || node.id;

    if (def.category === 'processing' && inCount === 0) {
      errors.push({
        rule: 'Rule 4: Missing Input',
        nodeId: node.id,
        message: `Processing node "${nodeLabel}" has no incoming connection from an upstream stream.`,
        severity: 'error'
      });
    }

    if (def.category === 'conditions' && inCount === 0) {
      errors.push({
        rule: 'Rule 4: Missing Input',
        nodeId: node.id,
        message: `Condition node "${nodeLabel}" has no incoming stream to evaluate.`,
        severity: 'error'
      });
    }

    if (node.type === 'andOr' && inCount === 1) {
      warnings.push({
        rule: 'Rule 4: Partial Condition',
        nodeId: node.id,
        message: `AND/OR gate "${nodeLabel}" only has 1 input connected; typically requires 2 conditions.`,
        severity: 'warning'
      });
    }
  });

  // Rule 5: Action nodes must have at least one incoming connection
  if (actionCount === 0) {
    warnings.push({
      rule: 'Rule 5: No Actions',
      message: 'No Action node connected. Pipeline will process telemetry but cannot emit alerts or logs.',
      severity: 'warning'
    });
  }

  nodes.forEach((node) => {
    const def = getNodeDefinition(node.type) || {};
    const inCount = inDegree.get(node.id) || 0;
    const outCount = outDegree.get(node.id) || 0;
    const nodeLabel = node.data?.label || node.id;

    if (def.category === 'actions' && inCount === 0) {
      errors.push({
        rule: 'Rule 5: Unreachable Action',
        nodeId: node.id,
        message: `Action node "${nodeLabel}" has no incoming connection and will never be triggered.`,
        severity: 'error'
      });
    }

    if (def.category === 'actions' && outCount > 0) {
      errors.push({
        rule: 'Rule 5: Action Outflow',
        nodeId: node.id,
        message: `Action node "${nodeLabel}" is a sink and cannot have outgoing connections.`,
        severity: 'error'
      });
    }
  });

  // Rule 8: Detect disconnected nodes
  nodes.forEach((node) => {
    const inCount = inDegree.get(node.id) || 0;
    const outCount = outDegree.get(node.id) || 0;
    const nodeLabel = node.data?.label || node.id;

    if (inCount === 0 && outCount === 0) {
      errors.push({
        rule: 'Rule 8: Disconnected Node',
        nodeId: node.id,
        message: `Disconnected node "${nodeLabel}" is isolated on the canvas without any connections.`,
        severity: 'error'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      sources: sourceCount,
      processing: processingCount,
      conditions: conditionCount,
      actions: actionCount
    }
  };
}
