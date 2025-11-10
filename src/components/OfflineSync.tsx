import { RefreshCw, CheckCircle, XCircle, Clock, WifiOff, Wifi } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function OfflineSync() {
  const { isOffline, toggleOffline, queue, retrySync, clearQueue } = useOffline();
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      case 'failed':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-card';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getActionLabel = (type: string, action: string) => {
    if (type === 'irrigation') {
      return action === 'start' ? 'Start Irrigation' : action === 'stop' ? 'Stop Irrigation' : 'Auto Mode';
    }
    if (type === 'crop') return 'Save Leaf Scan';
    if (type === 'schedule') return 'Set Schedule';
    return action;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">Offline Sync</h1>
        <p className="text-muted-foreground">Manage queued actions and data sync</p>
      </div>

      {/* Connection Status */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isOffline ? (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <WifiOff className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
            ) : (
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <Wifi className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl mb-1">
                {isOffline ? t('offline') : t('online')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isOffline 
                  ? 'Device is in offline mode. Actions will queue for sync.' 
                  : 'Connected to server. All actions sync in real-time.'
                }
              </p>
            </div>
          </div>
          <button
            onClick={toggleOffline}
            className={`px-6 py-3 rounded-xl transition-colors ${
              isOffline
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {isOffline ? 'Go Online' : 'Go Offline'}
          </button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl text-yellow-600 dark:text-yellow-400">
            {queue.filter(q => q.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Synced</p>
          <p className="text-2xl text-green-600 dark:text-green-400">
            {queue.filter(q => q.status === 'synced').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Failed</p>
          <p className="text-2xl text-red-600 dark:text-red-400">
            {queue.filter(q => q.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Sync Queue</h2>
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
            <h3 className="text-xl mb-2">All Synced</h3>
            <p className="text-muted-foreground">No pending actions in the queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`border rounded-xl p-4 ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1">{getActionLabel(item.type, item.action)}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {item.status === 'failed' && (
                    <button
                      onClick={() => retrySync(item.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  )}

                  {item.status === 'pending' && !isOffline && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing...
                    </div>
                  )}

                  {item.status === 'synced' && (
                    <span className="text-sm text-green-600 dark:text-green-400">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Features Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <h3 className="mb-3 text-blue-900 dark:text-blue-100">📱 Offline Features Available:</h3>
        <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
          <li>• View cached sensor readings (last 24 hours)</li>
          <li>• Start/Stop irrigation (queued for sync)</li>
          <li>• Scan leaves with on-device AI model</li>
          <li>• View historical data and graphs</li>
          <li>• Access saved crop records</li>
        </ul>
        <p className="mt-3 text-xs text-blue-800 dark:text-blue-200">
          All actions are automatically queued and will sync when connection is restored.
        </p>
      </div>
    </div>
  );
}
