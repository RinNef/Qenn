import React, { useState, useEffect } from 'react';
import { Device } from '../../types';
import { deviceService } from '../../services/api';

interface DeviceListProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
  selectedDeviceId?: string;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onDeviceSelect, selectedDeviceId }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDevices = devices.filter((device) => {
    const matchesName = device.name.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = !statusFilter || device.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    maintenance: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const statusLabels: Record<string, string> = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    maintenance: 'Bảo trì',
    error: 'Lỗi',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh Sách Thiết Bị</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
          <option value="maintenance">Bảo trì</option>
          <option value="error">Lỗi</option>
        </select>
      </div>

      {/* Device List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredDevices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Không có thiết bị nào</p>
        ) : (
          filteredDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => onDeviceSelect(device)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedDeviceId === device.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.deviceType?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-400 mt-1">{device.locationDescription || 'Không có mô tả'}</p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${statusColors[device.status]} mr-2`}></span>
                  <span className="text-sm text-gray-600 capitalize">{statusLabels[device.status]}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeviceList;
