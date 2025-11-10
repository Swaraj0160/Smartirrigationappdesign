import { useState } from 'react';
import { CheckCircle, Droplets } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationProps {
  onComplete: () => void;
}

export default function Registration({ onComplete }: RegistrationProps) {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: '',
    language: language,
    name: '',
    village: '',
    farmSize: '',
    crops: [] as string[],
    waterSource: '',
    consent: false,
  });

  const cropOptions = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Vegetables', 'Pulses', 'Fruits'];

  const handleNext = () => {
    if (step === 1) {
      setLanguage(formData.language as any);
      setStep(2);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem('farmerProfile', JSON.stringify(formData));
    setStep(3);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const toggleCrop = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop],
    }));
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-700">
        <div className="text-center text-white">
          <CheckCircle className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl mb-4">Profile Created!</h1>
          <p className="text-lg opacity-90">Let's connect your sensors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-700">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <Droplets className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl mb-2">{t('registration')}</h1>
          <p className="opacity-90">Smart Irrigation System</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-green-600' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-muted'}`} />
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-xl mb-4">Step 1: Basic Information</h2>

              <div>
                <label className="block text-sm mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="+91 1234567890"
                  className="w-full px-4 py-4 bg-muted rounded-xl text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send an OTP to verify your number
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2">Preferred Language *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['en', 'hi', 'mr'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                      className={`px-4 py-4 rounded-xl transition-colors ${
                        formData.language === lang
                          ? 'bg-green-600 text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.mobile || !formData.language}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
              >
                {t('next')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl mb-4">Step 2: Farm Details</h2>

              <div>
                <label className="block text-sm mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-4 bg-muted rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Village / Location *</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="Enter village name"
                  className="w-full px-4 py-4 bg-muted rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Farm Size (acres) *</label>
                <input
                  type="number"
                  value={formData.farmSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-4 bg-muted rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-3">Crops Grown *</label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map((crop) => (
                    <button
                      key={crop}
                      onClick={() => toggleCrop(crop)}
                      className={`px-4 py-3 rounded-xl transition-colors text-sm ${
                        formData.crops.includes(crop)
                          ? 'bg-green-600 text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Water Source *</label>
                <select
                  value={formData.waterSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, waterSource: e.target.value }))}
                  className="w-full px-4 py-4 bg-muted rounded-xl"
                >
                  <option value="">Select water source</option>
                  <option value="borewell">Borewell</option>
                  <option value="canal">Canal</option>
                  <option value="river">River</option>
                  <option value="tank">Tank/Pond</option>
                  <option value="rainwater">Rainwater Harvesting</option>
                </select>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    className="mt-1 w-5 h-5"
                  />
                  <span className="text-sm">
                    I agree to data usage for farm improvement and analytics
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.village || !formData.farmSize || formData.crops.length === 0 || !formData.waterSource || !formData.consent}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {t('submit')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
