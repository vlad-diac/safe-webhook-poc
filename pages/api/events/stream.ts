import type { NextApiRequest, NextApiResponse } from 'next';
import { eventsStore } from '@/lib/events-store';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial events
  const { address } = req.query;
  const safeAddress = typeof address === 'string' ? address : undefined;
  
  const initialEvents = eventsStore.getEvents(safeAddress);
  res.write(`data: ${JSON.stringify({ events: initialEvents })}\n\n`);

  // Subscribe to new events
  const unsubscribe = eventsStore.subscribe((allEvents) => {
    const filteredEvents = safeAddress
      ? allEvents.filter(e => e.address.toLowerCase() === safeAddress.toLowerCase())
      : allEvents;
    
    try {
      res.write(`data: ${JSON.stringify({ events: filteredEvents })}\n\n`);
    } catch (error) {
      // Client disconnected
      unsubscribe();
    }
  });

  // Clean up on client disconnect
  req.on('close', () => {
    unsubscribe();
  });
}
