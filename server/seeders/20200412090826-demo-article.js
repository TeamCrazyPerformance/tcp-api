import mock from './mock/article';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', mock);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', null, {});
  },
};
