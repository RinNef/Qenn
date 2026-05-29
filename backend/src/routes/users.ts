import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { User } from '../models/User';
import logger from '../utils/logger';

const router = Router();

// Get all users
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await User.findAndCountAll({
        limit: Number(limit),
        offset,
        attributes: { exclude: ['passwordHash'] },
        order: [['createdAt', 'DESC']],
      });

      res.json({
        total: count,
        page: Number(page),
        limit: Number(limit),
        users: rows,
      });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get users',
      });
    }
  }
);

// Get user by ID
router.get(
  '/:id',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['passwordHash'] },
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      res.json(user);
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user',
      });
    }
  }
);

// Update user role
router.patch(
  '/:id/role',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body;

      if (!['admin', 'operator', 'viewer'].includes(role)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid role',
        });
      }

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      await user.update({ role });

      res.json({
        message: 'User role updated successfully',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Update user role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user role',
      });
    }
  }
);

// Toggle user active status
router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin']),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      await user.update({ isActive: !user.isActive });

      res.json({
        message: 'User status updated successfully',
        user: {
          id: user.id,
          username: user.username,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      logger.error('Update user status error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user status',
      });
    }
  }
);

export default router;