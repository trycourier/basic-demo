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
import { useDemoAuth } from '../../contexts/DemoContext';

// Static demo preferences data
const DEMO_PREFERENCES = [
  {
    topic_id: "DEMO_001",
    topic_name: "User Updates",
    status: "OPTED_IN",
    default_status: "OPTED_IN",
    has_custom_routing: false,
    custom_routing: [],
  },
  {
    topic_id: "DEMO_002",
    topic_name: "Access Notifications",
    status: "OPTED_IN", 
    default_status: "OPTED_IN",
    has_custom_routing: false,
    custom_routing: [],
  },
  {
    topic_id: "EMO_003",
    topic_name: "Marketing",
    status: "OPTED_OUT",
    default_status: "OPTED_OUT",
    has_custom_routing: false,
    custom_routing: [],
  }
];

const DemoPreferences: React.FC = () => {
  const { user, tenantId, jwtToken } = useDemoAuth();

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
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />Demo Preferences Viewer
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Viewing notification preferences for the demo user in a controlled environment
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Demo User Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Demo User
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Name:</strong> {user.first_name} {user.last_name}</Typography>
                <Typography><strong>Username:</strong> {user.username}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Courier User ID:</strong> {user.courier_user_id}</Typography>
                <Typography><strong>Tenant ID:</strong> {tenantId}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Environment Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demo Environment
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                This is a demo environment showing Courier preferences functionality.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>No user management:</strong> Uses pre-configured demo user
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Read-only:</strong> Preferences are displayed but not editable in demo mode
              </Typography>
              <Typography variant="body2">
                <strong>Controlled data:</strong> All notifications go to demo@courier.com
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
              Topic Preferences (Demo Data)
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
                  {DEMO_PREFERENCES.map((topic) => (
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

export default DemoPreferences;
