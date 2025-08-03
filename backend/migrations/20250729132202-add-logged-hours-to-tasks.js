'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'logged_hours', {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0.0,
      after: 'estimate_hours', 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'logged_hours');
  },
};
