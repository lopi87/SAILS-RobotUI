

module.exports = {

  get_permissions_array: function (robot_id, cb){

    Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot){
      if (err) return res.badRequest(err);

      if(!robot) return res.redirect('robot/index');

      //Hash con clave id, valores d y v (true false)
      var perm = {};
      robot.drivers.forEach(function(user) {
        perm[user.id] = {d: true, v: false, user_name: user.name, avatarUrl: user.avatarUrl};
      });

      robot.viewers.forEach(function(user) {
        if((user.id in perm)){
          perm[user.id] = {d: perm[user.id].d , v: true, name: user.name, avatarUrl: user.avatarUrl};
        }
        else{
          perm[user.id] = {d: false, v: true, name: user.name, avatarUrl: user.avatarUrl};
        }
      });

      cb(null, perm);

    });
  }
};
