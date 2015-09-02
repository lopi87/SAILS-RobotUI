/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  show: function(req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface){
      if(err) return next(err);
      res.view({
        interface: iface
      });
    });
  }

};

