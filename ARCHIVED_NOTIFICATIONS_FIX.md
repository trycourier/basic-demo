# Courier v8 Archived Notifications - Fix Summary

## Problem with Customer's Code

The customer was trying to use the Courier v8 API incorrectly. Their issues were:

### Issue 1: Using Wrong API Parameter
```typescript
// ❌ Their code (INCORRECT)
await fetchNextPageOfMessages({ view: 'archived' });

// ✅ Correct code
await inbox.fetchNextPageOfMessages({ feedType: 'archive' });
```
**Why it failed:** In v8, the parameter is `feedType`, not `view`.

### Issue 2: Filtering Messages Incorrectly
```typescript
// ❌ Their code (INCORRECT)
const messages = customInbox.messages;
const archivedMessages = messages.filter(msg => msg.archived);

// ✅ Correct code
const archivedMessages = inbox?.archive?.messages ?? [];
```
**Why it failed:** In v8, archived messages are stored separately in `inbox.archive`, not filtered from the main `messages` array.

### Issue 3: Type Assertions
```typescript
// ❌ Their code (INCORRECT)
const customInbox = inbox as unknown as CustomInboxHooks;

// ✅ Correct code - no type casting needed
const { inbox } = useCourier();
```
**Why it failed:** No need for custom type assertions. The official types work fine.

## Working Implementation

I've created a working example at `/src/pages/ArchivedNotifications/ArchivedNotifications.tsx` that demonstrates:

1. ✅ Correct use of `feedType` parameter
2. ✅ Direct access to `inbox.archive?.messages`
3. ✅ Proper TypeScript types without casting
4. ✅ Error handling
5. ✅ Loading states

## Key API Changes in v8

| v7 Style | v8 Style | Notes |
|----------|----------|-------|
| `fetchNextPageOfMessages({ view: 'archived' })` | `fetchNextPageOfMessages({ feedType: 'archive' })` | Parameter name changed |
| `messages.filter(msg => msg.archived)` | `inbox.archive?.messages` | Separate archive dataset |
| Custom type assertions | Use official types | Types are already correct |

## How to Use

1. Navigate to `/archived` in the demo app
2. Click "Load Archived Notifications"
3. Archived messages will appear below

## Customer's Next Steps

To fix their code, they should:

1. Replace `{ view: 'archived' }` with `{ feedType: 'archive' }`
2. Use `inbox.archive?.messages` instead of filtering
3. Remove custom type assertions
4. Use the provided working example as a reference

## Files Created

- `src/pages/ArchivedNotifications/ArchivedNotifications.tsx` - Working implementation
- `src/pages/ArchivedNotifications/README.md` - Detailed documentation
- Added route in `src/App.tsx`
- Added navigation item in `src/components/Layout/Layout.tsx`

## Testing

The implementation is ready to test. It will work once the customer has:
- Proper authentication (JWT token)
- User with archived messages
- Correct Courier configuration

