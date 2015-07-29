


module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  else {
    var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}]
    req.session.flash = {
      err: requireLoginError
    }
    res.redirect('/session/new');
    return;
  }
};
