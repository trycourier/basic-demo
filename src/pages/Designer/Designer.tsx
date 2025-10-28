import React, { useState } from 'react';
import { Container, Typography, Alert, Box, Tabs, Tab } from '@mui/material';
import "@trycourier/react-designer/styles.css";
import { TemplateEditor, TemplateProvider } from "@trycourier/react-designer";
import { BrandEditor, BrandProvider } from "@trycourier/react-designer";

const Designer: React.FC = () => {
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  const tenantId = process.env.REACT_APP_DEMO_TENANT_ID;
  const [activeTab, setActiveTab] = useState(0);
  const [templateId] = useState('template-id');

  if (!tenantId || !jwtToken) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>Courier Template Designer</Typography>
        <Alert severity="error">Missing REACT_APP_DEMO_TENANT_ID or REACT_APP_DEMO_JWT</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ height: '90vh', py: 2 }}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>🎨 Courier Template Designer</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create and customize notification templates
        </Typography>
      </Box>
      
      <Box mb={2}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Template ID:</strong> {templateId} | 
            <strong> Tenant:</strong> {tenantId} | 
            <strong> User:</strong> {userId}
          </Typography>
          <Typography variant="body2">
            <strong>JWT:</strong> {jwtToken ? `${jwtToken.substring(0, 40)}...` : 'Not loaded'}
          </Typography>
        </Alert>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Template Editor" />
          <Tab label="Brand Editor" />
        </Tabs>
      </Box>
      
      <Box sx={{ height: '70vh' }}>
        {activeTab === 0 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <TemplateProvider templateId={templateId} tenantId={tenantId} token={jwtToken}>
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
                  user: {
                    firstName: "User",
                    lastName: "Name",
                    email: `${userId}@courier.com`,
                    phoneNumber: "+1234567890"
                  },
                  company: {
                    name: "Example Company",
                    address: {
                      street: "123 Main Street",
                      city: "San Francisco",
                      state: "CA",
                      zipCode: "94105"
                    }
                  }
                }}
              />
            </TemplateProvider>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <BrandProvider tenantId={tenantId} token={jwtToken}>
              <BrandEditor />
            </BrandProvider>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Designer;
