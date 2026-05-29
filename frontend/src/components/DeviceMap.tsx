import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Device, DeviceType } from '../../types';
import { deviceService } from '../../services/api';

interface DeviceMapProps {
  devices: Device[];
  onDeviceSelect?: (device: Device) => void;
  selectedDeviceId?: string;
}

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DeviceMap: React.FC<DeviceMapProps> = ({ devices, onDeviceSelect, selectedDeviceId }) => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    // Initialize map centered on Hanoi-Haiphong highway area
    const mapInstance = L.map('map').setView([20.85, 106.3], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each device
    devices.forEach((device) => {
      const statusColors: Record<string, string> = {
        active: '#22c55e',
        inactive: '#6b7280',
        maintenance: '#f59e0b',
        error: '#ef4444',
      };

      const color = statusColors[device.status] || '#6b7280';

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([device.latitude, device.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px;">${device.name}</h3>
            <p style="margin: 4px 0;"><strong>Loại:</strong> ${device.deviceType?.name || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Trạng thái:</strong> 
              <span style="color: ${color}; text-transform: capitalize;">${device.status}</span>
            </p>
            <p style="margin: 4px 0;"><strong>Vị trí:</strong> ${device.locationDescription || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Tọa độ:</strong> ${device.latitude.toFixed(6)}, ${device.longitude.toFixed(6)}</p>
          </div>
        `);

      marker.on('click', () => {
        if (onDeviceSelect) {
          onDeviceSelect(device);
        }
      });
    });
  }, [map, devices, onDeviceSelect]);

  return (
    <div id="map" className="w-full h-full rounded-lg shadow-lg" />
  );
};

export default DeviceMap;
