/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pager = require('sails-pager');

module.exports = {


  index: function(req, res, next) {
    var page = 1;
    if( typeof req.param('page') != 'undefined'  ){
      page = parseInt(req.param('page'));
    }

    User.find(function foundUsers(err, users){
      if(err) return next(err);

      Message.pagify('messages', {sort: ['createdAt DESC'], populate:[ 'from_user_id' ], page: page}).then(function(data){
        res.view({
          data: data,
          users:users
        });
      }).catch(function(err){
        return next(err);
      });
    });
  },


  create: function (req, res, next) {
    User.find(function foundUsers(err, users) {
      if (err) return next(err);

      users.forEach(function(user, index, object){
        if (user.id == req.session.User.id){
          object.splice(index, 1);
        }
      });

      return res.render('message/new.ejs', {
        users: users
      });
    });
  },


  send: function(req, res, next) {

    if (req.xhr){
      var msgObj = {
        content: req.param('content'),
        from_user_id: req.session.User.id,
        to_user_id: req.param('to_user_id'),
        title: req.param('title')
      };

      User.findOne( req.param('to_user_id'), function foundUser(err, user) {
        if (err) {
          FlashService.server_exit(req, err);
          return res.redirect('/message/index');
        }
        if (!user) {
          msg = {err: 'No user selected'};
          FlashService.error(req, msg);
          return res.redirect('/message/index');
        }

        Message.create(msgObj, function messageCreated(err, msge){
          if (err) {
            FlashService.server_exit(req, err);
            return res.redirect('/message/index');
          }

          //Mandar notificacion al usuario
          Session.findOne({user_id: req.param('to_user_id')}, function foundSession(err, session) {
            if (err) {
              console.log(err);
              var error = {err: err};
              FlashService.error(req, error);
              return res.redirect('/message/index');
            }

            if (!session) return next();
            User.message(session.user_id, {
              from: req.session.User.id,
              msg: {msg: req.param('message'), id: msge.id}
            });
          });

          res.ok({ msg: 'success' });
        });

      });
    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  },


  markasread: function(req, res, next){
    if(req.xhr){
      var id =  req.param('id');

      Message.update( id, {read: true}, function msgUpdated(err){
        if(err) return res.badRequest(err);
        return res.ok({
          msg: 'set as read'
        });
      });
    }else{
      err= 'Ajax call';
      return res.badRequest(err);
    }
  },


  destroy: function(req, res, next){
    if (req.xhr) {
      //Puedo borrar???

      var id = req.param('id');
      Message.destroy({id: req.param('id')}).exec(function deleteMessage(err) {
        console.log('The msg has been deleted');

        //Si hay error
        if (err) {
          console.log(err);
          return res.next(err);
        }

        return res.ok({id: req.param('id')});
      });
    }else{
      err= 'Ajax call';
      return res.badRequest(err);
    }
  },

  show: function(req, res, next){

    if (req.xhr) {

      var id = req.param('id');

      Message.findOne(id).populate('from_user_id').exec(function (err, message) {
        if (err) return next(err);
        if (!message) return next();

        Message.update(id, {read: true}, function msgUpdated(err) {
          if (err) return res.badRequest(err);

          return res.render('message/show.ejs', {
            message: message
          });

        });
      });
    }else{
      err= 'Ajax call';
      return res.badRequest(err);
    }
  },


  message_subscribe: function (req, res, next) {
    if (!req.isSocket) {
      return res.badRequest('HTTP request.');
    }

    var socketId = sails.sockets.id(req);

    Session.findOne({socket_id: socketId}, function foundSession(err, session) {
      if (err) return next(err);
      if (!session) return next();

      User.findOne(session.user_id, function foundUser(err, user) {
        if (err) return next(err);
        if (!user) {return next(err);}

        //Solo este usuario recibira el evento message
        User.subscribe(req, user, 'message');

        return res.json(user);
      });
    });
  }

};
