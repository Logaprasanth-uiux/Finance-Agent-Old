import * as Icons from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  iconName: string;
}

export const PlaceholderPage = ({ title, description, iconName }: PlaceholderPageProps) => {
  // Resolve icon component dynamically
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="placeholder-page">
      <div className="placeholder-header">
        <div className="placeholder-title-group">
          <div className="placeholder-icon-wrapper">
            <IconComponent size={20} className="placeholder-icon" />
          </div>
          <div>
            <h1 className="placeholder-title">{title}</h1>
            <p className="placeholder-subtitle">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="placeholder-card">
        <div className="placeholder-empty-state">
          <div className="empty-state-icon-bg">
            <IconComponent size={36} className="empty-state-icon" />
          </div>
          <h2 className="empty-state-title">{title} Module</h2>
          <p className="empty-state-text">
            This module is planned for Phase 2. Core database schema integration, real-time KPI metrics, and transaction validation engines will be connected here.
          </p>
          <div className="empty-state-badge">
            <span className="badge-dot"></span>
            <span className="badge-label">Phase 2 Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
