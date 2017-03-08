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
        res.ok({ msg: 'position updated' });
      });
    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  },


  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

      //Mis iconos y los del sistema por defecto
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
          var isOk1 = CssService.valid_color(req.param('color_text'));
          var isOk2 = CssService.valid_color(req.param('color_background'));
          var isOk3 = CssService.valid_color(req.param('color_border'));
          var isOk4 = CssService.valid_color(req.param('color_active_background'));

          if (!isOk1 || !isOk2 || !isOk3 || !isOk4) {
            return res.badRequest('you have to give a valid hexadecimal color');
          }
          actionObj.color_default = false;
        }

        if (req.param('name') == '' && req.param('icon') == 'undefined') {
          return res.badRequest('you have to give a name or icon');
        }

        Action.create(actionObj, function actionCreated(err, action) {
          if (err) return res.badRequest(err.Errors);

              if (req.param('icon')){
                Action.findOne(action.id).populate('icon').exec(function(err, action) {
                  if (err) return res.badRequest(err);
                  return res.render('interface/_action.ejs', {
                    action: action,
                    layout: false
                  });
                });
              }else{
                return res.render('interface/_action.ejs', {
                  action: action,
                  layout: false
                });
              }
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },


  destroy: function (req, res, next) {
    if (req.xhr) {
      Action.destroy({id: req.param('id')}).exec(function deleteaction(err) {
        if (err) return next(err);

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

        return res.render('action/edit.ejs', {
          action: action,
          icons: icons,
          layout: false
        });

      });
    });
  },


  update: function(req, res, next){
    if (req.xhr) {

      var actionObj = {
        name: req.param('name'),
        code: req.param('code'),
        icon: req.param('icon')
      };


      if(req.param("color_default") == 'false') {
        actionObj.color_default = false;
        actionObj.color_text = CssService.valid_color(req.param('color_text')) == true ? req.param('color_text') : null
        actionObj.color_text = CssService.valid_color(req.param('color_background')) == true ? req.param('color_background') : null
        actionObj.color_text = CssService.valid_color(req.param('color_border')) == true ? req.param('color_border') : null
        actionObj.color_text = CssService.valid_color(req.param('color_active_background')) == true ? req.param('color_active_background') : null
      }

      if (req.param('name') == '' && req.param('icon') == 'undefined') {
        return res.badRequest('you have to give a name or icon');
      }

      Action.update(req.param('id'), actionObj, function actionUpdated(err, action) {
        if (err){ return res.redirect('/action/edit' + req.param('id')); }
        msg = {err: 'The action has been updated'};
        FlashService.success(req, msg);

        Action.findOne(req.param('id')).populate('icon').exec(function(err, action) {
          return res.render('interface/_action.ejs', {
            action: action,
            layout: false
          });
        });
      });
    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }
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
