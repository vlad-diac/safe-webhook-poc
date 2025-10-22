import type { NextApiRequest, NextApiResponse } from 'next';
import { eventsStore } from '@/lib/events-store';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;
  const safeAddress = typeof address === 'string' ? address : undefined;

  const events = eventsStore.getEvents(safeAddress);

  res.status(200).json({ events });
}

