import React, { useState, useEffect } from 'react';
import DeviceMap from './components/DeviceMap';
import DeviceList from './components/DeviceList';
import DeviceDetails from './components/DeviceDetails';
import DashboardStats from './components/DashboardStats';
import { Device, DeviceStats } from './types';
import { deviceService } from './services/api';

// Sample data for demonstration (will be replaced with API calls)
const sampleDevices: Device[] = [
  {
    id: '1',
    name: 'Camera KM15',
    deviceTypeId: 1,
    latitude: 20.8525,
    longitude: 106.3258,
    locationDescription: 'Cao tốc HN-HP, KM15+200',
    status: 'active',
    ipAddress: '192.168.1.101',
    macAddress: '00:1B:44:11:3A:B7',
    firmwareVersion: 'v2.1.0',
    lastCheck: new Date(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    deviceType: { id: 1, name: 'Camera', code: 'CAM', description: 'Camera giám sát', icon: '📹' },
  },
  {
    id: '2',
    name: 'Biển LED KM25',
    deviceTypeId: 2,
    latitude: 20.8742,
    longitude: 106.4512,
    locationDescription: 'Cao tốc HN-HP, KM25+500',
    status: 'active',
    ipAddress: '192.168.1.102',
    macAddress: '00:1B:44:11:3A:B8',
    firmwareVersion: 'v1.5.2',
    lastCheck: new Date(),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
    deviceType: { id: 2, name: 'Biển LED', code: 'LED', description: 'Biển điện tử', icon: '🖼️' },
  },
  {
    id: '3',
    name: 'Hố ga KM35',
    deviceTypeId: 3,
    latitude: 20.8956,
    longitude: 106.5823,
    locationDescription: 'Cao tốc HN-HP, KM35+100',
    status: 'maintenance',
    ipAddress: '192.168.1.103',
    macAddress: '00:1B:44:11:3A:B9',
    firmwareVersion: 'v1.0.0',
    lastCheck: new Date(),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
    deviceType: { id: 3, name: 'Hố ga', code: 'HG', description: 'Hố ga thoát nước', icon: '🔧' },
  },
  {
    id: '4',
    name: 'Camera KM45',
    deviceTypeId: 1,
    latitude: 20.9123,
    longitude: 106.6945,
    locationDescription: 'Cao tốc HN-HP, KM45+800',
    status: 'error',
    ipAddress: '192.168.1.104',
    macAddress: '00:1B:44:11:3A:C0',
    firmwareVersion: 'v2.1.0',
    lastCheck: new Date(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    deviceType: { id: 1, name: 'Camera', code: 'CAM', description: 'Camera giám sát', icon: '📹' },
  },
  {
    id: '5',
    name: 'Trạm cáp quang KM50',
    deviceTypeId: 4,
    latitude: 20.9345,
    longitude: 106.7856,
    locationDescription: 'Cao tốc HN-HP, KM50+300',
    status: 'active',
    ipAddress: '192.168.1.105',
    macAddress: '00:1B:44:11:3A:C1',
    firmwareVersion: 'v3.0.1',
    lastCheck: new Date(),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    deviceType: { id: 4, name: 'Đường cáp quang', code: 'CQ', description: 'Trạm cáp quang', icon: '🌐' },
  },
];

const sampleStats: DeviceStats = {
  total: 5,
  active: 3,
  inactive: 0,
  maintenance: 1,
  error: 1,
  activeAlerts: 2,
};

function App() {
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [stats, setStats] = useState<DeviceStats>(sampleStats);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from API
    // For demo, use sample data
    const loadData = async () => {
      try {
        // const [devicesData, statsData] = await Promise.all([
        //   deviceService.getAll(),
        //   deviceService.getStats(),
        // ]);
        // setDevices(devicesData.devices || devicesData);
        // setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleCloseDetails = () => {
    setSelectedDevice(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Qenn</h1>
              <p className="text-sm text-gray-600">Quản Lý Thiết Bị Cao Tốc HN-HP</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Map and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[600px]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bản Đồ Vị Trí Thiết Bị</h2>
              <DeviceMap
                devices={devices}
                onDeviceSelect={handleDeviceSelect}
                selectedDeviceId={selectedDevice?.id}
              />
            </div>
          </div>

          {/* Device List */}
          <div className="lg:col-span-1">
            <DeviceList
              devices={devices}
              onDeviceSelect={handleDeviceSelect}
              selectedDeviceId={selectedDevice?.id}
            />
          </div>
        </div>

        {/* Device Details */}
        {selectedDevice && (
          <div className="mb-6">
            <DeviceDetails device={selectedDevice} onClose={handleCloseDetails} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Qenn - Hệ Thống Quản Lý Thiết Bị Hạ Tầng Đường Cao Tốc HN-HP
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
