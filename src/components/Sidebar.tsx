import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { navigationConfig } from '../config/navigation';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-agentic">Agentic</span>
        <span className="brand-finance">Finance</span>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {navigationConfig.map((item) => {
            const IconComponent = (Icons as any)[item.iconName] || Icons.HelpCircle;
            return (
              <li key={item.path} className="sidebar-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-content">
                    <IconComponent className="sidebar-icon" size={18} />
                    <span className="sidebar-label">{item.label}</span>
                  </span>
                  {item.hasChevron && (
                    <Icons.ChevronDown className="sidebar-chevron" size={14} />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
