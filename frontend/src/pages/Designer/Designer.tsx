import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TemplateEditor, TemplateProvider } from '@trycourier/react-designer';
import { BrandEditor, BrandProvider } from '@trycourier/react-designer';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Designer.css';

// Global error handler for DOM manipulation errors
window.addEventListener('error', (event) => {
  if (event.message.includes('removeChild') || event.message.includes('NotFoundError')) {
    console.warn('DOM manipulation error caught and ignored:', event.message);
    event.preventDefault();
    return false;
  }
});

// Simple Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const Designer: React.FC = () => {
  const { user } = useAuth();
  const [jwtToken, setJwtToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('fixed-template-id');
  const [existingTemplates, setExistingTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [actualTenantId, setActualTenantId] = useState<string>('');
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    const fetchJwtToken = async () => {
      if (!user || !isMounted) return;

      try {
        const response = await axios.get('/users/create-jwt/');
        if (!isMounted) return;
        
        setJwtToken(response.data.jwt_token);
        
        // Extract tenant_id from JWT token (this is the UUID that Courier Create expects)
        try {
          const tokenParts = response.data.jwt_token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.tenant_id && isMounted) {
            setActualTenantId(payload.tenant_id);
          }
        } catch (e) {
          // Could not decode JWT to extract tenant_id
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load designer. Please try again.');
          console.error('Error fetching JWT token:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJwtToken();
  }, [user, isMounted]);

  // Cleanup effect to prevent DOM manipulation errors
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Debug logging for TemplateProvider variables
  useEffect(() => {
    if (activeTab === 0 && actualTenantId) {
      // TemplateProvider variables logged for debugging
    }
  }, [activeTab, actualTenantId, selectedTemplateId, jwtToken]);

  // Load templates when JWT token is available
  useEffect(() => {
    if (jwtToken && existingTemplates.length === 0 && !loadingTemplates) {
      loadTemplates();
    }
  }, [jwtToken]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const refreshJwtToken = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/users/create-jwt/');
      setJwtToken(response.data.jwt_token);
    } catch (err: any) {
      setError('Failed to refresh JWT token. Please try again.');
      console.error('Error refreshing JWT token:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTemplateId = () => {
    // Generate a unique template ID for new templates
    const templateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return templateId;
  };

  const openCreateTemplateDialog = () => {
    setNewTemplateName('');
    setCreateTemplateDialogOpen(true);
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) return;
    
    const newTemplateId = generateTemplateId();
    setSelectedTemplateId(newTemplateId);
    
    // Add the new template to the list so it shows in the dropdown
    const newTemplate = {
      id: newTemplateId,
      name: newTemplateName.trim(),
      subject: newTemplateName.trim(),
      created_at: new Date().toISOString()
    };
    setExistingTemplates(prev => [...prev, newTemplate]);
    
    setCreateTemplateDialogOpen(false);
    setNewTemplateName('');
  };

  const createNewTemplate = async () => {
    const newTemplateId = generateTemplateId();
    setSelectedTemplateId(newTemplateId);
    
    // Add the new template to the list so it shows in the dropdown
    const newTemplate = {
      id: newTemplateId,
      name: 'New Template',
      subject: 'New Template',
      created_at: new Date().toISOString()
    };
    setExistingTemplates(prev => [...prev, newTemplate]);
  };

  const loadTemplates = async () => {
    if (!isMounted) return;
    
    setLoadingTemplates(true);
    try {
      const response = await axios.get('/templates/');
      if (!isMounted) return;
      
      // Handle the nested response structure from backend
      const templates = response.data?.templates || response.data?.items || response.data || [];
      
      if (isMounted) {
        setExistingTemplates(templates);
        
        // Check if fixed-template-id exists in the loaded templates
        const hasFixedTemplate = templates.some((t: any) => t.id === 'fixed-template-id');
        if (!hasFixedTemplate && templates.length === 0) {
          // If no templates exist and fixed-template-id is not found, keep the default selection
          // The template will be created when the user edits it in Courier Create
        } else if (hasFixedTemplate) {
          // fixed-template-id exists, we're good to go
        }
      }
    } catch (err: any) {
      // Handle different error scenarios
      if (isMounted) {
        if (err.response?.status === 404) {
          await createNewTemplate();
        } else if (err.response?.status === 400 || err.response?.status === 500) {
          await createNewTemplate();
        } else {
          setError('Failed to load templates. Please check your Courier configuration.');
        }
      }
    } finally {
      if (isMounted) {
        setLoadingTemplates(false);
      }
    }
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
        
        {/* Tenant Context Display */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3" color="primary" sx={{ fontWeight: 'bold' }}>
              Tenant Context
            </Typography>
            <Tooltip title="Refresh JWT Token">
              <IconButton size="small" onClick={refreshJwtToken} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" component="div">
            <strong>Tenant ID:</strong> {actualTenantId || process.env.REACT_APP_COURIER_TENANT_ID || 'Not configured'}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Tenant Name:</strong> {process.env.REACT_APP_COURIER_TENANT_ID || 'Not configured'}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>JWT Token:</strong> {jwtToken ? `${jwtToken.substring(0, 20)}...` : 'Not loaded'}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>User:</strong> {user?.email || 'Not authenticated'}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
            {loading ? 'Refreshing token...' : jwtToken ? '✅ Token ready for Courier Create' : '❌ Token not loaded'}
          </Typography>
        </Box>
      </Box>

      {/* Template Selection */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Template Selection
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              label="Select Template"
            >
              <MenuItem value="">
                <em>Create New Template</em>
              </MenuItem>
              {existingTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name || template.id}
                </MenuItem>
              ))}
              {selectedTemplateId && !existingTemplates.find(t => t.id === selectedTemplateId) && (
                <MenuItem key={`new-${selectedTemplateId}`} value={selectedTemplateId}>
                  <em>{selectedTemplateId === 'fixed-template-id' ? 'Default Template' : `New Template (${selectedTemplateId})`}</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            onClick={loadTemplates}
            disabled={loadingTemplates}
            startIcon={loadingTemplates ? <CircularProgress size={16} /> : <RefreshIcon />}
          >
            {loadingTemplates ? 'Loading...' : 'Load Templates'}
          </Button>
          
          <Button 
            variant="contained" 
            onClick={openCreateTemplateDialog}
            color="primary"
          >
            Create New Template
          </Button>
          
          {selectedTemplateId && (
            <Typography variant="body2" color="text.secondary">
              Selected: {existingTemplates.find(t => t.id === selectedTemplateId)?.name || selectedTemplateId}
            </Typography>
          )}
          
          {selectedTemplateId && existingTemplates.find(t => t.id === selectedTemplateId) && (
            <Typography variant="body2" color="success.main" sx={{ fontStyle: 'italic' }}>
              ✅ Template "{selectedTemplateId}" exists in Courier and is ready for editing.
            </Typography>
          )}
          
          {selectedTemplateId && !existingTemplates.find(t => t.id === selectedTemplateId) && (
            <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
              ⚠️ Template "{selectedTemplateId}" will be created when you make changes in the editor.
            </Typography>
          )}
          
          {existingTemplates.length === 0 && !loadingTemplates && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No existing templates found. Select "Create New Template" to get started.
            </Typography>
          )}
        </Box>
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
        {activeTab === 0 && actualTenantId && (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <ErrorBoundary fallback={<Alert severity="error">Template editor failed to load. Please refresh the page.</Alert>}>
              <TemplateProvider
                templateId={selectedTemplateId}
                tenantId={process.env.REACT_APP_COURIER_TENANT_ID || 'basic-demo-tenant'}
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
                      "firstName": user?.first_name || "John",
                      "lastName": user?.last_name || "Doe",
                      "email": user?.email || "user@example.com",
                      "phoneNumber": user?.phone_number || "+1234567890"
                    },
                    "company": {
                      "name": "Basic Demo Inc",
                      "address": {
                        "street": "123 Demo Street",
                        "city": "San Francisco",
                        "state": "CA",
                        "zipCode": "94105"
                      },
                      "website": "https://basic-demo.com"
                    },
                    "notification": {
                      "type": "welcome",
                      "priority": "high",
                      "timestamp": new Date().toISOString()
                    }
                  }}
                />
              </TemplateProvider>
            </ErrorBoundary>
          </Box>
        )}

        {activeTab === 1 && actualTenantId && (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <ErrorBoundary fallback={<Alert severity="error">Brand editor failed to load. Please refresh the page.</Alert>}>
              <BrandProvider
                tenantId={process.env.REACT_APP_COURIER_TENANT_ID || 'basic-demo-tenant'}
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
            </ErrorBoundary>
          </Box>
        )}

        {/* Loading state when tenant ID is not available */}
        {!actualTenantId && (
          <Box sx={{ 
            height: '100%', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
              Loading tenant information...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Create Template Dialog */}
      <Dialog open={createTemplateDialogOpen} onClose={() => setCreateTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            variant="outlined"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTemplateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTemplate} 
            variant="contained" 
            disabled={!newTemplateName.trim()}
          >
            Create Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Designer;
