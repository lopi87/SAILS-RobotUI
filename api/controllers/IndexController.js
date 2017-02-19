/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  index: function (req, res) {
    Robot.count({online: true}).exec(function countOnlineRobots(error, number) {
      return res.view({
        n_robots_online: number
      });
    });
  },

  about: function (req, res){

    return res.view();
  },

  contact: function (req, res){

    return res.view();
  }

};
