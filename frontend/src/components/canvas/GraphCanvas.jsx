import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  reconnectEdge,
  useReactFlow,
  ReactFlowProvider,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../nodes/nodeTypes.js';
import EmptyCanvasState from './EmptyCanvasState.jsx';
import Button from '../common/Button.jsx';
import { Maximize2, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import { isValidConnection } from '../../utils/graphValidator.js';
import './GraphCanvas.css';

function FlowCanvasInternal({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  selectedNodeId,
  onNodeSelect,
  onAddNodeAtPosition,
  onDeleteNode,
  onLoadDemo,
  onClearCanvas
}) {
  const reactFlowWrapper = useRef(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  const checkValidConnection = useCallback(
    (connection) => isValidConnection(connection, nodes),
    [nodes]
  );

  const onConnect = useCallback(
    (params) => {
      if (!isValidConnection(params, nodes)) {
        return;
      }
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#38bdf8', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#38bdf8',
              width: 16,
              height: 16
            }
          },
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow-type');
      const nodeDataStr = event.dataTransfer.getData('application/reactflow-node');

      if (!nodeType) return;

      const nodeDef = nodeDataStr ? JSON.parse(nodeDataStr) : null;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      onAddNodeAtPosition(nodeType, nodeDef, position);
    },
    [screenToFlowPosition, onAddNodeAtPosition]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedEdgeId(null);
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onEdgeClick = useCallback(
    (_, edge) => {
      setSelectedEdgeId(edge.id);
      onNodeSelect(null);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
    setSelectedEdgeId(null);
  }, [onNodeSelect]);

  const handleDeleteActive = useCallback(() => {
    if (selectedNodeId) {
      onDeleteNode(selectedNodeId);
    } else if (selectedEdgeId) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    } else {
      onClearCanvas();
    }
  }, [selectedNodeId, selectedEdgeId, onDeleteNode, setEdges, onClearCanvas]);

  return (
    <div className="nf-canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        isValidConnection={checkValidConnection}
        edgesReconnectable={true}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid={true}
        snapGrid={[15, 15]}
        nodesDraggable={true}
        connectionLineStyle={{ stroke: '#38bdf8', strokeWidth: 2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#38bdf8', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#38bdf8'
          }
        }}
      >
        <Background lineColor="#1e293b" gap={20} size={1} />
        <Controls className="nf-canvas-controls" showInteractive={false} />
        <MiniMap
          nodeStrokeColor="#38bdf8"
          nodeColor="#1e293b"
          nodeBorderRadius={4}
          maskColor="rgba(10, 14, 23, 0.7)"
          className="nf-canvas-minimap"
        />

        {nodes.length > 0 && (
          <Panel position="top-right" className="nf-canvas-toolbar-panel">
            <Button
              variant="secondary"
              size="sm"
              icon={ZoomIn}
              onClick={() => zoomIn({ duration: 300 })}
              title="Zoom In"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={ZoomOut}
              onClick={() => zoomOut({ duration: 300 })}
              title="Zoom Out"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={Maximize2}
              onClick={() => fitView({ padding: 0.2, duration: 400 })}
              title="Fit View"
            >
              Fit
            </Button>
            {selectedNodeId ? (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleDeleteActive}
                title="Delete Selected Node (or press Del/Backspace)"
              >
                Delete Node
              </Button>
            ) : selectedEdgeId ? (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleDeleteActive}
                title="Disconnect Selected Edge (or press Del/Backspace)"
              >
                Disconnect Edge
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={onClearCanvas}
                title="Clear all nodes"
              >
                Clear
              </Button>
            )}
          </Panel>
        )}
      </ReactFlow>

      {nodes.length === 0 && (
        <EmptyCanvasState onLoadDemo={onLoadDemo} />
      )}
    </div>
  );
}

export default function GraphCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
}
