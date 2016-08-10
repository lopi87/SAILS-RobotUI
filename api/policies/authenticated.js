
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  else {
    msg = { err: 'You must be signed in.' };
    FlashService.error(req, msg );

    res.redirect('/session/new');
    return next();
  }
};
