import { useState } from 'react';
import { Plus, MapPin, Leaf, Cpu, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Field {
  id: string;
  name: string;
  area: number;
  crop: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
}

export default function FarmProfile() {
  const { t } = useLanguage();
  const [profile] = useState(() => {
    const saved = localStorage.getItem('farmerProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Rajesh Kumar',
      village: 'Kharghar',
      farmSize: '5',
      crops: ['Wheat', 'Rice'],
      waterSource: 'borewell',
    };
  });

  const [fields, setFields] = useState<Field[]>([
    { id: '1', name: 'Field A', area: 2.5, crop: 'Wheat' },
    { id: '2', name: 'Field B', area: 2.5, crop: 'Rice' },
  ]);

  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'ESP32-001', type: 'Soil Sensor', status: 'online' },
    { id: '2', name: 'ESP32-002', type: 'Weather Station', status: 'online' },
    { id: '3', name: 'PUMP-001', type: 'Water Pump', status: 'online' },
    { id: '4', name: 'CAM-001', type: 'Crop Camera', status: 'offline' },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl mb-2">{t('profile')}</h1>
        <p className="text-muted-foreground">Manage your farm details and devices</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl mb-2">{profile.name}</h2>
            <div className="flex items-center gap-2 opacity-90">
              <MapPin className="w-4 h-4" />
              <span>{profile.village}</span>
            </div>
          </div>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-sm opacity-90 mb-1">Farm Size</p>
            <p className="text-xl">{profile.farmSize} acres</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-sm opacity-90 mb-1">Crops</p>
            <p className="text-xl">{profile.crops?.length || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-sm opacity-90 mb-1">Fields</p>
            <p className="text-xl">{fields.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-sm opacity-90 mb-1">Devices</p>
            <p className="text-xl">{devices.length}</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Fields</h2>
          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.id} className="bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3>{field.name}</h3>
                    <p className="text-sm text-muted-foreground">{field.crop}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-background rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Area:</span> {field.area} acres
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Devices */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Devices</h2>
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    device.status === 'online' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Cpu className={`w-5 h-5 ${
                      device.status === 'online' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    device.status === 'online'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}>
                    {device.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-card border border-border hover:bg-muted rounded-2xl p-6 transition-colors text-left">
          <Calendar className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-1">Set Schedule</h3>
          <p className="text-sm text-muted-foreground">Configure irrigation timings</p>
        </button>

        <button className="bg-card border border-border hover:bg-muted rounded-2xl p-6 transition-colors text-left">
          <Leaf className="w-8 h-8 mb-3 text-green-600 dark:text-green-400" />
          <h3 className="mb-1">Crop Records</h3>
          <p className="text-sm text-muted-foreground">View historical data</p>
        </button>

        <button className="bg-card border border-border hover:bg-muted rounded-2xl p-6 transition-colors text-left">
          <Cpu className="w-8 h-8 mb-3 text-purple-600 dark:text-purple-400" />
          <h3 className="mb-1">Device Settings</h3>
          <p className="text-sm text-muted-foreground">Configure sensors</p>
        </button>
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl mb-4">Add New Field</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Field Name</label>
                <input
                  type="text"
                  placeholder="e.g., Field C"
                  className="w-full px-4 py-3 bg-muted rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Area (acres)</label>
                <input
                  type="number"
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-3 bg-muted rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Crop</label>
                <select className="w-full px-4 py-3 bg-muted rounded-xl">
                  <option value="">Select crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="cotton">Cotton</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddField(false)}
                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => setShowAddField(false)}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl mb-4">Add New Device</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Device ID</label>
                <input
                  type="text"
                  placeholder="e.g., ESP32-003"
                  className="w-full px-4 py-3 bg-muted rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Device Type</label>
                <select className="w-full px-4 py-3 bg-muted rounded-xl">
                  <option value="">Select type</option>
                  <option value="soil">Soil Sensor</option>
                  <option value="weather">Weather Station</option>
                  <option value="pump">Water Pump</option>
                  <option value="camera">Crop Camera</option>
                </select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Scan the QR code on your device to auto-configure
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddDevice(false)}
                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => setShowAddDevice(false)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
