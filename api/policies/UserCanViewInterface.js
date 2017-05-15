module.exports = function(req, res, next) {

  Interface.findOne(req.param('id'), function foundIface(err, iface) {
    if (err) return next(err);
    if (!iface) return next(err);

    Robot.findOne(iface.robot_owner).populate('viewers').exec(function (err, robot) {
      if (err) return next(err);
      if (!robot) return next(err);

      if( !robot.busy){
        FlashService.warning(req, 'The Robot is offline.' );
        return res.redirect('back');
      }

      if(robot.owner == req.session.User.id){
        return next();
      }

      if (robot.public_view){
        return next();
      }else{
        robot.viewers.forEach(function(user) {
          if(user.id === req.session.User.id){
            return next();
          }
        });
      }

      msg = 'You dont have permissions for this action.';
      FlashService.warning(req, msg );
      return res.forbidden(msg);

    });
  });
};
