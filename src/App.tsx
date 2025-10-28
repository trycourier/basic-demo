import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import DemoDesigner from './pages/DemoDesigner/DemoDesigner';
import DemoPreferences from './pages/DemoPreferences/DemoPreferences';
import Inbox from './pages/Inbox/Inbox';
import Messaging from './pages/Messaging/Messaging';
import ArchivedNotifications from './pages/ArchivedNotifications/ArchivedNotifications';

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


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/designer" element={<DemoDesigner />} />
            <Route path="/preferences" element={<DemoPreferences />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/archived" element={<ArchivedNotifications />} />
            <Route path="/messaging" element={<Messaging />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
