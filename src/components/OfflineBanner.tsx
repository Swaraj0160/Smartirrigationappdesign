import { WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function OfflineBanner() {
  const { isOffline } = useOffline();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-500 dark:bg-yellow-600 text-yellow-950 dark:text-yellow-50 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <span>{t('offlineMode')}</span>
        </div>
        <Link 
          to="/sync"
          className="flex items-center gap-2 px-3 py-1 bg-yellow-950/20 dark:bg-yellow-50/20 rounded-lg hover:bg-yellow-950/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Sync</span>
        </Link>
      </div>
    </div>
  );
}
