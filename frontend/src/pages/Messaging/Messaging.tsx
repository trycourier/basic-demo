import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const demoNotifications = [
    {
      title: 'Order Confirmation',
      description: 'Send a confirmation email for a new order',
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      type: 'order_confirmation',
      color: '#1976d2',
    },
    {
      title: 'Shipping Update',
      description: 'Notify about shipping status changes',
      icon: <SmsIcon sx={{ fontSize: 40 }} />,
      type: 'shipping_update',
      color: '#2e7d32',
    },
    {
      title: 'General Notification',
      description: 'Send a general in-app notification',
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      type: 'general',
      color: '#ed6c02',
    },
  ];

  const handleSendDemoNotification = async (type: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/messaging/send-demo/', {
        type: type,
      });

      setSuccess(`${type.replace('_', ' ')} notification sent successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWelcomeMessage = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/messaging/send-welcome/');
      setSuccess('Welcome message sent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send welcome message');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCustomMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/messaging/send/', {
        message: {
          to: {
            user_id: user?.courier_user_id,
          },
          template: 'general-notification-template',
          data: {
            message: message,
            first_name: user?.first_name || user?.username,
          },
        },
      });

      setSuccess('Custom message sent successfully!');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">
          Please log in to send messages.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messaging
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Send notifications and messages through Courier
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Demo Notifications */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Demo Notifications
        </Typography>
        <Grid container spacing={3}>
          {demoNotifications.map((notification, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      color: notification.color,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {notification.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleSendDemoNotification(notification.type)}
                    disabled={loading}
                    sx={{ color: notification.color }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Send Demo'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Send Welcome Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Send a welcome message to the current user
              </Typography>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendWelcomeMessage}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Send Welcome'}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Custom Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Send a custom message to yourself
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendCustomMessage}
                disabled={loading || !message.trim()}
              >
                {loading ? <CircularProgress size={20} /> : 'Send Message'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* User Info */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Courier User ID:</strong> {user.courier_user_id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Phone:</strong> {user.phone_number || 'Not provided'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Language:</strong> {user.preferred_language}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Messaging;
