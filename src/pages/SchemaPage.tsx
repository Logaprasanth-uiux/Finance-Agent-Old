import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import FilterSection from '../components/schema/FilterSection';
import TabBar from '../components/schema/TabBar';
import ContainerCard from '../components/schema/ContainerCard';

interface Tab {
  id: string;
  name: string;
}

interface Field {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface Container {
  id: string;
  title: string;
  isCollapsed: boolean;
  fields: Field[];
}

export const SchemaPage: React.FC = () => {
  // Named placeholder business tabs per UX refinement 1
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'General Information' },
    { id: '2', name: 'Vendor Information' },
    { id: '3', name: 'Approval Workflow' },
  ]);
  
  const [activeTabId, setActiveTabId] = useState<string>('1');

  // Maintain separate list of Containers & Fields per tab in state with realistic business value placeholders
  const [tabContainers, setTabContainers] = useState<Record<string, Container[]>>({
    '1': [
      {
        id: 'c1',
        title: 'Bill Workflow Information',
        isCollapsed: false,
        fields: [
          { id: 'f1', name: 'Organization Name', type: 'Select', value: 'XYZ Company' },
          { id: 'f2', name: 'Organization ID', type: 'Input', value: 'ORG-001' },
          { id: 'f3', name: 'Status', type: 'Input', value: 'Active' },
        ]
      }
    ],
    '2': [
      {
        id: 'c2',
        title: 'Vendor Details',
        isCollapsed: false,
        fields: [
          { id: 'f4', name: 'Vendor Name', type: 'Input', value: 'Acme Corp' },
          { id: 'f5', name: 'Tax ID', type: 'Input', value: 'TX-998822' },
          { id: 'f6', name: 'Upload Mode', type: 'Select', value: 'Manual' }
        ]
      }
    ],
    '3': [
      {
        id: 'c3',
        title: 'Approval Information',
        isCollapsed: false,
        fields: [
          { id: 'f7', name: 'Approver Role', type: 'Select', value: 'Finance Manager' },
          { id: 'f8', name: 'Approval Threshold', type: 'Input', value: '$10,000' }
        ]
      }
    ]
  });

  const [isAddingContainer, setIsAddingContainer] = useState<boolean>(false);
  const [newContainerTitle, setNewContainerTitle] = useState<string>('');
  const containerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingContainer && containerInputRef.current) {
      containerInputRef.current.focus();
    }
  }, [isAddingContainer]);

  const handleAddTab = (name: string) => {
    const newTabId = Date.now().toString();
    const newTab = { id: newTabId, name };
    setTabs([...tabs, newTab]);
    setTabContainers(prev => ({
      ...prev,
      [newTabId]: []
    }));
    setActiveTabId(newTabId);
  };

  const handleRenameTab = (tabId: string, newName: string) => {
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, name: newName } : t));
  };

  const handleToggleCollapse = (containerId: string) => {
    setTabContainers(prev => {
      const activeContainers = prev[activeTabId] || [];
      const updated = activeContainers.map(c => 
        c.id === containerId ? { ...c, isCollapsed: !c.isCollapsed } : c
      );
      return {
        ...prev,
        [activeTabId]: updated
      };
    });
  };

  const handleAddField = (containerId: string, name: string, type: string, value: string) => {
    setTabContainers(prev => {
      const activeContainers = prev[activeTabId] || [];
      const updated = activeContainers.map(c => {
        if (c.id === containerId) {
          const newField = { id: Date.now().toString(), name, type, value };
          return { ...c, fields: [...c.fields, newField] };
        }
        return c;
      });
      return {
        ...prev,
        [activeTabId]: updated
      };
    });
  };

  const handleEditField = (containerId: string, fieldId: string, name: string, value: string) => {
    setTabContainers(prev => {
      const activeContainers = prev[activeTabId] || [];
      const updated = activeContainers.map(c => {
        if (c.id === containerId) {
          const updatedFields = c.fields.map(f => 
            f.id === fieldId ? { ...f, name, value } : f
          );
          return { ...c, fields: updatedFields };
        }
        return c;
      });
      return {
        ...prev,
        [activeTabId]: updated
      };
    });
  };

  const handleRenameContainer = (containerId: string, newTitle: string) => {
    setTabContainers(prev => {
      const activeContainers = prev[activeTabId] || [];
      const updated = activeContainers.map(c => 
        c.id === containerId ? { ...c, title: newTitle } : c
      );
      return {
        ...prev,
        [activeTabId]: updated
      };
    });
  };

  const handleStartAddContainer = () => {
    setIsAddingContainer(true);
    setNewContainerTitle('');
  };

  const handleSaveContainer = () => {
    const trimmedTitle = newContainerTitle.trim();
    if (trimmedTitle) {
      const newContainer: Container = {
        id: Date.now().toString(),
        title: trimmedTitle,
        isCollapsed: false, // Automatically expands upon creation
        fields: []
      };
      
      setTabContainers(prev => {
        const activeContainers = prev[activeTabId] || [];
        return {
          ...prev,
          [activeTabId]: [...activeContainers, newContainer]
        };
      });
      setIsAddingContainer(false);
    } else {
      handleCancelContainer();
    }
  };

  const handleCancelContainer = () => {
    setIsAddingContainer(false);
    setNewContainerTitle('');
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveContainer();
    } else if (e.key === 'Escape') {
      handleCancelContainer();
    }
  };

  const currentContainers = tabContainers[activeTabId] || [];

  return (
    <div className="schema-page">
      {/* Filter Section */}
      <FilterSection />

      {/* Tab Bar Strip */}
      <TabBar 
        tabs={tabs} 
        activeTabId={activeTabId} 
        setActiveTabId={setActiveTabId} 
        onAddTab={handleAddTab}
        onRenameTab={handleRenameTab}
      />

      {/* Container List Workspace */}
      <div className="schema-workspace-container">
        <div className="schema-containers-list">
          {currentContainers.map((container) => (
            <ContainerCard
              key={container.id}
              id={container.id}
              title={container.title}
              isCollapsed={container.isCollapsed}
              fields={container.fields}
              onToggleCollapse={handleToggleCollapse}
              onAddField={handleAddField}
              onEditField={handleEditField}
              onRenameContainer={handleRenameContainer}
            />
          ))}

          {currentContainers.length === 0 && !isAddingContainer && (
            <div className="empty-containers-message">
              No containers inside this tab. Click "+ Add Container" to create one.
            </div>
          )}

          {/* Inline Add Container Form */}
          {isAddingContainer ? (
            <div className="inline-container-editor">
              <label className="editor-label">Container Name</label>
              <div className="inline-container-row">
                <input
                  ref={containerInputRef}
                  type="text"
                  value={newContainerTitle}
                  onChange={(e) => setNewContainerTitle(e.target.value)}
                  onKeyDown={handleContainerKeyDown}
                  placeholder="Enter Container Title..."
                  className="container-editor-input"
                />
                <button onClick={handleSaveContainer} className="editor-action-btn save" title="Save Container">
                  <Check size={16} />
                </button>
                <button onClick={handleCancelContainer} className="editor-action-btn cancel" title="Cancel">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleStartAddContainer} 
              className="schema-add-container-btn"
              type="button"
            >
              <Plus size={16} />
              <span>Add Container</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaPage;
