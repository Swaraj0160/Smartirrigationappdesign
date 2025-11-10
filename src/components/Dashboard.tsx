import { useState, useEffect } from 'react';
import { Droplet, Thermometer, Wind, Power, Leaf, CloudRain, Info, Volume2, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  pumpStatus: boolean;
  cropHealth: 'healthy' | 'warning' | 'critical';
  rainProbability: number;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { isOffline, addToQueue } = useOffline();
  const [data, setData] = useState<SensorData>({
    soilMoisture: 65,
    temperature: 28,
    humidity: 72,
    pumpStatus: false,
    cropHealth: 'healthy',
    rainProbability: 30,
  });
  const [showInfo, setShowInfo] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        soilMoisture: Math.max(20, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 5)),
        temperature: Math.max(15, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(100, prev.humidity + (Math.random() - 0.5) * 3)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOffline]);

  const handleIrrigationControl = (action: 'start' | 'stop' | 'auto') => {
    if (isOffline) {
      addToQueue({ type: 'irrigation', action: action });
    }
    
    if (action === 'start') {
      setData(prev => ({ ...prev, pumpStatus: true }));
    } else if (action === 'stop') {
      setData(prev => ({ ...prev, pumpStatus: false }));
    } else if (action === 'auto') {
      setData(prev => ({ ...prev, pumpStatus: prev.soilMoisture < 40 }));
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail.action === 'start') handleIrrigationControl('start');
      if (e.detail.action === 'stop') handleIrrigationControl('stop');
    };
    window.addEventListener('irrigationControl', handler);
    return () => window.removeEventListener('irrigationControl', handler);
  }, []);

  const getMoistureStatus = (value: number): 'healthy' | 'warning' | 'critical' => {
    if (value >= 50) return 'healthy';
    if (value >= 30) return 'warning';
    return 'critical';
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const cards = [
    {
      id: 'moisture',
      icon: Droplet,
      title: t('soilMoisture'),
      value: `${data.soilMoisture.toFixed(0)}%`,
      status: getMoistureStatus(data.soilMoisture),
      statusLabel: data.soilMoisture >= 50 ? t('healthy') : data.soilMoisture >= 30 ? t('warning') : t('critical'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      tech: 'Capacitive Soil Sensor + ESP32 + LoRa',
      link: '/soil'
    },
    {
      id: 'temp',
      icon: Thermometer,
      title: t('temperature'),
      value: `${data.temperature.toFixed(1)}°C`,
      status: 'healthy' as const,
      statusLabel: t('healthy'),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      tech: 'DHT22 Sensor + ESP32',
      link: '/soil'
    },
    {
      id: 'humidity',
      icon: Wind,
      title: t('humidity'),
      value: `${data.humidity.toFixed(0)}%`,
      status: 'healthy' as const,
      statusLabel: t('healthy'),
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      tech: 'DHT22 Sensor + ESP32',
      link: '/weather'
    },
    {
      id: 'pump',
      icon: Power,
      title: t('pumpStatus'),
      value: data.pumpStatus ? t('on') : t('off'),
      status: data.pumpStatus ? 'on' as const : 'off' as const,
      statusLabel: data.pumpStatus ? t('on') : t('off'),
      color: data.pumpStatus ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400',
      bgColor: data.pumpStatus ? 'bg-green-50 dark:bg-green-950/30' : 'bg-gray-50 dark:bg-gray-800',
      tech: 'Relay Module + ESP32 + 12V DC Pump',
      link: '/weather'
    },
    {
      id: 'crop',
      icon: Leaf,
      title: t('cropHealth'),
      value: data.cropHealth === 'healthy' ? t('healthy') : data.cropHealth === 'warning' ? t('warning') : t('critical'),
      status: data.cropHealth,
      statusLabel: data.cropHealth === 'healthy' ? t('healthy') : data.cropHealth === 'warning' ? t('warning') : t('critical'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      tech: 'Multispectral Camera + AI Classifier',
      link: '/crop'
    },
    {
      id: 'rain',
      icon: CloudRain,
      title: t('rainProbability'),
      value: `${data.rainProbability}%`,
      status: 'healthy' as const,
      statusLabel: t('healthy'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      tech: 'Weather API + Local Forecast',
      link: '/weather'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">Smart Irrigation Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring and control</p>
      </div>

      {/* Live Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={card.link}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowInfo(showInfo === card.id ? null : card.id);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Info className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-muted-foreground">{card.title}</h3>
              <p className="text-3xl">{card.value}</p>
              <StatusBadge status={card.status} label={card.statusLabel} />
            </div>

            {showInfo === card.id && (
              <div className="mt-4 p-3 bg-muted rounded-lg space-y-2" onClick={(e) => e.preventDefault()}>
                <p className="text-sm text-muted-foreground">{card.tech}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    speak(`${card.title}: ${card.value}. Status: ${card.statusLabel}`);
                  }}
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  <Volume2 className="w-4 h-4" />
                  Read Aloud
                </button>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h2 className="text-xl mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleIrrigationControl('start')}
            disabled={data.pumpStatus}
            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {t('startIrrigation')}
          </button>
          <button
            onClick={() => handleIrrigationControl('stop')}
            disabled={!data.pumpStatus}
            className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {t('stopIrrigation')}
          </button>
          <button
            onClick={() => handleIrrigationControl('auto')}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            {t('autoMode')}
          </button>
          <Link
            to="/soil"
            className="flex-1 min-w-[140px] bg-card hover:bg-muted border border-border text-center px-6 py-4 rounded-xl transition-colors"
          >
            {t('viewGraph')}
          </Link>
          <Link
            to="/scan"
            className="flex-1 min-w-[140px] bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700 px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            {t('scanLeaf')}
          </Link>
        </div>
      </div>
    </div>
  );
}
