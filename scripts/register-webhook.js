/**
 * Script to register webhook with Safe's official Events Service
 * 
 * Usage:
 *   node scripts/register-webhook.js
 * 
 * Make sure to set environment variables first:
 *   PUBLIC_URL=https://your-app.vercel.app
 *   WEBHOOK_SECRET=your-secret-token
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const SAFE_EVENTS_API = process.env.SAFE_EVENTS_API || 'https://safe-events.safe.global';
const PUBLIC_URL = process.env.PUBLIC_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!PUBLIC_URL) {
  console.error('❌ PUBLIC_URL is required. Set it in .env.local');
  process.exit(1);
}

if (!WEBHOOK_SECRET) {
  console.error('❌ WEBHOOK_SECRET is required. Set it in .env.local');
  process.exit(1);
}

async function registerWebhook() {
  const webhookUrl = `${PUBLIC_URL}/api/webhook`;
  
  console.log('📝 Registering webhook with Safe Events Service...');
  console.log('Webhook URL:', webhookUrl);
  console.log('API Endpoint:', SAFE_EVENTS_API);

  try {
    const response = await axios.post(
      `${SAFE_EVENTS_API}/webhooks`,
      {
        url: webhookUrl,
        authToken: WEBHOOK_SECRET,
        chainIds: [1, 11155111], // Mainnet and Sepolia
        eventTypes: ['ALL'], // All event types
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Webhook registered successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to register webhook');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n💡 Note: Safe Events Service may require authentication or have different API structure.');
    console.log('   Check the latest docs at https://docs.safe.global');
    
    process.exit(1);
  }
}

registerWebhook();

