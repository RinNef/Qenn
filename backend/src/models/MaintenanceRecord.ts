import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class MaintenanceRecord extends Model {
  public id!: string;
  public deviceId!: string;
  public maintenanceType!: string;
  public description!: string;
  public performedBy!: string;
  public scheduledDate!: Date;
  public completedDate!: Date;
  public notes!: string;
  public createdAt!: Date;
}

export function initMaintenanceRecordModel(sequelize: Sequelize) {
  MaintenanceRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      deviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'id',
        },
      },
      maintenanceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      performedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      scheduledDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'maintenance_records',
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ['device_id'] }],
    }
  );

  return MaintenanceRecord;
}