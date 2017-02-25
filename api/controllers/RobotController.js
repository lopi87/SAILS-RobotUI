/**
 * RobotController
 *
 * @description :: Server-side logic for managing Robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Log = require('log');
log = new Log('debug');
var pager = require('sails-pager');

module.exports = {


  //Carga la pag new
  new: function(req, res){

    User.find(function foundUsers(err, users){
      if (err) return res.serverError(err);
      res.view({users: users});
    });
  },


  create: function(req, res, next) {

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id, //Añadimos el propietario
      public_drive: req.param('public_drive') == 'on' ? true : false,
      public_view: req.param('public_view') == 'on' ? true : false
    };


    Robot.create(robotObj, function robotCreated(err, robot) {
      //Se relaciona el robot con su interfaz de control
      Interface.create({robot_owner: robot.id}, function interfaceCreated(err, iface){
        if (err) { return res.serverError(err); }

        console.log('Associating robot - interface: ',robot.name,'with',iface.id);
        robot.iface = iface.id;
        Robot.publishCreate(robot);

        PermissionService.init_permissions(robot, req.param('driver_users'), req.param('viewer_users'), function whenDone(err){
          if (err) return res.negotiate(err);

          msg = { err: 'Robot has been created.' };
          FlashService.success(req, msg );

          robot.save(function (err) {
            if (err) return next(err);

            if (req.file('robot_avatar')){
              ImageService.upload_robot_avatar(req.file('robot_avatar'), robot, function whenDone(err, files) {
                if (err) return res.negotiate(err);
                //Redirección a index
                return res.redirect('robot/index/');
              });

            } else {
              return res.redirect('robot/index/');
            }


            /*
             ImageService.upload_robot_documentation(req.file('robot_documentation'), robot, function whenDone(err, files) {
             if (err) return res.negotiate(err);
             });
             */

          });
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

    //   var ping = require('ping');
    //   var address;
    //   robots.forEach(function(robot){
    //     address = robot.ipaddress + ':' + robot.port;
    //     ping.sys.probe(robot.ipaddress, function(isAlive){
    //       var msg = isAlive ? 'host ' + address + ' is alive' : 'host ' + address + ' is dead';
    //       robot.isAlive = isAlive;
    //       console.log(msg);
    //     });
    //   });

    var page = page2 = page3 = 1;
    if( typeof req.param('page') != 'undefined'  ){
      page = parseInt(req.param('page'));
    }
    if( typeof req.param('page2') != 'undefined'  ){
      page2 = parseInt(req.param('page2'));
    }
    if( typeof req.param('page3') != 'undefined'  ){
      page3 = parseInt(req.param('page3'));
    }


    User.findOne(req.session.User.id).populate('d_robots').populate('v_robots').exec(function (err, user){
      if (err) return res.serverError(err);
      if (!user) return res.badRequest();

      Robot.pagify('robots',{ findQuery: { owner: user.id }, sort: ['createdAt DESC'], page: page}).then(function(data_robots) {

         Robot.pagify('robots',{ findQuery: { viewers: user.id }, sort: ['createdAt DESC'], page: page2}).then(function(data_d_robots) {

           Robot.pagify('robots',{ findQuery: { drivers: user.id }, sort: ['createdAt DESC'], page: page3}).then(function(data_v_robots) {

             res.view({
               data_robots: data_robots,
               data_driver_robots: data_d_robots,
               data_viewer_robots: data_v_robots
             });

           });
         });
      });
    });
  },

  index_public_robots: function(req, res, next) {

    var page = 1;
    if( typeof req.param('page') != 'undefined'  ){
      page = parseInt(req.param('page'));
    }

    Robot.pagify('robots', {findQuery: { or: [{public_view: true, public_drive: true}]} , sort: ['createdAt DESC'], populate: ['owner'], page: page, perPage: 3}).then(function(data){
      res.view({data: data});
    }).catch(function(err){
      return next(err);
    });
  },


  index_driver_robots: function(req, res, next) {
    User.findOne(req.session.User.id).populate('d_robots').exec(function (err, user) {
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
  changetobusy: function(req,res){

    if (!req.isSocket) return res.badRequest();

    var robot_id = req.param('robot'), state = req.param('state');

    Robot.update({id: robot_id},{busy: state}, function robotUpdated(err) {
      if (err) return  res.badRequest();

      //Informar a otros clientes (sockets abiertos) que el robot queda liberado u ocupado
      Robot.publishUpdate(robot_id, {
        busy: state,
        id: robot_id
      });

      //Si el robot queda ocupado, lo alamcenamos en la session
      if (state == true) {
        Session.update({socket_id: req.socket.id}, {robot_id: robot_id}, function sessionUpdated(err){
          if (err) res.badRequest();
          log.debug('Robot ocupado...');
        });
      } else if (state == false) {
        Session.update({socket_id: req.socket.id}, {robot_id: ''}, function sessionUpdated(err){
          if (err) return res.badRequest();
          log.debug('Robot liberado...');
        });
      }
    });
  },


  admin_panel: function(req, res, next){

    var page = 1;

    if( typeof req.param('page') != 'undefined'  ){
      page = parseInt(req.param('page'));
    }

    Robot.pagify('robots', {sort: ['createdAt DESC'], populate: ['iface', 'owner'], page: page}).then(function(data){
      res.view({data: data});
    }).catch(function(err){
      return next(err);
    });

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

        Action.destroy({interface_owner: interface.id}).exec(function (err) {
          if (err) return next(err);

          Event.destroy({interface_owner: interface.id}).exec(function (err) {
            if (err) return next(err);

            Video.destroy({interface_owner: interface.id}).exec(function (err) {
              if (err) return next(err);

              Interface.destroy(interface.id, function interfaceDestroyed(err) {
                if (err) return next(err);

                Robot.destroy(id, function robotDestroyed(err){
                  if (err) return next(err);

                  ImageService.delete_file(robot);

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
      owner: req.session.User.id,
      public_drive: req.param('public_drive') == 'on' ? true : false,
      public_view: req.param('public_view') == 'on' ? true : false
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

  //Añade una nueva fila a la tabla robots (vista) cuando uno es creado.
  render: function (req, res, next) {
    Robot.findOne(req.param('id'), function foundRobot(err, robot) {
      if (err) return next(err);
      if (!robot) return next();

      return res.render('robot/_row.ejs', {
        robot: robot,
        layout: false
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

        return res.ok({
          msg: 'permission updated'
        });
      });
    });
  }

};
