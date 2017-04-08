

module.exports = function(req, res, next) {

  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  //El id solicitado no coincide con el id del usuario
  // y no es un administrador
  if(!(sessionUserMatchesId || isAdmin)) {
    msg = 'You must be an admin.';
    FlashService.warning(req, msg );
    return res.forbidden(msg);
  }

  next();

};
