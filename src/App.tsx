// Finance Agent Application Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderPage from './components/PlaceholderPage';
import SchemaPage from './pages/SchemaPage';
import ARPage from './pages/ARPage';
import RFQPage from './pages/RFQPage';
import { navigationConfig } from './config/navigation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {/* Default path redirects to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

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
    </BrowserRouter>
  );
}

export default App;
