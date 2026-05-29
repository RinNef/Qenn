import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import {
  createAlertSchema,
  resolveAlertSchema,
} from '../schemas/validation';
import { Alert } from '../models/Alert';
import { Device } from '../models/Device';
import logger from '../utils/logger';

const router = Router();

// Get all alerts
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { deviceId, severity, isResolved, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (deviceId) whereClause.deviceId = deviceId;
    if (severity) whereClause.severity = severity;
    if (isResolved !== undefined) whereClause.isResolved = isResolved === 'true';

    const { count, rows } = await Alert.findAndCountAll({
      where: whereClause,
      include: [{ model: Device, as: 'device' }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      alerts: rows,
    });
  } catch (error) {
    logger.error('Get alerts error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get alerts',
    });
  }
});

// Get alert by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const alert = await Alert.findByPk(req.params.id, {
      include: [{ model: Device, as: 'device' }],
    });

    if (!alert) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Alert not found',
      });
    }

    res.json(alert);
  } catch (error) {
    logger.error('Get alert error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get alert',
    });
  }
});

// Create alert
router.post(
  '/',
  authenticate,
  authorize(['admin', 'operator']),
  validate(createAlertSchema),
  async (req: Request, res: Response) => {
    try {
      // Check if device exists
      const device = await Device.findByPk(req.body.deviceId);
      if (!device) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Device not found',
        });
      }

      const alert = await Alert.create(req.body);

      // Emit real-time event
      const io = (req.app as any).get('io');
      if (io) {
        io.emit('alert:created', {
          id: alert.id,
          deviceId: alert.deviceId,
          title: alert.title,
          severity: alert.severity,
          timestamp: alert.createdAt,
        });
      }

      res.status(201).json({
        message: 'Alert created successfully',
        alert,
      });
    } catch (error) {
      logger.error('Create alert error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create alert',
      });
    }
  }
);

// Resolve alert
router.patch(
  '/:id/resolve',
  authenticate,
  authorize(['admin', 'operator']),
  validate(resolveAlertSchema),
  async (req: Request, res: Response) => {
    try {
      const alert = await Alert.findByPk(req.params.id);

      if (!alert) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Alert not found',
        });
      }

      if (req.body.isResolved) {
        await alert.update({
          isResolved: true,
          resolvedAt: new Date(),
          resolvedBy: req.user?.userId,
        });
      }

      res.json({
        message: 'Alert updated successfully',
        alert,
      });
    } catch (error) {
      logger.error('Resolve alert error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to resolve alert',
      });
    }
  }
);

// Get alert statistics
router.get('/stats/summary', authenticate, async (req: Request, res: Response) => {
  try {
    const total = await Alert.count();
    const unresolved = await Alert.count({ where: { isResolved: false } });
    const critical = await Alert.count({
      where: { severity: 'critical', isResolved: false },
    });
    const high = await Alert.count({
      where: { severity: 'high', isResolved: false },
    });
    const medium = await Alert.count({
      where: { severity: 'medium', isResolved: false },
    });
    const low = await Alert.count({
      where: { severity: 'low', isResolved: false },
    });

    res.json({
      total,
      unresolved,
      bySeverity: { critical, high, medium, low },
    });
  } catch (error) {
    logger.error('Get alert stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get alert statistics',
    });
  }
});

export default router;