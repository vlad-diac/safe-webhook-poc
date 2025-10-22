# Railway Deployment Guide

## Step-by-Step Railway Deployment

### Prerequisites
- GitHub account
- Railway account (free tier available at https://railway.app)

### 1. Prepare Repository

```bash
cd safe-webhook-poc

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Safe webhook POC"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/safe-webhook-poc.git
git push -u origin main
```

### 2. Deploy on Railway

#### Option A: GitHub Integration (Recommended)

1. **Go to Railway**: https://railway.app/new
2. **Deploy from GitHub**:
   - Click "Deploy from GitHub repo"
   - Select your `safe-webhook-poc` repository
   - Railway will automatically detect it's a Next.js project
3. **Configure Environment**:
   - Go to the "Variables" tab
   - Add `WEBHOOK_SECRET`:
     ```
     WEBHOOK_SECRET=<generate-secure-token>
     ```
     Generate a secure token:
     ```bash
     openssl rand -hex 32
     ```
4. **Generate Public Domain**:
   - Go to "Settings" tab
   - Under "Networking" section
   - Click "Generate Domain"
   - Copy your domain (e.g., `https://safe-webhook-poc-production.up.railway.app`)

#### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your Railway project
railway link

# Deploy
railway up

# Set environment variable
railway variables set WEBHOOK_SECRET=<your-secure-token>

# Generate domain
railway domain
```

### 3. Verify Deployment

1. **Check Deployment Status**:
   - Go to Railway dashboard
   - Check "Deployments" tab
   - Wait for "Success" status

2. **Test Your Endpoint**:
   ```bash
   curl https://your-app.up.railway.app/api/webhook \
     -X POST \
     -H "Authorization: Bearer your-webhook-secret" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "TEST",
       "address": "0x123",
       "chainId": "1"
     }'
   ```

   Should return: (no body, status 202)

3. **Open Your App**:
   ```
   https://your-app.up.railway.app
   ```

### 4. Configure Webhook with Safe

Now that you have a public URL, register it with Safe:

```bash
# Set environment variables
export PUBLIC_URL=https://your-app.up.railway.app
export WEBHOOK_SECRET=your-actual-secret-token

# Run registration script
npm run register-webhook
```

**Or manually register** (if script doesn't work):
```bash
curl -X POST https://safe-events.safe.global/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.up.railway.app/api/webhook",
    "authToken": "your-webhook-secret",
    "chainIds": [1, 11155111],
    "eventTypes": ["ALL"]
  }'
```

### 5. Monitor Logs

View logs in real-time:

**Via Dashboard**:
- Go to Railway project
- Click on your service
- Click "View Logs"

**Via CLI**:
```bash
railway logs
```

### Railway-Specific Features

#### Auto-Deploy on Git Push
Railway automatically redeploys when you push to main:
```bash
git add .
git commit -m "Update webhook handler"
git push
```

#### Environment Variables
Manage via dashboard or CLI:
```bash
# List variables
railway variables

# Set variable
railway variables set KEY=value

# Delete variable
railway variables delete KEY
```

#### Custom Domain (Optional)
1. Go to Settings → Networking
2. Click "Custom Domain"
3. Add your domain (e.g., `webhooks.yourdomain.com`)
4. Update DNS records as shown

### Troubleshooting

**Build Failed?**
- Check Railway logs for errors
- Ensure `package.json` has correct `build` and `start` scripts
- Verify Node.js version compatibility

**502 Bad Gateway?**
- App might be starting up (wait 30 seconds)
- Check logs for startup errors
- Verify PORT is not hardcoded (Railway assigns it dynamically)

**Webhook Not Receiving Events?**
- Verify domain is publicly accessible
- Check Railway logs for incoming requests
- Test with curl (see step 3)
- Verify WEBHOOK_SECRET matches Safe registration

**Environment Variables Not Working?**
- Restart deployment after adding variables
- Check variable names match exactly (case-sensitive)
- Use Railway CLI to verify: `railway variables`

### Cost & Limits

**Free Tier**:
- $5 free credits per month
- Enough for this POC (very low usage)
- Includes custom domains

**Upgrade if needed**:
- Only if you exceed free credits
- POC should stay well within limits

### Next Steps

Once deployed and working:

1. ✅ Test with real Safe transactions
2. ✅ Monitor logs for incoming webhooks
3. ✅ Integrate webhook handler into main app
4. ✅ Add database for persistent storage
5. ✅ Set up monitoring/alerts

---

**Railway Dashboard**: https://railway.app/dashboard
**Railway Docs**: https://docs.railway.app
**Safe Docs**: https://docs.safe.global

