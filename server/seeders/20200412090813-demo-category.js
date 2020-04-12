import mock from './mock/category';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
