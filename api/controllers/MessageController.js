/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pager = require('sails-pager');

module.exports = {


  index: function(req, res, next) {

    var page = page2 = 1;
    if (typeof req.param('page') != 'undefined') {
      page = parseInt(req.param('page'));
    }
    if (typeof req.param('page2') != 'undefined') {
      page2 = parseInt(req.param('page2'));
    }


    User.find(function foundUsers(err, users){
      if(err) return res.badRequest(err);

      Message.pagify('messages', { findQuery: { to_user_id: req.session.User.id }, sort: ['createdAt DESC'], page: page}).then(function(inbox){
        Message.pagify('messages', { findQuery: { from_user_id: req.session.User.id }, sort: ['createdAt DESC'], page: page2}).then(function(send) {
          res.view({
            inbox: inbox,
            sent: send,
            users: users
          });
        }).catch(function(err){
          return next(err);
        });
      }).catch(function(err){
        return next(err);
      });
    });
  },


create: function (req, res, next) {
    User.find(function foundUsers(err, users) {
      if(err) return res.badRequest(err);

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
          FlashService.error(req, 'No user selected');
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
              FlashService.server_exit(req, err);
              return res.redirect('/message/index');
            }

            if (session.user_id){
              User.message(session.user_id, {
                from: req.session.User.id,
                msg: {msg: msge.content, id: msge.id}
              });
            }

          });

          res.ok({ msg: 'success' });
        });

      });
    }else{
      return res.badRequest('Ajax call');
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
      return res.badRequest('Ajax call');
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
      return res.badRequest('Ajax call');
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
      return res.badRequest('Ajax call');
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
