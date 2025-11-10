import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Thermometer, Activity, Zap, Info, Volume2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';

export default function SoilMonitor() {
  const { t } = useLanguage();
  const { isOffline, addToQueue } = useOffline();
  const [showThresholds, setShowThresholds] = useState(false);
  const [thresholds, setThresholds] = useState({
    moistureMin: 40,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.5,
  });

  const [currentData, setCurrentData] = useState({
    moisture: 65,
    temp: 24,
    ph: 6.8,
    ec: 1.2,
  });

  const [hourlyData, setHourlyData] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      moisture: 60 + Math.random() * 20,
    }))
  );

  const [weeklyData] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      ph: 6.5 + Math.random() * 0.8,
    }))
  );

  useEffect(() => {
    if (isOffline) return;

    const interval = setInterval(() => {
      setCurrentData(prev => ({
        ...prev,
        moisture: Math.max(20, Math.min(100, prev.moisture + (Math.random() - 0.5) * 3)),
        temp: Math.max(15, Math.min(35, prev.temp + (Math.random() - 0.5) * 1)),
      }));

      setHourlyData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          moisture: currentData.moisture,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isOffline, currentData.moisture]);

  const getStatus = () => {
    if (currentData.moisture < thresholds.moistureMin) return { status: 'critical' as const, text: 'Irrigation Needed' };
    if (currentData.moisture > thresholds.moistureMax) return { status: 'warning' as const, text: 'Too Wet' };
    return { status: 'healthy' as const, text: t('healthy') };
  };

  const handleIrrigation = (action: 'start' | 'auto') => {
    if (isOffline) {
      addToQueue({ type: 'irrigation', action });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const status = getStatus();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('soilMonitor')}</h1>
        <p className="text-muted-foreground">Real-time soil condition monitoring</p>
      </div>

      {/* Current Values Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl">
              <Droplet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('soilMoisture')}</p>
              <p className="text-2xl">{currentData.moisture.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-xl">
              <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Soil Temp</p>
              <p className="text-2xl">{currentData.temp.toFixed(1)}°C</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">pH Level</p>
              <p className="text-2xl">{currentData.ph.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EC/Nutrients</p>
              <p className="text-2xl">{currentData.ec.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Status</h2>
          <StatusBadge status={status.status} label={status.text} />
        </div>
        <button
          onClick={() => speak(`Soil moisture is ${currentData.moisture.toFixed(0)} percent. Status: ${status.text}`)}
          className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"
        >
          <Volume2 className="w-4 h-4" />
          Read Aloud
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-xl mb-4">24-Hour Moisture Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                interval={5}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="moisture" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-xl mb-4">7-Day Average pH</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                domain={[5, 8]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="ph" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h2 className="text-xl mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleIrrigation('start')}
            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            {t('startIrrigation')}
          </button>
          <button
            onClick={() => handleIrrigation('auto')}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            {t('autoMode')}
          </button>
          <button
            onClick={() => setShowThresholds(true)}
            className="flex-1 min-w-[140px] bg-card hover:bg-muted border border-border px-6 py-4 rounded-xl transition-colors"
          >
            View Thresholds
          </button>
        </div>
      </div>

      {/* Technology Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Technology:</strong> Capacitive Soil Sensor + ESP32 + LoRa/Wi-Fi Module
            </p>
          </div>
        </div>
      </div>

      {/* Threshold Settings Popup */}
      {showThresholds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl mb-4">Threshold Settings</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Minimum Moisture (%)</label>
                <input
                  type="range"
                  min="20"
                  max="50"
                  value={thresholds.moistureMin}
                  onChange={(e) => setThresholds(prev => ({ ...prev, moistureMin: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-right text-sm text-muted-foreground">{thresholds.moistureMin}%</p>
              </div>

              <div>
                <label className="block text-sm mb-2">Maximum Moisture (%)</label>
                <input
                  type="range"
                  min="60"
                  max="90"
                  value={thresholds.moistureMax}
                  onChange={(e) => setThresholds(prev => ({ ...prev, moistureMax: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-right text-sm text-muted-foreground">{thresholds.moistureMax}%</p>
              </div>

              <div>
                <label className="block text-sm mb-2">pH Range</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={thresholds.phMin}
                    onChange={(e) => setThresholds(prev => ({ ...prev, phMin: Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 bg-muted rounded-lg"
                  />
                  <span className="py-2">-</span>
                  <input
                    type="number"
                    step="0.1"
                    value={thresholds.phMax}
                    onChange={(e) => setThresholds(prev => ({ ...prev, phMax: Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 bg-muted rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowThresholds(false)}
                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => setShowThresholds(false)}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
