

module.exports = function(req, res, ok) {

  // User is allowed, proceed to the controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }
  //not allowed
  else {
    msg = { err:  'You must be an admin.' };
    FlashService.warning(req, msg );
    return res.forbidden(msg);
  }
};
