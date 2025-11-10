import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

const translations: Translations = {
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  soilMonitor: { en: 'Soil Monitor', hi: 'मृदा निरीक्षण', mr: 'माती निरीक्षण' },
  cropHealth: { en: 'Crop Health', hi: 'फ़सल स्वास्थ्य', mr: 'पीक आरोग्य' },
  weather: { en: 'Weather & Irrigation', hi: 'मौसम व सिंचाई', mr: 'हवामान आणि सिंचन' },
  alerts: { en: 'Alerts', hi: 'सूचना', mr: 'सूचना' },
  control: { en: 'Control', hi: 'नियंत्रण', mr: 'नियंत्रण' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', mr: 'सेटिंग्ज' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
  startIrrigation: { en: 'Start Irrigation', hi: 'सिंचाई शुरू', mr: 'सिंचन सुरू' },
  stopIrrigation: { en: 'Stop', hi: 'रोकें', mr: 'थांबवा' },
  autoMode: { en: 'Auto Mode', hi: 'स्वचालित', mr: 'स्वयंचलित' },
  scanLeaf: { en: 'Scan Leaf', hi: 'पत्ता स्कैन', mr: 'पान स्कॅन' },
  soilMoisture: { en: 'Soil Moisture', hi: 'मिट्टी की नमी', mr: 'माती ओलसरपणा' },
  temperature: { en: 'Temperature', hi: 'तापमान', mr: 'तापमान' },
  humidity: { en: 'Humidity', hi: 'आर्द्रता', mr: 'आर्द्रता' },
  pumpStatus: { en: 'Pump Status', hi: 'पंप स्थिति', mr: 'पंप स्थिती' },
  healthy: { en: 'Healthy', hi: 'स्वस्थ', mr: 'निरोगी' },
  warning: { en: 'Warning', hi: 'चेतावनी', mr: 'चेतावणी' },
  critical: { en: 'Critical', hi: 'गंभीर', mr: 'गंभीर' },
  offline: { en: 'Offline', hi: 'ऑफ़लाइन', mr: 'ऑफलाइन' },
  online: { en: 'Online', hi: 'ऑनलाइन', mr: 'ऑनलाइन' },
  rainProbability: { en: 'Rain Probability', hi: 'बारिश की संभावना', mr: 'पाऊस संभाव्यता' },
  on: { en: 'ON', hi: 'चालू', mr: 'चालू' },
  off: { en: 'OFF', hi: 'बंद', mr: 'बंद' },
  viewGraph: { en: 'View Graph', hi: 'ग्राफ देखें', mr: 'आलेख पहा' },
  save: { en: 'Save', hi: 'सेव करें', mr: 'जतन करा' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', mr: 'रद्द करा' },
  viewAdvice: { en: 'View Advice', hi: 'सलाह देखें', mr: 'सल्ला पहा' },
  playVoice: { en: 'Play Voice', hi: 'आवाज़ सुनें', mr: 'आवाज ऐका' },
  offlineMode: { en: 'Offline - data will sync automatically', hi: 'ऑफ़लाइन - डेटा स्वचालित सिंक होगा', mr: 'ऑफलाइन - डेटा आपोआप सिंक होईल' },
  registration: { en: 'Farmer Registration', hi: 'किसान पंजीकरण', mr: 'शेतकरी नोंदणी' },
  next: { en: 'Next', hi: 'आगे', mr: 'पुढे' },
  submit: { en: 'Submit', hi: 'जमा करें', mr: 'सबमिट करा' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
