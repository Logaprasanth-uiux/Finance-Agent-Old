import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Organization, AuthState } from '../types/auth';
import { mockOrganizations } from '../data/authMockData';

interface AuthContextType extends AuthState {
  login: (email: string) => void;
  verifyCode: (code: string) => boolean;
  selectOrg: (orgId: string) => void;
  logout: () => void;
  bypassToOrgSelection: (email?: string) => void;
}

const STORAGE_KEY_AUTH = 'agentic_finance_auth';
const STORAGE_KEY_ORG = 'agentic_finance_org';
const STORAGE_KEY_EMAIL = 'agentic_finance_email';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_EMAIL) || 'alex.morgan@datatwin.ai';
  });

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(() => {
    const savedOrgId = localStorage.getItem(STORAGE_KEY_ORG);
    if (savedOrgId) {
      return mockOrganizations.find((o) => o.id === savedOrgId) || null;
    }
    return null;
  });

  const login = (userEmail: string) => {
    const finalEmail = userEmail.trim() || 'alex.morgan@datatwin.ai';
    setEmail(finalEmail);
    localStorage.setItem(STORAGE_KEY_EMAIL, finalEmail);
  };

  const verifyCode = (_code: string) => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    return true;
  };

  const bypassToOrgSelection = (userEmail?: string) => {
    if (userEmail) {
      login(userEmail);
    }
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
  };

  const selectOrg = (orgId: string) => {
    const org = mockOrganizations.find((o) => o.id === orgId) || mockOrganizations[0];
    setSelectedOrg(org);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    localStorage.setItem(STORAGE_KEY_ORG, org.id);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedOrg(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_ORG);
  };

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        email,
        selectedOrg,
        login,
        verifyCode,
        selectOrg,
        logout,
        bypassToOrgSelection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
