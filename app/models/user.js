'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, unique: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      admin: { type: DataTypes.BOOLEAN, allowNull: false }
    },
    {
      hooks: {
        afterValidate: (user, options) => {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        }
      }
    }
  );
  return User;
};
