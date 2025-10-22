# How to Get a Safe API Key

The Safe Events Service requires authentication to register webhooks. You need a Safe API key.

## Steps to Get API Key:

### 1. Go to Safe Dashboard
Visit: **https://safe.global/dashboard** or **https://app.safe.global/settings/setup**

### 2. Connect Your Wallet
- Connect with MetaMask, WalletConnect, etc.
- You don't need to own a Safe to get an API key

### 3. Navigate to API Settings
- Look for "Settings" or "Developer" section
- Find "API Keys" or "Webhooks" option

### 4. Create API Key
- Click "Create API Key" or similar
- Copy the generated key
- **Important**: Save it securely (you can't view it again)

### 5. Add to Environment
```bash
# In .env.local
SAFE_API_KEY=your-api-key-here
```

## Alternative: Contact Safe Team

If the dashboard doesn't have API key generation yet:

1. **Email**: developers@safe.global
2. **Subject**: "Webhook Registration - API Key Request"
3. **Include**:
   - Your use case
   - Webhook URL: `https://safe-webhook-poc-production.up.railway.app/api/webhook`
   - Chains: Ethereum Mainnet (1), Sepolia (11155111)

## API Key Documentation

Check Safe's latest documentation:
- https://docs.safe.global
- https://docs.safe.global/core-api/how-to-use-api-keys

## Using the API Key

Once you have it, register your webhook:

```bash
# Set environment variable
export SAFE_API_KEY=your-actual-api-key

# Run registration script
npm run register-webhook
```

Or add directly to `.env.local`:
```env
SAFE_API_KEY=sk-xxx-your-key-here
```

## Troubleshooting

**403 Forbidden**:
- API key is required
- API key is invalid or expired
- Request new key

**404 Not Found**:
- Webhook endpoint may not be publicly available
- Check Safe's API documentation for correct endpoint

**401 Unauthorized**:
- API key format is incorrect
- Try different authentication methods (Bearer, X-API-Key, etc.)

---

**Current Status**: We got a 403 Forbidden when trying to register, which confirms authentication is required.

