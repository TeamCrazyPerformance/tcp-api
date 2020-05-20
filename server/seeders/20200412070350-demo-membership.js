import mock from './mock/membership';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('memberships', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('memberships', null, {});
  },
};
