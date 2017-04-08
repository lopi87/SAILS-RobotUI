module.exports = function(req, res, next) {

  Robot.findOne(req.param('id')).exec(function (err, robot) {
    if (err) return next(err);
    if (!robot) return res.badRequest();


    if (robot.owner != req.session.User.id) {
      msg = 'You dont have permissions for this action.';
      FlashService.warning(req, msg);
      return res.forbidden(msg);
    }

    next();
  });
};
