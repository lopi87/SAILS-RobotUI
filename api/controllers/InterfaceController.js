/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  show: function (req, res, next) {
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      Action.find({interface_owner: req.param('id')}).exec(function(err, actions) {
        if (err) return next(err);

        Robot.find({robot_interface: iface.id}).exec(function(err, robot) {
          if (err) return next(err);

          res.view({
            interface: iface,
            actions: actions,
            index: actions.length,
            robot: robot
          });
        });

      });

    });
  },

/*
  getactions: function (req, res, next) {

    Interface.findOne(req.param('id'), function foundInterface(err, interface) {
      if (err) return next(err);
      if (!interface) return next();
      res.view({
        interface: interface,
        actions: interface.actions
      });
    });
  }
  */


  newaction: function (req, res, next) {

    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      var actionObj = {
        interface_owner: iface.id,
        name: req.param('name'),
        code: req.param('code'),
        element: 'button',
        port: parseInt(req.param('port'))
      };

      Action.create(actionObj, function actionCreated(err, action) {

        //Si hay error
        if (err){
          console.log(err);
          req.session.flash ={
            err: err
          };

          //redireccion si hay error
          return res.redirect('/interface/show/' + iface.id);
        }

        //action.save(function (err) {
        //  if (err) return next(err);
        //});

        Action.publishCreate(action);
        console.log('The action has been created');

        return res.ok({message: 'The action has been created',
          name: action.name,
          code: action.code,
          id: action.id

        });

        //req.session.flash = {};

        //TODO https://courses.platzi.com/courses/develop-apps-sails-js/   curso de sails js por el creador del framework

        //TODO episodio 21 activityuoverlord        https://www.youtube.com/watch?v=enyZYgjXRqQ

      });
    });
  },


  deleteaction: function (req, res, next) {

    Action.destroy({id: req.param('id')}).exec(function deleteaction(err){
      console.log('The action has been deleted');

        //Si hay error
        if (err){
          console.log(err);
          req.session.flash ={
            err: err
          };

          //redireccion si hay error
          return res.redirect('/interface/show/' + iface.id);

        }

      return res.ok({id: req.param('id')});
      //req.session.flash = {};

    });
  },


  commandline: function(req,res,next){

    var command = req.param('command');
    var interface = req.param('interface');

    var user = req.session.User.id;

    if (command && req.isSocket){
      console.log('emitiendo comando...');
      Interface.publishCreate({id: interface,command: command});

     //sails.socket.emit('command', {command: command});

      console.log('command send');

    } else if (req.isSocket){
      Interface.watch(req);
      console.log('Intreface with socket id '+sails.sockets.id(req)+' is now subscribed to the model class \'Interface\'.');
    } else {
      res.view();
    }
  }

  };

