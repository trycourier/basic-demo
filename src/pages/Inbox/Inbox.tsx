import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { Inbox } from '@trycourier/react-inbox';
import { useDemoAuth } from '../../contexts/DemoContext';

const DemoInbox: React.FC = () => {
  const { user, tenantId } = useDemoAuth();

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📬 Courier Inbox Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time notifications for demo user: {user.first_name} {user.last_name}
        </Typography>
      </Box>

      <Box mb={3}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Demo Mode:</strong> This inbox displays notifications sent to{' '}
            <strong>{user.email}</strong>. Send messages from the Messaging tab to see them appear here.
          </Typography>
        </Alert>
      </Box>

      <Box sx={{ height: '70vh' }}>
        <Paper sx={{ height: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Courier Inbox Component
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This would embed the Courier Inbox component with the demo user's notifications.
            Configure with tenant ID: {tenantId}
          </Typography>
          
          <Box
            sx={{
              height: '90%',
              border: '2px dashed',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
            }}
          >
            <Box textAlign="center">
              <Typography variant="h6" color="text.secondary">
                Courier Inbox Component
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Would show real-time notifications for the demo user
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DemoInbox;
