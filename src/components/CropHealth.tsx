import { useState } from 'react';
import { Leaf, Volume2, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LeafData {
  id: string;
  health: 'healthy' | 'warning' | 'critical';
  advice: string;
  confidence: number;
}

export default function CropHealth() {
  const { t } = useLanguage();
  const [leaves] = useState<LeafData[]>([
    {
      id: '1',
      health: 'healthy',
      advice: 'Crop is in excellent condition. Maintain current irrigation.',
      confidence: 95,
    },
    {
      id: '2',
      health: 'warning',
      advice: 'Early signs of nitrogen deficiency. Consider fertilizer.',
      confidence: 82,
    },
    {
      id: '3',
      health: 'healthy',
      advice: 'Good leaf color and texture. Continue monitoring.',
      confidence: 91,
    },
    {
      id: '4',
      health: 'critical',
      advice: 'Fungal infection detected. Apply fungicide immediately.',
      confidence: 88,
    },
  ]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('cropHealth')}</h1>
        <p className="text-muted-foreground">AI-powered crop health analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-xl">
              <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('healthy')}</p>
              <p className="text-2xl">2</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('warning')}</p>
              <p className="text-2xl">1</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('critical')}</p>
              <p className="text-2xl">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaf Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className={`bg-card border-2 rounded-2xl p-5 ${getHealthColor(leaf.health)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <StatusBadge
                status={leaf.health}
                label={
                  leaf.health === 'healthy'
                    ? t('healthy')
                    : leaf.health === 'warning'
                    ? t('warning')
                    : t('critical')
                }
              />
              <span className="text-sm text-muted-foreground">{leaf.confidence}% confident</span>
            </div>

            <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden">
              <ImageWithFallback
                src={`https://images.unsplash.com/photo-${leaf.id === '1' ? '1464226184884-fa280b87c399' : leaf.id === '2' ? '1530836369250-ef72a3f5cda8' : leaf.id === '3' ? '1523348837708-15d4a09cfac2' : '1500076656116-558758c991c1'}?w=600&h=400&fit=crop`}
                alt={`Leaf ${leaf.id}`}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm mb-4">{leaf.advice}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => speak(leaf.advice)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                {t('playVoice')}
              </button>
              <button className="flex-1 min-w-[120px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                Precautions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scan CTA */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl mb-2">Scan New Leaf</h2>
            <p className="opacity-90">{t('scanLeaf')} - Quick AI-powered diagnosis</p>
          </div>
          <Link
            to="/scan"
            className="bg-white text-green-700 px-8 py-4 rounded-xl hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t('scanLeaf')}
          </Link>
        </div>
      </div>

      {/* Technology Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Technology:</strong> Multispectral Camera + AI Image Classifier (TensorFlow Lite) + Cloud Sync
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
