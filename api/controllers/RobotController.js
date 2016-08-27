/**
 * RobotController
 *
 * @description :: Server-side logic for managing Robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var Log = require('log');
log = new Log('debug');

module.exports = {


  //Carga la pag new
  new: function(req, res){
    User.native(function(err, collection) {
      if (err) return res.serverError(err);

      collection.find({}, {name: true}).toArray(function (err, results) {
        if (err) return res.serverError(err);
        res.view({users: results});
      });
    });
  },


  create: function(req, res, next) {
    //TODO Comprobar que los parametros sean correctos

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id
    };

    Robot.create(robotObj, function robotCreated(err, robot) {
      //Añadimos el propietario
      robot.owner = req.session.User.id;

      //Se relaciona el robot con su interfaz de control
      Interface.create({robot_owner: robot.id}, function interfaceCreated(err, iface){
        console.log('Associating robot - interface: ',robot.name,'with',iface.id);

        iface.save(function (err) {
          if (err) return next(err);

          robot.robot_interface = iface.id;
          robot.save(function (err) {
            if (err) return next(err);
            Robot.publishCreate(robot);

            //Añade los usuarios invitados del robot
            if (req.param('driver_users') && req.param('driver_users') instanceof Array){
              req.param('driver_users').forEach(function(user_id)  {
                User.findOne(user_id, function foundUser(err, user){
                  if(err) return next(err);
                  if(!user) return next();

                  if (user.id != req.session.User.id){
                    //añadir invitados
                    log.debug('Associating robot - user: ',robot.id,'with',user.id);
                    user.d_robots.add(robot.id);
                    user.save(function (err) {
                      if (err) return next(err);
                    });
                  }
                });
              });
            }else {
              if (req.param('driver_users')) {
                User.findOne(req.param('driver_users'), function foundUser(err, user) {
                  if (err) return next(err);
                  if (!user) return next();

                  //Añadir un invitado
                  if (user.id != req.session.User.id) {
                    log.debug('Associating robot - user: ', robot.name, 'with', user.id);
                    user.d_robots.add(robot.id);
                    user.save(function (err) {
                      if (err) return next(err);
                    });
                  }
                });
              }
            }

            //Añade los usuarios invitados del robot
            if (req.param('driver_users') && req.param('viewer_users') instanceof Array){
              req.param('viewer_users').forEach(function(user_id)  {
                User.findOne(user_id, function foundUser(err, user){
                  if(err) return next(err);
                  if(!user) return next();

                  if (user.id != req.session.User.id){
                    //añadir invitados
                    log.debug('Associating robot - user: ',robot.id,'with',user.id);
                    user.v_robots.add(robot.id);
                    user.save(function (err) {
                      if (err) return next(err);
                    });
                  }
                });
              });
            }
            else {
              if (req.param('viewer_users')){
                User.findOne(req.param('viewer_users'), function foundUser(err, user) {
                  if (err) return next(err);
                  if (!user) return next();

                  //Añadir un invitado
                  if (user.id != req.session.User.id) {
                    log.debug('Associating robot - user: ', robot.name, 'with', user.id);
                    user.v_robots.add(robot.id);
                    user.save(function (err) {
                      if (err) return next(err);
                    });

                  }
                });
              }
            }
            //Redirección a index
            return res.redirect('robot/index/');
          });
        });
      });
    });
  },

  show: function(req, res, next){
    Robot.findOne(req.param('id')).populate('drivers').exec(function (err, robot1){
      if(err) return next(err);
      if(!robot1) return next();

      Robot.findOne(req.param('id')).populate('viewers').exec(function (err, robot2){
        if(err) return next(err);

        User.findOne(robot1.owner,function foundUsers(err, user){
          if(err) return next(err);
          res.view({
            robot: robot1,
            user: user,
            user_driver: robot1.drivers,
            user_viewer: robot2.viewers
          });
        });
      });
    });
  },




  index: function(req, res, next) {



    Robot.find({owner: req.session.User.id}).exec(function foundRobot(err, robots){
      if(err) return res.serverError(err);


      /*
      var ping = require('ping');
      var address;
      robots.forEach(function(robot){
        address = robot.ipaddress + ':' + robot.port;
        ping.sys.probe(robot.ipaddress, function(isAlive){
          var msg = isAlive ? 'host ' + address + ' is alive' : 'host ' + address + ' is dead';
          robot.isAlive = isAlive;
          console.log(msg);
        });
      });
      */

      User.findOne(req.session.User.id).populate('d_robots').exec(function (err, user1){
        if (err) return res.serverError(err);

        User.findOne(req.session.User.id).populate('v_robots').exec(function (err, user2){
          if (err) return res.serverError(err);

          res.view({
            robots:robots,
            driver_robots: user1.d_robots,
            viewer_robots: user2.v_robots
          });
        });
      });
    });
  },



  index_driver_robots: function(req, res, next) {
    User.findOne(req.session.User.id).populate('d_robots').exec(function (err, user){
      if (err) return res.serverError(err);

      res.view({
        driver_robots: user.d_robots
      });
    });
  },



  index_viewer_robots: function(req, res, next) {
    User.findOne(req.session.User.id).populate('v_robots').exec(function (err, user){
      if (err) return res.serverError(err);

      res.view({
        viewer_robots: user.v_robots
      });
    });
  },


  //Cambiar en la base de datos el estado del robot (Ocupado)
  changetobusy: function(req,res,next){

    if (req.isSocket) {

      var robot_id = req.param('robot'), state = req.param('state'), user = req.session.User.id;
      state == 'on'?  state = true : state = false;

      Robot.update({id: robot_id},{busy: state}, function robotUpdated(err) {
        if (err) return next(err);

        //Informar a otros clientes (sockets abiertos) que el robot queda liberado u ocupado
        Robot.publishUpdate(robot_id, {
          busy: state,
          id: robot_id
        });

        //Si el robot queda ocupado, lo alamcenamos en la session
        if (state == true) {
          Session.update({socket_id: req.socket.id}, {robot_id: robot_id}, function sessionUpdated(err, session){
            if (err) return next(err);
            log.debug('Robot ocupado...');
          });
        } else if (state == false) {
          Session.update({socket_id: req.socket.id}, {robot_id: ''}, function sessionUpdated(err, session){
            if (err) return next(err);
            log.debug('Robot liberado...');
          });
        }
      });
    }else {
      res.view();
    }
  },


  //Robot.subscribe(req.socket,req.session.User.id);
