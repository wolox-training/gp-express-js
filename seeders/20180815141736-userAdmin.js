'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'FirstAdminName',
          lastName: 'FirstAdminLastName',
          email: 'admin1@wolox.com.ar',
          password: bcrypt.hashSync('firstAdmin1', bcrypt.genSaltSync(8), null),
          admin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
// run seed: node_modules/.bin/sequelize db:seed:all
// page: http://docs.sequelizejs.com/manual/tutorial/migrations.html
