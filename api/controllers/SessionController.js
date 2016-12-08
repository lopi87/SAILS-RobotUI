/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var geoip = require('geoip-lite');
var requestIp = require('request-ip');


module.exports = {

  new: function(req, res){
    res.view('session/new');
  },


  //Almacenamiento en la base de datos la sesion de cada usuario de la pagina (PARA MANDAR MENSAJES)
  saveSocketID: function(req, res) {
    if (!req.isSocket) return res.badRequest();

    var socketId = sails.sockets.id(req);
    // => "BetX2G-2889Bg22xi-jy"

    if(req.session.User != undefined) {
      var sessionObj = {
        socket_id: socketId,
        user_id: req.session.User.id
      };

      //Comprobar si el usuario tiene mas sockets abiertos:
      Session.count({user_id: req.session.User.id}).exec(function countUserSessions(error, n_sessions) {
        console.log('There are ' + n_sessions + ' sessions of user ' + req.session.User.id);

        if (n_sessions == 0) {
          //Cambio de estado del usuario a online
          User.update(req.session.User.id, {online: true}, function (err) {
            if (err) return res.badRequest();

            //Informar a otros clientes (sockets abiertos) que el usuario esta logueado
            User.publishUpdate(req.session.User.id, {
              loggedIn: true,
              id: req.session.User.id
            });
          });
        }
      });

    }else {
      var sessionObj = {
        socket_id: socketId
      };
    }

    Session.create(sessionObj).exec( function (err, session) {
      if (err) return res.badRequest();

      console.log('\n....................................................');
      console.log('Conecting to Sails js...');
      console.log('Cliente conectado - id del socket: ' + socketId);
      console.log('....................................................');

      return;
    });
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
        msg = { err: 'The email address ' + req.param('email') + ' not found' };
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


        //Get user ip -> location
        var clientIp = requestIp.getClientIp(req).substr(7); // on localhost > 127.0.0.1
        var geo = geoip.lookup(clientIp);
        var long = 0, lat = 0;
        if(geo){
          long = geo.ll[1];
          lat = geo.ll[0];
        }

        //Cambio de estado a online
        User.update(user.id, {online: true, longitude: long, latitude: lat}, function (err){
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
            res.redirect('/robot/index/');
          }else{
            res.redirect('/robot/index/');
          }

          return;
        });
      });
    });
  },


  destroy: function(req, res, next) {

    User.findOne(req.session.User.id, function foundUser(err, user){
      if(err) return next(err);
      if(!user){
        msg = { err: 'User not found' };
        FlashService.error(req, msg );
        return res.redirect('/');
      }

      User.update(user.id, {online: false}, function (err){
        if(err) return next(err);
        req.session.destroy();

        //Informar a otros clientes (sockets abiertos) que el usuario no esta logueado
        User.publishUpdate(user.id, {
          loggedIn: false,
          id: user.id
        });

        //redireccion a Sign-in
        return res.redirect('session/new');
      });
    });
  }
};

