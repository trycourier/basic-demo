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
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Palette as DesignIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      title: 'Send Messages',
      description: 'Send notifications through multiple channels',
      icon: <MessageIcon sx={{ fontSize: 40 }} />,
      path: '/messaging',
      color: '#2e7d32',
    },
    {
      title: 'Demo Notifications',
      description: 'Test different types of notifications',
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      path: '/messaging',
      color: '#ed6c02',
    },
  ];

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Courier Demo
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Experience the power of Courier's notification platform
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This demo showcases Courier's complete ecosystem including Inbox, Create, and messaging capabilities.
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user.first_name || user.username}! Explore Courier's features below.
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
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {user.courier_user_id ? '✓' : '✗'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courier User
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {user.email ? '✓' : '✗'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email Verified
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {user.phone_number ? '✓' : '✗'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SMS Enabled
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
