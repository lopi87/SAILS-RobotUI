/**
 * RobotController
 *
 * @description :: Server-side logic for managing Robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Log = require('log');
log = new Log('debug');
var pager = require('sails-pager');
var fs = require('fs');

module.exports = {


  new: function (req, res) {

    User.find(function foundUsers(err, users) {
      if (err) return res.serverError(err);
      res.view({users: users});
    });
  },


  create: function (req, res, next) {
    res.setTimeout(0);

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id, //Añadimos el propietario
      public_drive: req.param('public_drive') == 'on',
      public_view: req.param('public_view') == 'on',
      pad_enabled: req.param('pad_enabled')
    };


    Robot.create(robotObj, function robotCreated(err, robot) {
      //Se relaciona el robot con su interfaz de control
      Interface.create({robot_owner: robot.id}, function interfaceCreated(err, iface) {
        if (err) {
          return res.serverError(err);
        }

        console.log('Associating robot - interface: ', robot.name, 'with', iface.id);
        robot.iface = iface.id;
        Robot.publishCreate(robot);

        PermissionService.init_permissions(robot, req.param('driver_users'), req.param('viewer_users'), function whenDone(err) {
          if (err) return res.negotiate(err);
          FlashService.success(req, 'Robot has been created.');

          robot.save(function (err) {
            if (err) return next(err);

            if (req._fileparser.upstreams.length == 1) {
              ImageService.upload_robot_avatar(req.file('robot_avatar'), robot);
            }
          });
        });
      });
    });
    return res.redirect('robot/my_robots/');
  },


  show: function (req, res, next) {
    Robot.findOne(req.param('id')).populate('drivers').populate('viewers').populate('iface').exec(function (err, robot) {
      if (err) return next(err);
      if (!robot) return next();

      User.findOne(robot.owner, function foundUsers(err, user) {
        if (err) return next(err);
        res.view({
          robot: robot,
          user: user,
          user_driver: robot.drivers,
          user_viewer: robot.viewers
        });
      });
    });
  },


  index: function (req, res, next) {

    var page = page2 = page3 = 1;
    if (typeof req.param('page') != 'undefined') {
      page = parseInt(req.param('page'));
    }
    if (typeof req.param('page2') != 'undefined') {
      page2 = parseInt(req.param('page2'));
    }
    if (typeof req.param('page3') != 'undefined') {
      page3 = parseInt(req.param('page3'));
    }


    User.findOne(req.session.User.id).populate('d_robots').populate('v_robots').exec(function (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.badRequest();

      Robot.pagify('robots', {
        findQuery: {owner: user.id},
        sort: ['createdAt DESC'],
        populate: ['drivers', 'viewers', 'owner', 'iface'],
        page: page
      }).then(function (data_robots) {

        Robot.pagify('robots', {
          findQuery: {viewers: user.id},
          sort: ['createdAt DESC'],
          populate: ['drivers', 'viewers', 'owner', 'iface'],
          page: page2
        }).then(function (data_d_robots) {

          Robot.pagify('robots', {
            findQuery: {drivers: user.id},
            sort: ['createdAt DESC'],
            populate: ['drivers', 'viewers', 'owner', 'iface'],
            page: page3
          }).then(function (data_v_robots) {

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

  index_public_robots: function (req, res, next) {

    var page = 1;
    if (typeof req.param('page') != 'undefined') {
      page = parseInt(req.param('page'));
    }

    Robot.pagify('robots', {
      findQuery: {or: [{public_view: true, public_drive: true}]},
      sort: ['createdAt DESC'],
      populate: ['owner', 'iface'],
      page: page,
      perPage: 3
    }).then(function (data) {
      res.view({data: data});
    }).catch(function (err) {
      return next(err);
    });
  },


  index_driver_robots: function (req, res, next) {
    User.findOne(req.session.User.id).populate('d_robots').exec(function (err, user) {
      if (err) return res.serverError(err);

      res.view({
        driver_robots: user.d_robots
      });
    });
  },


  index_viewer_robots: function (req, res, next) {
    User.findOne(req.session.User.id).populate('v_robots').exec(function (err, user) {
      if (err) return res.serverError(err);

      res.view({
        viewer_robots: user.v_robots
      });
    });
  },


  //Cambiar en la base de datos el estado del robot (Ocupado)
  changetobusy: function (req, res) {

    if (!req.isSocket) return res.badRequest();

    var robot_id = req.param('robot'), status = req.param('state');

    Robot.update({id: robot_id}, {busy: status}, function robotUpdated(err) {
      if (err) return res.badRequest();

      //Informar a otros clientes (sockets abiertos) que el robot queda liberado u ocupado
      Robot.publishUpdate(robot_id, {
        busy: status,
        online: true,
        id: robot_id
      });

      //Si el robot queda ocupado, lo alamcenamos en la session
      if (status == true) {
        Session.update({socket_id: req.socket.id}, {robot_id: robot_id}, function sessionUpdated(err) {
          if (err) res.badRequest();
          log.debug('Robot ocupado...');
        });
      } else if (status == false) {
        Session.update({socket_id: req.socket.id}, {robot_id: ''}, function sessionUpdated(err) {
          if (err) return res.badRequest();
          log.debug('Robot liberado...');
        });
      }
    });
  },


  //Cambiar en la base de datos el estado del robot (Online), essperando conexión
  changetoonline: function (req, res) {

    if (!req.isSocket) return res.badRequest();

    var robot_id = req.param('robot'), online = req.param('online');

    Robot.update({id: robot_id}, {online: online, socket_id: req.socket.id }, function robotUpdated(err) {
      if (err) return res.badRequest();

      //Informar a otros clientes (sockets abiertos) que el robot queda online
      Robot.publishUpdate(robot_id, {
        online: online,
        busy: false,
        id: robot_id
      });

    });
  },



  admin_panel: function(req, res, next){

    var page = 1;

    if( typeof req.param('page') != 'undefined'){
      page = parseInt(req.param('page'));
    }

    Robot.pagify('robots', {sort: ['createdAt DESC'], populate: ['iface', 'owner'], page: page}).then(function(data){
      res.view({data: data});
    }).catch(function(err){
      return next(err);
    });

  },


  robot_subscribe: function (req, res, next) {
    if (req.isSocket) {
      //Update, destroy...
      Robot.find(function foundRobots(err, robots) {
        if (err) return next(err);
        Robot.subscribe(req.socket, robots);
      });

      //Crear
      Robot.watch(req);
      log.debug('Usuario ' + req.session.User.id + 'con socket id ' + sails.sockets.id(req) + ' está suscrito a la clase \'Robot\'.');
    } else {
      res.view();
    }
  },


  destroy: function (req, res, next) {
    var id = req.param('id');

    Robot.findOne(id, function foundRobot(err, robot) {
      if (err) return next(err);
      if (!robot) {
        FlashService.error(req, 'Robot doesn\'t exists.');
        return res.redirect('robot/index');
      }

      //Eliminar la interfaz del robot
      Interface.findOne( robot.iface, function foundRobot(err, interface) {
        if (err) return next(err);
        if (!interface) {
          FlashService.error(req, 'Interface doesn\'t exists.');
          return res.redirect('robot/index');
        }

        Action.destroy({interface_owner: interface.id}).exec(function (err) {
          if (err) return next(err);

          Event.destroy({interface_owner: interface.id}).exec(function (err) {
            if (err) return next(err);

            Video.destroy({interface_owner: interface.id}).exec(function (err) {
              if (err) return next(err);

              Interface.destroy({ id: interface.id }, function interfaceDestroyed(err) {
                if (err) return next(err);

                ImageService.delete_file(robot);
                Robot.destroy(id, function robotDestroyed(err) {
                  if (err) return next(err);

                  Robot.publishDestroy(id, {id: id});
                  FlashService.success(req, 'Robot deleted');
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

      User.find(function foundUsers(err, users) {
        if (err) return next(err);

        PermissionService.get_permissions_array(robot.id, function (error, perm) {

          res.view({
            robot: robot,
            perm: perm,
            users: users
          });
        });
      });
    });
  },


  update: function (req, res, next) {

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress: req.param('ipaddress'),
      port: parseInt(req.param('port')),
      owner: req.session.User.id,
      public_drive: req.param('public_drive') == 'on',
      public_view: req.param('public_view') == 'on',
      pad_enabled: req.param('pad_enabled') == 'on'
    };


    Robot.findOne(req.param('id'), function foundRobot(err, robot) {
      if (err) return next(err);
      if (!robot) return next();

      if (req._fileparser.upstreams.length == 1) {
        ImageService.upload_robot_avatar(req.file('robot_avatar'), robot, function whenDone(err, files) {
          if (err) return res.negotiate(err);
        });
      }

      Robot.update(req.param('id'), robotObj, function robotUpdated(err) {
        if (err) {
          return res.redirect('/robot/edit' + req.param('id'));
        }
        FlashService.success(req, 'The Robot has been updated.');
        res.redirect('/robot/show/' + req.param('id'));
      });
    });
  },


  show_permissions: function (req, res, next) {

    var robot_id = req.param('id');

    Robot.findOne(robot_id).exec(function (err, robot) {
      if (err) return res.badRequest(err);

      PermissionService.get_permissions_array(robot_id, function (error, perm) {

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


  new_permissions: function (req, res, next) {
    var robot_id = req.param('id');

    if (req.param('users') && req.param('users') instanceof Array) {
    } else {
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
        if (req.param('control_check') == 'true' && (robot.owner.id != req.session.User.id)) {
          robot.drivers.add(user_id);
        }
        if (req.param('view_check') == 'true' && (robot.owner.id != req.session.User.id)) {
          robot.viewers.add(user_id);
        }

        if (req.param('control_check') == 'false') {
          robot.drivers.remove(user_id);
        }
        if (req.param('view_check') == 'false') {
          robot.viewers.remove(user_id);
        }
      });

      robot.save(function (err) {

        console.log('The new permissions has been added');

        PermissionService.get_permissions_array(robot_id, function (error, perm) {

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
        robot.save().fail(function () {
        });

        return res.ok({
          msg: 'permission updated'
        });
      });
    });
  },


  my_robots: function (req, res, next) {

    var page = 1;
    if (typeof req.param('page') != 'undefined') {
      page = parseInt(req.param('page'));
    }


    Userdriverobot.find().where({'user': req.session.User.id}).exec(function (err, user_d_robots) {
      if (err) return next(err);


      Userviewerobot.find().where({'user': req.session.User.id}).exec(function (err, user_v_robots) {
        if (err) return next(err);

        var d_robot = _.pluck(user_d_robots, 'robot');
        var v_robot = _.pluck(user_v_robots, 'robot');
        var list_id = d_robot.concat(v_robot);


        Robot.pagify('robots', {
          findQuery: { or: [ { id: list_id }, { owner: req.session.User.id } ] },
          populate: ['drivers', 'viewers', 'owner', 'iface'],
          page: page
        }).then(function (data_robots) {

          // Robot.find().where( { or: [ {'id': list_id}, { owner: req.session.User.id } ] } ).populate('drivers').populate('viewers').populate('owner').exec(function (err, robots) {
          return res.view({
            data: data_robots
          });
        });
      });
    });
  },


  download_code: function (req, res, next) {
    var robot_id = req.param('id');

    Robot.findOne(robot_id).exec(function (err, robot) {
      if (err) return res.badRequest(err);
      if (!robot) return res.badRequest(err);


      var file_content = 'CONTENIDO';

      var fs = require('fs');
      fs.writeFile("/tmp/test", "Hey there!", function(err) {
        if(err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });



      return res.ok({
        msg: 'code generated'
      });
    });


  }


};
