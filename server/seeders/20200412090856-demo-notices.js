import mock from './mock/notice';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('notices', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notices', null, {});
  },
};
