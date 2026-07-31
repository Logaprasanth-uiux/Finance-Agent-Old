export interface NavigationItem {
  path: string;
  label: string;
  iconName: string;
  hasChevron?: boolean;
}

export const navigationConfig: NavigationItem[] = [
  { path: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboard' },
  { path: '/inbox', label: 'Inbox', iconName: 'Inbox' },
  { path: '/transact', label: 'Transact', iconName: 'CreditCard' },
  { path: '/approvals', label: 'Approvals', iconName: 'FileCheck', hasChevron: true },
  { path: '/integration', label: 'Integration', iconName: 'Network' },
  { path: '/ledger-view', label: 'Ledger View', iconName: 'FileText' },
  { path: '/reports', label: 'Reports', iconName: 'BarChart3', hasChevron: true },
  { path: '/master-reports', label: 'Master Reports', iconName: 'FileSpreadsheet', hasChevron: true },
  { path: '/ap', label: 'AP', iconName: 'ArrowDownLeft', hasChevron: true },
  { path: '/ar', label: 'AR', iconName: 'ArrowUpRight', hasChevron: true },
  { path: '/fscp', label: 'FSCP', iconName: 'ShieldCheck', hasChevron: true },
  { path: '/schema', label: 'Schema', iconName: 'Database' },
  { path: '/config', label: 'Config', iconName: 'Settings' },
  { path: '/admin', label: 'Admin (DT)', iconName: 'ShieldAlert' },
];
