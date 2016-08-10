/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {




  index: function(req, res, next) {
    Message.find({to_user_id: req.session.User.id}).exec(function foundMessage(err, messages){
      if(err) return next(err);

      User.find(function foundUsers(err, users){
        if(err) return next(err);

        res.view({
          user_messages: messages,
          users:users
        });
      });
    });
  },


  send: function(req, res, next) {

    var msgObj = {
      content: req.param('message'),
      from_user_id: req.session.User.id,
      to_user_id: req.param('to_user_id'),
      title: req.param('title')
    };

    User.findOne( req.param('to_user_id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) {
        msg = {err: 'No user selected'};
        FlashService.error(req, msg);
        return res.redirect('/message/index');
      }

      Message.create(msgObj, function messageCreated(err, msge){
        if (err) return next(err);

        //Mandar notificacion al usuario  FUNCIONA
        Session.findOne({user_id: req.param('to_user_id')}, function foundSession(err, session) {
          if (err) return next(err);
          if (!session) return next();
            User.message(session.user_id, {
              from: req.session.User.id,
              msg: req.param('message')
            });
        });
        //

        //Mandar notificacion al usuario, a cada ventana que tiene abierta REVISAR SE MANDA MUCHAS VECES
        /*
        Session.find({user_id: req.param('to_user_id')}, function foundSession(err, sessions) {
          if (err) return next(err);
          if (!sessions) return next();

          sessions.forEach(function(session, index){
            User.message(session.user_id, {
              from: req.session.User.id,
              msg: req.param('message')
            });
          });
        });
        */
        ////////////////////////////////

        msg = { err: '<i class="glyphicon glyphicon-send"></i>' + " Message send! " };
        FlashService.success(req, msg );

        return res.redirect('/message/index');
      });

    });
  },


  markasread: function(req, res, next){
    if(req.xhr){
      var id =  req.param('id');
      //Comprobar si puede editar

      Message.update( id, {read: true}, function msgUpdated(err){
        if(err) return res.badRequest(err);
        return res.ok();
      });
    }else{
      err= 'Ajax call';
      return res.badRequest(err);
    }
  },


  destroy: function(){
    if (req.xhr) {
      //Puedo borrar???

      var id = req.param('id');
      Message.destroy({id: req.param('id')}).exec(function deleteaction(err) {
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
    var id = req.param('id');

    Message.findOne(id, function foundMessage(err, message){
      if(err) return next(err);
      if(!message) return next();

      Message.update( id, {read: true}, function msgUpdated(err){
        if(err) return res.badRequest(err);

        res.view({
          message: message
        });
      });
    });
  },



  message_subscribe: function(req, res, next){
    if (!req.isSocket) {
      return res.badRequest('HTTP request.');
    }

    //Solo este usuario recibira el evento messageajes
    User.subscribe(req, req.session.User.id, 'message');


    return res.ok();
  }
};
