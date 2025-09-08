import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CourierProvider } from '@trycourier/react-provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Inbox from './pages/Inbox/Inbox';
import Designer from './pages/Designer/Designer';
import Messaging from './pages/Messaging/Messaging';

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

// Courier configuration
const courierConfig = {
  clientKey: process.env.REACT_APP_COURIER_CLIENT_KEY || 'your-client-key',
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CourierProvider {...courierConfig}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/designer" element={<Designer />} />
                <Route path="/messaging" element={<Messaging />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </CourierProvider>
    </ThemeProvider>
  );
}

export default App;
