

module.exports = function(req, res, ok) {

  // User is allowed, proceed to the controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }
  //not allowed
  else {
    FlashService.warning(req, 'You must be an admin.' );
    return res.forbidden();
  }
};
