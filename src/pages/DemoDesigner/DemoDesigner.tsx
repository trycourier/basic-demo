import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { TemplateEditor, TemplateProvider } from '@trycourier/react-designer';
import { BrandEditor, BrandProvider } from '@trycourier/react-designer';
import { useDemoAuth } from '../../contexts/DemoContext';
import './DemoDesigner.css';

const DemoDesigner: React.FC = () => {
  const { user, jwtToken, tenantId } = useDemoAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplateId] = useState('demo-template-id');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          🎨 Courier Create Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Designing templates for the demo user: {user.first_name} {user.last_name}
        </Typography>
      </Box>

      {/* Demo Info Banner */}
      <Box mb={2}>
        <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="body2">
            <strong>Demo Mode:</strong> This is a controlled environment. Use template ID: <code>{selectedTemplateId}</code>
          </Typography>
        </Paper>
      </Box>

      {/* Debug Info */}
      <Box mb={2}>
        <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="body2" component="div">
            <strong>JWT Token:</strong> {jwtToken ? `${jwtToken.substring(0, 30)}...` : 'Not loaded'}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Tenant ID:</strong> {tenantId}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Demo User:</strong> {user.email}
          </Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="designer tabs">
          <Tab label="Template Editor" />
          <Tab label="Brand Editor" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ height: '70vh' }}>
        {activeTab === 0 && tenantId && jwtToken && (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <TemplateProvider
              templateId={selectedTemplateId}
              tenantId={tenantId}
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
                variables={{
                  "user": {
                    "firstName": user.first_name,
                    "lastName": user.last_name,
                    "email": user.email,
                    "phoneNumber": user.phone_number || "+1234567890"
                  },
                  "company": {
                    "name": "Courier Demo Inc",
                    "address": {
                      "street": "123 Demo Street",
                      "city": "San Francisco",
                      "state": "CA",
                      "zipCode": "94105"
                    }
                  }
                }}
              />
            </TemplateProvider>
          </Box>
        )}

        {activeTab === 1 && tenantId && jwtToken && (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <BrandProvider
              tenantId={tenantId}
              token={jwtToken}
            >
              <BrandEditor />
            </BrandProvider>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DemoDesigner;
