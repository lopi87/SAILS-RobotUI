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
      res.view({
        interface: iface
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
        interface: iface.id,
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

        action.save(function (err) {
          if (err) return next(err);
        });

        Action.publishCreate(action);

        //Redirección
        res.view('action/_list',{layout: null});
        req.session.flash = {};

        //TODO https://courses.platzi.com/courses/develop-apps-sails-js/   curso de sails js por el creador del framework

        //TODO episodio 21 activityuoverlord        https://www.youtube.com/watch?v=enyZYgjXRqQ

      });
    });
  }

};

