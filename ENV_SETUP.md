# Environment Setup for Courier Demo

The demo requires valid Courier credentials to work properly. You need to set up environment variables with real values from your Courier account.

## Required Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# Your Courier Client Key (get from Courier Dashboard -> Settings -> API Keys)
REACT_APP_COURIER_CLIENT_KEY=ck_prod_xxxxx

# Your Courier Tenant ID
REACT_APP_DEMO_TENANT_ID=tn_xxxxx

# A valid JWT token for the demo_user
REACT_APP_DEMO_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI...

# Optional: Override the Courier User ID (defaults to 'demo_user')
REACT_APP_COURIER_USER_ID=demo_user
```

## Generating a JWT Token

You need to generate a JWT token for your demo user. Here's how:

### Using cURL:
```bash
curl -X POST https://api.courier.com/auth/issue-token \
  -H "Authorization: Bearer YOUR_COURIER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "user_id:demo_user inbox:read:messages inbox:write:events",
    "expires_in": "30 days"
  }'
```

### Using Courier Dashboard:
1. Go to https://app.courier.com
2. Navigate to Settings -> API Keys
3. Click "Generate Token"
4. Set the user ID to `demo_user` (or your actual Courier user ID)
5. Set appropriate scopes (minimum: `inbox:read:messages`)
6. Copy the generated JWT token

## Creating the Demo User in Courier

If you haven't created a demo user yet:

1. Go to https://app.courier.com/users
2. Click "Create User"
3. Set the User ID to: `demo_user`
4. Add any email/phone/push notifications you want to test with

## What Changed

Previously, the demo was using hardcoded placeholder values. Now it:
- ✅ Uses actual environment variables
- ✅ Warns when JWT is missing
- ✅ Uses your real Courier user ID
- ✅ Requires valid authentication

## Troubleshooting

**"User not signed in" error:**
- Make sure `REACT_APP_DEMO_JWT` is set with a valid token
- Make sure `REACT_APP_COURIER_USER_ID` matches your Courier user ID

**"Invalid token" error:**
- Regenerate your JWT token with the correct scopes
- Make sure the token hasn't expired

**Check environment variables:**
```bash
# Load environment variables
npm start

# Check the console for warnings about missing JWT
```

