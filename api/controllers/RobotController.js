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

    var robotObj = {
      name: req.param('name'),
      description: req.param('description'),
      ipaddress:  parseInt(req.param('ipaddress')),
      port: parseInt(req.param('port'))
    };



    Robot.create(robotObj, function robotCreated(err, robot) {

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

      if (req.session.User.admin) {
        res.redirect('/user');
        return;
      }

      Robot.publishCreate(robot);

      /*
       console.log('Associating ',thisPony.name,'with',thisUser.name);
       thisUser.pets.add(thisPony.id);
       thisUser.save(console.log);
       */
      //Añade sus usuarios
      req.param('owners').forEach(function(user_id)  {

        User.findOne(user_id, function foundUser(err, user){
          if(err) return next(err);
          if(!user) return next();

          //TODO añadir el usuario propietario en la relación con un boleano
          console.log('Associating user: ',robot.name,'with',user.id);
          robot.owners.add(user.id);
          robot.save(function (err) {
            if (err) return next(err);
          });
        });
      });

      //Se relaciona el robot con su interfaz de control (relacion en doble sentido)
      Interface.create({robot_owner: robot.id}, function interfaceCreated(err, iface){
        robot.robot_interface = iface.id;
        robot.save(function (err) {
          if (err) return next(err);
        });

      });

      //Redirección a show
      res.redirect('robot/index/');
      req.session.flash = {};

    });
  },

  /*

  upload: function  (req, res) {
    if(req.method === 'GET')
      return res.json({'status':'GET not allowed'});
    //	Call to /upload via GET is error

    var uploadFile = req.file('uploadFile');
    console.log(uploadFile);

    uploadFile.upload(function onUploadComplete (err, files) {
      //	Files will be uploaded to .tmp/uploads

      if (err) return res.serverError(err);
      //	IF ERROR Return and send 500 error with error

      console.log(files);
      res.json({status:200,file:files});
    });
  }

*/


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

    Robot.find(function foundRobot(err, robots){
      if(err) return next(err);

      res.view({
        robots:robots
      });
    });
  }

};

