import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface QueueItem {
  id: string;
  type: string;
  action: string;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  data?: any;
}

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
  queue: QueueItem[];
  addToQueue: (item: Omit<QueueItem, 'id' | 'timestamp' | 'status'>) => void;
  retrySync: (id: string) => void;
  clearQueue: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem('offlineQueue');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  }, [queue]);

  const toggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const addToQueue = (item: Omit<QueueItem, 'id' | 'timestamp' | 'status'>) => {
    const newItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: 'pending',
    };
    setQueue(prev => [...prev, newItem]);
  };

  const retrySync = (id: string) => {
    setQueue(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: Math.random() > 0.3 ? 'synced' : 'failed' as const }
          : item
      )
    );
  };

  const clearQueue = () => {
    setQueue([]);
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && queue.length > 0) {
      const pendingItems = queue.filter(item => item.status === 'pending');
      if (pendingItems.length > 0) {
        setTimeout(() => {
          setQueue(prev =>
            prev.map(item =>
              item.status === 'pending'
                ? { ...item, status: 'synced' }
                : item
            )
          );
        }, 2000);
      }
    }
  }, [isOffline, queue]);

  return (
    <OfflineContext.Provider value={{ isOffline, toggleOffline, queue, addToQueue, retrySync, clearQueue }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
}
