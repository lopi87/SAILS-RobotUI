/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
  index: function (req, res) {

    var n_robots_online = 1;
    return res.view({
      n_robots_online: n_robots_online
    });
  },

  about: function (req, res){

    return res.ok();
  },

  contact: function (req, res){

    return res.ok();
  }

};
