import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export default function NodeCategory({
  category,
  nodes,
  onAddNode,
  defaultExpanded = true
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleDragStart = (e, nodeDef) => {
    e.dataTransfer.setData('application/reactflow-type', nodeDef.type);
    e.dataTransfer.setData('application/reactflow-node', JSON.stringify(nodeDef));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`nf-node-category nf-node-category--${category.id}`}>
      <button
        className="nf-node-category__header"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <div className="nf-node-category__title-wrap">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="nf-node-category__name">{category.name}</span>
        </div>
        <Badge variant={category.badgeVariant} size="sm">
          {nodes.length}
        </Badge>
      </button>

      {isExpanded && (
        <div className="nf-node-category__items">
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="nf-node-item"
                draggable
                onDragStart={(e) => handleDragStart(e, node)}
                title={`${node.description} (Drag onto canvas or click +)`}
              >
                <div className="nf-node-item__left">
                  <div
                    className="nf-node-item__icon-wrap"
                    style={{ color: category.color }}
                  >
                    {Icon && <Icon size={16} />}
                  </div>
                  <div className="nf-node-item__info">
                    <div className="nf-node-item__title">{node.name}</div>
                    <div className="nf-node-item__desc">{node.description}</div>
                  </div>
                </div>

                <button
                  className="nf-node-item__add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNode(node);
                  }}
                  title="Add node to canvas"
                  aria-label={`Add ${node.name}`}
                  type="button"
                >
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
