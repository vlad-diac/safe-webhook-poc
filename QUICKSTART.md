# Quick Start Guide

## Test Locally in 3 Minutes

### 1. Install & Run
```bash
cd safe-webhook-poc
npm install
npm run dev
```

### 2. Open Browser
Go to http://localhost:3000

### 3. Test Webhook
In another terminal, send a test event:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Authorization: Bearer test-secret-token-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xe193348fDC666476b80e1427e3a2Eb9646224994",
    "type": "EXECUTED_MULTISIG_TRANSACTION",
    "safeTxHash": "0xtest123",
    "txHash": "0xtest456",
    "to": "0x123",
    "data": null,
    "failed": "false",
    "chainId": "1"
  }'
```

### 4. Filter Events
In the browser:
- Enter Safe address: `0xe193348fDC666476b80e1427e3a2Eb9646224994`
- Click "Filter Events"
- You should see the test event appear!

## Deploy to Railway

### 1. Create GitHub Repo
```bash
git init
git add .
git commit -m "Safe webhook POC"
git remote add origin https://github.com/YOUR_USERNAME/safe-webhook-poc.git
git push -u origin main
```

### 2. Deploy
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `safe-webhook-poc` repository
4. Railway auto-detects Next.js (no config needed!)
5. Add environment variable in Railway dashboard:
   - **Key**: `WEBHOOK_SECRET`
   - **Value**: Generate a secure random token (e.g., use `openssl rand -hex 32`)
6. In Settings → Networking, click "Generate Domain"

### 3. Get Your URL
After deployment, copy your Railway URL from the Settings:
```
https://your-app-name.up.railway.app
```

### 4. Register with Safe
Update `.env.local` with your Railway URL and run:
```bash
export PUBLIC_URL=https://your-app-name.up.railway.app
export WEBHOOK_SECRET=your-generated-token
npm run register-webhook
```

**Note**: Safe's webhook registration API may require authentication or have different endpoints. Check their latest docs at https://docs.safe.global

## Manual Testing

Test different event types:

**Pending Transaction:**
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Authorization: Bearer test-secret-token-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xe193348fDC666476b80e1427e3a2Eb9646224994",
    "type": "PENDING_MULTISIG_TRANSACTION",
    "safeTxHash": "0xabc123",
    "to": "0xdef456",
    "data": null,
    "chainId": "1"
  }'
```

**New Confirmation:**
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Authorization: Bearer test-secret-token-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xe193348fDC666476b80e1427e3a2Eb9646224994",
    "type": "NEW_CONFIRMATION",
    "owner": "0x789abc",
    "safeTxHash": "0xabc123",
    "chainId": "1"
  }'
```

**Incoming Ether:**
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Authorization: Bearer test-secret-token-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xe193348fDC666476b80e1427e3a2Eb9646224994",
    "type": "INCOMING_ETHER",
    "txHash": "0xtx123",
    "value": "1000000000000000000",
    "chainId": "1"
  }'
```

That's it! 🎉

