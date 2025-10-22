// Simple in-memory event store for POC
// In production, you'd use a database

export interface SafeEvent {
  id: string;
  timestamp: string;
  address: string;
  type: string;
  chainId: string;
  data: any;
}

class EventsStore {
  private events: SafeEvent[] = [];
  private maxEvents = 100; // Keep last 100 events
  private listeners: Set<(events: SafeEvent[]) => void> = new Set();

  addEvent(event: Omit<SafeEvent, 'id' | 'timestamp'>) {
    const newEvent: SafeEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.events.unshift(newEvent); // Add to beginning
    
    // Keep only maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Notify listeners
    this.notifyListeners();

    return newEvent;
  }

  getEvents(safeAddress?: string): SafeEvent[] {
    if (!safeAddress) {
      return this.events;
    }
    
    // Filter by Safe address (case-insensitive)
    return this.events.filter(
      event => event.address.toLowerCase() === safeAddress.toLowerCase()
    );
  }

  subscribe(listener: (events: SafeEvent[]) => void) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.events);
    });
  }

  clear() {
    this.events = [];
    this.notifyListeners();
  }
}

// Singleton instance
export const eventsStore = new EventsStore();

