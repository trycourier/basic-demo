import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  Paper,
  GridLegacy as Grid,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useCourier } from '@trycourier/courier-react';

interface MessageGroup {
  date: string;
  messages: any[];
}

const ArchivedNotifications: React.FC = () => {
  const courier = useCourier();
  const { inbox } = courier;
  const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
  const jwtToken = process.env.REACT_APP_DEMO_JWT;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [lastFetchResult, setLastFetchResult] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const removeError = React.useCallback(() => {
    setError(null);
  }, []);

  // Authenticate with Courier using JWT
  useEffect(() => {
    if (jwtToken && userId) {
      courier.auth.signIn({
        userId,
        jwt: jwtToken,
      });
      setIsAuthenticated(true);
      // Load inbox after authentication - wait a bit for initialization
      setTimeout(() => {
        if (inbox?.load) {
          inbox.load().catch((err: any) => {
            console.error('Error loading inbox:', err);
          });
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define handleFetchArchived before using it in useEffect
  const handleFetchArchived = React.useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    removeError();
    
    try {
      if (!inbox) {
        throw new Error('Inbox not initialized. Please ensure authentication is complete.');
      }

      // Fetch archived messages using the datasetId (v9 API change)
      const result = await inbox.fetchNextPageOfMessages({ datasetId: 'archive' });
      
      if (result) {
        setLastFetchResult(result);
        setHasFetched(true);
      } else {
        setHasFetched(true);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch archived messages';
      setError(errorMessage);
      console.error('Error fetching archived messages:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [inbox, removeError]);

  // Auto-load archived messages after authentication
  useEffect(() => {
    if (isAuthenticated && jwtToken && userId && !hasFetched && inbox) {
      // Small delay to ensure inbox is fully initialized
      const timer = setTimeout(() => {
        handleFetchArchived(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, jwtToken, userId, inbox, hasFetched, handleFetchArchived]);

  // Get archived messages from the archive inbox dataset
  const archivedMessages = inbox?.archive?.messages ?? [];
  // Check if there are more messages to load
  // If the last fetch returned results with messages, there might be more pages
  // Note: The actual pagination check depends on the Courier API implementation
  const hasMoreMessages = !!(
    lastFetchResult && 
    lastFetchResult.messages && 
    Array.isArray(lastFetchResult.messages) &&
    lastFetchResult.messages.length > 0
  );

  // Format date for grouping
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown Date';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown time';
    return new Date(timestamp).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: any[]): MessageGroup[] => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach((msg) => {
      const dateKey = formatDate(msg.created || msg.archivedAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    // Sort groups by date (most recent first)
    const sortedGroups = Object.entries(groups)
      .sort((a, b) => {
        // Today and Yesterday come first
        if (a[0] === 'Today') return -1;
        if (b[0] === 'Today') return 1;
        if (a[0] === 'Yesterday') return -1;
        if (b[0] === 'Yesterday') return 1;
        // Otherwise sort by date
        return b[1][0]?.created - a[1][0]?.created;
      })
      .map(([date, messages]) => ({
        date,
        messages: messages.sort((a, b) => (b.created || 0) - (a.created || 0)),
      }));

    return sortedGroups;
  };

  const messageGroups = groupMessagesByDate(archivedMessages);

  const handleLoadMore = async () => {
    if (!isLoadingMore && hasMoreMessages) {
      await handleFetchArchived(false);
    }
  };

  const toggleMessageExpanded = (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessages(newExpanded);
  };

  if (!jwtToken) {
    return (
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            📦 Archived Notifications
          </Typography>
        </Box>
        <Alert severity="error">
          <Typography variant="body2">
            <strong>Missing Configuration:</strong> REACT_APP_DEMO_JWT is not set. 
            Please create a .env file with your Courier credentials. See ENV_SETUP.md for instructions.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📦 Archived Notifications
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Reference implementation for fetching and managing archived messages using Courier v8.2.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          User: <strong>{userId}</strong>
        </Typography>
      </Box>

      <Box mb={3}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Reference Implementation:</strong> This page demonstrates how to properly fetch, 
            display, and manage archived notifications using Courier React v8.2.0 API. Messages are 
            automatically loaded and grouped by date.
          </Typography>
        </Alert>
      </Box>

      {/* Error Display */}
      {error && (
        <Box mb={3}>
          <Alert severity="error" onClose={removeError}>
            <Typography variant="body2">
              <strong>Error:</strong> {error}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => handleFetchArchived(true)}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
        
        {hasFetched && archivedMessages.length > 0 && (
          <Chip 
            label={`${archivedMessages.length} archived message${archivedMessages.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Loading State */}
      {isLoading && !hasFetched && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {hasFetched && archivedMessages.length === 0 && !isLoading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Archived Messages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no archived notifications for this user.
          </Typography>
        </Paper>
      )}

      {/* Messages by Date */}
      {hasFetched && messageGroups.length > 0 && (
        <Box>
          {messageGroups.map((group, groupIndex) => (
            <Box key={group.date} sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                <ScheduleIcon fontSize="small" />
                {group.date}
                <Chip 
                  label={group.messages.length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {group.messages.map((msg) => {
                  const isExpanded = expandedMessages.has(msg.messageId);
                  
                  return (
                    <Grid item xs={12} key={msg.messageId}>
                      <Card 
                        sx={{ 
                          opacity: msg.read ? 0.85 : 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: 4,
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="h6" 
                                component="div"
                                sx={{ 
                                  fontWeight: msg.read ? 400 : 600,
                                  mb: 1,
                                }}
                              >
                                {msg.title || 'Notification'}
                              </Typography>
                              
                              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                {!msg.read && (
                                  <Chip 
                                    label="Unread" 
                                    size="small" 
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                                {msg.channels && Array.isArray(msg.channels) && msg.channels.length > 0 && (
                                  msg.channels.map((channel: string) => (
                                    <Chip 
                                      key={channel}
                                      label={channel} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  ))
                                )}
                                <Chip 
                                  icon={<ScheduleIcon />}
                                  label={formatTimestamp(msg.created || msg.archivedAt)} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Stack>
                            </Box>

                            <Tooltip title={isExpanded ? 'Show less' : 'Show details'}>
                              <IconButton
                                size="small"
                                onClick={() => toggleMessageExpanded(msg.messageId)}
                              >
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: isExpanded ? 2 : 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {msg.body || 'No message body'}
                          </Typography>

                          {isExpanded && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                                <Box><strong>Message ID:</strong> {msg.messageId}</Box>
                                {msg.created && (
                                  <Box><strong>Created:</strong> {new Date(msg.created).toLocaleString()}</Box>
                                )}
                                {msg.archivedAt && (
                                  <Box><strong>Archived:</strong> {new Date(msg.archivedAt).toLocaleString()}</Box>
                                )}
                                {msg.data && Object.keys(msg.data).length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <strong>Data:</strong>
                                    <pre style={{ margin: '8px 0', fontSize: '0.75rem', overflow: 'auto' }}>
                                      {JSON.stringify(msg.data, null, 2)}
                                    </pre>
                                  </Box>
                                )}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}

          {/* Load More Button */}
          {hasMoreMessages && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                startIcon={isLoadingMore ? <CircularProgress size={16} /> : null}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Messages'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ArchivedNotifications;
