import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  onAddTab: (name: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, setActiveTabId, onAddTab }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>('');
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [tabs, isAdding]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (tabsListRef.current) {
      const activeEl = tabsListRef.current.querySelector('.schema-tab.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
    const timer = setTimeout(checkScroll, 300);
    return () => clearTimeout(timer);
  }, [activeTabId, tabs]);

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewTabName('');
    setTimeout(() => {
      if (tabsListRef.current) {
        tabsListRef.current.scrollLeft = tabsListRef.current.scrollWidth;
      }
    }, 50);
  };

  const handleSave = () => {
    const trimmedName = newTabName.trim();
    if (trimmedName) {
      onAddTab(trimmedName);
      setIsAdding(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTabName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const scrollLeftAction = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const scrollRightAction = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  return (
    <div className="schema-tabs-container">
      <div className="schema-tabs-navigation">
        <button 
          onClick={scrollLeftAction} 
          className={`schema-scroll-btn ${canScrollLeft ? 'visible' : ''}`}
          disabled={!canScrollLeft}
          type="button"
          aria-label="Scroll Tabs Left"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="schema-tabs-list" ref={tabsListRef} onScroll={checkScroll}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`schema-tab ${activeTabId === tab.id ? 'active' : ''}`}
              title={tab.name}
            >
              {tab.name}
            </button>
          ))}
          
          {isAdding && (
            <div className="schema-tab-edit-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="New Tab"
                className="schema-tab-input"
                maxLength={20}
              />
              <button onClick={handleSave} className="schema-tab-btn-action save" title="Save Tab">
                <Check size={14} />
              </button>
              <button onClick={handleCancel} className="schema-tab-btn-action cancel" title="Cancel">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={scrollRightAction} 
          className={`schema-scroll-btn ${canScrollRight ? 'visible' : ''}`}
          disabled={!canScrollRight}
          type="button"
          aria-label="Scroll Tabs Right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="schema-tabs-actions">
        <button 
          onClick={handleStartAdd} 
          className="schema-add-tab-btn"
          disabled={isAdding}
        >
          <Plus size={16} />
          <span>Add Tab</span>
        </button>
      </div>
    </div>
  );
};

export default TabBar;
