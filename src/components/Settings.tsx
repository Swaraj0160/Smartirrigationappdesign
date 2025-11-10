import { useState } from 'react';
import { Sun, Moon, Sunrise, Volume2, Droplets, Wifi, HelpCircle, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isOffline, toggleOffline } = useOffline();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedHelp, setSelectedHelp] = useState<string | null>(null);

  const helpTopics = [
    {
      id: 'irrigation',
      question: 'What is Smart Irrigation?',
      answer: 'Smart Irrigation is an automated system that monitors soil moisture, weather conditions, and crop requirements to optimize water usage. It helps save water, reduce costs, and improve crop yield.',
    },
    {
      id: 'soil',
      question: 'How does the soil sensor work?',
      answer: 'The capacitive soil sensor measures moisture content by detecting changes in electrical capacitance. Data is sent to ESP32 via LoRa/Wi-Fi for real-time monitoring and automated irrigation control.',
    },
    {
      id: 'camera',
      question: 'How does crop camera work?',
      answer: 'The multispectral camera captures leaf images which are analyzed by an AI classifier (TensorFlow Lite). It detects diseases, nutrient deficiencies, and pest damage with 85-95% accuracy.',
    },
    {
      id: 'privacy',
      question: 'Data privacy & export',
      answer: 'All your farm data is encrypted and stored securely. You can export your data anytime in CSV/JSON format. We never share your data with third parties without consent.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('settings')}</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* Language */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl mb-4">Language / भाषा / भाषा</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'mr', label: 'मराठी' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`px-6 py-4 rounded-xl transition-colors ${
                language === lang.code
                  ? 'bg-green-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl mb-4">Voice Assistant</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Voice Enabled</span>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                voiceEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm mb-2">Voice Speed</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">{voiceSpeed}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Units & Thresholds */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl mb-4">Units & Thresholds</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <span>Temperature Unit</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">°C</button>
              <button className="px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg">°F</button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Moisture Thresholds</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Minimum</span>
                <span className="text-muted-foreground">40%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Maximum</span>
                <span className="text-muted-foreground">80%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl mb-4">Connectivity</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p>Connection Mode</p>
                <p className="text-sm text-muted-foreground">
                  {isOffline ? 'Offline' : 'LoRa/Wi-Fi'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleOffline}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              Test Connection
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-muted-foreground mb-1">Signal</p>
              <p className="text-green-600 dark:text-green-400">Strong</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-muted-foreground mb-1">Latency</p>
              <p>45ms</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-muted-foreground mb-1">Status</p>
              <p className="text-green-600 dark:text-green-400">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'auto', icon: Sunrise, label: 'Auto' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value as any)}
              className={`px-6 py-4 rounded-xl transition-colors flex flex-col items-center gap-2 ${
                theme === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <option.icon className="w-6 h-6" />
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
        {theme === 'auto' && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Automatically switches between 6 PM - 6 AM
          </p>
        )}
      </div>

      {/* Help */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl mb-4">Help & Support</h2>
        <div className="space-y-2">
          {helpTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedHelp(topic.id)}
              className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{topic.question}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Help Modal */}
      {selectedHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl pr-8">
                {helpTopics.find(t => t.id === selectedHelp)?.question}
              </h3>
              <button
                onClick={() => setSelectedHelp(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {helpTopics.find(t => t.id === selectedHelp)?.answer}
            </p>
            <button
              onClick={() => setSelectedHelp(null)}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
