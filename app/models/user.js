'use strict';

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {

    id:        { type: Sequelize.INTEGER, allowNull: false, unique: true, autoIncrement: true },

    firstName: { type: Sequelize.STRING, allowNull: false },

    lastName:  { type: Sequelize.STRING, allowNull: false },

    email:     { type: Sequelize.STRING, allowNull: false, unique: true },

    password:  { type: Sequelize.STRING, allowNull: false, autoIncrement: true }

  }, {});

  User.associate = function(models) {
    // associations can be defined here
  };
  return User;

};
