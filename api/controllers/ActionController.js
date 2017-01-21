/**
 * ActionController
 *
 * @description :: Server-side logic for managing actions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  update_position: function (req, res, next) {
    //Ajax call
    if (req.xhr) {

      var id = req.param('id');
      var x = req.param('x');
      var y = req.param('y');

      Action.update(id, {coordinate_x: x, coordinate_y: y}, function actionUpdated(err){
        if(err) return res.badRequest(err);
        res.ok();
      });

    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  },


  create: function (req, res, next){
    //Mis iconos y los del sistema por defecto
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      Icon.find({or: [{user_owner: req.session.User.id}, {default: true}]}).exec(function (err, icons) {
        if (err) return next(err);

        return res.render('action/new.ejs', {
          icons: icons,
          interface: iface,
          layout: false
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
          icon: req.param('icon')
        };

        if(req.param("color_default") == 'false'){

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

            return res.render('interface/_action.ejs', {
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


  edit: function(req, res, next){
    Action.findOne(req.param('id'), function foundAction(err, action){
      if(err) return next(err);
      if(!action) return next();

      //Mis iconos y los del sistema por defecto
      Icon.find({or: [{user_owner: req.session.User.id}, {default: true}]}).exec(function (err, icons) {
        if (err) return next(err);

        res.view({
          action: action,
          icons: icons
        });
      });
    });
  },


  index: function(req, res, next) {
    Action.find({interface_owner: req.session.User.id}).exec(function (err, actions) {
      if (err) return next(err);
      res.view({
        actions: actions
      });
    });
  }



};
