module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      title: {
          type: DataTypes.STRING(100),
            allowNull: false,
          validate: {
            notEmpty: true,
        }
      },
      description: {
          type: DataTypes.TEXT,
            allowNull: true,
          validate: {
              notEmpty: true,
          }
      },
      status: {
        type: DataTypes.STRING(20)
      },
      estimate_hours: {
        type: DataTypes.DECIMAL(5, 2)
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'tasks',
      timestamps: true
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Task;
};

