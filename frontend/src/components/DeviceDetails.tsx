import React from 'react';
import { Device } from '../../types';

interface DeviceDetailsProps {
  device: Device | null;
  onClose: () => void;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device, onClose }) => {
  if (!device) return null;

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chi Tiết Thiết Bị</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Tên thiết bị</label>
          <p className="text-lg font-semibold text-gray-800">{device.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Loại thiết bị</label>
          <p className="text-lg font-semibold text-gray-800">
            {device.deviceType?.name || 'N/A'}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Trạng thái</label>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-3 h-3 rounded-full ${statusColors[device.status]} mr-2`}></span>
            <span className="text-lg font-semibold text-gray-800 capitalize">
              {statusLabels[device.status] || device.status}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Vị trí</label>
          <p className="text-gray-800">{device.locationDescription || 'Không có mô tả'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Tọa độ</label>
          <p className="text-gray-800">
            Vĩ độ: {device.latitude.toFixed(6)}, Kinh độ: {device.longitude.toFixed(6)}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Địa chỉ IP</label>
          <p className="text-gray-800">{device.ipAddress || 'N/A'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Địa chỉ MAC</label>
          <p className="text-gray-800">{device.macAddress || 'N/A'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Phiên bản firmware</label>
          <p className="text-gray-800">{device.firmwareVersion || 'N/A'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Lần kiểm tra cuối</label>
          <p className="text-gray-800">
            {device.lastCheck ? new Date(device.lastCheck).toLocaleString('vi-VN') : 'Chưa kiểm tra'}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
          <p className="text-gray-800">
            {new Date(device.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
          <p className="text-gray-800">
            {new Date(device.updatedAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
