module.exports = function(req, res, next) {

  Interface.findOne(req.param('id'), function foundIface(err, iface) {
    if (err) return next(err);
    if (!iface) return next(err);

    Robot.findOne(iface.robot_owner).populate('viewers').exec(function (err, robot) {
      if (err) return next(err);
      if (!robot) return next(err);

      var found = false;

      if (robot.public_view){
        found = true;
      }else{
        robot.viewers.forEach(function(user) {
          if(user.id === req.session.User.id){
            found = true;
          }
        });
      }

      if (found){
        next();
      } else {
        msg = { err:  'You dont have permissions for this action.' };
        FlashService.warning(req, msg );
        return res.forbidden(msg);
      }

    });
  });
};
