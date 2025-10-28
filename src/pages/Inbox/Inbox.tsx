import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { CourierInbox, useCourier } from '@trycourier/courier-react';

const DemoInbox: React.FC = () => {
  const courier = useCourier();
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  const tenantId = process.env.REACT_APP_DEMO_TENANT_ID;

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

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📬 Courier Inbox Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time notifications for user: {userId}
        </Typography>
      </Box>

      <Box mb={3}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Live Inbox:</strong> This displays notifications sent to{' '}
            <strong>{userId}</strong>. Send messages from the Messaging tab to see them appear here.
          </Typography>
        </Alert>
      </Box>

      <Box sx={{ height: '70vh' }}>
        <Paper sx={{ height: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Courier Inbox Component
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Live notifications for {userId}
            {tenantId && ` (Tenant: ${tenantId})`}
          </Typography>
          
          <Box sx={{ height: 'calc(100% - 80px)' }}>
            <CourierInbox />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DemoInbox;
