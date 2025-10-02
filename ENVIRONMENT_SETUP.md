# Environment Variables Setup Guide

## 🎯 Required Credentials

Before deploying to Vercel, gather these from your Courier Dashboard:

### 1. Courier API Key
- **Location:** Dashboard → Settings → API Keys
- **Format:** `pk_prod_xxxxxxxxxxxxxxxxxxx` or `pk_test_xxxxxxxxxxxxxxxxxxx`
- **Usage:** For generating JWT tokens

### 2. Courier Client Key  
- **Location:** Dashboard → Settings → API Keys
- **Format:** `ck_prod_xxxxxxxxxxxxxxxxxxx` or `ck_test_xxxxxxxxxxxxxxxxxxx`
- **Usage:** For Courier SDK frontend integration

### 3. Courier Tenant ID
- **Location:** Dashboard → Settings → Account Settings
- **Format:** `tn_xxxxxxxxxxxxxxxxxxx`
- **Usage:** Multi-tenant application identifier

## 🔧 Vercel Environment Variables

Set these **exact** variable names in Vercel Dashboard → Project → Settings → Environment Variables:

```
REACT_APP_COURIER_CLIENT_KEY=ck_prod_your_client_key_here
REACT_APP_DEMO_TENANT_ID=tn_your_tenant_id_here
REACT_APP_DEMO_JWT=your_6month_jwt_token_here
```

## ⚠️ Important Notes

1. **No Quotes Required** - Don't wrap values in quotes
2. **Case Sensitive** - Exact spelling and capitalization matters
3. **JWT Must Pre-exist** - Generate manually before deploying (see DEPLOYMENT.md)
4. **User ID Matching** - JWT scope must match `courier_user_id` in DemoContext

## 🔍 Verification

After setting environment variables:

1. **Check Vercel Dashboard** - Verify all 3 variables are listed
2. **Check Case Sensitivity** - Ensure exact naming matches above
3. **Check Values** - No extra spaces or characters
4. **Test Deployment** - Redeploy after adding env vars

## 🆘 Troubleshooting

**If Courier Create doesn't load:**
- Check `REACT_APP_COURIER_CLIENT_KEY` is correct
- Check `REACT_APP_DEMO_TENANT_ID` matches your Courier account

**If JWT errors occur:**
- Check `REACT_APP_DEMO_JWT` is the exact token from API response
- Verify JWT hasn't expired
- Ensure JWT scope includes required permissions

**If messaging fails:**
- Check all 3 environment variables are set
- Verify Courier account is active and has send permissions
