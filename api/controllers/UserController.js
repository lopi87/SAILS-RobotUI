/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pager = require('sails-pager');

module.exports = {

  //Carga la pag sign up
  'new': function (req, res) {
    res.view();
  },


  //Crea un usuario con los parametros del formulario
  // new.ejs
  create: function (req, res, next) {

    var userObj = {
      name: req.param('name'),
      email: req.param('email'),
      language: req.param('language'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };


    User.create(userObj, function userCreated(err, user) {
      if (err){
        FlashService.server_exit(req, err);
        return res.redirect('/user/new');
      }

      //Logueamos al usuario
      req.session.authenticated = true;
      req.session.User = user;

      user.online = true;

      user.save(function (err) {
        if (err) return next(err);
      });

      FlashService.success(req, 'User created.' );
      User.publishCreate({id: user.id});

      ImageService.upload_avatar(req.file('avatar'), user, function whenDone(err, files) {
        if (err) return res.negotiate(err);
      });

      //Mandar email de bienvenida
      EmailService.sendWelcomeEmail({
        emailAddress: user.email,
        firstName: user.name
      }, function (err) {
        if (err) { return res.serverError(err); }
      });


      if (req.session.User.admin) return res.redirect('/user');
      return res.redirect('user/show/' + user.id);

    });
  },

  show: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return res.serverError(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },


  index: function (req, res, next) {
    var page = 1;

    if( typeof req.param('page') != 'undefined'  ){
      page = parseInt(req.param('page'));
    }

    User.pagify('users', {sort: ['createdAt DESC'], page: page}).then(function(data){
      res.view({data: data});
    }).catch(function(err){
      return next(err);
    });

  },


  edit: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },


  update: function (req, res, next) {

    var userObj = {
      name: req.param('name'),
      email: req.param('email'),
      language: req.param('language')
    };

    if (req.session.User.admin == true) {
      userObj.admin = req.param('admin')
    }

    if (req.param('password') != '********'){
      userObj.password = req.param('password');
      userObj.confirmation = req.param('confirmation');
      userObj.newPassword = true;
    }


    User.findOne(req.param('id')).exec(function userFound(err, user){
      if (err){
        FlashService.server_exit(err);
        return res.redirect('/user/edit' + req.param('id'));
      }
      ImageService.upload_avatar(req.file('avatar'), user, function whenDone(err, files) {
        if (err){
          FlashService.server_exit(err);
          return res.redirect('/user/edit' + req.param('id'));
        }
      });
    });


    User.update(req.param('id'), userObj, function userUpdated(err) {
      if (err) {
        FlashService.server_exit(err);
        return res.redirect('/user/edit' + req.param('id'));
      }

      if (req.session.User.admin == true) {
        User.publishUpdate(req.param('id'), {
          name: req.param('name'),
          email: req.param('email'),
          admin: req.param('admin')
        });
      }
      FlashService.success(req, 'User updated.' );
      res.redirect('/user/show/' + req.param('id'));
    });

  },


  destroy: function (req, res, next) {
    var id = req.param('id');

    User.findOne(id, function foundUser(err, user) {
      if (err) return next(err);
      if (!user) {
        FlashService.error(req, 'User doesn\'t exists.');
        return res.redirect('user/index');
      }

      User.destroy(id, function userDestroyed(err) {
        return res.badRequest(err);

        ImageService.delete_file(user);

        User.publishDestroy(id, {id: user.id});

        FlashService.success(req,  'User deleted.');

        res.redirect('/');
      });
    });
  },


  user_subscribe: function (req, res, next) {
    if (req.isSocket) {
      //Update, destroy...
      User.find(function foundUsers(err, users) {
        if (err) return res.badRequest(err);

        User.subscribe(req.socket, users);
      });

      //Create
      User.watch(req);
      console.log('User ' + req.session.User.id + 'with socket id ' + sails.sockets.id(req) + ' is now subscribed to the model class \'User\'.');
    } else {
      res.view();
    }
  },


  //Añade una nueva fila a la tabla usuarios (vista) cuando uno es creado.
  render: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      return res.badRequest('Ajax call');
      if (!user) return res.badRequest(__('not_found'));

      return res.render('user/_row.ejs', {
        user: user,
        layout: false
      });
    });
  },


// Send a private message from one user to another
  private: function (req, res) {
    // Get the ID of the currently connected socket
    var socketId = sails.sockets.id(req.socket);
    // Use that ID to look up the user in the session
    // We need to do this because we can have more than one user
    // per session, since we're creating one user per socket

    Session.findOne({socket_id: socketId}, function foundSession(err, session) {
      if (err) return next(err);
      if (!session) return next();

      User.findOne(session.user_id, function foundUser(err, user) {
        if (err) return next(err);
        if (!user) return;

        User.message(user.id, {
          from: user.id,
          msg: ''
        });

      });
    });
  },


  edit_avatar: function (req, res, next) {

    if (req.xhr){

      req.file('avatar').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 10000000,
        saveAs: function(file, cb){

          // setting allowed file types
          var allowedTypes = ['image/jpeg', 'image/png'];

          var extension = file.filename.split('.').pop();

          // seperate allowed and disallowed file types
          if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
            err = {err: 'Disallowed file type'};
            return res.badRequest(err);
          }

          var Path = '../../.tmp/public/uploads/avatar/' + req.session.User.id + '.' + extension;
          cb(null, Path);

        }
      },function whenDone(err, file) {
        if (err) return res.negotiate(err);

        // If no files were uploaded, respond with an error.
        if (file.length === 0){
          FlashService.error(req, 'No file was uploaded.');
          res.redirect('/user/new');
        }


        var extension = file[0].filename.split('.').pop();

        // Save the "fd" and the url where the avatar for a user can be accessed
        User.update(req.session.User.id, {
          // Generate a unique URL where the avatar can be downloaded.
          avatarUrl: require('util').format('/uploads/avatar/%s', req.session.User.id + '.' + extension),
          // Grab the first file and use it's `fd` (file descriptor)
          avatarFd: file[0].fd
        }).exec(function (err){
          if (err) return res.negotiate(err);
          return res.ok({url: ''});
        });
      });
    }else{
      return res.badRequest('Ajax call');
    }
  }

};
