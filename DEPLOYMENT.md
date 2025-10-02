# Courier Demo - Vercel Deployment Guide

This is a pure frontend SPA (Single Page Application) designed for Vercel deployment.

## 🎯 Pre-Deployment Checklist

**Before you begin, gather these Courier credentials:**
- [ ] Courier API Key (from Dashboard → API Keys)
- [ ] Courier Client Key (from Dashboard → API Keys)  
- [ ] Courier Tenant ID (from Dashboard → Settings)
- [ ] Decide on `courier_user_id` value (e.g., `demo_user_courier_id`)

## 🚀 Deployment Steps

### Step 1: Configure Hardcoded Values

**Edit `src/contexts/DemoContext.tsx`** and update the demo user:

```typescript
const demoUser: DemoUser = {
  id: 1,
  username: 'demo_user',                           // ← Customize
  email: 'demo@yourcompany.com',                 // ← Customize  
  first_name: 'Demo',                             // ← Customize
  last_name: 'User',                              // ← Customize
  courier_user_id: 'YOUR_CHOSEN_USER_ID',        // ← IMPORTANT: Use this below
  phone_number: '+15551234567',                   // ← Customize
};
```

**⚠️ Note the `courier_user_id` value - you'll need it for JWT generation.**

### Step 2: Generate JWT Token (Required Manual Process)

**You MUST generate the JWT manually** - this cannot be automated.

#### Option A: Using Postman
1. Create new POST request to: `https://api.courier.com/auth/issue-token`
2. Headers:
   ```
   Authorization: Bearer YOUR_COURIER_API_KEY
   Content-Type: application/json
   ```
3. Body (replace `YOUR_TENANT_ID` and `YOUR_CHOSEN_USER_ID`):
   ```json
   {
     "tenant_id": "YOUR_TENANT_ID",
     "scope": "user_id:YOUR_CHOSEN_USER_ID tenants:read tenants:notifications:read tenants:notifications:write tenants:brand:read tenant:YOUR_TENANT_ID:read tenant:YOUR_TENANT_ID:notification:read tenant:YOUR_TENANT_ID:notification:write tenant:YOUR_TENANT_ID:brand:read tenant:YOUR_TENANT_ID:brand:write",
     "expires_in": "6 months"
   }
   ```

#### Option B: Using curl
```bash
curl -X POST https://api.courier.com/auth/issue-token \
  -H "Authorization: Bearer YOUR_COURIER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "YOUR_TENANT_ID",
     "scope": "user_id:YOUR_CHOSEN_USER_ID tenants:read tenants:notifications:read tenants:notifications:write tenants:brand:read tenant:YOUR_TENAnt_ID:read tenant:YOUR_TENAnt_ID:notification:read tenant:YOUR_TENANT_ID:notification:write tenant:YOUR_TENANT_ID:brand:read tenant:YOUR_TENANT_ID:brand:write",
    "expires_in": "6 months"
  }'
```

### Step 3: Configure Vercel Environment Variables

**Navigate to:** Vercel Dashboard → Your Project → Settings → Environment Variables

**Add these EXACT variables:**

```
REACT_APP_COURIER_CLIENT_KEY=ck_prod_xxxxxxxxx
REACT_APP_DEMO_TENANT_ID=tn_xxxxxxxxx  
REACT_APP_DEMO_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:** 
- Copy the JWT token exactly as returned from the API
- No quotes or additional characters
- Values are case-sensitive

### Step 4: Deploy to Vercel

**Option A: Git Integration (Recommended)**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Framework preset: `Vite` or `Other`
4. Root directory: `./` (leave empty for auto-detect)
5. Deploy automatically on every push

**Option B: CLI Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 📁 Project Structure

```
/
├── src/
│   ├── components/
│   │   └── Layout/          # Navigation layout
│   ├── contexts/
│   │   └── DemoContext.tsx  # Static demo user context
│   ├── pages/
│   │   ├── Dashboard/       # Main dashboard
│   │   ├── DemoDesigner/    # Courier Create integration
│   │   ├── DemoPreferences/ # Preferences viewer
│   │   ├── Inbox/           # Courie inbox placeholder
│   │   └── Messaging/       # Message sending demo
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
└── vercel.json             # Vercel deployment config
```

## 🎯 Demo Features

- ✅ **No Authentication Required** - Instant access for sales demos
- ✅ **Couier Create Integration** - Live template designer
- ✅ **Static User Data** - Pre-configured demo user, customize in DemoContext
- ✅ **Preferences Viewer** - Static read-only preferences display
- ✅ **Message Sending Demo** - Direct Courier Send API integration
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Sales-Ready** - Professional Material-UI design

## 🔧 Key Files for Customization

| File | Purpose | What to Customize |
|------|---------|------------------|
| `src/contexts/DemoContext.tsx` | Demo user data & environment variables | User info, courier_user_id |
| `src/pages/DemoDesigner/DemoDesigner.tsx` | Courier Create integration | Template ID, styling |
| `src/pages/DemoPreferences/DemoPreferences.tsx` | Static preferences display | Preference data (DEMO_PREFERENCES) |
| `src/pages/Messaging/Messaging.tsx` | Message sending demo | Template IDs, API integration |

## 📝 Environment Variables Reference

**Required for Vercel deployment:**

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `REACT_APP_COURIER_CLIENT_KEY` | Your Courier client key | `ck_prod_demo123...` | ✅ Yes |
| `REACT_APP_DEMO_TENANT_ID` | Your Courier tenant ID | `tn_demo123...` | ✅ Yes |
| `REACT_APP_DEMO_JWT` | Pre-generated JWT token | `eyJhbGciOiJIUzI1NiIsInR5cCI...` | ✅ Yes |

**⚠️ Important Notes:**
- All values are **case-sensitive**
- JWT token must match the `courier_user_id` in DemoContext
- No quotes or extra characters in environment variables

## 🔄 Maintenance & Troubleshooting

### When JWT Token Expires (Every 6 months):
1. Generate new JWT using the same process above
2. Update `REACT_APP_DEMO_JWT` in Vercel environment variables
3. Redeploy automatically (triggered by env var change)

### If Demo Features Don't Work:
1. **Check Environment Variables** - Verify all 3 are set correctly in Vercel
2. **Check JWT Scope** - Ensure it includes all required permissions
3. **Check User ID Match** - `courier_user_id` in DemoContext must match JWT scope
4. **Check Courier Dashboard** - Ensure your Courier account is active

### If You Need to Change Demo User:
1. Update `courier_user_id` in `src/contexts/DemoContext.tsx`
2. Regenerate JWT with matching `user_id:YOUR_NEW_VALUE` in scope
3. Update `REACT_APP_DEMO_JWT` in Vercel environment variables

## 🎯 Vercel Configuration Settings

**Framework Preset:** `Vite` or `Other`
**Root Directory:** `./` (or leave empty for auto-detect)
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `build` (auto-detected)
**Install Command:** `npm install` (auto-detected)
