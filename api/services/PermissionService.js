

module.exports = {



  get_permissions_array: function (robot_id, cb){

    Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot){
      if (err) return res.badRequest(err);

      if(!robot) return res.redirect('robot/index');

      //Hash con clave id, valores d y v (true false)
      var perm = {};
      robot.drivers.forEach(function(user) {
        perm[user.id] = {d: true, v: false, user_name: user.name, avatarUrl: sails.getBaseUrl() + user.avatarUrl};
      });

      robot.viewers.forEach(function(user) {
        if((user.id in perm)){
          perm[user.id] = {d: perm[user.id].d , v: true, name: user.name, avatarUrl: sails.getBaseUrl() +user.avatarUrl};
        }
        else{
          perm[user.id] = {d: false, v: true, name: user.name, avatarUrl: sails.getBaseUrl() + user.avatarUrl};
        }
      });

      cb(null, perm);

    });
  },


  init_permissions: function(robot, drivers, viewers, cb) {

    //Añade los usuarios invitados del robot
    var driver_users = [];
    if ((drivers) instanceof Array) {
      driver_users = drivers
    }else{
      if (drivers != undefined){
        driver_users.push(drivers);
      }
    }

    driver_users.forEach(function (user_id) {
      User.findOne(user_id, function foundUser(err, user) {
        if (err) return next(err);
        if (!user) return next();

        //añadir invitados
        log.debug('Associating robot - user: ', robot.id, 'with', user.id);
        robot.drivers.add(user.id);
        robot.save(function (err) {
          if (err) return next(err);
        });
      });
    });

    var viewer_users = [];
    if ((viewers) instanceof Array) {
      viewer_users = viewers
    }else{
      if (viewers != undefined){
        viewer_users.push(viewers);
      }
    }

    //Añade los usuarios invitados del robot
    viewer_users.forEach(function (user_id) {
      User.findOne(user_id, function foundUser(err, user) {
        if (err) return next(err);
        if (!user) return next();

        //añadir invitados
        log.debug('Associating robot - user: ', robot.id, 'with', user.id);
        robot.viewers.add(user.id);
        robot.save(function (err) {
          if (err) return next(err);
        });
      });
    })

    return cb(null);
  }

  };
