import React, { useState } from 'react';
import { Container, Typography, Alert, Box, Tabs, Tab, Switch, FormControlLabel, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import "@trycourier/react-designer/styles.css";
import { TemplateEditor, TemplateProvider, ErrorBoundary } from "@trycourier/react-designer";
import { BrandEditor, BrandProvider } from "@trycourier/react-designer";

const Designer: React.FC = () => {
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  const tenantId = process.env.REACT_APP_DEMO_TENANT_ID;
  const [activeTab, setActiveTab] = useState(0);
  const [templateId, setTemplateId] = useState('template-id');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [routingMethod, setRoutingMethod] = useState<'single' | 'all'>('single');

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
      
      {activeTab === 0 && (
        <Box mb={2} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Template ID"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            helperText="Change template ID to edit a different template"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Routing Method</InputLabel>
            <Select
              value={routingMethod}
              label="Routing Method"
              onChange={(e) => setRoutingMethod(e.target.value as 'single' | 'all')}
            >
              <MenuItem value="single">Single (Fallback)</MenuItem>
              <MenuItem value="all">All Channels</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: 1 }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Template Editor" />
            <Tab label="Brand Editor" />
          </Tabs>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={colorScheme === 'dark'}
              onChange={(e) => setColorScheme(e.target.checked ? 'dark' : 'light')}
            />
          }
          label="Dark Mode"
          sx={{ ml: 2 }}
        />
      </Box>
      
      <Box sx={{ height: '70vh' }}>
        {activeTab === 0 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <TemplateProvider templateId={templateId} tenantId={tenantId} token={jwtToken}>
              <ErrorBoundary
                fallback={
                  <Alert severity="error" sx={{ m: 2 }}>
                    <Typography variant="h6">Editor Error</Typography>
                    <Typography variant="body2">
                      Something went wrong with the template editor. Please refresh the page or try a different template ID.
                    </Typography>
                  </Alert>
                }
              >
                <TemplateEditor
                  theme={{
                    background: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
                    foreground: colorScheme === 'dark' ? '#e0e0e0' : '#292929',
                    muted: colorScheme === 'dark' ? '#2a2a2a' : '#D9D9D9',
                    mutedForeground: colorScheme === 'dark' ? '#a0a0a0' : '#A3A3A3',
                    popover: colorScheme === 'dark' ? '#2a2a2a' : '#ffffff',
                    popoverForeground: colorScheme === 'dark' ? '#e0e0e0' : '#292929',
                    border: colorScheme === 'dark' ? '#3a3a3a' : '#DCDEE4',
                    input: colorScheme === 'dark' ? '#3a3a3a' : '#DCDEE4',
                    card: colorScheme === 'dark' ? '#2a2a2a' : '#FAF9F8',
                    cardForeground: colorScheme === 'dark' ? '#e0e0e0' : '#292929',
                    primary: colorScheme === 'dark' ? '#1976d2' : '#1976d2',
                    primaryForeground: '#ffffff',
                    secondary: colorScheme === 'dark' ? '#2a2a2a' : '#F5F5F5',
                    secondaryForeground: colorScheme === 'dark' ? '#e0e0e0' : '#171717',
                    accent: colorScheme === 'dark' ? '#1e3a5f' : '#E5F3FF',
                    accentForeground: colorScheme === 'dark' ? '#ffffff' : '#1D4ED8',
                    destructive: colorScheme === 'dark' ? '#292929' : '#292929',
                    destructiveForeground: colorScheme === 'dark' ? '#FF3363' : '#FF3363',
                    ring: colorScheme === 'dark' ? '#80849D' : '#80849D',
                    radius: '8px',
                  }}
                  colorScheme={colorScheme}
                  routing={{
                    method: routingMethod,
                    channels: ["email", "sms", "push", "inbox"]
                  }}
                />
              </ErrorBoundary>
            </TemplateProvider>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ height: '100%', width: '100%' }}>
            <BrandProvider tenantId={tenantId} token={jwtToken}>
              <ErrorBoundary
                fallback={
                  <Alert severity="error" sx={{ m: 2 }}>
                    <Typography variant="h6">Brand Editor Error</Typography>
                    <Typography variant="body2">
                      Something went wrong with the brand editor. Please refresh the page.
                    </Typography>
                  </Alert>
                }
              >
                <BrandEditor colorScheme={colorScheme} />
              </ErrorBoundary>
            </BrandProvider>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Designer;
