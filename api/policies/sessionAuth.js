
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // Usuario logueado, procede a la siguiente policy o controlador si es la última.
  if (req.session.authenticated) {
    return next();
  } else {
    //Usuario no logueado no permitido
    FlashService.warning(req, 'Session expired.' );
    return res.redirect('/');
  }

};
