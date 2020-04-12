import mock from './mock/user';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
