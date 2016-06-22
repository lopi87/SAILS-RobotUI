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


      if (req.session.User.admin) {
        res.redirect('/user');
        return;
      }

      User.publishCreate({id: user.id});

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
      };

    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email')
        };
    }

    User.update(req.param('id'), userObj, function userUpdated(err){
      if(err){
        return res.redirect('/user/edit' + req.param('id'));
      }

      if(req.session.User.admin == true) {
        User.publishUpdate(req.param('id'), {
          name: req.param('name'),
          title: req.param('title'),
          email: req.param('email'),
          admin: req.param('admin')
        });
      }
      else{
        User.publishUpdate( req.param('id'), {
          name: req.param('name'),
          title: req.param('title'),
          email: req.param('email')
        });
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


/*
  subscribe: function(req, res){

    User.find(function foundUsers(err, users){
      if (err) return next(err);


      User.subscribe(req.socket);

      User.subscribe(req.socket, users);

      //Esto evitará un warning ya que intentaria renderizar una vista
      res.send(200);

    });
  },
*/


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
  },



  //Explicado aqui https://www.youtube.com/watch?v=enyZYgjXRqQ&list=PL16Fzt2LkOBQTP2vbyZ82wci6MoOdFtF5&index=24
  user_subscribe: function(req,res,next){
    if (req.isSocket){
      //Update session table
      Session.update({socket_id:sails.sockets.id(req)},{user_id:req.session.User.id}).exec(function afterwards(err, updated){
        if (err) {
          // handle error here- e.g. `res.serverError(err);`
          return;
        }
        console.log('Updated session to username ' + User.name);
      });

      //Update, destroy...
      User.find(function foundUsers(err,users){
        if (err) return next(err);
        User.subscribe(req.socket,users);
      });

      //Create
      User.watch(req);
      console.log('User ' + req.session.User.id + 'with socket id '+sails.sockets.id(req)+' is now subscribed to the model class \'User\'.');
    } else {
      res.view();
    }
  }



};











/*



 socket.on('message', commetMessageReceivedFromServer);
 //socket.get('/user/user_subscribe');

 function commetMessageReceivedFromServer(message){

 if (message.model == 'user'){
 var userId = message.id;
 updateUserInDom(userId, message);
 }
 };

 function updayeUserInDom(userId, message){

 var page = document.localtion.pathname;

 page = page.replace(/(\/)$/, '');

 switch (page){
 case '/user':
 if (message.verb = 'update'){
 UserIndexPage.updateUser(userId, message);
 }
 break;
 }
 }


 var UserIndexPage = {
 updateUser: function(id, message){

 if (message.data.loggedIn) {
 var $userRow = $('tr[data-id"' + id + '"] td img').first();
 $userRow.attr('src', "/images/icon-online.png");
 } else {
 var $userRow = $('tr[data-id"' + id + '"] td img').first();
 $userRow.attr('src', "/images/icon-offline.png");
 }
 }
 }








 */
