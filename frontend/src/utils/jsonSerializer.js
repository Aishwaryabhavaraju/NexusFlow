import { getNodeDefinition } from './nodeCatalog.js';

/**
 * Serializes the React Flow visual graph into a structured JSON pipeline specification
 * formatted specifically for Member 1's backend RxJS stream compiler.
 */
export function serializePipelineToJSON(pipelineName, nodes = [], edges = []) {
  return {
    pipelineId: `pipe_${Date.now().toString(36)}`,
    name: pipelineName || 'Untitled IIoT Pipeline',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    schemaVersion: 'nexusflow-stream-v1',
    topology: {
      nodeCount: nodes.length,
      edgeCount: edges.length
    },
    nodes: nodes.map((node) => {
      const def = getNodeDefinition(node.type) || {};
      return {
        id: node.id,
        type: node.type,
        category: def.category || 'general',
        position: {
          x: Math.round(node.position.x),
          y: Math.round(node.position.y)
        },
        data: {
          ...node.data
        }
      };
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      sourceHandle: edge.sourceHandle || null,
      target: edge.target,
      targetHandle: edge.targetHandle || null,
      animated: Boolean(edge.animated)
    })),
    meta: {
      generatedBy: 'NexusFlow Member 3 Visual Graph Builder',
      targetRuntime: 'Member 1 RxJS Compiler Engine',
      isTopologyValid: true
    }
  };
}