//log.debug('Robot with socket id '+ sails.sockets.id(req)+' is now subscribed to the model class \'Robot\'.');


robot_subscribe: function(req,res,next){
    if (req.isSocket){
      //Update, destroy...
      Robot.find(function foundRobots(err,robots){
        if (err) return next(err);
        Robot.subscribe(req.socket,robots);
      });

      //Create
      Robot.watch(req);
      log.debug('User ' + req.session.User.id + 'with socket id '+sails.sockets.id(req)+' is now subscribed to the model class \'Robot\'.');
    } else {
      res.view();
    }
  },


  destroy: function(req, res, next){
    var id = req.param('id');

    Robot.findOne(id, function foundRobot(err, robot){
      if (err) return next(err);
      if (!robot){
        msg = { err: 'Robot doesn\'t exists.' };
        FlashService.error(req, msg );
        return res.redirect('robot/index');
      }

      //Eliminar la interfaz del robot
      Interface.find({robot_owner: robot.id}).exec(function (err, interface){
        if (err) return next(err);
        if (!interface) {
          msg = {err: 'Interface doesn\'t exists.'};
          FlashService.error(req, msg);
          return res.redirect('robot/index');
        }

        Action.destroy({interface_owner: interface.id}).exec(function (err, action) {
          if (err) return next(err);

          Event.destroy({interface_owner: interface.id}).exec(function (err, action) {
            if (err) return next(err);

            Video.destroy({interface_owner: interface.id}).exec(function (err, action) {
              if (err) return next(err);

              Interface.destroy(interface.id, function interfaceDestroyed(err) {
                if (err) return next(err);

                Robot.destroy(id, function robotDestroyed(err){
                  if (err) return next(err);

                  Robot.publishDestroy(id, {id: robot.id});

                  msg = { err: 'Robot deleted' };
                  FlashService.success(req, msg );
                  return res.redirect('robot/index');
                });
              });
            });
          });
        });
      });
    });
  },



  edit: function (req, res, next) {
    Robot.findOne(req.param('id'), function foundRobot(err, robot) {
      if (err) return next(err);
      if (!robot) return next();
      res.view({
        robot: robot
      });
    });
  },


  show_permissions: function(req, res, next){

    var robot_id = req.param('id');
    Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot){
      if (err) return res.badRequest(err);

      if(!robot) return res.redirect('robot/index');

      User.find(function foundUsers(err, users){
        if (err) return res.badRequest(err);

        //Hash con clave id, valores d y v (true false)
        var perm = {};
        robot.drivers.forEach(function(user) {
          perm[user.id] = {d: true, v: false};
        });

        robot.viewers.forEach(function(user) {
          if((user.id in perm)){
            perm[user.id] = {d: perm[user.id].d , v: true};
          }
          else{
            perm[user.id] = {d: false, v: true};
          }
        });

        res.view({
          robot:robot,
          perm: perm,
          users: users
        });
      });
    });
  },


  new_permissions: function(req, res, next){
    var robot_id = req.param('id');


    if (req.param('users') && req.param('users') instanceof Array) {

    }else{
      users = [req.param('users')]
    }

      //Check if the users exists
      req.param('users').forEach(function (user_id) {
        User.findOne(user_id).exec(function (err, user) {
          if (err) return res.badRequest(err);
          if (!user) return next();
        });
      });

    Robot.findOne(robot_id).exec(function foundRobot(err, robot) {
      if (err) return res.badRequest(err);
      if (!robot) return res.badRequest(err);

      req.param('users').forEach(function (user_id) {
        if (req.param('control_check')) {
          robot.drivers.add(user_id);
        }
        if (req.param('view_check')) {
          robot.viewers.add(user_id);
        }

        if (!req.param('control_check')) {
          robot.drivers.remove(user_id);
        }
        if (!req.param('view_check')) {
          robot.viewers.remove(user_id);
        }
      });


      robot.save(function (err, robot){
        console.log('The new permissions has been added');

        Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot) {
          if (err) return res.badRequest(err);

          //Hash con clave id, valores d y v (true false)
          var perm = {};
          robot.drivers.forEach(function (user) {
            perm[user.id] = {d: true, v: false};
          });

          robot.viewers.forEach(function (user) {
            if ((user.id in perm)) {
              perm[user.id] = {d: perm[user.id].d, v: true};
            }
            else {
              perm[user.id] = {d: false, v: true};
            }
          });

          console.log(perm);

          return res.render('robot/_permissions_row.ejs', {
            robot: robot,
            perm: perm,
            layout: false
          });
        });

      });
    });
  },


  delete_permission: function (req, res, next) {

    var robot_id = req.param('id');
    var user_id = req.param('user_id');

    User.findOne(user_id).exec(function (err, user) {
      if (err) return res.badRequest(err);
      if (!user) return next();

      Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot) {
        if (err) return res.badRequest(err);
        if (!robot) return res.badRequest(err);

        robot.drivers.remove(user_id);
        robot.viewers.remove(user_id);
        robot.save().fail(function(){});

        return res.ok();
      });
    });
  },



  unlink: function (req, res, next) {

    if (req.xhr) {

      var robot_id = req.param('robot_id');
      var user_id = req.param('user_id');

      User.findOne(user_id).exec(function (err, user) {
        if (err) return res.badRequest(err);
        if (!user) return next();

        Robot.findOne(robot_id).populate('viewers').populate('drivers').exec(function (err, robot) {
          if (err) return res.badRequest(err);
          if (!robot) return res.badRequest(err);

          if(req.param('type_link') == 'driver'){
            robot.drivers.remove(user_id);
          }

          if (req.param('type_link') == 'viewer'){
            robot.viewers.remove(user_id);
          }
          robot.save();

          return res.ok();
        });
      });
    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }

  }



};









/*

User.findOne(req.session.User.id, function foundUser(err, user) {
  if (err) {
    return res.serverError(err);
  }

  Robot.subscribe(req, _.pluck(user, 'id'));
  //Solo este usuario queda sibscrito a los cambios del robot

//Informar a otros clientes (sockets abiertos) que el robot esta conectado
Robot.publishUpdate(robot.id, {busy: robot.busy, id: robot.id});
console.log('state changed');


  */
