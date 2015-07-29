

module.exports = function(req, res, ok) {

  // User is allowed, proceed to the controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }

  // Usuario no permitido
  else {
    var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin.'}];
    req.session.flash = {
      err: requireAdminError
    };
    res.redirect('/session/new');
    return;
  }
};
