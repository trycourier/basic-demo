import React, { createContext, useContext, ReactNode } from 'react';

// Types
interface DemoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  preferred_language: string;
  courier_user_id: string;
}

interface DemoContextType {
  user: DemoUser;
  jwtToken: string;
  tenantId: string;
}

// Static demo data - no backend needed!
const DEMO_USER: DemoUser = {
  id: 1,
  username: 'demo_user',
  email: 'demo@courier.com',
  first_name: 'Demo',
  last_name: 'User',
  phone_number: '+1234567890',
  preferred_language: 'en',
  courier_user_id: 'demo_user_courier_id'
};

// Environment variables from Vercel
const DEMO_JWT = process.env.REACT_APP_DEMO_JWT || 'your-pre-generated-jwt-token';
const DEMO_TENANT_ID = process.env.REACT_APP_DEMO_TENANT_ID || 'your-demo-tenant-id';

// Create context
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// DemoProvider component
export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: DemoContextType = {
    user: DEMO_USER,
    jwtToken: DEMO_JWT,
    tenantId: DEMO_TENANT_ID
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

// Custom hook
export const useDemoAuth = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoProvider');
  }
  return context;
};
