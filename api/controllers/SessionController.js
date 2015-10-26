/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  new: function(req, res){

/*
    var oldDateObj = new Date();
    var newDateObj = new Date(oldDateObj.getTime() + 60000);
    req.session.cookie.expires = newDateObj;
    req.session.authenticated = true;
    console.log(req.session);
*/
    res.view('session/new');
  },


  create: function(req, res, next){

    if(!req.param('email') || !req.param('password')) {
      var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}];

      req.session.flash = {
        err: usernamePasswordRequiredError
      };

      res.redirect('/session/new');
      return;
    }

    User.findOneByEmail(req.param('email'), function foundUser(err, user){
      if (err) return next(err);

      if (!user){
        var noAccountError = [{name: 'noAccount', message: 'The email address' + req.param('email') + ' not found'}];
        req.session.flash = {
          err: noAccountError
        };

        res.redirect('session/new');
        return;
      }

      require('bcrypt').compare(req.param('password'), user.encryptedPassword, function checkPassword(err, valid){
        if(err) return next(err);

        if(!valid){
          var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatchError', message: 'Invalid username and password combination'}];
          req.session.flash = {
            err: usernamePasswordMismatchError
          };
          res.redirect('session/new');
          return;
        }

        req.session.authenticated = true;
        req.session.User = user;

        //Cambio de estado a online
        user.online = true;
        user.save(function (err, user){
          if (err) return next(err);


          //Informar a otros clientes (sockets abiertos) que el usuario esta logueado
          User.publishUpdate(user.id, {
            loggedIn: true,
            id: user.id
          });

          //Si el usuario es administrador redirecciona a la vista de todos los usuarios
          if (req.session.User.admin) {
            res.redirect('/user');
            return;
          }
          res.redirect('/user/show/' + user.id);

        });
      });
    });
  },

  destroy: function(req, res, next) {

    User.findOne(req.session.User.id, function foundUser(err, user){
      var userId = req.session.User.id;
      User.update(user.id, {
        online: false
    }, function (err){
        if(err) return next(err);
        req.session.destroy();

        //redireccion a Sign-in
        res.redirect('session/new');
      });
    });
  }
};

