# Archived Notifications with Courier v9

This page demonstrates how to properly fetch and display archived notifications using Courier React v9.0.2.

## Key Differences from v7

### ❌ Incorrect v7-style approach:
```typescript
// This WON'T work in v8
const messages = customInbox.messages;
const archivedMessages = messages.filter(msg => msg.archived);
await fetchNextPageOfMessages({ view: 'archived' });
```

### ✅ Correct v8 approach:
```typescript
// Proper v8 usage
const courier = useCourier();
const { inbox } = courier;

// Get archived messages directly from the archive dataset (v9 API - accessed via feeds)
const archivedMessages = inbox?.feeds?.['archive']?.messages ?? [];

// Fetch archived messages using datasetId (v9 API - was feedType in v8)
await inbox.fetchNextPageOfMessages({ datasetId: 'archive' });
```

## API Reference

### `useCourier()` Hook Returns:
```typescript
{
  shared: Courier,      // Shared Courier instance
  auth: {
    signIn: (props) => void,
    signOut: () => void,
  },
  inbox: {
    load: () => Promise<void>,
    fetchNextPageOfMessages: (props: { datasetId: 'inbox' | 'archive' }) => Promise<InboxDataSet | null>,
    feeds: Record<string, InboxDataSet>,  // All datasets including 'archive' and 'inbox'
    // ... other methods
  },
  toast: { ... }
}
```

### Key Methods:
- **`inbox.feeds?.['archive']?.messages`** - Array of archived messages (v9 API)
- **`inbox.fetchNextPageOfMessages({ datasetId: 'archive' })`** - Fetch archived messages
- **`inbox.fetchNextPageOfMessages({ datasetId: 'inbox' })`** - Fetch regular inbox messages

## Common Pitfalls

1. ❌ Using `{ view: 'archived' }` or `{ feedType: 'archive' }` - should be `{ datasetId: 'archive' }` in v9
2. ❌ Filtering `messages` by `archived` property - use `inbox.feeds?.['archive']?.messages` instead (v9 API)
3. ❌ Type casting `inbox as CustomInboxHooks` - proper types are already available

## Example Usage

```typescript
import { useCourier } from '@trycourier/courier-react';

const MyComponent = () => {
  const { inbox } = useCourier();
  
  // Get archived messages (v9 API - accessed via feeds)
  const archivedMessages = inbox?.feeds?.['archive']?.messages ?? [];
  
  // Fetch more archived messages
  const handleFetch = async () => {
    await inbox.fetchNextPageOfMessages({ datasetId: 'archive' });
  };
  
  return (
    <div>
      <button onClick={handleFetch}>Load More</button>
      {archivedMessages.map(msg => (
        <div key={msg.messageId}>{msg.title}</div>
      ))}
    </div>
  );
};
```

