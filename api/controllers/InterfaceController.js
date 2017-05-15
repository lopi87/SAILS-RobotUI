/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Log = require('log');
log = new Log('debug');
var geoip = require('geoip-lite');


module.exports = {

  configure: function (req, res, next) {

    Interface.findOne({id: req.param('id')}).populate('events').populate('video').populate('robot_owner').populate('sliders').exec(function (err, iface) {
      if(err) return res.badRequest(err);
      if(!iface) return res.badRequest(__('not_found'));

      //Mis iconos y los del sistema por defecto
      Icon.find({or: [{user_owner: req.session.User.id}, {default: true}]}).exec(function (err, icons) {
        if(err) return res.badRequest(err);

        User.findOne({id:  iface.robot_owner.owner}).exec(function Userfound(err, user){
          if(err) return res.badRequest(err);
          if(!user) return res.badRequest(__('not_found'));


          Action.find({or: [{interface_owner: req.param('id')},{default: true}] }).populate('icon').exec(function(err, actions) {
            if (err) return res.badRequest(err);

            res.view({
              interface: iface,
              actions: actions,
              sliders: iface.sliders,
              events: iface.events,
              video: iface.video,
              joysticks: iface.joysticks,
              icons: icons,
              robot: iface.robot_owner,
              user: user
            });
          });
        });
      });
    });
  },


  show: function (req, res, next) {
    Interface.findOne(req.param('id')).populate('events').populate('video').populate('robot_owner').exec(function (err, iface) {
      if(err) return res.badRequest(err);
      if(!iface) return res.badRequest(__('not_found'));

        Action.find({interface_owner: req.param('id')}).populate('icon').exec(function (err, actions) {
          if (err) return res.badRequest(err);


          Slider.find({interface_owner: req.param('id')}).exec(function (err, sliders) {
            if (err) return res.badRequest(err);


            User.findOne({id: iface.robot_owner.owner}).exec(function Userfound(err, user) {
              if (err) return res.badRequest(err);

              var geo = geoip.lookup(iface.robot_owner.ipaddress);
              if (geo) {
                iface.robot_owner.longitude = geo.ll[1];
                iface.robot_owner.latitude = geo.ll[0];
              }

              res.view({
                interface: iface,
                actions: actions,
                sliders: sliders,
                events: iface.events,
                video: iface.video,
                joysticks: iface.joysticks,
                robot: iface.robot_owner,
                user: user
              });
            });
          });
        });
      });
  },


  view: function(req, res, next){

    Interface.findOne({id: req.param('id')}).populate('events').populate('video').populate('sliders').populate('robot_owner').exec(function (err, iface) {
      if(err) return res.badRequest(err);
      if(!iface) return res.badRequest(__('not_found'));

      Action.find({interface_owner: req.param('id')}).populate('icon').exec(function(err, actions) {
        if (err) return res.badRequest(err);


          User.findOne({id:  iface.robot_owner.owner}).exec(function Userfound(error, user){
            if (err) return res.badRequest(err);

          res.view({
            interface: iface,
            actions: actions,
            sliders: iface.sliders,
            joysticks: iface.joystick,
            video: iface.video,
            events: iface.events,
            robot: iface.robot_owner,
            user: user
          });
          });
        });
      });
  },


  update_board_size: function (req, res, next) {
    if (req.xhr) {
      //Puede actualizar?

      var id = req.param('id');
      var x = req.param('width');
      var y = req.param('height');

      //Comprobar si puede o no actualizar

      Interface.update(id, {panel_sizex: x, panel_sizey: y}, function ifaceUpdated(err) {
        if (err) return res.badRequest(err);
        res.ok({
          msg: 'size updated'
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }
  },


  //Se elimina las acciones de la interfaz, pero esta se conserva enlazada al robot
  destroy: function (req, res, next) {
    if(req.xhr){
      var id = req.param('id');
      Interface.findOne(id, function foundInterface(err, interface) {
        if (err) return res.badRequest(err);
        if (!interface) {
          err = 'Interface doesn\'t exists.';
          return res.badRequest(err);
        }
        Action.destroy({interface_owner: interface.id}).exec(function (err) {
          if (err) return res.badRequest(err);

          Video.destroy({interface_owner: interface.id}).exec(function (err) {
            if (err) return res.badRequest(err);

            Slider.destroy({interface_owner: interface.id}).exec(function (err) {
              if (err) return res.badRequest(err);

              Event.destroy({interface_owner: interface.id}).exec(function (err) {
                if (err) return res.badRequest(err);

                res.ok({
                  msg: 'deleted'
                });
              });
            });
          });
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }
  },

  //Modo visita en la interfaz, se subscribe para recibir los eventos que iran sucediendo
  subscribe: function (req, res){

    if (!req.isSocket) return res.badRequest();

    //Nos unimos al room
    sails.sockets.join(req.socket, req.param('robot_id'));

    //Link socket with a room (into database)
    Session.findOne({socket_id: req.socket.id}).exec(function (err, session){
      if (err) return res.badRequest();
      if (!session) return res.badRequest();

      Room.findOrCreate({room_name: req.param('robot_id')}, {room_name: req.param('robot_id')}).then(function(room){
        if (!room) return res.badRequest();

        //Link
        room.sockets_room.add(session.id);
        room.save(function(err, room) {
          if (err) return res.badRequest();

          //Aviso de una nueva conexion a todos los clientes de la room llamada con el valor de robot.id
          User.findOne(session.user_id, function foundUser(err, user) {
            if (err) return res.badRequest();
            if (!user) return res.badRequest();

            sails.sockets.broadcast(req.param('robot_id'), {
              type: 'new_viewer_user',
              msg: {user_name: user.name, avatar: user.avatarUrl, user_id: user.id}
            });
            console.log('User ' + req.session.User.id + 'with socket id ' + sails.sockets.id(req) + ' is now subscribed to the model class \'Robot\'.');
          });

        });
      }).catch( sails.log.error );

    });
  },


  //Emision de los eventos a los vivitantes de una interfaz
  emit_event: function(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.broadcast(req.param('robot'), {type: 'event', id: req.param('id'), msg: req.param('msg')});
  },


  //Emision de las acciones a los vivitantes de una interfaz
  emit_action: function(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.broadcast(req.param('robot'), {type: 'action', id: req.param('id'), msg: req.param('msg')});
  },


  //Emision del valor slider a los vivitantes de una interfaz
  emit_slider: function(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.broadcast(req.param('robot'), {type: 'slider', id: req.param('id'), msg: req.param('msg')});
  },


  //Emision de las acciones a los vivitantes de una interfaz
  emit_command: function(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.broadcast(req.param('robot'), {type: 'command', id: req.param('id'), msg: req.param('msg')});
  },


  //Emision de las acciones a los vivitantes de una interfaz
  emit_video: function(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.broadcast(req.param('robot'), {type: 'video', id: req.param('id'), msg: req.param('msg')});
  },



  eject_viewer_user: function (req, res, next) {
    //Ajax call
    if (req.xhr) {
      if(req.param('user_id') != req.session.User.id){
        Room.findOne({room_name: req.param('robot_id')}).populate('sockets_room').exec(function (err, room) {
          if (err) {return res.serverError(err);}
          if (!room) return next();

          room.sockets_room.forEach(function(session) {
            if (session.user_id ==  req.param('user_id')){
              sails.sockets.broadcast(session.socket_id, {type: 'out'});
              sails.sockets.leave(session.socket_id, room.room_name, function(err) {
              });
            }
          });

        });
        return res.ok({
          msg: 'User out'
        });

      }else{
        err= 'User incorrect';
        return res.badRequest(err);
      }

    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  }

};
