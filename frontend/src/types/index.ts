export interface Device {
  id: string;
  name: string;
  deviceTypeId: number;
  latitude: number;
  longitude: number;
  locationDescription: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  lastCheck: Date;
  createdAt: Date;
  updatedAt: Date;
  deviceType?: DeviceType;
}

export interface DeviceType {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
}

export interface DeviceParameter {
  id: string;
  deviceId: string;
  parameterName: string;
  parameterValue: string;
  unit: string;
  timestamp: Date;
}

export interface Alert {
  id: string;
  deviceId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DeviceStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  error: number;
  activeAlerts: number;
}
