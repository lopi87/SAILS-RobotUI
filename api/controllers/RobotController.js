/**
 * RobotController
 *
 * @description :: Server-side logic for managing Robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var Log = require('log');
log = new Log('debug');

var geoip = require('geoip-lite');

module.exports = {


  //Carga la pag new
  new: function(req, res){

    User.find(function foundUsers(err, users){
      if (err) return res.serverError(err);
      res.view({users: users});
    });
  },


  create: function(req, res, next) {

    var geo = geoip.lookup(req.param('ipaddress'));

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id, //Añadimos el propietario
      longitude: 0,
      latitude: 0
    };

    if(geo){
      robotObj.longitude = geo.ll[1];
      robotObj.latitude = geo.ll[0];
    }


    Robot.create(robotObj, function robotCreated(err, robot) {
      //Se relaciona el robot con su interfaz de control
      Interface.create({robot_owner: robot.id}, function interfaceCreated(err, iface){
        if (err) { return res.serverError(err); }

        console.log('Associating robot - interface: ',robot.name,'with',iface.id);
        robot.robot_interface = iface.id;
        Robot.publishCreate(robot);

        //Añade los usuarios invitados del robot
        var driver_users = [];
        if (req.param('driver_users') && !(req.param('driver_users') instanceof Array)){
          driver_users.push(req.param('driver_users'));
        }else{
          driver_users = req.param('driver_users');
        }

        driver_users.forEach(function(user_id)  {
          User.findOne(user_id, function foundUser(err, user){
            if(err) return next(err);
            if(!user) return next();

            //añadir invitados
            log.debug('Associating robot - user: ',robot.id,'with',user.id);
            robot.drivers.add(user.id);
            robot.save(function (err) {
              if (err) return next(err);
            });
          });
        });


        var viewer_users = [];
        if (req.param('viewer_users') && !(req.param('viewer_users') instanceof Array)){
          viewer_users.push(req.param('viewer_users'));
        }else{
          viewer_users = req.param('driver_users');
        }

        //Añade los usuarios invitados del robot
        viewer_users.forEach(function(user_id)  {
          User.findOne(user_id, function foundUser(err, user){
            if(err) return next(err);
            if(!user) return next();

            //añadir invitados
            log.debug('Associating robot - user: ',robot.id,'with',user.id);
            robot.viewers.add(user.id);
            robot.save(function (err) {
              if (err) return next(err);
            });
          });
        });

        ImageService.upload_robot_avatar(req.file('robot_avatar'), robot, function whenDone(err, files) {
          if (err) return res.negotiate(err);

          msg = { err: 'Robot has been created.' };
          FlashService.success(req, msg );

          robot.save(function (err) {
            if (err) return next(err);
          });

          //Redirección a index
          return res.redirect('robot/index/');

        });
      });
    });
  },


  show: function(req, res, next){
    Robot.findOne(req.param('id')).populate('drivers').populate('viewers').exec(function (err, robot){
      if(err) return next(err);
      if(!robot) return next();

      User.findOne(robot.owner,function foundUsers(err, user){
        if(err) return next(err);
        res.view({
          robot: robot,
          user: user,
          user_driver: robot.drivers,
          user_viewer: robot.viewers
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

      User.find(function foundUsers(err, users){
        if (err) return next(err);

        PermissionService.get_permissions_array(robot.id, function(error, perm) {

          res.view({
            robot: robot,
            perm: perm,
            users: users
          });
        });
      });
    });
  },


  update: function(req, res, next){

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id
    };


    Robot.findOne(req.param('id'), function foundRobot(err, robot) {
      if (err) return next(err);
      if (!robot) return next();
      ImageService.upload_robot_avatar(req.file('robot_avatar'), robot, function whenDone(err, files) {
        if (err) return res.negotiate(err);
      });

      Robot.update(req.param('id'), robotObj, function robotUpdated(err) {
        if (err){
          return res.redirect('/robot/edit' + req.param('id'));
        }
        msg = {err: 'The Robot has been updated'};
        FlashService.success(req, msg);
        res.redirect('/robot/show/' + req.param('id'));
      });
    });
  },


  show_permissions: function(req, res, next){

    var robot_id = req.param('id');

    Robot.findOne(robot_id).exec(function (err, robot) {
      if (err) return res.badRequest(err);

      PermissionService.get_permissions_array(robot_id, function(error, perm) {

        User.find(function foundUsers(err, users) {
          if (err) return res.badRequest(err);

          res.view({
            robot: robot,
            perm: perm,
            users: users
          });
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

      robot.save(function (err){
        console.log('The new permissions has been added');

        PermissionService.get_permissions_array(robot_id, function(error, perm) {

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
  }

};
