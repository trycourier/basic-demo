import React from 'react';
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
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

// Static preferences data
const EXAMPLE_PREFERENCES = [
  {
    topic_id: "TOPIC_001",
    topic_name: "User Updates",
    status: "OPTED_IN",
    default_status: "OPTED_IN",
    has_custom_routing: false,
    custom_routing: [],
  },
  {
    topic_id: "TOPIC_002",
    topic_name: "Access Notifications",
    status: "OPTED_IN", 
    default_status: "OPTED_IN",
    has_custom_routing: false,
    custom_routing: [],
  },
  {
    topic_id: "TOPIC_003",
    topic_name: "Marketing",
    status: "OPTED_OUT",
    default_status: "OPTED_OUT",
    has_custom_routing: false,
    custom_routing: [],
  }
];

const Preferences: React.FC = () => {
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const tenantId = process.env.REACT_APP_DEMO_TENANT_ID;

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

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1">
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />Preferences Viewer
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Viewing notification preferences for {userId}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                User Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>User ID:</strong> {userId}</Typography>
                {tenantId && <Typography><strong>Tenant ID:</strong> {tenantId}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Environment
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                This environment shows Courier preferences functionality.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Read-only:</strong> Preferences are displayed for viewing
              </Typography>
              <Typography variant="body2">
                <strong>User ID:</strong> {userId}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Static Preferences Table */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Topic Preferences
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Topic Name</TableCell>
                    <TableCell>Topic ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Default Status</TableCell>
                    <TableCell>Custom Routing</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {EXAMPLE_PREFERENCES.map((topic) => (
                    <TableRow key={topic.topic_id}>
                      <TableCell>{topic.topic_name}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {topic.topic_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(topic.status)} 
                          color={getStatusColor(topic.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(topic.default_status)} 
                          color={getStatusColor(topic.default_status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {topic.has_custom_routing ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {topic.custom_routing?.map((channel) => (
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Preferences;
