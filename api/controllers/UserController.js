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
  }

};


