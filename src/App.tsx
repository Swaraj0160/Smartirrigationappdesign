import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SoilMonitor from './components/SoilMonitor';
import CropHealth from './components/CropHealth';
import WeatherControl from './components/WeatherControl';
import Alerts from './components/Alerts';
import QRScanner from './components/QRScanner';
import OfflineSync from './components/OfflineSync';
import Registration from './components/Registration';
import FarmProfile from './components/FarmProfile';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import VoiceAssist from './components/VoiceAssist';
import OfflineBanner from './components/OfflineBanner';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { OfflineProvider } from './contexts/OfflineContext';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('farmerRegistered') === 'true';
  });

  const handleRegistrationComplete = () => {
    localStorage.setItem('farmerRegistered', 'true');
    setIsRegistered(true);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <OfflineBanner />
              
              {!isRegistered ? (
                <Registration onComplete={handleRegistrationComplete} />
              ) : (
                <>
                  <Navigation />
                  <main className="pb-20 md:pb-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/soil" element={<SoilMonitor />} />
                      <Route path="/crop" element={<CropHealth />} />
                      <Route path="/weather" element={<WeatherControl />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="/scan" element={<QRScanner />} />
                      <Route path="/sync" element={<OfflineSync />} />
                      <Route path="/profile" element={<FarmProfile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <VoiceAssist />
                </>
              )}
            </div>
          </Router>
        </OfflineProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
