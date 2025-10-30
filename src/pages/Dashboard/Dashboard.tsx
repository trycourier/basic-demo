import React from 'react';
import {
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Palette as DesignIcon,
  Settings as PreferencesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';

  const features = [
    {
      title: 'Courier Inbox',
      description: 'View real-time notifications and messages in your inbox',
      icon: <InboxIcon sx={{ fontSize: 40 }} />,
      path: '/inbox',
      color: '#1976d2',
    },
    {
      title: 'Template Designer',
      description: 'Create and edit notification templates with Courier Create',
      icon: <DesignIcon sx={{ fontSize: 40 }} />,
      path: '/designer',
      color: '#dc004e',
    },
    {
      title: 'Preferences Viewer',
      description: 'View user notification preferences',
      icon: <PreferencesIcon sx={{ fontSize: 40 }} />,
      path: '/preferences',
      color: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            🎯 Courier Showcase
          </Typography>
          <Typography variant="body2">
            Showcasing Courier's core features. 
            All notifications are sent to: <strong>{userId}</strong>
          </Typography>
        </Alert>
      </Box>

      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courier Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Explore Courier's features. User: <strong>{userId}</strong>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    color: feature.color,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(feature.path)}
                  sx={{ color: feature.color }}
                >
                  Explore
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Features Available
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Courier Create
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Template designer
                  <br />
                  • Visual editor
                  <br />
                  • Brand customization
                  <br />
                  • Variable substitution
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Courier Inbox
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Real-time notifications
                  <br />
                  • Message history
                  <br />
                  • Channel preferences
                  <br />
                  • Interactive components
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Notification preferences
                  <br />
                  • Topic subscriptions
                  <br />
                  • Custom routing
                  <br />
                  • Preference auditing
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="body2" color="primary.main">
              <strong>🎯 Easy to Use:</strong> No login required, 
              controlled environment, all features working with live Courier integration.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
