/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  configure: function (req, res, next) {
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      Action.find({interface_owner: req.param('id')}).exec(function (err, actions) {
        if (err) return next(err);

        //Mis iconos y los del sistema por defecto
        Icon.find({or: [{user_owner: req.session.User.id}, {default: true}]}).exec(function (err, icons) {
          if (err) return next(err);

          Robot.findOne({robot_interface: req.param('id')}).exec(function (err, robot) {
            if (err) return next(err);

            res.view({
              interface: iface,
              actions: actions,
              icons: icons,
              robot: robot
            });
          });

        });
      });
    });
  },


  show: function (req, res, next) {
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      Action.find({interface_owner: req.param('id')}).exec(function (err, actions) {
        if (err) return next(err);

        Robot.findOne({robot_interface: iface.id}).exec(function (err, robot) {
          if (err) return next(err);

          res.view({
            interface: iface,
            actions: actions,
            robot: robot
          });
        });

      });

    });
  },


  newaction: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var actionObj = {
          interface_owner: iface.id,
          name: req.param('name'),
          code: req.param('code'),
          icon: req.param('icon'),
          element: 'button',
          port: parseInt(req.param('port'))
        };

        if(req.param("color_default") == false){

          var isOk1 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(req.param('color_text'));
          var isOk2 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(req.param('color_background'));
          var isOk3 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(req.param('color_border'));
          var isOk4 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(req.param('color_active_background'));

          if (!isOk1 || !isOk2 || !isOk3 || !isOk4) {
            return res.badRequest('you have to give a valid hexadecimal color');
          }

          actionObj.color_text = req.param('color_text').replace('#', '');
          actionObj.color_background = req.param('color_background').replace('#', '');
          actionObj.color_border = req.param('color_border').replace('#', '');
          actionObj.color_active_background = req.param('color_active_background').replace('#', '');
          actionObj.color_default = false;
        }

        if (req.param('name') == '' && req.param('icon') == 'undefined') {
          return res.badRequest('you have to give a name or icon');
        }


        Action.create(actionObj, function actionCreated(err, action) {
        if (err) return res.badRequest(err);

          action.save(function (err) {
            if (err) return res.badRequest(err);

            console.log('The action has been created');

            return res.render('interface/action_row.ejs', {
              action: action,
              layout: false
            });

          });
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },


  deleteaction: function (req, res, next) {
    if (req.xhr) {
      Action.destroy({id: req.param('id')}).exec(function deleteaction(err) {
        console.log('The action has been deleted');

        //Si hay error
        if (err) {
          console.log(err);
          return res.next(err);
        }

        return res.ok({id: req.param('id')});
      });
    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

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
    } else if (button && req.isSocket) {
      console.log('emitiendo boton pulsado...');

      Action.findOne(button, function foundAction(err, action) {
        if (err) return next(err);
        if (!action) return next();
        Interface.publishCreate({id: interface, command: action.code});
      });
      //sails.socket.emit('command', {command: command});

      console.log('command send');
    } else if (req.isSocket) {
      Interface.watch(req);
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
  }




  /*
   //Subida imagen avatar.
   upload: function(req, res) {
   if (req.method === 'GET')
   return res.json({ 'status': 'GET not allowed' });
   //	Call to /upload via GET is error

   // setting allowed file types
   var allowedTypes = ['image/jpeg', 'image/png'];

   var uploadFile = req.file('uploadFile');
   console.log(uploadFile);

   var user_id = req.session.User.id;

   uploadFile.upload({
   saveAs: function(file, cb) {
   var extension = file.filename.split('.').pop();

   // seperate allowed and disallowed file types
   if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
   err = { err: 'Disallowed file type' };
   FlashService.error(req, err );
   return res.redirect('/user/new');
   }else{
   // save as allowed files

   gm(file).resize('200', '200').stream().pipe(output);

   cb(null, '../../.tmp/public/uploads/profile_image/' + user_id + '.' + extension);
   //Nombre del avatar: id del usuario + extension
   }

   }},function onUploadComplete(err, files) {
   if (err) return next(err);

   console.log(files);
   msg = { err: 'Upload completed' };
   FlashService.success(req, msg );
   return res.redirect('/user/index');
   });
   },

   render: function(req,res,next){
   User.findOne(req.param('id'), function foundUser(err, user){
   if(err) return next(err);
   if(!user) return next();

   return res.render('user/user_row.ejs', {
   user: user,
   layout: false
   });
   });
   }

   };


   */




};

//TODO https://courses.platzi.com/courses/develop-apps-sails-js/   curso de sails js por el creador del framework

//TODO episodio 21 activityuoverlord        https://www.youtube.com/watch?v=enyZYgjXRqQ
