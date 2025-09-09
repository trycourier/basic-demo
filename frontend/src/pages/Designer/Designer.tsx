import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { TemplateEditor, TemplateProvider } from '@trycourier/react-designer';
import { BrandEditor, BrandProvider } from '@trycourier/react-designer';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Designer.css';

const Designer: React.FC = () => {
  const { user } = useAuth();
  const [jwtToken, setJwtToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchJwtToken = async () => {
      if (!user) return;

      try {
        const response = await axios.get('/users/create-jwt/');
        setJwtToken(response.data.jwt_token);
        console.log('JWT token fetched successfully');
      } catch (err: any) {
        setError('Failed to load designer. Please try again.');
        console.error('Error fetching JWT token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJwtToken();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">
          Please log in to access the template designer.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box className="designer-container">
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courier Create
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Design and customize notification templates
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="designer tabs">
          <Tab label="Template Editor" />
          <Tab label="Brand Editor" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box className="designer-content">
        {activeTab === 0 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <TemplateProvider
              templateId=""
              tenantId={process.env.REACT_APP_COURIER_TENANT_ID || ''}
              token={jwtToken}
            >
              <TemplateEditor
                theme={{
                  background: '#ffffff',
                  foreground: '#292929',
                  border: '#DCDEE4',
                  primary: '#1976d2',
                  primaryForeground: '#ffffff',
                  radius: '8px',
                }}
                onError={(error) => {
                  console.error('Template Editor Error:', error);
                  setError('Template editor failed to load. Please check your Courier configuration.');
                }}
              />
            </TemplateProvider>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <BrandProvider
              tenantId={process.env.REACT_APP_COURIER_TENANT_ID || ''}
              token={jwtToken}
            >
              <BrandEditor
                theme={{
                  background: '#ffffff',
                  foreground: '#292929',
                  border: '#DCDEE4',
                  primary: '#1976d2',
                  primaryForeground: '#ffffff',
                  radius: '8px',
                }}
                onError={(error) => {
                  console.error('Brand Editor Error:', error);
                  setError('Brand editor failed to load. Please check your Courier configuration.');
                }}
              />
            </BrandProvider>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Designer;
