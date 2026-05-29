import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import { registerSchema, loginSchema } from '../schemas/validation';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';

const router = Router();

// Register
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Username already exists',
      });
    }

    // Check if email exists
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already exists',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName,
      role: 'viewer',
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user',
    });
  }
});

// Login
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User account is inactive',
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login',
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user info',
    });
  }
});

export default router;