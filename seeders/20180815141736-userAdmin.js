'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'FirstAdminName',
          lastName: 'FirstAdminLastName',
          email: 'admin1@wolox.com.ar',
          password: 'firstAdmin1',
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
