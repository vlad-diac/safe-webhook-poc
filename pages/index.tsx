import { useState, useEffect } from 'react';
import type { SafeEvent } from '@/lib/events-store';

export default function Home() {
  const [safeAddress, setSafeAddress] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [events, setEvents] = useState<SafeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!filterAddress) return;

    // Connect to SSE for real-time updates
    const eventSource = new EventSource(`/api/events/stream?address=${filterAddress}`);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('✅ Connected to event stream');
    };

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setEvents(data.events);
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [filterAddress]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterAddress(safeAddress.trim());
  };

  const clearFilter = () => {
    setFilterAddress('');
    setSafeAddress('');
    setEvents([]);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>🔐 Safe Webhook POC</h1>
        <p style={{ color: '#666' }}>
          Monitor real-time events from Safe's official webhook service
        </p>
      </header>

      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <form onSubmit={handleFilter}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Safe Address to Monitor:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={safeAddress}
              onChange={(e) => setSafeAddress(e.target.value)}
              placeholder="0x..."
              style={{ 
                flex: 1, 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#0070f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Filter Events
            </button>
            {filterAddress && (
              <button 
                type="button"
                onClick={clearFilter}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#666', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          {filterAddress ? (
            <>
              <span style={{ color: isConnected ? 'green' : 'orange' }}>
                {isConnected ? '● Connected' : '○ Connecting...'}
              </span>
              {' | '}
              <span>Filtering: {filterAddress}</span>
            </>
          ) : (
            <span>Enter a Safe address to start monitoring events</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
          Events Received: {events.length}
        </h2>
      </div>

      <div 
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          height: '600px', 
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}
      >
        {events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            <p>No events received yet</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              {filterAddress 
                ? `Waiting for events from ${filterAddress}...`
                : 'Enter a Safe address above to start monitoring'
              }
            </p>
          </div>
        ) : (
          <div>
            {events.map((event) => (
              <div 
                key={event.id}
                style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #eee',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: getEventColor(event.type),
                    fontSize: '14px'
                  }}>
                    {getEventIcon(event.type)} {event.type}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  <div><strong>Safe:</strong> {event.address}</div>
                  <div><strong>Chain:</strong> {getChainName(event.chainId)}</div>
                  {event.data.safeTxHash && (
                    <div><strong>Tx Hash:</strong> {event.data.safeTxHash.slice(0, 10)}...{event.data.safeTxHash.slice(-8)}</div>
                  )}
                  {event.data.txHash && (
                    <div><strong>Blockchain Tx:</strong> {event.data.txHash.slice(0, 10)}...{event.data.txHash.slice(-8)}</div>
                  )}
                </div>

                <details style={{ fontSize: '12px' }}>
                  <summary style={{ cursor: 'pointer', color: '#0070f3' }}>
                    View full payload
                  </summary>
                  <pre style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '11px'
                  }}>
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #eee', fontSize: '12px', color: '#666' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Setup Instructions:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Deploy this app to Railway</li>
          <li>Set WEBHOOK_SECRET environment variable in Railway</li>
          <li>Generate a public domain in Railway settings</li>
          <li>Register your webhook at <code>https://safe-events.safe.global</code></li>
          <li>Your webhook URL will be: <code>{typeof window !== 'undefined' ? window.location.origin : 'https://your-app.up.railway.app'}/api/webhook</code></li>
        </ol>
      </footer>
    </div>
  );
}

function getEventColor(type: string): string {
  switch (type) {
    case 'EXECUTED_MULTISIG_TRANSACTION': return '#22c55e';
    case 'PENDING_MULTISIG_TRANSACTION': return '#f59e0b';
    case 'NEW_CONFIRMATION': return '#3b82f6';
    case 'DELETED_MULTISIG_TRANSACTION': return '#ef4444';
    case 'INCOMING_ETHER':
    case 'INCOMING_TOKEN': return '#8b5cf6';
    case 'OUTGOING_ETHER':
    case 'OUTGOING_TOKEN': return '#ec4899';
    default: return '#666';
  }
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'EXECUTED_MULTISIG_TRANSACTION': return '✅';
    case 'PENDING_MULTISIG_TRANSACTION': return '⏳';
    case 'NEW_CONFIRMATION': return '✍️';
    case 'DELETED_MULTISIG_TRANSACTION': return '❌';
    case 'INCOMING_ETHER':
    case 'INCOMING_TOKEN': return '💰';
    case 'OUTGOING_ETHER':
    case 'OUTGOING_TOKEN': return '💸';
    default: return '📨';
  }
}

function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    '1': 'Ethereum Mainnet',
    '11155111': 'Sepolia',
    '137': 'Polygon',
    '10': 'Optimism',
    '42161': 'Arbitrum',
    '8453': 'Base',
  };
  return chains[chainId] || `Chain ${chainId}`;
}

