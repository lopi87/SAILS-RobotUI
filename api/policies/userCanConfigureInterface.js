
module.exports = function(req, res, next) {

   Interface.findOne(req.param('id'), function foundIface(err, iface) {
      if (err) return next(err);
      if (!iface) return next(err);

     Robot.findOne(iface.robot_owner, function foundIface(err, robot) {
       if (err) return next(err);
       if (!robot) return next(err);


       if(robot.owner != req.session.User.id){
         msg = { err:  'You dont have permissions for this action.' };
         FlashService.warning(req, msg );
         return res.forbidden(msg);
       }

       next();

     });

    });
};
