import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().max(100).optional(),
});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().required(),
});

export const createDeviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  deviceTypeId: Joi.number().integer().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  locationDescription: Joi.string().optional(),
  ipAddress: Joi.string().optional(),
  macAddress: Joi.string().optional(),
  firmwareVersion: Joi.string().optional(),
});

export const updateDeviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  deviceTypeId: Joi.number().integer().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  locationDescription: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'maintenance', 'error').optional(),
  ipAddress: Joi.string().optional(),
  macAddress: Joi.string().optional(),
  firmwareVersion: Joi.string().optional(),
});

export const createAlertSchema = Joi.object({
  deviceId: Joi.string().uuid().required(),
  alertType: Joi.string().required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().optional(),
});

export const resolveAlertSchema = Joi.object({
  isResolved: Joi.boolean().required(),
});

export const createMaintenanceSchema = Joi.object({
  deviceId: Joi.string().uuid().required(),
  maintenanceType: Joi.string().required(),
  description: Joi.string().optional(),
  scheduledDate: Joi.date().iso().required(),
});

export const updateMaintenanceSchema = Joi.object({
  maintenanceType: Joi.string().optional(),
  description: Joi.string().optional(),
  completedDate: Joi.date().iso().optional(),
  notes: Joi.string().optional(),
});

export const deviceParameterSchema = Joi.object({
  parameterName: Joi.string().required(),
  parameterValue: Joi.string().required(),
  unit: Joi.string().optional(),
});