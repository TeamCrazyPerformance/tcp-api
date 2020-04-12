import mock from './mock/comment';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comments', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  },
};
