import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Check, X } from 'lucide-react';
import FieldRow from './FieldRow';

interface Field {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface ContainerCardProps {
  id: string;
  title: string;
  isCollapsed: boolean;
  fields: Field[];
  onToggleCollapse: (id: string) => void;
  onAddField: (containerId: string, name: string, type: string, value: string) => void;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({
  id,
  title,
  isCollapsed,
  fields,
  onToggleCollapse,
  onAddField,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('Input');
  const [fieldValue, setFieldValue] = useState<string>('');
  const fieldInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && fieldInputRef.current) {
      fieldInputRef.current.focus();
    }
  }, [isAdding]);

  const handleStartAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering expand/collapse of the container card itself
    setIsAdding(true);
    setFieldName('');
    setFieldType('Input');
    setFieldValue('');
  };

  const handleSave = () => {
    const trimmedName = fieldName.trim();
    const trimmedValue = fieldValue.trim();
    if (trimmedName) {
      // Default value to a sensible default if left blank
      const finalValue = trimmedValue || (
        fieldType === 'Checkbox' ? 'False' : 
        fieldType === 'Date' ? new Date().toISOString().split('T')[0] : 
        '—'
      );
      onAddField(id, trimmedName, fieldType, finalValue);
      setIsAdding(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFieldName('');
    setFieldValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const fieldCount = fields.length;

  return (
    <div className={`container-card ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Header */}
      <div className="container-header" onClick={() => onToggleCollapse(id)}>
        <div className="header-left-side">
          <span className="collapse-icon">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </span>
          <h3 className="container-title">{title}</h3>
        </div>
        
        <div className="header-right-side">
          <span className="field-count">
            {fieldCount} {fieldCount === 1 ? 'Field' : 'Fields'}
          </span>
          {/* Add Field is only shown when container is expanded per UX refinement 2 */}
          {!isCollapsed && !isAdding && (
            <button 
              onClick={handleStartAdd} 
              className="container-add-field-btn"
              type="button"
            >
              <Plus size={14} />
              <span>Add Field</span>
            </button>
          )}
        </div>
      </div>

      {/* Body content */}
      {!isCollapsed && (
        <div className="container-body">
          <div className="fields-list">
            {fields.map((field) => (
              <FieldRow key={field.id} name={field.name} value={field.value} />
            ))}
            
            {fields.length === 0 && !isAdding && (
              <div className="empty-fields-message">
                No fields inside this container. Click "+ Add Field" to get started.
              </div>
            )}
          </div>

          {/* Inline Add Field Form */}
          {isAdding && (
            <div className="inline-field-editor">
              <div className="editor-row">
                <div className="editor-input-group name-group">
                  <label className="editor-label">Field Name</label>
                  <input
                    ref={fieldInputRef}
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Field Name..."
                    className="editor-input"
                  />
                </div>

                <div className="editor-input-group value-group">
                  <label className="editor-label">Default Value</label>
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Value..."
                    className="editor-input"
                  />
                </div>
                
                <div className="editor-input-group type-group">
                  <label className="editor-label">Field Type</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="editor-select"
                  >
                    <option value="Input">Input</option>
                    <option value="Select">Select</option>
                    <option value="Checkbox">Checkbox</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Date">Date</option>
                  </select>
                </div>
                
                <div className="editor-actions">
                  <button onClick={handleSave} className="editor-action-btn save" title="Save Field">
                    <Check size={16} />
                  </button>
                  <button onClick={handleCancel} className="editor-action-btn cancel" title="Cancel">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContainerCard;
