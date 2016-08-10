/**
 * RobotController
 *
 * @description :: Server-side logic for managing Robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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


  //Crea un robot con los parametros del formulario
  // new.ejs
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
      //Añade los usuarios del robot
      if (req.param('owners').size > 1){
        req.param('owners').forEach(function(user_id)  {
          User.findOne(user_id, function foundUser(err, user){
            if(err) return next(err);
            if(!user) return next();

            //añadir invitados
            console.log('Associating robot - user: ',robot.name,'with',user.id);
            robot.owners.add(user.id);
            robot.save(function (err) {
              if (err) return next(err);
            });
          });
        });

      }else{
        User.findOne(req.param('owners'), function foundUser(err, user){
          if(err) return next(err);
          if(!user) return next();

          //Añadir un invitado
          console.log('Associating robot - user: ',robot.name,'with',user.id);
          robot.owners.add(user.id);
          robot.save(function (err) {
            if (err) return next(err);
          });
        });
      }

      //Se relaciona el robot con su interfaz de control (relacion en doble sentido)
      Interface.create({robot_owner: robot.id, csscode: ''}, function interfaceCreated(err, iface){
        console.log('Associating robot - interface: ',robot.name,'with',iface.id);

        robot.robot_interface = iface.id;
        robot.save(function (err) {
          if (err) return next(err);
        });
      });

      //Si hay error
      if (err){
        console.log(err);
        req.session.flash ={
          err: err
        };

        //redireccion si hay error
        return res.redirect('/robot/new');
      }

      robot.save(function (err) {
        if (err) return next(err);
      });

      Robot.publishCreate(robot);

      //Redirección a show
      res.redirect('robot/index/');
      req.session.flash = {};

    });
  },

  show: function(req, res, next){
    Robot.findOne(req.param('id'), function foundRobot(err, robot){
      if(err) return next(err);
      if(!robot) return next();
      res.view({
        robot: robot
      });
    });
  },


  index: function(req, res, next) {
    //console.log(new Date());
    //console.log(req.session.authenticated);

      Robot.find({owner: req.session.User.id}).exec(function foundRobot(err, robots){
        if(err) return next(err);

        res.view({
          robots:robots
        });
      });
  },


  //Sockets
  changestate: function(req,res,next){

    var robot = req.param('robot');
    var state = req.param('state');
    var user = req.session.User.id;

    //Comprobar que el robot pertenece al ususario que esta cambiando su estado
    //.....
    //


    //Cambiar en la base de datos el estado del robot
    if (robot){
      Robot.findOne({id: robot}).exec(function (err, robot){
        if (err) {
          return res.negotiate(err);
        }

        if (state == "on"){
          robot.online = true;
        }else if (state == "off"){
          robot.online = false;
        }

        robot.save(function (err, robot){
          if (err) return next(err);

          console.log('cambiando estado...');
          //Informar a otros clientes (sockets abiertos) que el robot esta conectado
          Robot.publishUpdate(robot.id,{
            online: robot.online,
            id: robot.id
          });
          console.log('state changed');
        });
      });


    } else if (req.isSocket){
      Robot.watch(req);
      //console.log('Robot with socket id '+ sails.sockets.id(req)+' is now subscribed to the model class \'Robot\'.');
    } else {
      res.view();
    }
  },





  robot_subscribe: function(req,res,next){
    if (req.isSocket){
      //Update session table
      Session.update({socket_id:sails.sockets.id(req)},{user_id:req.session.User.id}).exec(function afterwards(err, updated){
        if (err) {
          // handle error here- e.g. `res.serverError(err);`
          return;
        }
        console.log('Updated session to username ' + User.name);
      });

      //Update, destroy...
      Robot.find(function foundRobots(err,robots){
        if (err) return next(err);
        Robot.subscribe(req.socket,robots);
      });

      //Create
      Robot.watch(req);
      console.log('User ' + req.session.User.id + 'with socket id '+sails.sockets.id(req)+' is now subscribed to the model class \'User\'.');
    } else {
      res.view();
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
Robot.publishUpdate(robot.id, {online: robot.online, id: robot.id});
console.log('state changed');


  */
