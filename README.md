# Courier Demo - Sales Showcase SPA

A pure frontend Single Page Application showcasing Courier's core features for sales demos. **No backend, no database, no authentication required.**

## 🎯 What This Is

- **Pure Frontend SPA** - Built with React, Material-UI, and Courier SDKs
- **Sales Demo Ready** - Instant access, controlled environment
- **Vercel Deployed** - Static deployment with environment variables
- **Courier Integration** - Live Courier Create, Inbox, and API demonstrations

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone [your-repo]
cd basic-demo
npm install
npm start
```

### 2. For Production (Vercel)

**Prerequisites:** Courier API Key, Client Key, and Tenant ID

**Manual JWT Generation Required:**
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

**Vercel Environment Variables:**
```
REACT_APP_COURIER_CLIENT_KEY=ck_prod_xxxxx
REACT_APP_DEMO_TENANT_ID=tn_xxxxx  
REACT_APP_DEMO_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

## 🎨 Features

- ✅ **Dashboard** - Overview of all Courier features
- ✅ **Template Designer** - Live Courier Create integration
- ✅ **Preferences Viewer** - Static preference display
- ✅ **Inbox Demo** - Courier Inbox provider demonstration
- ✅ **Message Demo** - Direct Courier Send API integration
- ✅ **Mobile Responsive** - Material-UI design system

## 🔧 Architecture

```
/ (root)
├── src/
│   ├── contexts/DemoContext.tsx    # Static demo user + environment variables
│   ├── pages/
│   │   ├── Dashboard/              # Main dashboard with feature cards
│   │   ├── DemoDesigner/           # Courier Create integration
│   │   ├── DemoPreferences/        # Static preferences data
│   │   ├── Inbox/                  # Courier Inbox provider
│   │   └── Messaging/              # Direct Courier API integration
│   ├── components/Layout/          # Navigation sidebar
│   ├── App.tsx                     # Main app with routing
│   └── index.tsx                   # Entry point
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tsconfig.json                  # TypeScript config
├── vercel.json                    # Vercel deployment config
└── README.md                      # This file
```

## 🔧 Configuration

### Demo User (Edit `src/contexts/DemoContext.tsx`)
```typescript
const demoUser: DemoUser = {
  id: 1,
  username: 'demo_user',                    // ← Customize
  email: 'demo@company.com',               // ← Customize  
  first_name: 'Demo',                       // ← Customize
  last_name: 'User',                        // ← Customize
  courier_user_id: 'demo_user_courier_id',  // ← MUST match JWT
  phone_number: '+15551234567',             // ← Customize
};
```

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_COURIER_CLIENT_KEY` | Courier client key | `ck_prod_demo123...` |
| `REACT_APP_DEMO_TENANT_ID` | Courier tenant ID | `tn_demo123...` |
| `REACT_APP_DEMO_JWT` | Pre-generated JWT | `eyJhbGciOiJIUzI1Ni...` |

**⚠️ Important:** 
- JWT `user_id` scope must match `courier_user_id` above
- Generate JWT manually - cannot be automated
- JWT expires every 6 months - regenerate and update Vercel env vars

## 📱 Perfect for Sales

- **Zero Configuration** - Sales team just opens URL
- **No Demo Fails** - Controlled environment with static data
- **Fast Loading** - Pure static assets on CDN
- **Always Available** - No server maintenance required
- **Professional Look** - Material-UI design system

## 🔄 Maintenance

**JWT Token Refresh (Every 6 months):**
1. Generate new JWT using same curl command above
2. Update `REACT_APP_DEMO_JWT` in Vercel environment variables
3. Vercel auto-redeploys on environment changes

**Changing Demo User:**
1. Update `courier_user_id` in `src/contexts/DemoContext.tsx`
2. Regenerate JWT with matching `user_id:NEW_VALUE` in scope
3. Update Vercel environment variables

## 🚀 Vercel Deployment

1. **Connect Repository** (GitHub/GitLab/Bitbucket)
2. **Framework Preset:** `Vite` or `Other`
3. **Root Directory:** `./` (auto-detect)
4. **Environment Variables:** Add the 3 required variables
5. **Deploy**

**Vercel Configuration:**
- Framework: React SPA
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

## 🆘 Troubleshooting

**Courier Create doesn't load:**
- Check `REACT_APP_COURIER_CLIENT_KEY` is correct
- Verify `REACT_APP_DEMO_TENANT_ID` matches Courier account

**JWT errors:**
- Verify `REACT_APP_DEMO_JWT` is exact token from API response
- Check JWT hasn't expired
- Ensure JWT scope includes required permissions

**Messaging fails:**
- Check all 3 environment variables are set in Vercel
- Verify Courier account has send permissions

---

**Ready for Sales Demos!** 🎯 **No Backend Required!** 🚀