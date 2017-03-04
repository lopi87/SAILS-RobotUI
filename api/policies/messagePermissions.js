module.exports = function(req, res, next) {

  Message.findOne(req.param('id')).exec(function (err, message) {
    if (err) return next(err);
    if (!message) return res.badRequest();


    if (message.from_user_id != req.session.User.id) {
      msg = {err: 'You dont have permissions for this action.'};
      FlashService.warning(req, msg);
      return res.forbidden(msg);
    }

    next();
  });
};