# Archived Notifications with Courier v8

This page demonstrates how to properly fetch and display archived notifications using Courier React v8.2.0.

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

// Get archived messages directly from the archive dataset
const archivedMessages = inbox?.archive?.messages ?? [];

// Fetch archived messages using feedType (not 'view')
await inbox.fetchNextPageOfMessages({ feedType: 'archive' });
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
    fetchNextPageOfMessages: (props: { feedType: 'inbox' | 'archive' }) => Promise<InboxDataSet | null>,
    inbox?: InboxDataSet,     // Regular inbox messages
    archive?: InboxDataSet,   // Archived messages
    // ... other methods
  },
  toast: { ... }
}
```

### Key Methods:
- **`inbox.archive?.messages`** - Array of archived messages
- **`inbox.fetchNextPageOfMessages({ feedType: 'archive' })`** - Fetch archived messages
- **`inbox.fetchNextPageOfMessages({ feedType: 'inbox' })`** - Fetch regular inbox messages

## Common Pitfalls

1. ❌ Using `{ view: 'archived' }` - should be `{ feedType: 'archive' }`
2. ❌ Filtering `messages` by `archived` property - use `inbox.archive?.messages` instead
3. ❌ Type casting `inbox as CustomInboxHooks` - proper types are already available

## Example Usage

```typescript
import { useCourier } from '@trycourier/courier-react';

const MyComponent = () => {
  const { inbox } = useCourier();
  
  // Get archived messages
  const archivedMessages = inbox?.archive?.messages ?? [];
  
  // Fetch more archived messages
  const handleFetch = async () => {
    await inbox.fetchNextPageOfMessages({ feedType: 'archive' });
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

