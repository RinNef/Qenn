import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public fullName!: string;
  public role!: 'admin' | 'operator' | 'viewer';
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'operator', 'viewer'),
        defaultValue: 'viewer',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  return User;
}