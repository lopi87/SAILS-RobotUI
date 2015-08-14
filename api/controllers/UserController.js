/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  //Carga la pag sign up
  'new': function(req, res){
    res.view();
  },


  //Crea un usuario con los parametros del formulario
  // new.ejs
  create: function(req, res, next) {

    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      language: req.param('language'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };


    User.create(userObj, function userCreated(err, user) {

      //Si hay error
      if (err){
        console.log(err);
        req.session.flash ={
          err: err
        };

        //redireccion si hay error
        return res.redirect('/user/new');
      }

      //Logueamos al usuario
      req.session.authenticated = true;
      req.session.User = user;

      user.online = true;
      user.save(function (err) {
        if (err) return next(err);
      });

/*
      //Subida del avatar
       req.file('avatar').upload({
          // don't allow the total upload size to exceed ~10MB
          maxBytes: 10000000
        },function whenDone(err, uploadedFiles) {


          if (err) {
            return res.negotiate(err);
          }

          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0){
            console.log('ERROR: No file was uploaded');
            return res.badRequest('No file was uploaded');
          }

          // Save the "fd" and the url where the avatar for a user can be accessed
          User.update(user, {

            // Generate a unique URL where the avatar can be downloaded.
            avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), user),

            // Grab the first file and use it's `fd` (file descriptor)
            avatarFd: uploadedFiles[0].fd
          })
            .exec(function (err){
              if (err) return res.negotiate(err);
              return res.ok();
            });
        });


      //////////////////////


*/





      if (req.session.User.admin) {
        res.redirect('/user');
        return;
      }

      User.publishCreate(user);

      //Redirección a show
      res.redirect('user/show/' + user.id);
      req.session.flash = {};

    });
  },


  show: function(req, res, next){
    User.findOne(req.param('id'), function foundUser(err, user){
      if(err) return next(err);
      if(!user) return next();
      res.view({
        user: user
      });
    });
  },


  index: function(req, res, next) {
    //console.log(new Date());
    //console.log(req.session.authenticated);

      User.find(function foundUsers(err, users){
        if(err) return next(err);

        res.view({
          users:users
        });
      });
  },


  edit: function(req, res, next){
    User.findOne(req.param('id'), function foundUser(err, user){
      if(err) return next(err);
      if(!user) return next();
      res.view({
        user: user
      });
    });
  },


  update: function(req, res, next){

    if(req.session.User.admin == true){
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        admin: req.param('admin')
      }
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email')
      }
    }

    User.update(req.param('id'), userObj, function userUpdated(err){
      if(err){
        return res.redirect('/user/edit' + req.param('id'));
      }
      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user){
      if (err) return next(err);
      if (!user) return next('User doesn\'t exists.');

      User.destroy(req.param('id'), function userDestroyed(err){
        if (err) return next(err);

        User.publishDestroy(user.id);
      });

      res.redirect('/user');
    });
  },



  subscribe: function(req, res){

    User.find(function foundUsers(err, users){
      if (err) return next(err);


      User.subscribe(req.socket);

      User.subscribe(req.socket, users);

    });
  },



  /**
   * Upload avatar for currently logged-in user
   *
   * (POST /user/avatar)
   */
  uploadAvatar: function (req, res) {

    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }


      // Save the "fd" and the url where the avatar for a user can be accessed
      User.update(req.session.me, {

        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      })
        .exec(function (err){
          if (err) return res.negotiate(err);
          return res.ok();
        });
    });
  },

  /**
   * Download avatar of the user with the specified id
   *
   * (GET /user/avatar/:id)
   */
  avatar: function (req, res){

    req.validate({
      id: 'string'
    });

    User.findOne(req.param('id')).exec(function (err, user){
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // User has no avatar image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!user.avatarFd) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk(/* optional opts */);

      // Stream the file down
      fileAdapter.read(user.avatarFd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
    });
  }



};


