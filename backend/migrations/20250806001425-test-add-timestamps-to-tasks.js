'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Don't run this on prod or dev (only on test DB)
    if (process.env.NODE_ENV !== 'test') return;

    await queryInterface.addColumn('tasks', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('tasks', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV !== 'test') return;

    await queryInterface.removeColumn('tasks', 'createdAt');
    await queryInterface.removeColumn('tasks', 'updatedAt');
  },
};
