module.exports = function(req, res, next) {

  Interface.findOne(req.param('id'), function foundIface(err, iface) {
    if (err) return next(err);
    if (!iface) return next(err);

    Robot.findOne(iface.robot_owner).populate('drivers').exec(function (err, robot) {
      if (err) return next(err);

      if(robot.owner == req.session.User.id){
        return next();
      }

      if (robot.public_drive){
        return next();
      }else{
        robot.drivers.forEach(function(user) {
          if(user.id === req.session.User.id){
            return next();
          }
        });
      }
      msg = { err: 'You dont have permissions for this action.' };
      FlashService.warning(req, msg );
      return res.forbidden(msg);
    });
  });
};

