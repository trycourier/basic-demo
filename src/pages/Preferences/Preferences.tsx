import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  GridLegacy as Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Public as GlobalIcon,
  Business as TenantIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useCourier } from '@trycourier/courier-react';
import { usePreferences } from '@trycourier/react-hooks';

interface TopicPreference {
  topic_id: string;
  templateId?: string;
  topic_name?: string;
  status: string;
  default_status?: string;
  has_custom_routing?: boolean;
  custom_routing?: string[];
  routingPreferences?: string[];
}

const Preferences: React.FC = () => {
  const courier = useCourier();
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  const tenantId = process.env.REACT_APP_DEMO_TENANT_ID;
  
  const [tabValue, setTabValue] = useState(0);

  // Use the preferences hook - fetch global (no tenant) and tenant-specific preferences
  // These hooks use CourierProvider context from index.tsx
  const globalPreferencesHook = usePreferences();
  const tenantPreferencesHook = usePreferences();

  // Authenticate with Courier using JWT
  useEffect(() => {
    if (jwtToken && userId) {
      courier.auth.signIn({
        userId,
        jwt: jwtToken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch global preferences (no tenant)
  useEffect(() => {
    if (userId && jwtToken) {
      globalPreferencesHook.fetchRecipientPreferences();
      globalPreferencesHook.fetchPreferencePage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, jwtToken]);

  // Fetch tenant-specific preferences
  useEffect(() => {
    if (userId && jwtToken && tenantId) {
      tenantPreferencesHook.fetchRecipientPreferences(tenantId);
      tenantPreferencesHook.fetchPreferencePage(tenantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, jwtToken, tenantId]);

  // Helper function to get topic name from preferencePage
  // preferencePage.sections has structure: { nodes: [{ topics: { nodes: [IPreferenceTemplate] } }] }
  const getTopicName = (templateId: string, preferencePage: any): string | undefined => {
    if (!preferencePage?.sections) return undefined;
    
    const sections = preferencePage.sections;
    // sections.nodes is an array of sections
    if (!sections.nodes || !Array.isArray(sections.nodes)) return undefined;
    
    for (const section of sections.nodes) {
      // Each section has topics.nodes which is an array of preference templates
      if (section?.topics?.nodes && Array.isArray(section.topics.nodes)) {
        for (const topic of section.topics.nodes) {
          if (topic?.templateId === templateId) {
            return topic?.templateName;
          }
        }
      }
    }
    return undefined;
  };

  // Transform recipientPreferences to TopicPreference format
  // Handle both API format (topic_id, topic_name) and hook format (templateId)
  const transformPreferences = (
    recipientPreferences: any[],
    preferencePage: any
  ): TopicPreference[] => {
    if (!recipientPreferences || !Array.isArray(recipientPreferences)) {
      return [];
    }

    return recipientPreferences.map((pref: any) => {
      // API returns topic_id, but hook might return templateId
      const topicId = pref.topic_id || pref.templateId || pref.id || '';
      
      // API returns topic_name directly, or we can get it from preferencePage
      const topicName = pref.topic_name 
        || getTopicName(topicId, preferencePage) 
        || pref.label 
        || pref.name 
        || pref.templateName;

      return {
        topic_id: topicId,
        templateId: topicId, // Keep for toggle handler
        topic_name: topicName,
        status: pref.status || 'OPTED_OUT',
        // API returns default_status, hook might return defaultStatus
        default_status: pref.default_status || pref.defaultStatus || pref.status || 'OPTED_OUT',
        // API format uses snake_case, hook might use camelCase
        has_custom_routing: pref.has_custom_routing || pref.hasCustomRouting || (pref.routingPreferences && pref.routingPreferences.length > 0) || false,
        custom_routing: pref.custom_routing || pref.routingPreferences || pref.routing || [],
        routingPreferences: pref.custom_routing || pref.routingPreferences || [],
      };
    });
  };

  const globalDefaults = transformPreferences(
    globalPreferencesHook.recipientPreferences || [],
    globalPreferencesHook.preferencePage
  );

  const tenantPreferences = transformPreferences(
    tenantPreferencesHook.recipientPreferences || [],
    tenantPreferencesHook.preferencePage
  );

  // Debug: log what we're getting from the hooks and transformed data
  useEffect(() => {
    if (globalPreferencesHook.recipientPreferences) {
      console.log('🔍 Global recipientPreferences (raw):', globalPreferencesHook.recipientPreferences);
      console.log('🔍 Global preferencePage:', globalPreferencesHook.preferencePage);
      console.log('✅ Transformed globalDefaults:', globalDefaults);
    }
    if (tenantPreferencesHook.recipientPreferences) {
      console.log('🔍 Tenant recipientPreferences (raw):', tenantPreferencesHook.recipientPreferences);
      console.log('🔍 Tenant preferencePage:', tenantPreferencesHook.preferencePage);
      console.log('✅ Transformed tenantPreferences:', tenantPreferences);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalPreferencesHook.recipientPreferences, tenantPreferencesHook.recipientPreferences]);

  const isLoading = globalPreferencesHook.isLoading || tenantPreferencesHook.isLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTED_IN':
        return 'success';
      case 'OPTED_OUT':
        return 'error';
      case 'REQUIRED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPTED_IN':
        return 'Opted In';
      case 'OPTED_OUT':
        return 'Opted Out';
      case 'REQUIRED':
        return 'Required';
      default:
        return status;
    }
  };

  // Handler to toggle preference status
  const handleTogglePreference = (templateId: string, currentStatus: string, isTenant: boolean = false) => {
    const hook = isTenant ? tenantPreferencesHook : globalPreferencesHook;
    const newStatus = currentStatus === 'OPTED_IN' ? 'OPTED_OUT' : 'OPTED_IN';
    
    hook.updateRecipientPreferences({
      templateId,
      status: newStatus,
      hasCustomRouting: false,
      digestSchedule: '',
      routingPreferences: [],
      ...(isTenant && tenantId ? { tenantId } : {}),
    });
  };

  const renderPreferencesTable = (preferences: TopicPreference[], showTenantOverride: boolean = false) => {
    if (preferences.length === 0) {
      return (
        <Alert severity="info">
          No preferences found for this scope.
        </Alert>
      );
    }

    const isUpdating = showTenantOverride 
      ? tenantPreferencesHook.isUpdating 
      : globalPreferencesHook.isUpdating;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Topic Name</TableCell>
              <TableCell>Topic ID</TableCell>
              <TableCell>Toggle</TableCell>
              <TableCell>Status</TableCell>
              {showTenantOverride && <TableCell>Overrides Global</TableCell>}
              <TableCell>Default Status</TableCell>
              <TableCell>Custom Routing</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preferences.map((topic) => {
              // REQUIRED is determined by default_status, not current status
              // A preference is REQUIRED if its default_status is REQUIRED
              const isRequired = topic.default_status === 'REQUIRED';
              const isChecked = topic.status === 'OPTED_IN';
              
              return (
                <TableRow 
                  key={topic.topic_id}
                  sx={{
                    opacity: isRequired ? 0.7 : 1,
                    '&:hover': {
                      backgroundColor: isRequired ? 'transparent' : 'action.hover',
                    }
                  }}
                >
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      fontWeight={topic.topic_name ? 'medium' : 'normal'}
                      sx={{ color: isRequired ? 'text.secondary' : 'text.primary' }}
                    >
                      {topic.topic_name || 'Unnamed Topic'}
                      {isRequired && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="warning"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {topic.topic_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={isRequired ? 'Required - cannot be changed' : (isChecked ? 'Opt out' : 'Opt in')}>
                      <span>
                        <Switch
                          checked={isChecked}
                          onChange={() => handleTogglePreference(topic.templateId || topic.topic_id, topic.status, showTenantOverride)}
                          disabled={isRequired || isUpdating}
                          color="primary"
                          sx={{
                            opacity: isRequired ? 0.5 : 1,
                            cursor: isRequired ? 'not-allowed' : 'pointer',
                          }}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(topic.status)} 
                      color={getStatusColor(topic.status) as any}
                      size="small"
                      sx={{ opacity: isRequired ? 0.6 : 1 }}
                    />
                  </TableCell>
                  {showTenantOverride && (
                    <TableCell>
                      {topic.status !== topic.default_status ? (
                        <Chip 
                          label="Yes" 
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(topic.default_status || topic.status)} 
                      color={getStatusColor(topic.default_status || topic.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {topic.has_custom_routing && topic.custom_routing && topic.custom_routing.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {topic.custom_routing.map((channel) => (
                          <Chip key={channel} label={channel} size="small" variant="outlined" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Default routing
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1">
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />Preferences Viewer
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Viewing notification preferences for {userId}
          {tenantId && ` (Tenant: ${tenantId})`}
        </Typography>
      </Box>

      {/* User Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                User Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2"><strong>User ID:</strong> {userId}</Typography>
                {tenantId && <Typography variant="body2"><strong>Tenant ID:</strong> {tenantId}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GlobalIcon />
                Global Defaults
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System-wide default preferences that apply to all users unless overridden.
              </Typography>
              <Box mt={1}>
                <Typography variant="h6" color="primary">
                  {isLoading ? '...' : globalDefaults.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  topics configured
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TenantIcon />
                Tenant Options
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tenantId 
                  ? `Tenant-specific preferences for ${tenantId}`
                  : 'Tenant-specific preferences (no tenant configured)'}
              </Typography>
              <Box mt={1}>
                <Typography variant="h6" color="primary">
                  {isLoading ? '...' : tenantPreferences.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  topics configured
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info Alert */}
      <Box mb={3}>
        <Alert severity="info" icon={<InfoIcon />}>
          <Typography variant="body2">
            <strong>How Preferences Work:</strong> Global defaults apply to all users system-wide. 
            Tenant-specific preferences can override global defaults for users within that tenant. 
            User preferences (when available) can further override both global and tenant settings.
          </Typography>
        </Alert>
      </Box>

      {/* Tabs for Global vs Tenant */}
      <Card>
        <CardContent>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<GlobalIcon />} 
              iconPosition="start"
              label={`Global Defaults (${isLoading ? '...' : globalDefaults.length})`} 
            />
            <Tab 
              icon={<TenantIcon />} 
              iconPosition="start"
              label={`Tenant Options (${isLoading ? '...' : tenantPreferences.length})`} 
              disabled={!tenantId}
            />
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Global Defaults Tab */}
              {tabValue === 0 && (
                <Box>
                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                      <GlobalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Global Default Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      These are the system-wide default preferences. All users inherit these unless 
                      overridden by tenant or user-specific preferences.
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {renderPreferencesTable(globalDefaults)}
                </Box>
              )}

              {/* Tenant Preferences Tab */}
              {tabValue === 1 && (
                <Box>
                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                      <TenantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Tenant-Specific Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preferences specific to tenant <strong>{tenantId}</strong>. These override 
                      global defaults for users in this tenant.
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {tenantId ? (
                    renderPreferencesTable(tenantPreferences, true)
                  ) : (
                    <Alert severity="warning">
                      No tenant ID configured. Tenant preferences are only available when REACT_APP_DEMO_TENANT_ID is set.
                    </Alert>
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Preferences;
