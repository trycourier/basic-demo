import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  GridLegacy as Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useDemoAuth } from '../../contexts/DemoContext';

const DemoMessaging: React.FC = () => {
  const { user, tenantId } = useDemoAuth();
  const [messageType, setMessageType] = useState('welcome');
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const messageTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'notification', label: 'Push Notification' },
    { value: 'marketing', label: 'Marketing Email' },
    { value: 'alert', label: 'System Alert' },
  ];

  const handleSendMessage = async () => {
    setIsSending(true);
    
    // Simulate sending a message
    setTimeout(() => {
      setIsSending(false);
      setLastSent(new Date().toLocaleTimeString());
    }, 2000);
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📨 Send Demo Messages
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Send notifications to the demo user: {user.first_name} {user.last_name}
        </Typography>
      </Box>

      <Box mb={3}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Demo Mode:</strong> Messages will be sent to{' '}
            <strong>{user.email}</strong> and appear in their inbox. Use tenant ID: {tenantId}
          </Typography>
        </Alert>
      </Box>

      <Grid container spacing={3}>
        {/* Message Sender */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send Message
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Message Type</InputLabel>
                  <Select
                    value={messageType}
                    label="Message Type"
                    onChange={(e) => setMessageType(e.target.value)}
                  >
                    {messageTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Recipient"
                  value={user.email}
                  disabled
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  placeholder="Enter your message content here..."
                  defaultValue="Hello! This is a demo message from Courier."
                />

                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={isSending}
                  fullWidth
                  size="large"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>

                {lastSent && (
                  <Alert severity="success">
                    Message sent successfully at {lastSent}
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demo Configuration
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Demo User:</strong> {user.first_name} {user.last_name}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Phone:</strong> {user.phone_number}</Typography>
                <Typography><strong>Tenant ID:</strong> {tenantId}</Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Available Channels:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined">Email</Button>
                  <Button size="small" variant="outlined">SMS</Button>
                  <Button size="small" variant="outlined">Push</Button>
                  <Button size="small" variant="outlined">In-App</Button>
                </Box>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Message Templates:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Welcome messages
                  <br />
                  • Password reset
                  <br />
                  • Order confirmation
                  <br />
                  • Marketing campaigns
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Integration Example */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Courier Integration Example
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
              <Typography variant="body2">
                💡 Example API call to send a message:
                <br />
                POST https://api.courier.com/send
                <br />{' '}
                Authorization: Bearer YOUR_API_KEY
                <br />{' '}
                {'{'}
                <br />
                {'  "message": {'}
                <br />
                {'    "to": "'}{user.email}{'",'}
                <br />
                {'    "template": "'}{messageType}{'-template",'}
                <br />
                {'    "data": {'}
                <br />
                {'      "username": "'}{user.first_name}{'"'}
                <br />
                {'    }'}
                <br />
                {'  }'}
                <br />
                {'}'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DemoMessaging;
