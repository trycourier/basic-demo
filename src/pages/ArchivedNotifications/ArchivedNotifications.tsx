import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useCourier } from '@trycourier/courier-react';

const ArchivedNotifications: React.FC = () => {
  const courier = useCourier();
  const { inbox } = courier;
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

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

  // Get archived messages from the archive inbox dataset
  const archivedMessages = inbox?.archive?.messages ?? [];

  const handleFetchArchived = async () => {
    setIsLoading(true);
    try {
      // Fetch archived messages using the feedType
      await inbox.fetchNextPageOfMessages({ feedType: 'archive' });
      setHasFetched(true);
    } catch (error) {
      console.error('Error fetching archived messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📦 Archived Notifications
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          User: {userId}
        </Typography>
      </Box>

      <Box mb={3}>
        <Alert severity="info">
          Fetch and display archived notifications using Courier v8.2.0.
        </Alert>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleFetchArchived}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={16} />}
        >
          {isLoading ? 'Fetching...' : 'Load Archived Notifications'}
        </Button>
      </Box>

      {hasFetched && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Archived Messages ({archivedMessages.length})
          </Typography>

          {archivedMessages.length === 0 ? (
            <Alert severity="info">
              No archived notifications found for this user.
            </Alert>
          ) : (
            <List>
              {archivedMessages.map((msg) => (
                <ListItem
                  key={msg.messageId}
                  sx={{
                    borderBottom: '1px dashed #eee',
                    py: 2,
                  }}
                >
                  <ListItemText
                    primary={msg.title || 'Notification Message'}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {msg.body}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {msg.messageId}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ArchivedNotifications;

