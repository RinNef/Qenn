import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class Alert extends Model {
  public id!: string;
  public deviceId!: string;
  public alertType!: string;
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public title!: string;
  public description!: string;
  public isResolved!: boolean;
  public resolvedAt!: Date;
  public resolvedBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export function initAlertModel(sequelize: Sequelize) {
  Alert.init(
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
      alertType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resolvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
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
      tableName: 'alerts',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['device_id'] },
        { fields: ['severity'] },
        { fields: ['is_resolved'] },
      ],
    }
  );

  return Alert;
}