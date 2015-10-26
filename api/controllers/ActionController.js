/**
 * ActionController
 *
 * @description :: Server-side logic for managing actions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //Carga la pag sign up
  'new': function(req, res){
    res.view();
  },


  create: function(req, res, next) {

    var actionObj = {
      name: req.param('name'),
      title: req.param('code'),
      email: req.param('element')
    };


    User.create(actionObj, function actionCreated(err, action) {

      //Si hay error
      if (err){
        console.log(err);
        req.session.flash ={
          err: err
        };

        //redireccion si hay error
        return res.redirect('/interface/show');
      }


      Action.publishCreate(action);

      //Redirección a show
      res.redirect('interface/show/' + interface.id);
      req.session.flash = {};

    });
  }


  };

