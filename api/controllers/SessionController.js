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
    return res.ok();
  },

  //Almacenamiento en la base de datos la sesion de cada usuario de la pagina
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

        // if (n_sessions == 0) {
        //   //Cambio de estado del usuario a online
        //   User.update(req.session.User.id, {online: true}, function (err) {
        //     if (err) return res.badRequest();
        //
        //     //Informar a otros clientes (sockets abiertos) que el usuario esta logueado
        //     User.publishUpdate(req.session.User.id, {
        //       loggedIn: true,
        //       id: req.session.User.id
        //     });
        //   });
        // }
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
      FlashService.error(req, 'You must enter both a username and password.' );

      res.redirect('/session/new');
      return;
    }

    User.findOneByEmail(req.param('email'), function foundUser(err, user){
      if (err) return next(err);

      if (!user){
        msg = 'The email address ' + req.param('email') + ' not found';
        FlashService.error(req, msg );

        res.redirect('session/new');
        return;
      }

      require('bcrypt').compare(req.param('password'), user.encryptedPassword, function checkPassword(err, valid){
        if(err) return next(err);

        if(!valid){
          FlashService.error(req, 'Invalid username and password combination.' );

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
          FlashService.success(req, req.__('Welcome') );

          if (req.session.User.admin) {
            res.redirect('/robot/index_public_robots/');
          }else{
            res.redirect('/robot/index_public_robots/');
          }

          return;
        });
      });
    });
  },


  destroy: function(req, res, next) {

    if (req.session.User){
      User.findOne(req.session.User.id, function foundUser(err, user){
        if(err) return next(err);
        if(!user){
          FlashService.error(req, 'User not found.' );
          return res.redirect('/');
        }

        User.update(user.id, {online: false}, function (err){
          if(err) return next(err);
          req.session.destroy();

          //Informar a otros clientes (sockets abiertos) que el usuario no esta logueado
          // User.publishUpdate(user.id, {
          //   loggedIn: false,
          //   id: user.id
          // });

          res.clearCookie('io');
          res.clearCookie('sails.sid');

          //redireccion a Sign-in
          return res.redirect('/');
        });
      });
    }
    }
};

