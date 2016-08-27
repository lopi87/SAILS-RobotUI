/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Log = require('log');
log = new Log('debug');


module.exports = {

  configure: function (req, res, next) {

    Interface.findOne({id: req.param('id')}).populate('actions').populate('events').populate('videos').populate('robot_owner').exec(function (err, iface) {
      if (err) return next(err);

      //Mis iconos y los del sistema por defecto
      Icon.find({or: [{user_owner: req.session.User.id}, {default: true}]}).exec(function (err, icons) {
        if (err) return next(err);

        res.view({
          interface: iface,
          actions: iface.actions,
          events: iface.events,
          videos: iface.videos,
          icons: icons,
          robot: iface.robot_owner
        });
      });
    });
  },


  show: function (req, res, next) {
    Interface.findOne({id: req.param('id')}).populate('actions').populate('events').populate('videos').populate('robot_owner').exec(function (err, iface) {
      if (err) return next(err);

      res.view({
        interface: iface,
        actions: iface.actions,
        events: iface.events,
        videos: iface.videos,
        robot: iface.robot_owner
      });
    });
  },


  get_viewer_users: function (req, res, next){

  },



  commandline: function (req, res, next) {

    var command = req.param('command');
    var button = req.param('button');

    var interface = req.param('interface');

    var user = req.session.User.id;

    if (command && req.isSocket) {
      console.log('emitiendo comando...');
      Interface.publishCreate({id: interface, command: command});

      //sails.socket.emit('command', {command: command});

      console.log('command send');

    }else if (button && req.isSocket) {
      console.log('emitiendo boton pulsado...');

      Action.findOne(button, function foundAction(err, action) {
        if (err) return next(err);
        if (!action) return next();
        Interface.publishCreate({id: interface, command: action.code});
        console.log('command send');
        //sails.socket.emit('command', {command: command});

        //sails.sockets.broadcast(robot.id, { msg: 'Hola!' });

      });
    } else if (req.isSocket) {
      Interface.subscribe(req.socket,req.session.User.id);
      console.log('Intreface with socket id ' + sails.sockets.id(req) + ' is now subscribed to the model class \'Interface\'.');
    } else {
      res.view();
    }
  },


  savecode: function (req, res, next) {
    if (req.xhr) {
      // Yup, it's AJAX alright.
      var code = req.param('code');
      var iface_id = req.param('id');

      Interface.findOne(iface_id, function foundInterface(err, iface) {
        if (err) return res.badRequest(err);

        iface.csscode = code.html;

        Interface.update(iface_id, iface, function ifaceUpdated(err) {
          if (err)  return res.badRequest(err);
          return res.ok({code: code.html});
        });
      });
    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

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
        res.ok();
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
        Action.destroy({interface_owner: interface.id}).exec(function (err, action) {
          if (err) return res.badRequest(err);
          console.log('Actions deleted');
          res.ok();
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }
  },



  view: function(req, res, next){

    Interface.findOne({id: req.param('id')}).populate('actions').populate('events').populate('videos').populate('robot_owner').exec(function (err, iface) {
      if (err) return next(err);

      res.view({
        interface: iface,
        actions: iface.actions,
        videos: iface.videos,
        events: iface.events,
        robot: iface.robot_owner
      });
    });
  },



//Modo visita en la interfaz, se subscribe para recibir los eventos que iran sucediendo
  view_subscribe: function (req, res, next){

  //Comprobar si tiene permisos TODO
    if (req.isSocket) {

      //Nos unimos al room
      sails.sockets.join(req.socket, req.param('robot'));

      //Aviso de una nueva conexion
      sails.sockets.broadcast(req.param('robot'), {type: 'new_viewer_user' ,msg: req.session.User.id });

      console.log('User ' + req.session.User.id + 'with socket id ' + sails.sockets.id(req) + ' is now subscribed to the model class \'Robot\'.');
    } else {
      res.view();
    }
  },


  //Emision de los eventos a los vivitantes de una interfaz
  emit_event: function(req, res, next){
    sails.sockets.broadcast(req.param('robot'), { type: 'event' ,id: req.param('id'), msg: req.param('msg') });
  },


  //Emision de las acciones a los vivitantes de una interfaz
  emit_action: function(req, res, next){
    sails.sockets.broadcast(req.param('robot'), { type: 'action' ,id: req.param('id'), msg: req.param('msg') });
  }

};
