# Courier Demo - Sales Showcase SPA

A pure frontend Single Page Application showcasing Courier's core features, designed for easy Vercel deployment.

## 🎯 What This Is

- **Pure Frontend SPA** - No backend, no database, no authentication
- **Sales Demo Ready** - Instant access, controlled environment
- **Vercel Optimized** - Static deployment with environment variables
- **Courier Integration** - Live Courier Create, Inbox, and API demos

## 🚀 Quick Deploy to Vercel

### 1. Generate JWT Token (Required - Manual Process)

**❗ IMPORTANT:** You must manually generate a long-lived JWT token using your Courier API key before deploying.

#### Option A: Using Postman
```
POST https://api.courier.com/auth/issue-token
Authorization: Bearer YOUR_COURIER_API_KEY
Content-Type: application/json

Body:
{
  "tenant_id": "YOUR_TENANT_ID",
  "scope": "user_id:demo_user_courier_id tenants:read tenants:notifications:read tenants:notifications:write tenants:brand:read tenant:YOUR_TENANT_ID:read tenant:YOUR_TENANT_ID:notification:read tenant:YOUR_TENANT_ID:notification:write tenant:YOUR_TENANT_ID:brand:read tenant:YOUR_TENANT_ID:brand:write",
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
    "scope": "user_id:demo_user_courier_id tenants:read tenants:notifications:read tenants:notifications:write tenants:brand:read tenant:YOUR_TENANT_ID:read tenant:YOUR_TENANT_ID:notification:read tenant:YOUR_TENANT_ID:notification:write tenant:YOUR_TENANT_ID:brand:read tenant:YOUR_TENANT_ID:brand:write",
    "expires_in": "6 months"
  }'
```

### 2. Set Environment Variables in Vercel

**Navigate to:** Vercel Dashboard → Your Project → Settings → Environment Variables

Add these **exact** environment variables:

```
REACT_APP_COURIER_CLIENT_KEY=your_courier_client_key_here
REACT_APP_DEMO_TENANT_ID=your_courier_tenant_id_here  
REACT_APP_DEMO_JWT=your_generated_jwt_token_here
```

### 3. Deploy

```bash
vercel --prod
```

## 🎨 Features

- ✅ **Dashboard** - Overview of all Courier features
- ✅ **Template Designer** - Courier Create integration
- ✅ **Preferences Viewer** - Static preference display
- ✅ **Inbox Demo** - Courier Inbox placeholder
- ✅ **Message Demo** - API integration examples
- ✅ **Mobile Responsive** - Works on all devices

## 🔧 Hardcoded Values (Configure These)

**📍 Edit in `src/contexts/DemoContext.tsx`:**

```typescript
// DEMO USER INFO (Customize these)
const demoUser: DemoUser = {
  id: 1,
  username: 'demo_user',                    // ← Customize
  email: 'demo@courier.com',                // ← Customize  
  first_name: 'Demo',                       // ← Customize
  last_name: 'User',                        // ← Customize
  courier_user_id: 'demo_user_courier_id',  // ← MUST match JWT scope
  phone_number: '+15551234567',             // ← Customize
};

// Environment Variables (Set in Vercel)
const demoClientKey = process.env.REACT_APP_COURIER_CLIENT_KEY || 'your-client-key';
const demoTenantId = process.env.REACT_APP_DEMO_TENANT_ID || 'your-tenant-id';  
const demoJwtToken = process.env.REACT_APP_DEMO_JWT || 'your-long-lived-demo-jwt';
```

**📍 Update `courier_user_id` in JWT generation:**
- Must match the `user_id:YOUR_VALUE` in JWT scope
- Must match `courier_user_id` in `DemoContext.tsx`

## 🏗️ Architecture

```
/ (root)
├── src/
│   ├── contexts/DemoContext.tsx    # Static demo user + env vars
│   ├── pages/
│   │   ├── DemoDesigner/          # Courier Create integration
│   │   ├── DemoPreferences/       # Static preferences data
│   │   ├── Inbox/                 # Courier Inbox demo
│   │   ├── Messaging/             # Message sending demo
│   │   └── Dashboard/             # Feature overview
│   ├── components/Layout/           # Navigation
│   ├── App.tsx                      # Main app with routing
│   └── index.tsx                    # Entry point
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                   # TypeScript
├── vercel.json                     # Vercel config
├── DEPLOYMENT.md                   # Detailed deploy guide
└── README.md                       # This file
```

## 📱 Perfect for Sales

- **Zero Configuration** - Sales team just opens URL
- **No Demo Fails** - Controlled environment with static data
- **Fast Loading** - Pure static assets
- **Always Available** - No server maintenance
- **Professional Look** - Material-UI design system

## 📋 Environment Variables Checklist

**Before deploying, ensure you have:**

- [ ] **Courier API Key** - From your Courier dashboard
- [ ] **Courier Client Key** - From your Courier dashboard  
- [ ] **Courier Tenant ID** - From your Courier dashboard
- [ ] **Generated JWT Token** - 6-month lifespan, specific scopes
- [ ] **Updated `courier_user_id`** - In both JWT and DemoContext

**Vercel Environment Variables:**
```
REACT_APP_COURIER_CLIENT_KEY=ck_test_xxxxx
REACT_APP_DEMO_TENANT_ID=tenant_xxxxx
REACT_APP_DEMO_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔄 Maintenance

**When the JWT expires (6 months):**
1. Generate new JWT token using the same process
2. Update `REACT_APP_DEMO_JWT` in Vercel environment variables
3. Redeploy automatically (triggered by env var change)

**If you need to change the demo user:**
1. Update `courier_user_id` in `src/contexts/DemoContext.tsx`
2. Regenerate JWT with matching `user_id:YOUR_NEW_VALUE`
3. Update Vercel environment variables

---

**Ready for Sales Demos!** 🎯