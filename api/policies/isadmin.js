

module.exports = function(req, res, ok) {

  // User is allowed, proceed to the controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }

  // Usuario no permitido
  else {
    msg = { err:  'You must be an admin.' };
    FlashService.warning(req, msg );
    res.redirect('/');
    return;
  }
};
