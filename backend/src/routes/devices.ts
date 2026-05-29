import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import {
  createDeviceSchema,
  updateDeviceSchema,
} from '../schemas/validation';
import { Device } from '../models/Device';
import { DeviceType } from '../models/DeviceType';
import { Alert } from '../models/Alert';
import logger from '../utils/logger';

const router = Router();

// Get all devices
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, typeId, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (typeId) whereClause.deviceTypeId = typeId;

    const { count, rows } = await Device.findAndCountAll({
      where: whereClause,
      include: [{ model: DeviceType, as: 'deviceType' }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      devices: rows,
    });
  } catch (error) {
    logger.error('Get devices error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get devices',
    });
  }
});

// Get device by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const device = await Device.findByPk(req.params.id, {
      include: [{ model: DeviceType, as: 'deviceType' }],
    });

    if (!device) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
    }

    res.json(device);
  } catch (error) {
    logger.error('Get device error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get device',
    });
  }
});

// Create device
router.post(
  '/',
  authenticate,
  authorize(['admin', 'operator']),
  validate(createDeviceSchema),
  async (req: Request, res: Response) => {
    try {
      const device = await Device.create(req.body);

      res.status(201).json({
        message: 'Device created successfully',
        device,
      });
    } catch (error) {
      logger.error('Create device error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create device',
      });
    }
  }
);

// Update device
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'operator']),
  validate(updateDeviceSchema),
  async (req: Request, res: Response) => {
    try {
      const device = await Device.findByPk(req.params.id);

      if (!device) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
      }

      await device.update(req.body);

      res.json({
        message: 'Device updated successfully',
        device,
      });
    } catch (error) {
      logger.error('Update device error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update device',
      });
    }
  }
);

// Delete device
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const device = await Device.findByPk(req.params.id);

      if (!device) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
      }

      await device.destroy();

      res.json({
        message: 'Device deleted successfully',
      });
    } catch (error) {
      logger.error('Delete device error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete device',
      });
    }
  }
);

// Get device statistics
router.get('/stats/overview', authenticate, async (req: Request, res: Response) => {
  try {
    const total = await Device.count();
    const active = await Device.count({ where: { status: 'active' } });
    const inactive = await Device.count({ where: { status: 'inactive' } });
    const maintenance = await Device.count({ where: { status: 'maintenance' } });
    const error = await Device.count({ where: { status: 'error' } });
    const alerts = await Alert.count({ where: { isResolved: false } });

    res.json({
      total,
      active,
      inactive,
      maintenance,
      error,
      activeAlerts: alerts,
    });
  } catch (error) {
    logger.error('Get device stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get device statistics',
    });
  }
});

export default router;