import { useState } from 'react';
import { Droplet, Leaf, CloudRain, Settings as SettingsIcon, Volume2, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Alert {
  id: string;
  type: 'soil' | 'crop' | 'weather' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export default function Alerts() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'soil' | 'crop' | 'weather' | 'system'>('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'soil',
      severity: 'critical',
      title: 'Low Soil Moisture',
      message: 'Soil moisture dropped to 28%. Start irrigation immediately.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      resolved: false,
    },
    {
      id: '2',
      type: 'crop',
      severity: 'warning',
      title: 'Leaf Disease Detected',
      message: 'Early signs of fungal infection on Leaf #4. View advice for treatment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolved: false,
    },
    {
      id: '3',
      type: 'weather',
      severity: 'info',
      title: 'Rain Expected',
      message: '70% chance of rain today. Pump paused automatically.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      resolved: false,
    },
    {
      id: '4',
      type: 'system',
      severity: 'warning',
      title: 'Sensor Connection Weak',
      message: 'Soil sensor signal strength low. Check battery or connection.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      resolved: false,
    },
    {
      id: '5',
      type: 'soil',
      severity: 'info',
      title: 'Irrigation Complete',
      message: 'Irrigation cycle completed. Soil moisture now at 65%.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      resolved: true,
    },
  ]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'soil': return Droplet;
      case 'crop': return Leaf;
      case 'weather': return CloudRain;
      case 'system': return SettingsIcon;
      default: return Droplet;
    }
  };

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50 dark:bg-red-950/20',
          icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          icon: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        };
      case 'info':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        };
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          icon: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
        };
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('alerts')}</h1>
        <p className="text-muted-foreground">Real-time notifications and alerts</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Active</p>
          <p className="text-2xl">{alerts.filter(a => !a.resolved).length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Critical</p>
          <p className="text-2xl text-red-600 dark:text-red-400">
            {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Warning</p>
          <p className="text-2xl text-yellow-600 dark:text-yellow-400">
            {alerts.filter(a => a.severity === 'warning' && !a.resolved).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl text-green-600 dark:text-green-400">
            {alerts.filter(a => a.resolved).length}
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'soil', 'crop', 'weather', 'system'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-card border border-border hover:bg-muted'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = getIcon(alert.type);
          const colors = getSeverityColors(alert.severity);

          return (
            <div
              key={alert.id}
              className={`border-l-4 ${colors.border} ${colors.bg} rounded-2xl p-5 ${
                alert.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`${colors.icon} p-3 rounded-xl flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="mb-1 flex items-center gap-2">
                        {alert.title}
                        {alert.resolved && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{alert.message}</p>

                  {!alert.resolved && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Fix Now
                      </button>
                      <button
                        onClick={() => speak(`${alert.title}. ${alert.message}`)}
                        className="px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        {t('playVoice')}
                      </button>
                      <button className="px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg transition-colors text-sm">
                        {t('viewAdvice')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
          <h3 className="text-xl mb-2">No {filter !== 'all' ? filter : ''} alerts</h3>
          <p className="text-muted-foreground">Everything is running smoothly!</p>
        </div>
      )}
    </div>
  );
}
