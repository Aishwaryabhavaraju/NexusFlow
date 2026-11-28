import React, { useState, useMemo } from 'react';
import { Search, Layers } from 'lucide-react';
import NodeCategory from './NodeCategory.jsx';
import { NODE_CATEGORIES, NODE_DEFINITIONS } from '../../utils/nodeCatalog.js';
import './NodeLibrary.css';

export default function NodeLibrary({ onAddNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return Object.entries(NODE_CATEGORIES).map(([catKey, category]) => {
      const catNodes = NODE_DEFINITIONS.filter((n) => n.category === catKey);
      const matchingNodes = query
        ? catNodes.filter(
            (n) =>
              n.name.toLowerCase().includes(query) ||
              n.description.toLowerCase().includes(query)
          )
        : catNodes;

      return {
        category,
        nodes: matchingNodes
      };
    }).filter((group) => group.nodes.length > 0);
  }, [searchQuery]);

  return (
    <div className="nf-node-library">
      <div className="nf-node-library__search-box">
        <Search className="nf-node-library__search-icon" size={14} />
        <input
          type="text"
          className="nf-node-library__search-input"
          placeholder="Filter nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="nf-node-library__clear-search"
            onClick={() => setSearchQuery('')}
            type="button"
          >
            ×
          </button>
        )}
      </div>

      <div className="nf-node-library__list">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(({ category, nodes }) => (
            <NodeCategory
              key={category.id}
              category={category}
              nodes={nodes}
              onAddNode={onAddNode}
              defaultExpanded={true}
            />
          ))
        ) : (
          <div className="nf-node-library__empty">
            <Layers size={24} className="nf-node-library__empty-icon" />
            <p>No matching nodes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
