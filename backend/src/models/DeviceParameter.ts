import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class DeviceParameter extends Model {
  public id!: string;
  public deviceId!: string;
  public parameterName!: string;
  public parameterValue!: string;
  public unit!: string;
  public timestamp!: Date;
}

export function initDeviceParameterModel(sequelize: Sequelize) {
  DeviceParameter.init(
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
      parameterName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      parameterValue: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'device_parameters',
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ['device_id'] }],
    }
  );

  return DeviceParameter;
}