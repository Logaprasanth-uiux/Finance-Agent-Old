import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderPage from './components/PlaceholderPage';
import { navigationConfig } from './config/navigation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {/* Default path redirects to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dynamic route mapping from config */}
          {navigationConfig.map((item) => {
            // Remove leading slash for relative routing nested in AppShell
            const relativePath = item.path.startsWith('/') ? item.path.substring(1) : item.path;
            
            return (
              <Route
                key={item.path}
                path={relativePath}
                element={
                  <PlaceholderPage
                    title={item.label}
                    description={`This page will be implemented in the next phase.`}
                    iconName={item.iconName}
                  />
                }
              />
            );
          })}
          
          {/* Catch-all route redirects back to /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
