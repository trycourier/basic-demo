import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { Inbox } from '@trycourier/react-inbox';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJwtToken = async () => {
      if (!user) return;

      try {
        await axios.get('/users/inbox-jwt/');
      } catch (err: any) {
        setError('Failed to load inbox. Please try again.');
        console.error('Error fetching JWT token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJwtToken();
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">
          Please log in to access your inbox.
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
    <Container maxWidth="lg">
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courier Inbox
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View your real-time notifications and messages
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ height: '70vh', overflow: 'hidden' }}>
        <Inbox />
      </Paper>

      <Box mt={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            About Courier Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This inbox displays real-time notifications sent through Courier. 
            You can view message history, mark messages as read, and interact with notifications.
            The inbox is powered by Courier's real-time WebSocket connections and JWT authentication.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default InboxPage;
