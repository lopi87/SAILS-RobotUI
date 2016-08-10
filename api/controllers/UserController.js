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
        FlashService.error(req, err);

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

      //...................................
      //Subida del avatar
      //sails.controllers.user.upload(req,res);
      //.....................................

      msg = { err: 'User created' };
      FlashService.success(req, msg );

      if (req.session.User.admin) {
        res.redirect('/user');
        return;
      }

      User.publishCreate({id: user.id});

      //Mandar email de bienvenida
      EmailService.sendWelcomeEmail({
        emailAddress: user.email,
        firstName: user.name
      }, function (err) {
        if (err) { return res.serverError(err); }

        // It worked!  The welcome email was sent.
        //Redirección a show
        res.redirect('user/show/' + user.id);
      });

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

      res.redirect('/user/show/' + req.param('id'));
    });

  },


  destroy: function(req, res, next) {
    var id = req.param('id');

    User.findOne(id, function foundUser(err, user){
      if (err) return next(err);
      if (!user) return next('User doesn\'t exists.');

      User.destroy(id, function userDestroyed(err){
        if (err) return next(err);

        User.publishDestroy(id, {id: user.id});

        msg = { err: 'User deleted' };
        FlashService.success(req, msg );

        res.redirect('/');
      });
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


  //Explicado aqui https://www.youtube.com/watch?v=enyZYgjXRqQ&list=PL16Fzt2LkOBQTP2vbyZ82wci6MoOdFtF5&index=24
  user_subscribe: function(req,res,next){
    if (req.isSocket){
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
  },

  //Subida imagen avatar.
  upload: function(req, res) {

    if (req.method === 'GET')
      return res.json({ 'status': 'GET not allowed' });
    //	Call to /upload via GET is error

    // setting allowed file types
    var allowedTypes = ['image/jpeg', 'image/png'];

    var uploadFile = req.file('uploadFile');
    console.log(uploadFile);

    var user_id = req.session.User.id;

    uploadFile.upload({
      saveAs: function(file, cb) {
        var extension = file.filename.split('.').pop();

        // seperate allowed and disallowed file types
        if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
          err = { err: 'Disallowed file type' };
          FlashService.error(req, err );
          return res.redirect('/user/new');
        }else{
          // save as allowed files

          gm(file).resize('200', '200').stream().pipe(output);

          cb(null, '../../.tmp/public/uploads/profile_image/' + user_id + '.' + extension);
          //Nombre del avatar: id del usuario + extension
        }

      }},function onUploadComplete(err, files) {
            if (err) return next(err);

            console.log(files);
            msg = { err: 'Upload completed' };
            FlashService.success(req, msg );
            return res.redirect('/user/index');
    });
  },

  //Añade una nueva fila a la tabla usuarios (vista) cuando uno es creado.
  render: function(req,res,next){
    User.findOne(req.param('id'), function foundUser(err, user){
      if(err) return next(err);
      if(!user) return next();

      return res.render('user/user_row.ejs', {
        user: user,
        layout: false
      });
    });
  },







// Send a private message from one user to another
  private: function(req, res) {
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
        if (!user) {}

        User.message(user.id, {
          from: user.id,
          msg: 'HOLA HIJO PUTA'
        });

      });
    });
  },

  message_subscribe: function(req, res, next){
    if (!req.isSocket) {
      return res.badRequest('HTTP request.');
    }

    var socketId = sails.sockets.id(req);

    //Update, destroy...

    Session.findOne({socket_id: socketId}, function foundSession(err, session) {
      if (err) return next(err);
      if (!session) return next();

      User.findOne(session.user_id, function foundUser(err, user) {
        if (err) return next(err);
        if (!user) {}

        //Solo este usuario recibira el evento messageajes
        User.subscribe(req, user, 'message');

        return res.json(user);
      });
    });

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















