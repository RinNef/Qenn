import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DeviceType } from './DeviceType';

export class Device extends Model {
  public id!: string;
  public name!: string;
  public deviceTypeId!: number;
  public latitude!: number;
  public longitude!: number;
  public locationDescription!: string;
  public status!: 'active' | 'inactive' | 'maintenance' | 'error';
  public ipAddress!: string;
  public macAddress!: string;
  public firmwareVersion!: string;
  public lastCheck!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associations: {
    deviceType: Association<Device, DeviceType>;
  };
}

export function initDeviceModel(sequelize: Sequelize) {
  Device.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deviceTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'device_types',
          key: 'id',
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      locationDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'error'),
        defaultValue: 'active',
      },
      ipAddress: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      macAddress: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      firmwareVersion: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      lastCheck: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'devices',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['device_type_id'] },
        { fields: ['latitude', 'longitude'] },
      ],
    }
  );

  return Device;
}