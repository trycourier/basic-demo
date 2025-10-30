# Courier Showcase - Courier v8 React SPA

A React application showcasing Courier's core features using Courier React v8.2.0. Demonstrates Inbox, Template Designer, and Preferences with real Courier integration.

## 🎯 What This Is

- **React SPA** - Built with React 19, Material-UI, and Courier React v8.2.0
- **Production Ready** - Uses real Courier APIs and authentication
- **Vercel Deployed** - Static deployment with environment variables
- **Courier Integration** - Live Inbox, Template Designer, and API demonstrations

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone [your-repo]
cd basic-demo
npm install
npm start
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
REACT_APP_COURIER_USER_ID=your-courier-user-id
REACT_APP_DEMO_JWT=your-jwt-token
REACT_APP_DEMO_TENANT_ID=your-tenant-id
```

### 3. Generate JWT Token

You need a valid JWT token to authenticate with Courier. Generate one using:

```bash
curl -X POST https://api.courier.com/auth/issue-token \
  -H "Authorization: Bearer YOUR_COURIER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "user_id:YOUR_USER_ID inbox:read:messages inbox:write:events",
    "expires_in": "30 days"
  }'
```

See `ENV_SETUP.md` for detailed instructions.

## 🎨 Features

- ✅ **Dashboard** - Overview of all Courier features
- ✅ **Inbox** - Live Courier Inbox with real-time notifications
- ✅ **Archived Notifications** - Example of fetching archived messages (v8 API)
- ✅ **Template Designer** - Live Courier Create integration
- ✅ **Preferences Viewer** - Notification preference display
- ✅ **Courier v8.2.0** - Latest Courier React SDK
- ✅ **Mobile Responsive** - Material-UI design system

## 🔧 Architecture

```
/ (root)
├── src/
│   ├── pages/
│   │   ├── Dashboard/                 # Main dashboard with feature cards
│   │   ├── Inbox/                     # Courier Inbox component
│   │   ├── ArchivedNotifications/     # Archived messages example
│   │   ├── Designer/                  # Courier Create integration
│   │   └── Preferences/               # Notification preferences
│   ├── components/Layout/              # Navigation sidebar
│   ├── App.tsx                        # Main app with routing
│   └── index.tsx                      # Entry point
├── public/                            # Static assets
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── vercel.json                        # Vercel deployment config
├── ENV_SETUP.md                       # Environment setup guide
└── README.md                          # This file
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_COURIER_USER_ID` | Courier user ID | `demo_user` |
| `REACT_APP_DEMO_JWT` | JWT token for authentication | `eyJhbGciOiJIUzI1Ni...` |
| `REACT_APP_DEMO_TENANT_ID` | Courier tenant ID (optional) | `tn_xxxxx...` |

**⚠️ Important:** 
- JWT `user_id` scope must match `REACT_APP_COURIER_USER_ID`
- JWT must have `inbox:read:messages` and `inbox:write:events` scopes
- Generate JWT using the API (see ENV_SETUP.md)
- JWT expires based on `expires_in` parameter when generating

## 📱 Key Features

- **Real Courier Integration** - Uses actual Courier APIs and authentication
- **Latest SDK** - Built with Courier React v8.2.0
- **Fast Loading** - Pure static assets on CDN
- **Always Available** - No server maintenance required
- **Professional Look** - Material-UI design system
- **Archived Messages Example** - Demonstrates Courier v8 API usage

## 🔄 Maintenance

**JWT Token Refresh:**
1. Generate new JWT using the curl command in ENV_SETUP.md
2. Update `REACT_APP_DEMO_JWT` in environment variables
3. Vercel auto-redeploys on environment changes

**Changing User:**
1. Update `REACT_APP_COURIER_USER_ID` in environment variables
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

**Inbox doesn't load:**
- Check `REACT_APP_DEMO_JWT` is set correctly
- Verify JWT hasn't expired
- Check browser console for authentication errors

**JWT errors:**
- Verify `REACT_APP_DEMO_JWT` is exact token from API response
- Check JWT hasn't expired  
- Ensure JWT scope includes `inbox:read:messages` and other required permissions
- Verify `REACT_APP_COURIER_USER_ID` matches the user_id in JWT scope

**Designer doesn't load:**
- Check `REACT_APP_DEMO_TENANT_ID` is set
- Verify tenant ID matches your Courier account

**General:**
- Check all environment variables are set
- Verify Courier account has necessary permissions
- Check browser console for detailed error messages

---

**Built with Courier React v8.2.0** 🚀 **Production Ready** ✨