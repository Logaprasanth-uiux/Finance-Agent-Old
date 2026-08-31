// Finance Agent Application Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderPage from './components/PlaceholderPage';
import SchemaPage from './pages/SchemaPage';
import ARPage from './pages/ARPage';
import RFQPage from './pages/RFQPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyPage from './pages/auth/VerifyPage';
import SelectOrgPage from './pages/auth/SelectOrgPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { navigationConfig } from './config/navigation';

// Guard component that ensures the user has signed in and selected an organization
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, selectedOrg } = useAuth();

  if (!isAuthenticated || !selectedOrg) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Root index redirector based on auth state
const RootRedirector: React.FC = () => {
  const { isAuthenticated, selectedOrg } = useAuth();

  if (isAuthenticated && selectedOrg) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Global Authentication & Entry Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/select-organization" element={<SelectOrgPage />} />

      {/* Root Path: Redirects to /dashboard if authed, or /login */}
      <Route path="/" element={<RootRedirector />} />

      {/* 2. Protected Application Shell Routes */}
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        {/* Transact root redirect to /transact/rfq */}
        <Route path="transact" element={<Navigate to="/transact/rfq" replace />} />
        <Route path="transact/rfq" element={<RFQPage />} />

        {/* Specific Transact Submenu Placeholders */}
        <Route
          path="transact/bill-invoice"
          element={
            <PlaceholderPage
              title="Bill/Invoice"
              description="This page will be implemented in the next phase."
              iconName="Receipt"
            />
          }
        />
        <Route
          path="transact/cost-allocation"
          element={
            <PlaceholderPage
              title="Cost Allocation"
              description="This page will be implemented in the next phase."
              iconName="PieChart"
            />
          }
        />
        <Route
          path="transact/goods-and-service"
          element={
            <PlaceholderPage
              title="Goods and Service"
              description="This page will be implemented in the next phase."
              iconName="Truck"
            />
          }
        />
        <Route
          path="transact/intern-plan"
          element={
            <PlaceholderPage
              title="Intern Plan"
              description="This page will be implemented in the next phase."
              iconName="Calendar"
            />
          }
        />
        <Route
          path="transact/item"
          element={
            <PlaceholderPage
              title="Item Master"
              description="This page will be implemented in the next phase."
              iconName="Package"
            />
          }
        />
        <Route
          path="transact/organization"
          element={
            <PlaceholderPage
              title="Organization"
              description="This page will be implemented in the next phase."
              iconName="Building2"
            />
          }
        />
        <Route
          path="transact/purchase-order"
          element={
            <PlaceholderPage
              title="Purchase Order"
              description="This page will be implemented in the next phase."
              iconName="ShoppingBag"
            />
          }
        />
        <Route
          path="transact/vendor"
          element={
            <PlaceholderPage
              title="Vendor Master"
              description="This page will be implemented in the next phase."
              iconName="Users"
            />
          }
        />

        {/* Dynamic route mapping from config */}
        {navigationConfig.map((item) => {
          // Skip transact since it is explicitly routed above
          if (item.path === '/transact') return null;

          // Remove leading slash for relative routing nested in AppShell
          const relativePath = item.path.startsWith('/')
            ? item.path.substring(1)
            : item.path;

          // Render specific Schema page component for /schema
          if (relativePath === 'schema') {
            return (
              <Route
                key={item.path}
                path={relativePath}
                element={<SchemaPage />}
              />
            );
          }

          // Render AR page component for /ar
          if (relativePath === 'ar') {
            return (
              <Route
                key={item.path}
                path={relativePath}
                element={<ARPage />}
              />
            );
          }

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
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
