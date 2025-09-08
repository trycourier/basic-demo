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
    <Container maxWidth="xl">
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courier Create
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Design and customize notification templates
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="designer tabs">
          <Tab label="Template Editor" />
          <Tab label="Brand Editor" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Paper elevation={2} sx={{ height: '70vh', overflow: 'hidden' }}>
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
            />
          </TemplateProvider>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper elevation={2} sx={{ height: '70vh', overflow: 'hidden' }}>
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
            />
          </BrandProvider>
        </Paper>
      )}

      <Box mt={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            About Courier Create
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Courier Create is an embeddable template designer that allows you to create and customize 
            notification templates with a visual editor. You can design templates for email, SMS, 
            push notifications, and in-app messages.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The Brand Editor allows you to customize your brand's visual identity including logos, 
            colors, and styling that will be applied across all your templates.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Designer;
