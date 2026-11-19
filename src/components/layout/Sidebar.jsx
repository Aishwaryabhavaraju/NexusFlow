import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({
  title,
  icon: Icon,
  position = 'left',
  isCollapsed = false,
  onToggleCollapse,
  badge,
  children
}) {
  return (
    <aside
      className={`nf-sidebar nf-sidebar--${position} ${
        isCollapsed ? 'nf-sidebar--collapsed' : ''
      }`}
    >
      <div className="nf-sidebar__header">
        <div className="nf-sidebar__title-wrap">
          {Icon && <Icon className="nf-sidebar__icon" size={16} />}
          {!isCollapsed && <span className="nf-sidebar__title">{title}</span>}
          {!isCollapsed && badge && <span className="nf-sidebar__badge">{badge}</span>}
        </div>

        {onToggleCollapse && (
          <button
            className="nf-sidebar__collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
            aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
          >
            {position === 'left' ? (
              isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
            ) : (
              isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
            )}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="nf-sidebar__content">
          {children}
        </div>
      )}
    </aside>
  );
}
