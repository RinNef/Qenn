import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
} from '../schemas/validation';
import { MaintenanceRecord } from '../models/MaintenanceRecord';
import { Device } from '../models/Device';
import logger from '../utils/logger';

const router = Router();

// Get all maintenance records
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { deviceId, status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (deviceId) whereClause.deviceId = deviceId;

    // Determine status filter
    if (status === 'completed') {
      whereClause.completedDate = { [require('sequelize').Op.ne]: null };
    } else if (status === 'in_progress') {
      whereClause.completedDate = null;
      whereClause.scheduledDate = { [require('sequelize').Op.ne]: null };
    }

    const { count, rows } = await MaintenanceRecord.findAndCountAll({
      where: whereClause,
      include: [{ model: Device, as: 'device' }],
      limit: Number(limit),
      offset,
      order: [['scheduledDate', 'DESC']],
    });

    res.json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      records: rows,
    });
  } catch (error) {
    logger.error('Get maintenance records error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get maintenance records',
    });
  }
});

// Get maintenance record by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const record = await MaintenanceRecord.findByPk(req.params.id, {
      include: [{ model: Device, as: 'device' }],
    });

    if (!record) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Maintenance record not found',
      });
    }

    res.json(record);
  } catch (error) {
    logger.error('Get maintenance record error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get maintenance record',
    });
  }
});

// Create maintenance record
router.post(
  '/',
  authenticate,
  authorize(['admin', 'operator']),
  validate(createMaintenanceSchema),
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

      const record = await MaintenanceRecord.create({
        ...req.body,
        performedBy: req.user?.userId,
      });

      res.status(201).json({
        message: 'Maintenance record created successfully',
        record,
      });
    } catch (error) {
      logger.error('Create maintenance record error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create maintenance record',
      });
    }
  }
);

// Update maintenance record
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'operator']),
  validate(updateMaintenanceSchema),
  async (req: Request, res: Response) => {
    try {
      const record = await MaintenanceRecord.findByPk(req.params.id);

      if (!record) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Maintenance record not found',
        });
      }

      await record.update(req.body);

      res.json({
        message: 'Maintenance record updated successfully',
        record,
      });
    } catch (error) {
      logger.error('Update maintenance record error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update maintenance record',
      });
    }
  }
);

// Delete maintenance record
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const record = await MaintenanceRecord.findByPk(req.params.id);

      if (!record) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Maintenance record not found',
        });
      }

      await record.destroy();

      res.json({
        message: 'Maintenance record deleted successfully',
      });
    } catch (error) {
      logger.error('Delete maintenance record error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete maintenance record',
      });
    }
  }
);

export default router;