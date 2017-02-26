module.exports = {

  autoUpdatedAt: true,
  autoCreatedAt: true,
  tableName: 'robot_drivers__user_d_robots',
  attributes: {

    user: {
      model: 'user',
      columnName: 'user_d_robots'
    },

    robot: {
      model: 'robot',
      columnName: 'robot_drivers'
    }
  }
};
