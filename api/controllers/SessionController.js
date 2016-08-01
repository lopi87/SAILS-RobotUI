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

  getSocketID: function(req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }

    var socketId = sails.sockets.getId(req);
    // => "BetX2G-2889Bg22xi-jy"

    sails.log('My socket ID is: ' + socketId);

    return res.json(socketId);
  },

  create: function(req, res, next){

    if(!req.param('email') || !req.param('password')) {

      msg = { err: 'You must enter both a username and password.' };
      FlashService.error(req, msg );

      res.redirect('/session/new');
      return;
    }

    User.findOneByEmail(req.param('email'), function foundUser(err, user){
      if (err) return next(err);

      if (!user){
        msg = { err: 'The email address' + req.param('email') + ' not found' };
        FlashService.error(req, msg );

        res.redirect('session/new');
        return;
      }

      require('bcrypt').compare(req.param('password'), user.encryptedPassword, function checkPassword(err, valid){
        if(err) return next(err);

        if(!valid){
          msg = { err: 'Invalid username and password combination' };
          FlashService.error(req, msg );

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

          req.session.languagePreference = req.setLocale(user.language.toLowerCase());

          msg = { err: req.__('Welcome') };
          FlashService.success(req, msg );

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
      User.update(user.id, {online: false}, function (err){
        if(err) return next(err);
        req.session.destroy();


//        msg = {messages: {error: ["See you soon!"], success: [], warning:[]}};

       // Restore session
       // Session.update({socket_id:sails.sockets.id(req)},{user_id:'invited'}).exec(function afterwards(err, updated){
       //   if (err) return next(err);
       //   console.log('Updated session to invited');
       // });

        //redireccion a Sign-in
        return res.redirect('session/new');
      });
    });
  }
};

