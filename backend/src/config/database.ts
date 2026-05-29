import { Sequelize } from 'sequelize';
import { initUserModel } from '../models/User';
import { initDeviceTypeModel } from '../models/DeviceType';
import { initDeviceModel } from '../models/Device';
import { initAlertModel } from '../models/Alert';
import { initMaintenanceRecordModel } from '../models/MaintenanceRecord';
import { initDeviceParameterModel } from '../models/DeviceParameter';
import logger from '../utils/logger';

let sequelize: Sequelize | null = null;

export async function initializeDatabase() {
  try {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
    const dbName = process.env.DB_NAME || 'qenn_db';
    const dbUser = process.env.DB_USER || 'qenn_user';
    const dbPassword = process.env.DB_PASSWORD || 'password';

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? logger.debug : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Initialize models
    initUserModel(sequelize);
    initDeviceTypeModel(sequelize);
    initDeviceModel(sequelize);
    initAlertModel(sequelize);
    initMaintenanceRecordModel(sequelize);
    initDeviceParameterModel(sequelize);

    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database models synchronized');

    return sequelize;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getSequelize() {
  if (!sequelize) {
    throw new Error('Database not initialized');
  }
  return sequelize;
}

export async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    logger.info('Database connection closed');
  }
}