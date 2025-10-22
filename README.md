# Safe Webhook POC

A minimal Next.js app to test Safe's official webhook integration. Deploy to Vercel in minutes!

## Features

- 🔐 Receives webhooks from Safe's official Events Service
- 🎯 Filter events by Safe address
- ⚡ Real-time event display with Server-Sent Events (SSE)
- 🔒 Webhook authentication with secret token
- 📊 Beautiful event viewer with color coding

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
WEBHOOK_SECRET=your-super-secret-random-token-here
PUBLIC_URL=http://localhost:3000
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Railway

### 1. Push to GitHub 

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/safe-webhook-poc.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js configuration
5. Add environment variable:
   - `WEBHOOK_SECRET`: Generate a random secure token
   - Click "Generate Domain" to get a public URL

### 3. Get Your Webhook URL

After deployment, your webhook endpoint will be:
```
https://your-app-name.up.railway.app/api/webhook
```

### 4. Register Webhook with Safe

Option A: Use the registration script (may require adjustments based on Safe's API):
```bash
# Set your Vercel URL
export PUBLIC_URL=https://your-app-name.vercel.app
export WEBHOOK_SECRET=your-secret-token

npm run register-webhook
```

Option B: Manual registration via Safe's API or admin panel
- Endpoint: `https://safe-events.safe.global/webhooks` (or check latest docs)
- Method: POST
- Body:
  ```json
  {
    "url": "https://your-app-name.vercel.app/api/webhook",
    "authToken": "your-secret-token",
    "chainIds": [1, 11155111],
    "eventTypes": ["ALL"]
  }
  ```

## Usage

1. Open your deployed app
2. Enter a Safe address to monitor (e.g., `0x...`)
3. Click "Filter Events"
4. Events will appear in real-time as they're received!

## Event Types

The POC displays all Safe event types:

- ✅ **EXECUTED_MULTISIG_TRANSACTION** - Transaction executed on-chain
- ⏳ **PENDING_MULTISIG_TRANSACTION** - New transaction proposed
- ✍️ **NEW_CONFIRMATION** - Owner signed transaction
- ❌ **DELETED_MULTISIG_TRANSACTION** - Transaction cancelled
- 💰 **INCOMING_ETHER/TOKEN** - Safe received funds
- 💸 **OUTGOING_ETHER/TOKEN** - Safe sent funds

## API Endpoints

- `POST /api/webhook` - Receives events from Safe
- `GET /api/events?address=0x...` - Get stored events (filtered by address)
- `GET /api/events/stream?address=0x...` - SSE stream of real-time events

## Testing Locally

To test without deploying:

1. Use [ngrok](https://ngrok.com) to expose your local server:
   ```bash
   ngrok http 3000
   ```

2. Update `.env.local` with ngrok URL:
   ```env
   PUBLIC_URL=https://your-ngrok-id.ngrok.io
   ```

3. Register the ngrok URL with Safe

## Security Notes

- ✅ Webhook endpoint validates secret token
- ✅ Always returns 202 status (Safe's requirement)
- ✅ Processes events asynchronously
- ⚠️ In-memory storage (POC only - events lost on restart)
- ⚠️ For production, use a database (PostgreSQL, etc.)

## Troubleshooting

**No events received?**
- Check Safe's webhook is registered with correct URL
- Verify WEBHOOK_SECRET matches in Safe and your app
- Check Railway logs for incoming requests (View Logs in Railway dashboard)
- Test webhook endpoint manually:
  ```bash
  curl -X POST https://your-app.up.railway.app/api/webhook \
    -H "Authorization: Bearer your-secret" \
    -H "Content-Type: application/json" \
    -d '{"type":"TEST","address":"0x123","chainId":"1"}'
  ```

**Events not filtering?**
- Ensure Safe address is checksummed (proper case)
- Check browser console for errors
- Verify SSE connection is established

## Next Steps

Once this POC works, you can:
1. Integrate the webhook handler into your main app
2. Add database persistence
3. Add more sophisticated filtering
4. Implement retry logic for failed processing
5. Add monitoring and alerting

## Resources

- [Safe Docs](https://docs.safe.global)
- [Safe Events Service](https://github.com/safe-global/safe-events-service)
- [Safe Transaction Service API](https://docs.safe.global/core-api/transaction-service-overview)

