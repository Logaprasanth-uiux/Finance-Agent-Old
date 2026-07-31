import React from 'react';

interface FieldRowProps {
  name: string;
  value: string;
}

export const FieldRow: React.FC<FieldRowProps> = ({ name, value }) => {
  return (
    <div className="schema-field-row interactive">
      <div className="field-info-row">
        <span className="field-name">{name}</span>
        <span className="field-value-display">{value || '—'}</span>
      </div>
    </div>
  );
};

export default FieldRow;
