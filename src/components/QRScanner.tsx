import { useState } from 'react';
import { Camera, Upload, Volume2, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import StatusBadge from './StatusBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ScanResult {
  health: 'healthy' | 'warning' | 'critical';
  confidence: number;
  diagnosis: string;
  advice: string;
}

export default function QRScanner() {
  const { t } = useLanguage();
  const { isOffline, addToQueue } = useOffline();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate scanning process
    setTimeout(() => {
      const results: ScanResult[] = [
        {
          health: 'healthy',
          confidence: 94,
          diagnosis: 'Healthy Leaf',
          advice: 'Leaf shows excellent health. No action needed. Continue regular monitoring.',
        },
        {
          health: 'warning',
          confidence: 87,
          diagnosis: 'Nitrogen Deficiency',
          advice: 'Early signs of nitrogen deficiency detected. Apply nitrogen-rich fertilizer within 3 days.',
        },
        {
          health: 'critical',
          confidence: 91,
          diagnosis: 'Fungal Infection',
          advice: 'Fungal disease detected. Apply appropriate fungicide immediately. Remove affected leaves.',
        },
      ];

      const randomResult = results[Math.floor(Math.random() * results.length)];
      setResult(randomResult);
      setScanning(false);
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        handleScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (result && isOffline) {
      addToQueue({ 
        type: 'crop', 
        action: 'save-scan', 
        data: { result, timestamp: Date.now() } 
      });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('scanLeaf')}</h1>
        <p className="text-muted-foreground">AI-powered leaf health diagnosis</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
        <h3 className="mb-2 text-blue-900 dark:text-blue-100">📸 Instructions</h3>
        <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
          <li>• Hold the leaf flat against a light background</li>
          <li>• Ensure good lighting (natural daylight preferred)</li>
          <li>• Keep the camera steady and focused</li>
          <li>• Fill the frame with the leaf</li>
        </ul>
      </div>

      {!result ? (
        <>
          {/* Camera/Upload Interface */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="aspect-video bg-muted rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded leaf" className="w-full h-full object-cover" />
              ) : (
                <>
                  {/* QR Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {/* Corner markers */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <p className="absolute bottom-4 text-sm text-muted-foreground">
                    Position leaf within frame
                  </p>
                </>
              )}

              {scanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-3" />
                    <p>Analyzing leaf...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                <span>Open Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <label className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Offline Notice */}
          {isOffline && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    <strong>Offline Mode:</strong> Using on-device AI model. Results may have reduced accuracy.
                    Will sync with cloud for verification when online.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Scan Result */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Scan Result</h2>
              <StatusBadge
                status={result.health}
                label={
                  result.health === 'healthy'
                    ? t('healthy')
                    : result.health === 'warning'
                    ? t('warning')
                    : t('critical')
                }
              />
            </div>

            {uploadedImage && (
              <div className="aspect-video bg-muted rounded-xl mb-6 overflow-hidden">
                <img src={uploadedImage} alt="Scanned leaf" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Diagnosis</p>
                <p className="text-xl">{result.diagnosis}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        result.health === 'healthy'
                          ? 'bg-green-600'
                          : result.health === 'warning'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm">{result.confidence}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Recommended Action</p>
                <p className="text-sm">{result.advice}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save to Records
              </button>
              <button
                onClick={() => speak(`${result.diagnosis}. ${result.advice}`)}
                className="flex-1 min-w-[140px] bg-card hover:bg-muted border border-border px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {t('playVoice')}
              </button>
              <button className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors">
                See Remedies
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setUploadedImage(null);
                }}
                className="flex-1 min-w-[140px] bg-card hover:bg-muted border border-border px-6 py-4 rounded-xl transition-colors"
              >
                Scan Again
              </button>
            </div>
          </div>

          {result.health === 'critical' && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="mb-1 text-red-900 dark:text-red-100">Urgent Action Required</h3>
                  <p className="text-sm text-red-900 dark:text-red-100">
                    This condition requires immediate attention. Consider consulting with an agricultural expert
                    if symptoms persist or worsen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Technology Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Technology:</strong> {isOffline ? 'On-device TensorFlow Lite model' : 'Cloud AI (TensorFlow) + Multispectral Analysis'} • 
              Trained on 50,000+ crop disease images
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
