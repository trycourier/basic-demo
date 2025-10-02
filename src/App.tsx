import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CourierProvider } from '@trycourier/react-provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DemoProvider } from './contexts/DemoContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import DemoDesigner from './pages/DemoDesigner/DemoDesigner';
import DemoPreferences from './pages/DemoPreferences/DemoPreferences';
import Inbox from './pages/Inbox/Inbox';
import Messaging from './pages/Messaging/Messaging';

// Import Courier React Designer styles
import '@trycourier/react-designer/styles.css';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Courier configuration - using environment variables
const courierConfig = {
  clientKey: process.env.REACT_APP_COURIER_CLIENT_KEY || 'demo-client-key',
  tenantId: process.env.REACT_APP_DEMO_TENANT_ID,
  userId: 'demo_user_courier_id', // Static demo user
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CourierProvider {...courierConfig}>
        <DemoProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/designer" element={<DemoDesigner />} />
                <Route path="/preferences" element={<DemoPreferences />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/messaging" element={<Messaging />} />
              </Routes>
            </Layout>
          </Router>
        </DemoProvider>
      </CourierProvider>
    </ThemeProvider>
  );
}

export default App;
