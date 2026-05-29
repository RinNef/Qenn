import { Socket } from 'socket.io';
import { Device } from '../models/Device';
import { Alert } from '../models/Alert';
import logger from '../utils/logger';

export const setupSocketEvents = (socket: Socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Handle device updates
  socket.on('device:update', async (data) => {
    try {
      const device = await Device.findByPk(data.deviceId);
      if (device) {
        socket.broadcast.emit('device:updated', {
          id: device.id,
          status: device.status,
          lastCheck: device.lastCheck,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      logger.error('Device update error:', error);
    }
  });

  // Handle alert creation
  socket.on('alert:create', async (data) => {
    try {
      socket.broadcast.emit('alert:created', {
        id: data.id,
        deviceId: data.deviceId,
        title: data.title,
        severity: data.severity,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Alert creation error:', error);
    }
  });

  // Handle alert resolution
  socket.on('alert:resolve', async (data) => {
    try {
      socket.broadcast.emit('alert:resolved', {
        id: data.id,
        resolvedAt: new Date(),
      });
    } catch (error) {
      logger.error('Alert resolution error:', error);
    }
  });

  // Handle device parameter updates
  socket.on('device:parameter-update', (data) => {
    try {
      socket.broadcast.emit('device:parameter-updated', {
        deviceId: data.deviceId,
        parameter: data.parameter,
        value: data.value,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Device parameter update error:', error);
    }
  });

  // Handle maintenance updates
  socket.on('maintenance:update', (data) => {
    try {
      socket.broadcast.emit('maintenance:updated', {
        id: data.id,
        status: data.status,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Maintenance update error:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
};

// Helper function to emit device status updates to all clients
export const broadcastDeviceStatus = (io: any, deviceData: any) => {
  io.emit('device:status-changed', {
    id: deviceData.id,
    status: deviceData.status,
    timestamp: new Date(),
  });
};

// Helper function to emit alert notifications
export const broadcastAlert = (io: any, alertData: any) => {
  io.emit('alert:notification', {
    id: alertData.id,
    deviceId: alertData.deviceId,
    title: alertData.title,
    severity: alertData.severity,
    message: alertData.description,
    timestamp: new Date(),
  });
};