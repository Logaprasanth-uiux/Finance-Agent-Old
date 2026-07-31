import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Check, X, Pencil } from 'lucide-react';
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
  onEditField: (containerId: string, fieldId: string, name: string, value: string) => void;
  onRenameContainer: (id: string, newTitle: string) => void;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({
  id,
  title,
  isCollapsed,
  fields,
  onToggleCollapse,
  onAddField,
  onEditField,
  onRenameContainer,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('Input');
  const [fieldValue, setFieldValue] = useState<string>('');
  const fieldInputRef = useRef<HTMLInputElement>(null);

  // States for renaming the container card title inline
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && fieldInputRef.current) {
      fieldInputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

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

  const handleStartRenameTitle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the collapse state of the container card
    setIsEditingTitle(true);
    setEditTitle(title);
  };

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRenameContainer(id, trimmed);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
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
          {isEditingTitle ? (
            <div className="container-title-edit-wrapper" onClick={(e) => e.stopPropagation()}>
              <input
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="container-title-input"
                maxLength={45}
              />
              <button onClick={handleSaveTitle} className="container-title-btn save" title="Save Title">
                <Check size={12} />
              </button>
              <button onClick={() => setIsEditingTitle(false)} className="container-title-btn cancel" title="Cancel">
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="container-title-wrapper">
              <h3 className="container-title">{title}</h3>
              <button
                className="container-edit-pencil-btn"
                onClick={handleStartRenameTitle}
                title="Rename Container"
                type="button"
              >
                <Pencil size={13} />
              </button>
            </div>
          )}
        </div>
        
        <div className="header-right-side">
          <span className="field-count">
            {fieldCount} {fieldCount === 1 ? 'Field' : 'Fields'}
          </span>
          {/* Add Field is only shown when container is expanded */}
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
              <FieldRow 
                key={field.id} 
                id={field.id}
                name={field.name} 
                value={field.value} 
                onEditField={(fieldId, name, value) => onEditField(id, fieldId, name, value)}
              />
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
