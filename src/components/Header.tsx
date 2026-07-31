import { useLocation } from 'react-router-dom';
import { Menu, Search, ChevronDown, Store, FileText, RefreshCw } from 'lucide-react';
import { navigationConfig } from '../config/navigation';

export const Header = () => {
  const location = useLocation();
  
  // Find current label based on path
  const currentItem = navigationConfig.find(item => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.label : 'Dashboard';

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" aria-label="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <h1 className="header-title">{pageTitle}</h1>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search size={18} className="search-icon-left" />
          <input 
            type="text" 
            placeholder="What would you like to do today?" 
            className="search-input"
            readOnly
          />
          <ChevronDown size={16} className="search-icon-right" />
        </div>
      </div>
      
      <div className="header-right">
        <button className="utility-btn" aria-label="Marketplace">
          <Store size={20} />
        </button>
        <button className="utility-btn" aria-label="Documents">
          <FileText size={20} />
        </button>
        <button className="utility-btn" aria-label="Refresh">
          <RefreshCw size={18} className="spin-hover" />
        </button>
        <div className="user-avatar">
          <span className="user-initials">D</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
