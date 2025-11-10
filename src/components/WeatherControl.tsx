import { useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Power, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import StatusBadge from './StatusBadge';

export default function WeatherControl() {
  const { t } = useLanguage();
  const { isOffline, addToQueue } = useOffline();
  const [pumpStatus, setPumpStatus] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState({
    enabled: false,
    time: '06:00',
    duration: 30,
  });

  const forecast = [
    { day: 'Mon', icon: Sun, temp: 32, rain: 10 },
    { day: 'Tue', icon: CloudRain, temp: 28, rain: 70 },
    { day: 'Wed', icon: CloudRain, temp: 26, rain: 80 },
    { day: 'Thu', icon: Cloud, temp: 29, rain: 40 },
    { day: 'Fri', icon: Sun, temp: 33, rain: 5 },
  ];

  const handlePumpControl = (action: 'start' | 'stop' | 'auto') => {
    if (isOffline) {
      addToQueue({ type: 'irrigation', action });
    }

    if (action === 'start') setPumpStatus(true);
    if (action === 'stop') setPumpStatus(false);
    if (action === 'auto') {
      const hasRain = forecast[0].rain > 50;
      setPumpStatus(!hasRain);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('weather')}</h1>
        <p className="text-muted-foreground">Weather forecast and irrigation control</p>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h2 className="text-xl mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {forecast.map((day, i) => (
            <div
              key={i}
              className={`bg-muted rounded-xl p-3 md:p-4 text-center ${
                i === 0 ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <p className="text-sm mb-2">{day.day}</p>
              <day.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="mb-1">{day.temp}°C</p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Droplets className="w-3 h-3" />
                <span>{day.rain}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestion */}
      {forecast[0].rain > 50 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="mb-1">Rain Expected Today</h3>
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {forecast[0].rain}% chance of rain. Irrigation will be paused automatically in Auto Mode.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pump Status & Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Pump Control</h2>
          <div className="flex items-center gap-3">
            <Power className={`w-5 h-5 ${pumpStatus ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
            <StatusBadge
              status={pumpStatus ? 'on' : 'off'}
              label={pumpStatus ? t('on') : t('off')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Current Status</p>
            <p className="text-xl">{pumpStatus ? 'Running' : 'Stopped'}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Today's Usage</p>
            <p className="text-xl">45 mins</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handlePumpControl('start')}
            disabled={pumpStatus}
            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {t('startIrrigation')}
          </button>
          <button
            onClick={() => handlePumpControl('stop')}
            disabled={!pumpStatus}
            className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {t('stopIrrigation')}
          </button>
          <button
            onClick={() => handlePumpControl('auto')}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            {t('autoMode')}
          </button>
          <button
            onClick={() => setShowSchedule(true)}
            className="flex-1 min-w-[140px] bg-card hover:bg-muted border border-border px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </button>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t('temperature')}</p>
              <p className="text-xl">{forecast[0].temp}°C</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t('humidity')}</p>
              <p className="text-xl">72%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="text-xl">12 km/h</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t('rainProbability')}</p>
              <p className="text-xl">{forecast[0].rain}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Popup */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl mb-4">Irrigation Schedule</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <span>Enable Schedule</span>
                <button
                  onClick={() => setSchedule(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    schedule.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    schedule.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm mb-2">Start Time</label>
                <input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 bg-muted rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={schedule.duration}
                  onChange={(e) => setSchedule(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-muted rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSchedule(false)}
                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  if (isOffline) {
                    addToQueue({ type: 'schedule', action: 'set', data: schedule });
                  }
                  setShowSchedule(false);
                }}
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
