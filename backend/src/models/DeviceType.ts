import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class DeviceType extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon!: string;
  public createdAt!: Date;
}

export function initDeviceTypeModel(sequelize: Sequelize) {
  DeviceType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'device_types',
      timestamps: false,
      underscored: true,
    }
  );

  return DeviceType;
}