import type { NextApiRequest, NextApiResponse } from 'next';
import { eventsStore } from '@/lib/events-store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook secret (if configured)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
        console.warn('⚠️ Unauthorized webhook request');
        // Still return 202 to not reveal authentication failure
        return res.status(202).send('');
      }
    }

    const event = req.body;

    console.log('📨 Received Safe webhook event:', {
      type: event.type,
      address: event.address,
      chainId: event.chainId,
    });

    // Respond immediately with 202 (Safe's requirement)
    res.status(202).send('');

    // Process event asynchronously
    setImmediate(() => {
      try {
        // Store the event
        eventsStore.addEvent({
          address: event.address,
          type: event.type,
          chainId: event.chainId,
          data: event,
        });

        console.log('✅ Event stored successfully');
      } catch (error) {
        console.error('❌ Error processing event:', error);
      }
    });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    // Always return 202 even on error (already responded)
    if (!res.headersSent) {
      res.status(202).send('');
    }
  }
}

