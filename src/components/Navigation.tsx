import { Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Leaf, CloudRain, Bell, User, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navigation() {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: t('dashboard'), key: 'home' },
    { path: '/alerts', icon: Bell, label: t('alerts'), key: 'alerts' },
    { path: '/weather', icon: CloudRain, label: t('control'), key: 'control' },
    { path: '/settings', icon: SettingsIcon, label: t('settings'), key: 'settings' },
  ];

  const desktopNavItems = [
    { path: '/', label: t('dashboard') },
    { path: '/soil', label: t('soilMonitor') },
    { path: '/crop', label: t('cropHealth') },
    { path: '/weather', label: t('weather') },
    { path: '/alerts', label: t('alerts') },
    { path: '/profile', label: t('profile') },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-xl">Smart Irrigation</span>
            </div>
            <div className="flex items-center gap-1">
              {desktopNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              to="/settings"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'hover:bg-muted'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[80px] ${
                isActive(item.path)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
