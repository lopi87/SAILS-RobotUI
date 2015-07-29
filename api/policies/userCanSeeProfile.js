

module.exports = function(req, res, next) {

  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  //El id solicitado no coincide con el id del usuario
  // y no es un administrador
  if(!(sessionUserMatchesId || isAdmin)) {
    var noRightsError = [{name: 'noRights', message: 'You must be an admin'}];
    req.session.flash = {
      err:noRightsError
    }
    res.redirect('/session/new');
    return;
  }

  next();

};
