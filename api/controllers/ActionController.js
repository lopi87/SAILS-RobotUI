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

  },


  update_position: function (req, res, next) {
    //Ajax call
    if (req.xhr) {

      var id = req.param('id');
      var x = req.param('x');
      var y = req.param('y');

      //Comprobar si puede o no actualizar

      Action.update(id, {coordinate_x: x, coordinate_y: y}, function actionUpdated(err){
        if(err) return res.badRequest(err);
        res.ok();
      });

    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  }

};
