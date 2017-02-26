module.exports = {

  autoUpdatedAt: true,
  autoCreatedAt: true,
  tableName: 'robot_viewers__user_v_robots',
  attributes: {

    user: {
      model: 'user',
      columnName: 'user_v_robots'
    },

    robot: {
      model: 'robot',
      columnName: 'robot_viewers'
    }
  }
};
